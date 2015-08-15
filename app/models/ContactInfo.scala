package models

import play.api.libs.json.JsValue

import internal.PostgresDriverExtended.api._

case class ContactInfo(id: Int, name: String, internal_name: Option[String])

case class ContactNumber(id: Int, contactInfoId: Int, name: String, number: String)

case class ContactEmail(id: Int, contactInfoId: Int, contactPerson: String, email: String, name: String)

case class ContactAddress(id: Int, contactInfo: Int, name: String, address: String, geoCoordinates: Option[JsValue])

object ContactInfoDAO {

  class ContactInfosTable(tag: Tag) extends Table[ContactInfo](tag, "contact_infos") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def name = column[String]("name")

    def internalName = column[Option[String]]("internal_name")

    def * = (id, name, internalName) <> (ContactInfo.tupled, ContactInfo.unapply)
  }

  class ContactNumbersTable(tag: Tag) extends Table[ContactNumber](tag, "contact_numbers") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def contactInfoId = column[Int]("contact_info_id")

    def contactPerson = column[String]("contact_person")

    def name = column[String]("name")

    def number = column[String]("number")

    def * = (id, contactInfoId, name, number) <> (ContactNumber.tupled, ContactNumber.unapply)
  }

  class ContactEmailsTable(tag: Tag) extends Table[ContactEmail](tag, "contact_emails") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def contactInfoId = column[Int]("contact_info_id")

    def contactPerson = column[String]("contact_person")

    def email = column[String]("email")

    def name = column[String]("name")

    def * = (id, contactInfoId, contactPerson, email, name) <> (ContactEmail.tupled, ContactEmail.unapply)
  }

  class ContactAddressesTable(tag: Tag) extends Table[ContactAddress](tag, "contact_addresses") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def contactInfoId = column[Int]("contact_info_id")

    def name = column[String]("name")

    def address = column[String]("address")

    def geoCoordinates = column[Option[JsValue]]("geo_coordinates")

    def * = (id, contactInfoId, name, address, geoCoordinates) <> (ContactAddress.tupled, ContactAddress.unapply)
  }

  val allInfos = TableQuery[ContactInfosTable]

  val allNumbers = TableQuery[ContactNumbersTable]

  val allEmails = TableQuery[ContactEmailsTable]

  val allAddresses = TableQuery[ContactAddressesTable]

}
