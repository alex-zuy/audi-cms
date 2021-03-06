package controllers

import internal.validation._
import internal.validation.Validators._
import internal.{RequestBodyValidation, CheckExists, Authenticate, DefaultDbConfiguration}
import internal.PostgresDriverExtended.api._
import models.ContactInfoDAO._
import models._
import models.ManagerRoles.TypicalManager

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json._
import play.api.libs.json.Json.toJson
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import play.api.mvc._

import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

import scala.concurrent.Future

class Contacts extends Controller with DefaultDbConfiguration with RequestBodyValidation {

  import Contacts._

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val formatContactInfo = Json.format[ContactInfo]

  implicit val formatContactNumber = Json.format[ContactNumber]

  implicit val formatContactEmail = Json.format[ContactEmail]

  implicit val formatContactAddress = Json.format[ContactAddress]

  def list = Action.async { implicit request =>
    runQuery(allInfos.result).map { infos =>
      Ok(toJson(infos))
    }
  }

  def listDetailed = Action.async { implicit request =>
    runQuery(ContactInfoDAO.allInfos.result).map { infos =>
      for(info <- infos) yield
        for {
          numbers <- runQuery(ContactInfoDAO.infoNumbers(info.id.get).result)
          emails <- runQuery(ContactInfoDAO.infoEmails(info.id.get).result)
          addresses <- runQuery(ContactInfoDAO.infoAddresses(info.id.get).result)
        } yield
          toJson(info).transform(__.json.update((
            (__ \ 'numbers).json.put(toJson(numbers)) and
            (__ \ 'emails).json.put(toJson(emails)) and
            (__ \ 'addresses).json.put(toJson(addresses))
            ).reduce)).get
    }.flatMap(Future.sequence(_)).map(infos => Ok(JsArray(infos)))
  }

  def store = Authenticate(TypicalManager).async(parse.json[ContactInfo].validateWith(
    new ContactInfoValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.insertInfo(request.body)).map { id =>
      Ok(toJson(StoreResponse(id)))
    }
  }

  def show(id: Int) = (Action andThen CheckExists(id, allInfos)).async { implicit request =>
    for {
      Some(info) <- runQuery(ContactInfoDAO.infoById(id).result.headOption)
      numbers <- runQuery(allNumbers.filter(_.contactInfoId === id).result)
      emails <- runQuery(allEmails.filter(_.contactInfoId === id).result)
      addresses <- runQuery(allAddresses.filter(_.contactInfoId === id).result)
    } yield {
      val transformer = __.json.update((
        (__ \ 'numbers).json.put(toJson(numbers)) and
        (__ \ 'emails).json.put(toJson(emails)) and
        (__ \ 'addresses).json.put(toJson(addresses))
        ).reduce)
      Ok(toJson(info).transform(transformer).get)
    }
  }

  def update(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allInfos)).async(
    parse.json[ContactInfo].validateWith(new ContactInfoValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.updateInfo(id, request.body)).map( _ => Ok)
  }

  def delete(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allInfos)).async {
    runQuery(ContactInfoDAO.deleteInfo(id)).map(_ => Ok)
  }

  def validate = ValidateAction[ContactInfo](TypicalManager, new ContactInfoValidator(_))

  def storeAddress = Authenticate(TypicalManager).async(parse.json[ContactAddress].validateWith(
    new ContactAddressValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.insertAddress(request.body)).map { id =>
      Ok(toJson(StoreResponse(id)))
    }
  }

  def updateAddress(addressId: Int) = (Authenticate(TypicalManager) andThen CheckExists(addressId, allAddresses)).async(
    parse.json[ContactAddress].validateWith(new ContactAddressValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.updateAddress(addressId, request.body)).map(_ => Ok)
  }

  def deleteAddress(addressId: Int) = (Authenticate(TypicalManager) andThen CheckExists(addressId, allAddresses)).async { implicit request =>
    runQuery(ContactInfoDAO.deleteAddress(addressId)).map(_ => Ok)
  }

  def validateAddress = ValidateAction[ContactAddress](TypicalManager, new ContactAddressValidator(_))

  def storeNumber = Authenticate(TypicalManager).async(parse.json[ContactNumber].validateWith(
    new ContactNumberValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.insertNumber(request.body)).map { id =>
      Ok(toJson(StoreResponse(id)))
    }
  }

  def updateNumber(numberId: Int) = (Authenticate(TypicalManager) andThen CheckExists(numberId, allNumbers)).async(
    parse.json[ContactNumber].validateWith(new ContactNumberValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.updateNumber(numberId, request.body)).map(_ => Ok)
  }

  def deleteNumber(numberId: Int) = (Authenticate(TypicalManager) andThen CheckExists(numberId, allNumbers)).async { implicit request =>
    runQuery(ContactInfoDAO.deleteNumber(numberId)).map(_ => Ok)
  }

  def validateNumber = ValidateAction[ContactNumber](TypicalManager, new ContactNumberValidator(_))

  def storeEmail = Authenticate(TypicalManager).async(parse.json[ContactEmail].validateWith(
    new ContactEmailValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.insertEmail(request.body)).map{ id =>
      Ok(toJson(StoreResponse(id)))
    }
  }

  def updateEmail(emailId: Int) = (Authenticate(TypicalManager) andThen CheckExists(emailId, allEmails)).async(
    parse.json[ContactEmail].validateWith(new ContactEmailValidator(_))) { implicit request =>
    runQuery(ContactInfoDAO.updateEmail(emailId, request.body)).map( _ => Ok)
  }

  def deleteEmail(emailId: Int) = (Authenticate(TypicalManager) andThen CheckExists(emailId, allEmails)).async { implicit request =>
    runQuery(ContactInfoDAO.deleteEmail(emailId)).map(_ => Ok)
  }

  def validateEmail = ValidateAction[ContactEmail](TypicalManager, new ContactEmailValidator(_))

}

object Contacts {

  case class StoreResponse(id: Int)

  class ContactInfoValidator(contactInfo: ContactInfo)(implicit dbConfig: DatabaseConfig[JdbcProfile]) extends Validator {
    override def rules: Seq[(String, RuleSet[_])] = Seq(
      "name" -> Required(contactInfo.name)(
        I18nTexts
      ),
      "category" -> Required(contactInfo.category)(
        Length(50), NoWhitespace
      )
    )
  }

  class ContactNumberValidator(contactNumber: ContactNumber) extends Validator {
    override def rules: Seq[(String, RuleSet[_])] = Seq(
      "contactInfoId" -> Required(contactNumber.contactInfoId)(),
      "name" -> Required(contactNumber.name)(
        I18nTexts
      ),
      "number" -> Required(contactNumber.number)(
        Length(20), PhoneNumber
      )
    )
  }

  class ContactEmailValidator(contactEmail: ContactEmail) extends Validator {
    override def rules: Seq[(String, RuleSet[_])] = Seq(
      "contactInfoId" -> Required(contactEmail.contactInfoId)(),
      "name" -> Required(contactEmail.name)(
        I18nTexts
      ),
      "email" -> Required(contactEmail.email)(
        Length(50), Email
      )
    )
  }

  class ContactAddressValidator(contactAddress: ContactAddress) extends Validator {
    override def rules: Seq[(String, RuleSet[_])] = Seq(
      "contactInfoId" -> Required(contactAddress.contactInfoId)(),
      "name" -> Required(contactAddress.name)(
        I18nTexts
      ),
      "address" -> Required(contactAddress.address)(
        Length(50)
      ),
      "geoCoordinates" -> Optional(contactAddress.geoCoordinates)()
    )
  }

}
