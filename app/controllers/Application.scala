package controllers

import internal.{DefaultDbConfiguration, Authenticate}
import play.api._
import play.api.libs.json._
import play.api.mvc._


class Application extends Controller with DefaultDbConfiguration {

  import Application._

  implicit val readsManagerRegistration = Json.reads[ManagerRegistration]

  implicit val readsCredentials = Json.reads[Credentials]

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def login = Authenticate.loginAction()

  def logout = Authenticate.logoutAction()
}

object Application {

  case class Credentials(email: String, password: String)

  case class ManagerRegistration(fullName: String, email: String, password: String, isAdmin: Option[Boolean])

}