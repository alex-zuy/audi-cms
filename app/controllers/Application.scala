package controllers

import internal.{DefaultDbConfiguration, Authenticate}
import play.api._
import play.api.Play.current
import play.api.libs.json._
import play.api.mvc._
import play.api.routing.JavaScriptReverseRouter

import org.hjson.JsonValue

import scala.collection.JavaConversions._

class Application extends Controller with DefaultDbConfiguration {

  import Application._

  implicit val readsManagerRegistration = Json.reads[ManagerRegistration]

  implicit val readsCredentials = Json.reads[Credentials]

  def index = Action {
    Ok(views.html.main("Audi"))
  }

  def login = Authenticate.loginAction()

  def logout = Authenticate.logoutAction()

  def jsRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter("jsRoutes")(
        routes.javascript.Application.login,
        routes.javascript.Application.logout,
        routes.javascript.Application.localeData,
        routes.javascript.Application.setLanguage,

        routes.javascript.Managers.list,
        routes.javascript.Managers.show,
        routes.javascript.Managers.store,
        routes.javascript.Managers.validateStore,
        routes.javascript.Managers.update,
        routes.javascript.Managers.validateUpdate,
        routes.javascript.Managers.delete,
        routes.javascript.Managers.grantAdmin,
        routes.javascript.Managers.revokeAdmin,
        routes.javascript.Managers.changePassword,

        routes.javascript.Contacts.list,
        routes.javascript.Contacts.store,
        routes.javascript.Contacts.show,
        routes.javascript.Contacts.update,
        routes.javascript.Contacts.delete,
        routes.javascript.Contacts.validate,
        routes.javascript.Contacts.storeAddress,
        routes.javascript.Contacts.updateAddress,
        routes.javascript.Contacts.deleteAddress,
        routes.javascript.Contacts.validateAddress,
        routes.javascript.Contacts.storeNumber,
        routes.javascript.Contacts.updateNumber,
        routes.javascript.Contacts.deleteNumber,
        routes.javascript.Contacts.validateNumber,
        routes.javascript.Contacts.storeEmail,
        routes.javascript.Contacts.updateEmail,
        routes.javascript.Contacts.deleteEmail,
        routes.javascript.Contacts.validateEmail,

        routes.javascript.Articles.list,
        routes.javascript.Articles.storeHeaders,
        routes.javascript.Articles.validateHeaders,
        routes.javascript.Articles.show,
        routes.javascript.Articles.updateHeaders,
        routes.javascript.Articles.updateText,
        routes.javascript.Articles.delete,

        routes.javascript.Photos.storePhotoSet,
        routes.javascript.Photos.listPhoto,
        routes.javascript.Photos.validatePhotoHeaders,
        routes.javascript.Photos.storePhotoHeaders,
        routes.javascript.Photos.showHeaders,
        routes.javascript.Photos.updateHeaders,
        routes.javascript.Photos.uploadImage,
        routes.javascript.Photos.showImage,
        routes.javascript.Photos.delete,

        routes.javascript.Models.storeRange,
        routes.javascript.Models.listRanges,
        routes.javascript.Models.validateRange,
        routes.javascript.Models.showRange,
        routes.javascript.Models.updateRange,
        routes.javascript.Models.deleteRange,
        routes.javascript.Models.storeModel,
        routes.javascript.Models.listModels,
        routes.javascript.Models.validateModel,
        routes.javascript.Models.showModel,
        routes.javascript.Models.showModelDetailed,
        routes.javascript.Models.listModelEditions,
        routes.javascript.Models.updateModel,
        routes.javascript.Models.deleteModel,
        routes.javascript.Models.storeEdition,
        routes.javascript.Models.listEditions,
        routes.javascript.Models.validateEdition,
        routes.javascript.Models.showEdition,
        routes.javascript.Models.updateEdition,
        routes.javascript.Models.deleteEdition
      )
    ).as("text/javascript")
  }

  def localeData = Action { implicit request =>
    val content = scala.io.Source.fromInputStream(getClass.getResourceAsStream(s"/translations/${getLang}.hjson")).mkString
    val translations = JsonValue.readHjson(content).toString
    Ok(Json.obj(
      "translations" -> Json.parse(translations),
      "defaultLanguage" -> defaultLanguage,
      "supportedLanguages" -> JsArray(supportedLanguages.map(JsString.apply))))
      .as("text/json")
      .withCookies(Cookie("lang", getLang, httpOnly = false))
  }

  def setLanguage(lang: String) = Action { implicit request =>
    if(supportedLanguages contains lang) {
      Ok.withCookies(Cookie("lang", lang, httpOnly = false))
    }
    else {
      BadRequest("Unsupported or unknown language")
    }
  }

}

object Application {

  case class Credentials(email: String, password: String)

  case class ManagerRegistration(fullName: String, email: String, password: String, isAdmin: Option[Boolean])

  /**
   * Default language for client is English
   */
  val defaultLanguage = Play.application.configuration.getString("app.i18n.defaultLanguage").get

  val supportedLanguages = Play.application.configuration.getStringList("app.i18n.supportedLanguages").get

  def getLang(implicit request: RequestHeader) = request.cookies.get("lang").map(_.value) getOrElse "en"

}