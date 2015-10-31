package models

import play.api.libs.json.JsValue

import internal.PostgresDriverExtended.api._

case class ContactInfo(id: Option[Int], name: JsValue, category: String)

case class ContactNumber(id: Option[Int], contactInfoId: Int, name: JsValue, number: String)

case class ContactEmail(id: Option[Int], contactInfoId: Int, email: String, name: JsValue)

case class ContactAddress(id: Option[Int], contactInfoId: Int, name: JsValue, address: String, geoCoordinates: Option[JsValue])

object ContactInfoDAO {

  class ContactInfosTable(tag: Tag) extends Table[ContactInfo](tag, "contact_infos") with IntegerIdPk {
    def name = column[JsValue]("name")

    def category = column[String]("category")

    def * = (id.?, name, category) <> (ContactInfo.tupled, ContactInfo.unapply)
  }

  class ContactNumbersTable(tag: Tag) extends Table[ContactNumber](tag, "contact_numbers") with IntegerIdPk {
    def contactInfoId = column[Int]("contact_info_id")

    def name = column[JsValue]("name")

    def number = column[String]("number")

    def * = (id.?, contactInfoId, name, number) <> (ContactNumber.tupled, ContactNumber.unapply)
  }

  class ContactEmailsTable(tag: Tag) extends Table[ContactEmail](tag, "contact_emails") with IntegerIdPk {
    def contactInfoId = column[Int]("contact_info_id")

    def email = column[String]("email")

    def name = column[JsValue]("name")

    def * = (id.?, contactInfoId, email, name) <> (ContactEmail.tupled, ContactEmail.unapply)
  }

  class ContactAddressesTable(tag: Tag) extends Table[ContactAddress](tag, "contact_addresses") with IntegerIdPk {
    def contactInfoId = column[Int]("contact_info_id")

    def name = column[JsValue]("name")

    def address = column[String]("address")

    def geoCoordinates = column[Option[JsValue]]("geo_coordinates")

    def * = (id.?, contactInfoId, name, address, geoCoordinates) <> (ContactAddress.tupled, ContactAddress.unapply)
  }

  val allInfos = TableQuery[ContactInfosTable]

  val allNumbers = TableQuery[ContactNumbersTable]

  val allEmails = TableQuery[ContactEmailsTable]

  val allAddresses = TableQuery[ContactAddressesTable]

  def infoById(id: Int) = allInfos.filter(_.id === id)

  def numberById(id: Int) = allNumbers.filter(_.id === id)

  def emailById(id: Int) = allEmails.filter(_.id === id)

  def addressById(id: Int) = allAddresses.filter(_.id === id)

  def insertInfo(contactInfo: ContactInfo) = (allInfos returning allInfos.map(_.id)) += contactInfo

  def insertNumber(contactNumber: ContactNumber) = (allNumbers returning allNumbers.map(_.id)) += contactNumber

  def insertEmail(contactEmail: ContactEmail) = (allEmails returning allEmails.map(_.id)) += contactEmail

  def insertAddress(contactAddress: ContactAddress) = (allAddresses returning allAddresses.map(_.id)) += contactAddress

  def updateInfo(id: Int, contactInfo: ContactInfo) =
    infoById(id).map(c => (c.name, c.category)).update(contactInfo.name, contactInfo.category)

  def updateNumber(id: Int, cn: ContactNumber) =
    numberById(id).map(c => (c.name, c.number)).update(cn.name, cn.number)

  def updateEmail(id: Int, ce: ContactEmail) =
    emailById(id).map(c => (c.name, c.email)).update(ce.name, ce.email)

  def updateAddress(id: Int, ca: ContactAddress) =
    addressById(id).map(c => (c.name, c.address, c.geoCoordinates)).update(ca.name, ca.address, ca.geoCoordinates)

  def deleteInfo(id: Int) = infoById(id).delete

  def deleteNumber(id: Int) = numberById(id).delete

  def deleteEmail(id: Int) = emailById(id).delete

  def deleteAddress(id: Int) = addressById(id).delete

}
