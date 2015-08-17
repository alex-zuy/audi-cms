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

  val contactOne = ContactInfo(0, "contactOne", None)

  val contactTwo = ContactInfo(0, "contactOne", Some("internalNameTwo"))

  def numberOne(contactInfoId: Int) = ContactNumber(0, contactInfoId, "numberOne", "+123456789")

  def numberTwo(contactInfoId: Int) = ContactNumber(0, contactInfoId, "numberTwo", "+987654321")

  def emailOne(contactInfoId: Int) = ContactEmail(0, contactInfoId, "personOne", "emailOne@example.net", "emailOne")

  def emailTwo(contactInfoId: Int) = ContactEmail(0, contactInfoId, "personTwo", "emailTwo@example.net", "emailTwo")

  def addressOne(contactInfoId: Int) = ContactAddress(0, contactInfoId, "addressOne", "streetOne", None)

  def addressTwo(contactInfoId: Int) = ContactAddress(0, contactInfoId, "addressTwo", "streetTwo", Some(Json.toJson("{}")))

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
