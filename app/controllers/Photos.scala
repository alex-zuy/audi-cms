package controllers

import java.io.FileInputStream
import java.nio.file.{Path, Files}
import java.sql.Blob
import javax.sql.rowset.serial.SerialBlob

import internal.{RequestBodyValidation, CheckExists, Authenticate, DefaultDbConfiguration}
import internal.validation.{ValidateAction, Required, Validator, Validators}
import internal.PostgresDriverExtended.api._
import models.ManagerRoles.TypicalManager
import models.PhotoDAO

import play.api._
import play.api.libs.json._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc._

class Photos extends Controller with DefaultDbConfiguration with RequestBodyValidation {

  import Json.toJson
  import Photos._
  import PhotoDAO._

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val formatsPhotoHeaders = Json.format[PhotoHeaders]

  def storePhotoSet = Authenticate(TypicalManager).async { implicit request =>
    runQuery(PhotoDAO.createPhotoSet).map(id => Ok(toJson(StoreResponse(id))))
  }

  def listPhoto(photoSetId: Int) = (Action andThen CheckExists(photoSetId, allPhotoSets)).async { implicit request =>
    runQuery(photoSetPhotos(photoSetId).result).map(photos => Ok(toJson(photos.map(toPhotoHeaders))))
  }

  def validatePhotoHeaders = ValidateAction[PhotoHeaders](TypicalManager, new PhotoHeadersValidator(_))

  def storePhotoHeaders = Authenticate(TypicalManager).async(parse.json[PhotoHeaders].validateWith(
    new PhotoHeadersValidator(_))) { implicit request =>
    val ph = request.body
    runQuery((PhotoDAO.photoMetaProjection returning allPhotos.map(_.id)) += ph.mainHeaders).map(
      id => Ok(toJson(StoreResponse(id))))
  }

  def showHeaders(photoId: Int) = (Action andThen CheckExists(photoId, allPhotos)).async { implicit request =>
    runQuery(byId(photoId).map(p => (p.id, p.photoSetId, p.name, p.mimeType)).result.head).map(ph =>
      Ok(toJson(toPhotoHeaders(ph))))
  }

  def updateHeaders(photoId: Int) = (Authenticate(TypicalManager) andThen CheckExists(photoId, allPhotos)).async(
    parse.json[PhotoHeaders].validateWith(new PhotoHeadersValidator(_))) { implicit request =>
    runQuery(PhotoDAO.photoMeta(photoId).update(request.body.mainHeaders)).map(_ => Ok)
  }

  def uploadImage(photoId: Int) = (Authenticate(TypicalManager) andThen CheckExists(photoId, allPhotos)).async(
    parse.temporaryFile) { implicit request =>
    val bytes = Files.readAllBytes(request.body.file.toPath)
    runQuery(byId(photoId).map(_.image).update(Some(bytes)).transactionally).map(_ => Ok)
  }

  def showImage(photoId: Int) = (Action andThen CheckExists(photoId, allPhotos)).async { implicit request =>
    runQuery(byId(photoId).map(p => (p.mimeType, p.image)).result.head.transactionally).map { data =>
      val (mimeType, image) = data
      if(image.isDefined) Ok(image.get).as(mimeType)
      else NotFound
    }
  }

  def delete(photoId: Int) = (Authenticate(TypicalManager) andThen CheckExists(photoId, allPhotos)).async {
    implicit request => runQuery(byId(photoId).delete).map(_ => Ok)
  }

  def toPhotoHeaders(t: (Int, Int, JsValue, String)) = PhotoHeaders(Some(t._1), t._2, t._3, t._4)
}

object Photos {

  case class StoreResponse(id: Int)

  case class PhotoHeaders(id: Option[Int], photoSetId: Int, name: JsValue, mimeType: String) {
    def mainHeaders = (photoSetId, name, mimeType)
  }

  class PhotoHeadersValidator(ph: PhotoHeaders) extends Validator {
    def rules = Seq(
      "name" -> Required(ph.name)(Validators.JsonObject(Seq(Application.defaultLanguage)))
    )
  }
}
