package app.controllers

import internal.PostgresDriverExtended.api._
import controllers.Contacts
import models.ContactInfoDAO.{ContactAddressesTable, ContactEmailsTable, ContactNumbersTable, ContactInfosTable}
import models.{ContactAddress, ContactEmail, ContactNumber, ContactInfo, ContactInfoDAO}
import org.scalatest.BeforeAndAfterAll
import seeders.{ManagersSeeder, ContactsSeeder}
import utility.{CrudTestHelper, FakeAuthenticatedRequests, FakeAppPerSuite}

import play.api.libs.json._
import play.api.test._
import play.api.test.Helpers._

class ContactsTest extends FakeAppPerSuite with FakeAuthenticatedRequests with BeforeAndAfterAll {

  import ContactInfoDAO.{allInfos, allNumbers, allEmails, allAddresses}
  import ContactsSeeder.{contactOne, contactTwo, idOf}
  import CrudTestHelper._

  override def beforeAll() = {
    await(ManagersSeeder.clean)
    await(ManagersSeeder.seed)
  }

  before {
    await(ContactsSeeder.clean)
    await(ContactsSeeder.seed)
  }

  def controller = new Contacts

  implicit val formatContactInfo = Json.format[ContactInfo]

  implicit val formatContactNumber = Json.format[ContactNumber]

  implicit val formatContactEmail = Json.format[ContactEmail]

  implicit val formatContactAddress = Json.format[ContactAddress]

  lazy val infoTestHelper = new CrudTestHelper[ContactInfo, ContactInfosTable](allInfos)

  lazy val numbersTestHelper = new CrudTestHelper[ContactNumber, ContactNumbersTable](allNumbers)

  lazy val emailsTestHelper = new CrudTestHelper[ContactEmail, ContactEmailsTable](allEmails)

  lazy val addressesTestHelper = new CrudTestHelper[ContactAddress, ContactAddressesTable](allAddresses)

  val newOrUpdatedValidContactInfo = ContactInfo(None, Json.obj("en" -> "new info"), Some("new.internal.name"))

  // violation: breaks unique value constraint for 'internal_name'
  val newOrUpdatedInvalidContactInfo = ContactInfo(None, Json.obj("en" -> "new info"), Some("internalNameTwo"))

  def newOrUpdatedValidContactNumber(id: Int) = ContactNumber(None, id, "new number name", "+123456789")

  def newOrUpdatedValidEmail(id: Int) = ContactEmail(None, id, "person contact", "some@example.net", "main contact")

  def newOrUpdatedValidAddress(id: Int) = ContactAddress(None, id, "some address", "street pushkina", None)

  "Contacts controller" must {
    "list contacts info" in {
      val result = controller.list(managerRequest())
      status(result) mustBe OK
      val maybeInfos = contentAsJson(result).validate[Seq[ContactInfo]].asOpt
      maybeInfos mustBe defined
      val infos = maybeInfos.get
      infos must have size 2
      infos.find(_.name == contactOne.name) mustBe defined
      infos.find(_.name == contactTwo.name) mustBe defined
    }
    "show contact info" in {
      val id = idOf(contactTwo)
      val result = controller.show(id).apply(FakeRequest())
      status(result) mustBe OK
      val json = contentAsJson(result)
      val maybeInfo = json.validate[ContactInfo].asOpt
      maybeInfo mustBe defined
      val info = maybeInfo.get
      info.name mustBe contactTwo.name
      info.internalName mustBe contactTwo.internalName
      val numbers = json.transform((__ \ "numbers").json.pick).get.validate[Seq[ContactNumber]].asOpt
      numbers mustBe defined
      numbers.get must have size 2
      val emails = json.transform((__ \ 'emails).json.pick).get.validate[Seq[ContactEmail]].asOpt
      emails mustBe defined
      emails.get must have size 2
      val addresses = json.transform((__ \ 'addresses).json.pick).get.validate[Seq[ContactAddress]].asOpt
      addresses mustBe defined
      addresses.get must have size 2
    }
    "store new contact info" in {
      infoTestHelper.testValidStore(controller.store, newOrUpdatedValidContactInfo)
    }
    "update contact info" in {
      val id = ContactsSeeder.idOf(contactOne)
      infoTestHelper.testValidUpdate(controller.update(id), id, newOrUpdatedValidContactInfo)
    }
    "delete contact info" in {
      val id = ContactsSeeder.idOf(contactOne)
      infoTestHelper.testValidDelete(controller.delete(id), id)
    }
    "reject storing invalid info" in {
      infoTestHelper.testInvalidStore(controller.store, newOrUpdatedInvalidContactInfo)
    }
    "reject updating invalid info" in {
      val id = idOf(contactOne)
      infoTestHelper.testInvalidUpdate(controller.update(id), id, newOrUpdatedInvalidContactInfo)
    }
    "validate contact info" in {
      val ci = new ContactInfo(None, Json.obj("en" -> "asdadasd"), Some("asdsad s"))
      val response = invokeWithRecordCheckingStatus(controller.validate, ci, OK)
      val expectedJson = Json.parse(
        """{
          | "internalName": {
          |  "key":"validators.errors.string.whitespace",
          |  "args":{
          |   "field":"internalName"
          |  }
          | }
          |}
        """.stripMargin)
      contentAsJson(response) mustBe expectedJson
    }
    "store new contact number" in {
      val id = idOf(contactOne)
      numbersTestHelper.testValidStore(controller.storeNumber, newOrUpdatedValidContactNumber(id))
    }
    "update contact number" in {
      val id = idOf(contactTwo)
      val numberId = runQuery(allNumbers.filter(_.contactInfoId === id).map(_.id).result.head)
      numbersTestHelper.testValidUpdate(controller.updateNumber(numberId), numberId, newOrUpdatedValidContactNumber(id))
    }
    "delete contact number" in {
      val id = idOf(contactTwo)
      val numberId = runQuery(allNumbers.filter(_.contactInfoId === id).map(_.id).result.head)
      numbersTestHelper.testValidDelete(controller.deleteNumber(numberId), numberId)
    }
    "store new contact email" in {
      val id = idOf(contactOne)
      emailsTestHelper.testValidStore(controller.storeEmail, newOrUpdatedValidEmail(id))
    }
    "update contact email" in {
      val id = idOf(contactOne)
      val emailId = runQuery(allEmails.filter(_.contactInfoId === id).map(_.id).result.head)
      emailsTestHelper.testValidUpdate(controller.updateEmail(emailId), emailId, newOrUpdatedValidEmail(id))
    }
    "delete contact email" in {
      val id = idOf(contactTwo)
      val emailId = runQuery(allEmails.filter(_.contactInfoId === id).map(_.id).result.head)
      emailsTestHelper.testValidDelete(controller.deleteEmail(emailId), emailId)
    }
    "store new contact address" in {
      val id = idOf(contactOne)
      addressesTestHelper.testValidStore(controller.storeAddress, newOrUpdatedValidAddress(id))
    }
    "update contact address" in {
      val id = idOf(contactOne)
      val addressId = runQuery(allAddresses.filter(_.contactInfoId === id).map(_.id).result.head)
      addressesTestHelper.testValidUpdate(controller.updateAddress(addressId), addressId, newOrUpdatedValidAddress(id))
    }
    "delete contact address" in {
      val id = idOf(contactTwo)
      val addressId = runQuery(allAddresses.filter(_.contactInfoId === id).map(_.id).result.head)
      addressesTestHelper.testValidDelete(controller.deleteAddress(addressId), addressId)
    }
  }

}
