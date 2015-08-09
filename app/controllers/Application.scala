package controllers

import javax.inject.Inject

import internal.{DefaultDbConfiguration, DatabaseConfiguration}
import jp.t2v.lab.play2.auth.{AuthElement, LoginLogout}
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
  with LoginLogout
  with AuthConfig
  with AuthElement
  with DatabaseConfiguration {
  this: Controller =>

  import ApplicationImpl._

  implicit val readsManagerRegistration = Json.reads[ManagerRegistration]

  implicit val readsCredentials = Json.reads[Credentials]

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  /** Alter the login page action to suit your application. */
  def login = Action.async(parse.json) { implicit request =>
    request.body.validate[Credentials] match {
      case c: JsSuccess[Credentials] => {
        val credentials = c.get
        ManagerDAO.authorize(credentials.email, credentials.password)
          .fold(Future.successful(Unauthorized("Bad credentials"))) {
          manager => gotoLoginSucceeded(manager.email)
        }
      }
      case failure: JsError => {
        Future.successful(BadRequest)
      }
    }
  }

  /**
   * Return the `gotoLogoutSucceeded` method's result in the logout action.
   *
   * Since the `gotoLogoutSucceeded` returns `Future[Result]`,
   * you can add a procedure like the following.
   *
   * gotoLogoutSucceeded.map(_.flashing(
   * "success" -> "You've been logged out"
   * ))
   */
  def logout = Action.async { implicit request =>
    gotoLogoutSucceeded
  }

  def addManager = Action.async(parse.json) { implicit requst =>
    requst.body.validate[ManagerRegistration] match {
      case s: JsSuccess[ManagerRegistration] => {
        val mgr = s.get
        val manager = Manager(0, mgr.fullName, mgr.email, BCrypt.hashpw(mgr.password, BCrypt.gensalt()), mgr.isAdmin.getOrElse(false))
        val q = ManagerDAO.all += manager
        dbConfig.db.run(q).map(success => Created).fallbackTo(Future.successful(BadRequest))
      }
      case err: JsError => Future.successful(BadRequest)
    }
  }
}

object ApplicationImpl {

  case class Credentials(email: String, password: String)

  case class ManagerRegistration(fullName: String, email: String, password: String, isAdmin: Option[Boolean])

}

class Application extends ApplicationImpl with DefaultDbConfiguration
