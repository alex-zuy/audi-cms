package internal

import models.ManagerRoles.Role
import models.{ManagerDAO, Manager}
import play.api._
import play.api.Play.current
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.BodyParsers._
import slick.driver.JdbcProfile

import scala.concurrent.{Future, Await}
import scala.concurrent.duration._

class Authenticate(role: Role) extends ActionBuilder[AuthenticatedRequest] with Results {

  implicit val dbConfig = DatabaseConfigProvider.get[JdbcProfile]

  override def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]) = {
    authorize(request).map { manager =>
      if (manager.hasRole(role)) block(new AuthenticatedRequest[A](manager, request))
      else Future.successful(Unauthorized)
    } getOrElse {
      Future.successful(Unauthorized)
    }
  }

  protected def authorize(request: RequestHeader): Option[Manager] = {
    request.session.get(Authenticate.sessionKeyName).map { managerEmail =>
      Await.result(ManagerDAO.byEmail(managerEmail), 10 seconds)
    } getOrElse None
  }
}

object Authenticate {

  import play.api.mvc.Results._

  def apply(role: Role) = new Authenticate(role)

  implicit val dbConfig = DatabaseConfigProvider.get[JdbcProfile]

  case class Credentials(email: String, password: String)

  implicit val readsCredentials = Json.reads[Credentials]

  /**
   * Name of session key which contains user identification info.
   */
  val sessionKeyName = "managerEmail"

  /**
   * Creates login action
   * @return
   */
  def loginAction = Action(parse.json) { implicit request =>
    request.body.asOpt[Credentials].map { credentials =>
      ManagerDAO.authorize(credentials.email, credentials.password).map { manager =>
        Ok.addingToSession((sessionKeyName -> manager.email))
      } getOrElse NotFound
    } getOrElse BadRequest
  }

  /**
   * Creates logout action
   * @return
   */
  def logoutAction = Action { implicit request =>
    Ok.removingFromSession(sessionKeyName)
  }

}

class AuthenticatedRequest[A](val manager: Manager, request: Request[A]) extends WrappedRequest[A](request)
