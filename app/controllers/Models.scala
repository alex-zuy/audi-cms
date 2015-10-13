package controllers

import internal.{CheckExists, Authenticate, RequestBodyValidation, DefaultDbConfiguration}
import internal.PostgresDriverExtended.api._
import internal.validation._
import internal.validation.Validators._
import models.ManagerRoles.TypicalManager
import models._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.concurrent.Execution.Implicits._

class Models extends Controller with DefaultDbConfiguration with RequestBodyValidation {

  import Models._
  import ModelDAO._
  import Json.toJson

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val formatsModelRange = Json.format[ModelRange]

  def storeRange = Authenticate(TypicalManager).async(parse.json[ModelRange].validateWith(
    new ModelRangeValidator(_))) { implicit request =>
    runQuery(insertModelRange(request.body)).map(id => Ok(toJson(StoreResponse(id))))
  }

  def listRanges = Action.async { implicit request =>
    runQuery(allModelRanges.result).map(ranges => Ok(toJson(ranges)))
  }

  def validateRange = ValidateAction[ModelRange](TypicalManager, new ModelRangeValidator(_))

  def showRange(id: Int) = (Action andThen CheckExists(id, allModelRanges)).async { implicit request =>
    runQuery(rangeById(id)).map(range => Ok(toJson(range)))
  }

  def updateRange(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allModelRanges)
    ).async(parse.json[ModelRange].validateWith(new ModelRangeValidator(_))) { implicit request =>
    runQuery(ModelDAO.updateRange(id, request.body)).map(_ => Ok)
  }

  def deleteRange(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allModelRanges)
    ).async { implicit request =>
    runQuery(ModelDAO.deleteRange(id)).map(_ => Ok)
  }
}

object Models {

  case class StoreResponse(id: Int)

  class ModelRangeValidator(modelRange: ModelRange) extends Validator {
    def rules: Seq[(String, RuleSet[_])] = Seq(
      "name" -> Required(modelRange.name)(I18nTexts),
      "description" -> Optional(modelRange.description)(I18nTexts)
    )
  }
}
