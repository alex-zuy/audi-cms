package controllers

import internal.{DefaultDbConfiguration, Authenticate}
import play.api._
import play.api.libs.json._
import play.api.mvc._
import play.api.routing.JavaScriptReverseRouter

import org.hjson.JsonValue

class Application extends Controller with DefaultDbConfiguration {

  import Application._

  implicit val readsManagerRegistration = Json.reads[ManagerRegistration]

  implicit val readsCredentials = Json.reads[Credentials]

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def login = Authenticate.loginAction()

  def logout = Authenticate.logoutAction()

  def jsRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter("jsRoutes")(
        routes.javascript.Application.login,
        routes.javascript.Application.logout,
        routes.javascript.Application.translations,
        routes.javascript.Application.setLanguage,

        routes.javascript.Managers.list,
        routes.javascript.Managers.show,
        routes.javascript.Managers.store,
        routes.javascript.Managers.validateStore,
        routes.javascript.Managers.update,
        routes.javascript.Managers.delete,
        routes.javascript.Managers.grantAdmin,
        routes.javascript.Managers.revokeAdmin,
        routes.javascript.Managers.changePassword,

        routes.javascript.Contacts.list,
        routes.javascript.Contacts.store,
        routes.javascript.Contacts.show,
        routes.javascript.Contacts.update,
        routes.javascript.Contacts.delete,
        routes.javascript.Contacts.storeAddress,
        routes.javascript.Contacts.updateAddress,
        routes.javascript.Contacts.deleteAddress,
        routes.javascript.Contacts.storeNumber,
        routes.javascript.Contacts.updateNumber,
        routes.javascript.Contacts.deleteNumber,
        routes.javascript.Contacts.storeEmail,
        routes.javascript.Contacts.updateEmail,
        routes.javascript.Contacts.deleteEmail
      )
    ).as("text/javascript")
  }

  def translations = Action { implicit request =>
    val content = scala.io.Source.fromInputStream(getClass.getResourceAsStream(s"/translations/${getLang}.hjson")).mkString
    Ok(JsonValue.readHjson(content).toString).as("text/json").withCookies(Cookie("lang", getLang))
  }

  def setLanguage(lang: String) = Action { implicit request =>
    if(supportedLanguages contains lang) {
      Ok.withCookies(Cookie("lang", lang))
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
  val defaultLang = "en";

  val supportedLanguages = Set("en", "ru")

  def getLang(implicit request: RequestHeader) = request.cookies.get("lang").map(_.value) getOrElse "en"

}