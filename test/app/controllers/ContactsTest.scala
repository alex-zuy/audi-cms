package app.controllers

import internal.PostgresDriverExtended.api._
import controllers.Contacts
import models.ContactInfoDAO.{ContactAddressesTable, ContactEmailsTable, ContactNumbersTable, ContactInfosTable}
import models.{ContactAddress, ContactEmail, ContactNumber, ContactInfo, ContactInfoDAO}
import org.scalatest.BeforeAndAfterAll
import seeders.{ManagersSeeder, ContactsSeeder}
import utility.{CrudTestHelper, FakeAuthenticatedRequests, FakeAppPerSuite}

import play.api._
import play.api.mvc._
import play.api.libs.json.{Writes, Json, JsValue}
import play.api.test._
import play.api.test.Helpers._

import slick.lifted.AbstractTable

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

//  def request(body: JsValue) = managerRequest().withBody(body)

//  def contactInfosCount = await(dbConfig.db.run(allInfos.size.result))
//
//
  //  implicit val readsContactNumber = Json.reads[ContactNumber]
  //
  //  implicit val readsContactEmail = Json.reads[ContactEmail]
  //
  //  implicit val readsContactAddress = Json.reads[ContactAddress]

  implicit val readsContactInfo = Json.reads[ContactInfo]

  implicit val writesContactInfo = Json.writes[ContactInfo]

  implicit val writesContactNumber = Json.writes[ContactNumber]

  implicit val writesContactEmail = Json.writes[ContactEmail]

  implicit val writesContactAddress = Json.writes[ContactAddress]

//  case class StoreResponse(id: Int)
//
//  implicit val readsStoreResponse = Json.reads[StoreResponse]

  lazy val infoTestHelper = new CrudTestHelper[ContactInfo, ContactInfosTable](allInfos)

  lazy val numbersTestHelper = new CrudTestHelper[ContactNumber, ContactNumbersTable](allNumbers)

  lazy val emailsTestHelper = new CrudTestHelper[ContactEmail, ContactEmailsTable](allEmails)

  lazy val addressesTestHelper = new CrudTestHelper[ContactAddress, ContactAddressesTable](allAddresses)

  val newOrUpdatedValidContactInfo = ContactInfo(0, "new info", Some("new internal name"))

  // violation: breaks unique value constraint for 'internal_name'
  val newOrUpdatedInvalidContactInfo = ContactInfo(0, "new info", Some("internalNameTwo"))

  def newOrUpdatedValidContactNumber(id: Int) = ContactNumber(0, id, "new number name", "+123456789")

  def newOrUpdatedValidEmail(id: Int) = ContactEmail(0, id, "person contact", "some@example.net", "main contact")

  def newOrUpdatedValidAddress(id: Int) = ContactAddress(0, id, "some address", "street pushkina", None)

  "Contacts controller" must {
    "list contacts info" in {
      val result = controller.list(FakeRequest())
      status(result) mustBe OK
      val maybeInfos = contentAsJson(result).validate[Seq[ContactInfo]].asOpt
      maybeInfos mustBe defined
      val infos = maybeInfos.get
      infos must have size 2
      infos.find(_.name == contactOne.name) mustBe defined
      infos.find(_.name == contactTwo.name) mustBe defined
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
    "store new contact number" in {
      val id = idOf(contactOne)
      numbersTestHelper.testValidStore(controller.storeNumber(id), newOrUpdatedValidContactNumber(id))
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
      emailsTestHelper.testValidStore(controller.storeEmail(id), newOrUpdatedValidEmail(id))
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
      addressesTestHelper.testValidStore(controller.storeAddress(id), newOrUpdatedValidAddress(id))
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
