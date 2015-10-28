package controllers

import internal.{CheckExists, Authenticate, RequestBodyValidation, DefaultDbConfiguration}
import internal.PostgresDriverExtended.api._
import internal.validation._
import internal.validation.Validators._
import internal.FormatEnumeration
import models.ManagerRoles.TypicalManager
import models._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Future

class Models extends Controller with DefaultDbConfiguration with RequestBodyValidation {

  import Models._
  import ModelDAO._
  import Json.toJson

  implicit val formatsEngineType = new FormatEnumeration(EngineTypes)

  implicit val formatsGearboxType = new FormatEnumeration(GearboxTypes)

  implicit val formatsTransmissionType = new FormatEnumeration(TransmissionTypes)

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val formatsModelRange = Json.format[ModelRange]

  implicit val formatsModels = Json.format[Model]

  implicit val formatsModelEditions = Json.format[ModelEdition]

  implicit val formatsPhotoHeaders = Json.format[PhotoDAO.PhotoHeaders]

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

  def storeModel = Authenticate(TypicalManager).async(parse.json[Model].validateWith(
    new ModelValidator(_))) { implicit request =>
    runQuery(ModelDAO.insertModel(request.body)).map(id => Ok(toJson(StoreResponse(id))))
  }

  def listModels = Action.async { implicit request =>
    runQuery(allModels.result).map(models => Ok(toJson(models)))
  }

  def listModelsDetailed = Action.async { implicit request =>
    runQuery(allModels.result).map { models =>
      for(model <- models) yield {
        for {
          photos <- runQuery(PhotoDAO.photoSetPhotos(model.photoSetId).result)
          range <- runQuery(ModelDAO.rangeById(model.modelRangeId))
          editions <- runQuery(ModelDAO.modelEditions(model.id.get).result)
        } yield {
          val transformer = __.json.update((
            (__ \ 'editions).json.put(toJson(editions)) and
            (__ \ 'range).json.put(toJson(range)) and
            (__ \ 'photos).json.put(toJson(photos.map(t => PhotoDAO.PhotoHeaders(Some(t._1), t._2, t._3, t._4))))
            ).reduce)
          toJson(model).transform(transformer).get
        }
      }
    }.flatMap(all => Future.sequence(all)).map(models => Ok(JsArray(models)))
  }

  def validateModel = ValidateAction[Model](TypicalManager, new ModelValidator(_))

  def showModel(id: Int) = (Action andThen CheckExists(id, allModels)).async { implicit request =>
    runQuery(modelById(id).result.head).map(model => Ok(toJson(model)))
  }

  def showModelDetailed(id: Int) = (Action andThen CheckExists(id, allModels)).async { implicit request =>
    for {
      model <- runQuery(modelById(id).result.head)
      editions <- runQuery(modelEditions(id).result)
      range <- runQuery(rangeById(model.modelRangeId))
      photos <- runQuery(PhotoDAO.photoSetPhotos(model.photoSetId).result)
    } yield {
      val transformer = __.json.update((
        (__ \ 'editions).json.put(toJson(editions)) and
        (__ \ 'range).json.put(toJson(range)) and
        (__ \ 'photos).json.put(toJson(photos.map(t => PhotoDAO.PhotoHeaders(Some(t._1), t._2, t._3, t._4))))
        ).reduce)
      Ok(toJson(model).transform(transformer).get)
    }
  }

  def listModelEditions(modelId: Int) = (Action andThen CheckExists(modelId, allModels)).async { implicit request =>
    runQuery(modelEditions(modelId).result).map(editions => Ok(toJson(editions)))
  }

  def updateModel(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allModels)).async(
    parse.json[Model].validateWith(new ModelValidator(_))) { implicit request =>
    runQuery(ModelDAO.updateModel(id, request.body)).map(_ => Ok)
  }

  def deleteModel(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allModels)).async(
    implicit request => runQuery(ModelDAO.deleteModel(id)).map(_ => Ok))

  def storeEdition = Authenticate(TypicalManager).async(parse.json[ModelEdition].validateWith(
    new ModelEditionValidator(_))) { implicit request =>
    runQuery(insertModelEdition(request.body)).map(id => Ok(toJson(StoreResponse(id))))
  }

  def listEditions = Action.async { implicit request =>
    runQuery(allModelEditions.result).map(editions => Ok(toJson(editions)))
  }

  def validateEdition = ValidateAction[ModelEdition](TypicalManager, new ModelEditionValidator(_))

  def showEdition(id: Int) = (Action andThen CheckExists(id, allModelEditions)).async { implicit request =>
    runQuery(editionById(id).result.head).map(e => Ok(toJson(e)))
  }

  def updateEdition(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allModelEditions)).async(
    parse.json[ModelEdition].validateWith(new ModelEditionValidator(_))) { implicit request =>
    runQuery(ModelDAO.updateEdition(id, request.body)).map(_ => Ok)
  }

  def deleteEdition(id: Int) = (Authenticate(TypicalManager) andThen CheckExists(id, allModelEditions)).async(
    implicit request => runQuery(ModelDAO.deleteEdition(id)).map(_ => Ok))
}

object Models {

  case class StoreResponse(id: Int)

  class ModelRangeValidator(modelRange: ModelRange) extends Validator {
    def rules: Seq[(String, RuleSet[_])] = Seq(
      "name" -> Required(modelRange.name)(I18nTexts),
      "description" -> Optional(modelRange.description)(I18nTexts)
    )
  }

  class ModelValidator(model: Model) extends Validator {
    def rules: Seq[(String, RuleSet[_])] = Seq(
      "modelRangeId" -> Required(model.modelRangeId)(),
      "photoSetId" -> Required(model.photoSetId)(),
      "name" -> Required(model.name)(I18nTexts),
      "passengerCapacity" -> Required(model.passengerCapacity)(InRange(2, 10)),
      "width" -> Required(model.width)(InRange(1.0f, 2.0f)),
      "height" -> Required(model.height)(InRange(1.0f, 3.0f)),
      "length" -> Required(model.length)(InRange(1.0f, 6.0f)),
      "groundClearance" -> Required(model.groundClearance)(InRange(0.0f, 1.0f)),
      "luggageSpace" -> Required(model.luggageSpace)(InRange(50, 800))
    )
  }

  class ModelEditionValidator(modelEdition: ModelEdition) extends Validator {
    def rules: Seq[(String, RuleSet[_])] = Seq(
      "modelId" -> Required(modelEdition.modelId)(),
      "name" -> Required(modelEdition.name)(I18nTexts),
      "engineType" -> Required(modelEdition.engineType)(),
      "engineVolume" -> Required(modelEdition.engineVolume)(InRange(1.0f, 8.0f)),
      "engineCylinderCount" -> Required(modelEdition.engineCylinderCount)(InRange(2,16)),
      "enginePower" -> Required(modelEdition.enginePower)(InRange(20, 1200)),
      "fuelTank" -> Required(modelEdition.fuelTank)(InRange(2, 150)),
      "fuelConsumption" -> Required(modelEdition.fuelConsumption)(InRange(2.0f, 18.0f)),
      "acceleration" -> Required(modelEdition.acceleration)(InRange(2.0f, 25.0f)),
      "maxSpeed" -> Required(modelEdition.maxSpeed)(InRange(60, 450)),
      "gearboxType" -> Required(modelEdition.gearboxType)(),
      "gearboxLevels" -> Required(modelEdition.gearboxLevels)(InRange(2, 8)),
      "transmissionType" -> Required(modelEdition.transmissionType)()
    )
  }
}
