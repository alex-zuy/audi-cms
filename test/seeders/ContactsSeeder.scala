package seeders

import models._
import internal.PostgresDriverExtended.api._

import play.api.libs.json.Json
import play.api.test.{DefaultAwaitTimeout, FutureAwaits}

import slick.backend.DatabaseConfig
import slick.dbio.DBIO
import slick.driver.JdbcProfile

import scala.collection.concurrent.TrieMap
import scala.collection.mutable.HashMap
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

object ContactsSeeder extends DatabaseSeeder with FutureAwaits with DefaultAwaitTimeout {

  import ContactInfoDAO._

  val contactOne = ContactInfo(None, Json.obj("en" -> "contactOne"), None)

  val contactTwo = ContactInfo(None, Json.obj("en" -> "contactTwo"), Some("internalNameTwo"))

  def numberOne(contactInfoId: Int) = ContactNumber(None, contactInfoId, Json.obj("en" -> "numberOne"), "+123456789")

  def numberTwo(contactInfoId: Int) = ContactNumber(None, contactInfoId, Json.obj("en" -> "numberTwo"), "+987654321")

  def emailOne(contactInfoId: Int) = ContactEmail(None, contactInfoId, "personOne", "emailOne@example.net", Json.obj("en" -> "emailOne"))

  def emailTwo(contactInfoId: Int) = ContactEmail(None, contactInfoId, "personTwo", "emailTwo@example.net", Json.obj("en" -> "emailTwo"))

  def addressOne(contactInfoId: Int) = ContactAddress(None, contactInfoId, Json.obj("en" -> "addressOne"), "streetOne", None)

  def addressTwo(contactInfoId: Int) = ContactAddress(None, contactInfoId, Json.obj("en" -> "addressTwo"), "streetTwo", Some(Json.toJson("{}")))

  override def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    val oneId = await(dbConfig.db.run(insertInfo(contactOne)))
    val twoId = await(dbConfig.db.run(insertInfo(contactTwo)))

    instanceToId ++= Seq(contactOne -> oneId, contactTwo -> twoId)

    val q = DBIO.seq(
      insertNumber(numberOne(oneId)),
      insertEmail(emailOne(oneId)),
      insertAddress(addressOne(oneId)),

      insertNumber(numberOne(twoId)),
      insertNumber(numberTwo(twoId)),
      insertEmail(emailOne(twoId)),
      insertEmail(emailTwo(twoId)),
      insertAddress(addressOne(twoId)),
      insertAddress(addressTwo(twoId))
    )
    dbConfig.db.run(q)
  }

  override def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    val q = DBIO.seq(
      ContactInfoDAO.allInfos.delete,
      ContactInfoDAO.allNumbers.delete,
      ContactInfoDAO.allEmails.delete,
      ContactInfoDAO.allAddresses.delete
    )
    dbConfig.db.run(q)
  }

  def idOf(contactInfo: ContactInfo) = instanceToId.get(contactInfo).get

  private val instanceToId = HashMap[ContactInfo, Int]()
}
