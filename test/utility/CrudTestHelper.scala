package utility

import internal.PostgresDriverExtended.api._
import models.IntegerIdPk
import org.scalatest.MustMatchers

import play.api.http.Writeable
import play.api.libs.json._
import play.api.mvc.Action
import play.api.test._
import play.api.test.Helpers._

import slick.backend.DatabaseConfig
import slick.dbio
import slick.driver.JdbcProfile
import slick.lifted.AbstractTable

/**
 * Helper class for writing test for simple CRUD operations. This helper intended for cases
 * where:
 * - request data format matches database table shema
 * - request affects only main table(it may affect another tables, but helper checks only main table)
 * - valid store request must create exactly one new record in table and return its id
 * - valid update request must update record without affecting records count
 * - valid delete request must decrease record count by 1 and deleted record must not be present in table when done
 * - invalid request does not change records count and does not update data
 *
 * @param tableQuery a table which must be affected by requests
 * @tparam B table records type
 * @tparam T table type
 */
class CrudTestHelper[B, T <: Table[B] with IntegerIdPk](val tableQuery: TableQuery[T])(
  implicit writesBody: Writes[B], dbConfig: DatabaseConfig[JdbcProfile])
  extends FutureAwaits with DefaultAwaitTimeout with FakeAuthenticatedRequests with MustMatchers {

  import Json.toJson
  import CrudTestHelper._

  case class StoreResponse(id: Int)

  implicit val readsStoreResponse = Json.reads[StoreResponse]

  def byId(id: Int) = runQuery(tableQuery.filter(_.id === id).result.head)

  def testValidStore(action: Action[_], storable: B) = {
    checkRecordsCountDifference(tableQuery, +1) {
      val recordToStore = toJson(storable)
      val response = invokeWithBodyCheckingStatus(action, recordToStore, OK)
      val maybeStoreResponse = contentAsJson(response).asOpt[StoreResponse]
      maybeStoreResponse mustBe defined
      val storedRecord = byId(maybeStoreResponse.get.id)
      dataMustBeSame(toJson(storedRecord), recordToStore)
      response
    }
  }

  def testValidUpdate(action: Action[_], updatableId: Int, updatable: B) = {
    checkRecordsCountDifference(tableQuery, 0) {
      val recordToUpdate = toJson(updatable)
      val response = invokeWithBodyCheckingStatus(action, recordToUpdate, OK)
      val updatedRecord = byId(updatableId)
      dataMustBeSame(toJson(updatedRecord), recordToUpdate)
      response
    }
  }

  def testValidDelete(action: Action[_], deletableId: Int) = {
    checkRecordsCountDifference(tableQuery, -1) {
      val response = invokeWithBodyCheckingStatus(action, toJson(0), OK)
      val deletedRecordExists = runQuery(tableQuery.filter(_.id === deletableId).exists.result)
      deletedRecordExists mustBe false
      response
    }
  }

  def testInvalidStore(action: Action[_], storable: B, expectedStatus: Int = CONFLICT) = {
    checkRecordsCountDifference(tableQuery, 0) {
      invokeWithRecordCheckingStatus(action, storable, expectedStatus)
    }
  }

  def testInvalidUpdate(action: Action[_], updatableId: Int, updatable: B, expectedStatus: Int = CONFLICT) = {
    checkRecordsCountDifference(tableQuery, 0) {
      val recordBefore = byId(updatableId)
      val response = invokeWithRecordCheckingStatus(action, updatable, expectedStatus)
      val recordAfter = byId(updatableId)
      dataMustBeSame(toJson(recordBefore), toJson(recordAfter))
      response
    }
  }

  def testInvalidDelete(action: Action[_], deletableId: Int, expectedStatus: Int = CONFLICT) = {
    checkRecordsCountDifference(tableQuery, 0) {
      invokeWithBodyCheckingStatus(action, toJson(0), expectedStatus)
    }
  }

}

object CrudTestHelper extends FakeAuthenticatedRequests with MustMatchers {

  def invokeWithRecordCheckingStatus[B](action: Action[_], record: B, expectedStatus: Int)(implicit writesBody: Writes[B]) =
    invokeWithBodyCheckingStatus(action, Json.toJson(record), expectedStatus)

  def invokeWithBodyCheckingStatus[B](action: Action[_], requestBody: B, expectedStatus: Int)(implicit writesB: Writeable[B]) = {
    val response = call(action, request(requestBody))
    status(response) mustBe expectedStatus
    response
  }

  def runQuery[R, S <: dbio.NoStream, E <: dbio.Effect](query: DBIOAction[R,S,E])(implicit dbConfig: DatabaseConfig[JdbcProfile]): R =
    await(dbConfig.db.run(query))

  val removeIdTransformer = ( __ \ "id").json.prune

  def request[B](body: B) = managerRequest().withBody(body)

  def dataMustBeSame(left: JsValue, right: JsValue) = left.transform(removeIdTransformer) mustBe right.transform(removeIdTransformer)

  def recordsCount[T <: AbstractTable[_]](tableQuery: TableQuery[T])(implicit dbConfig: DatabaseConfig[JdbcProfile]) = runQuery(tableQuery.size.result)

  def checkRecordsCountDifference[T <: AbstractTable[_], R](tableQuery: TableQuery[T], difference: Int)(block: => R)(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    val before = recordsCount(tableQuery)
    val result = block
    val after = recordsCount(tableQuery)
    (before + difference) mustBe after
    result
  }
}
