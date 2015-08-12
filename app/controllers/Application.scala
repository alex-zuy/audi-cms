package controllers

import javax.inject.Inject

import internal.{DefaultDbConfiguration, DatabaseConfiguration}
import models.{Manager, ManagerDAO}
import org.mindrot.jbcrypt.BCrypt
import play.api._
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.mvc._
import play.api.mvc.BodyParsers.parse._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.db.slick.DatabaseConfigProvider

import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent.Future

abstract class ApplicationImpl
  extends Controller
  with DatabaseConfiguration {
  this: Controller =>

  import ApplicationImpl._

  implicit val readsManagerRegistration = Json.reads[ManagerRegistration]

  implicit val readsCredentials = Json.reads[Credentials]

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }
}

object ApplicationImpl {

  case class Credentials(email: String, password: String)

  case class ManagerRegistration(fullName: String, email: String, password: String, isAdmin: Option[Boolean])

}

class Application extends ApplicationImpl with DefaultDbConfiguration
