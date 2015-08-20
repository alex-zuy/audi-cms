package controllers

import internal.{DefaultDbConfiguration, Authenticate}
import play.api._
import play.api.libs.json._
import play.api.mvc._
import play.api.routing.JavaScriptReverseRouter


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

        routes.javascript.Managers.list,
        routes.javascript.Managers.store,
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
}

object Application {

  case class Credentials(email: String, password: String)

  case class ManagerRegistration(fullName: String, email: String, password: String, isAdmin: Option[Boolean])

}