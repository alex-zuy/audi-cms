package controllers

import controllers.TestDrives.TestDriveValidator
import internal._
import internal.PostgresDriverExtended.api._
import internal.validation._

import models.ManagerRoles.TypicalManager
import models._

import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import play.api.libs.concurrent.Execution.Implicits._

import scala.concurrent.Future

class TestDrives extends Controller with DefaultDbConfiguration with RequestBodyValidation {

  import Json.toJson
  import TestDrives._

  implicit val formatsTestDrives = Json.format[TestDrive]

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val writesContactAddress = Json.writes[ContactAddress]

  implicit val writesModel = Json.writes[Model]

  implicit val writesModelEdition = Json.writes[ModelEdition]

  def list = Authenticate(TypicalManager).async { implicit request =>
    runQuery(TestDriveDAO.allTestDrives.result).map(all =>
      for(testDrive <- all) yield
        for {
          preferedContactAddress <- runQuery(ContactInfoDAO.allAddresses.filter(_.id === testDrive.preferedContactAddressId).result.headOption)
          modelEdition <- runQuery(ModelDAO.editionById(testDrive.modelEditionId).result.head)
          model <- runQuery(ModelDAO.modelById(modelEdition.modelId).result.head)
        } yield {
          toJson(testDrive).transform(__.json.update((
            (__ \ 'preferedContactAddress).json.put(toJson(preferedContactAddress)) and
            (__ \ 'modelEdition).json.put(toJson(modelEdition)) and
            (__ \ 'model).json.put(toJson(model))
            ).reduce)
          ).get
        }
    ).flatMap(all => Future.sequence(all)).map(all => Ok(JsArray(all)))
  }

  def validate = Action(parse.json[TestDrive]) { implicit request =>
    Ok(toJson(new TestDriveValidator(request.body).violations))
  }

  def store = Action.async(parse.json[TestDrive].validateWith(new TestDriveValidator(_))) { implicit request =>
    runQuery(TestDriveDAO.insertTestDrive(request.body)).map(id => Ok(toJson(StoreResponse(id))))
  }

  def delete(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, TestDriveDAO.allTestDrives)).async { implicit request =>
    runQuery(TestDriveDAO.deleteTestDrive(id)).map(_ => Ok)
  }
}

object TestDrives {

  import Validators._

  case class StoreResponse(id: Int)

  class TestDriveValidator(td: TestDrive) extends Validator {
    override def rules: Seq[(String, RuleSet[_])] = Seq(
      "preferedContactAddressId" -> Optional(td.preferedContactAddressId)(),
      "modelEditionId" -> Required(td.modelEditionId)(),
      "clientFullName" -> Required(td.clientFullName)(Length(50)),
      "clientEmail" -> Required(td.clientEmail)(Length(50), Email),
      "clientNumber" -> Required(td.clientNumber)(Length(20), PhoneNumber)
    )
  }
}
