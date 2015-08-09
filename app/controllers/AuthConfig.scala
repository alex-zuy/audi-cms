package controllers

import internal.DatabaseConfiguration
import jp.t2v.lab.play2.auth.{AuthConfig => AuthConfigBase}
import models.{Manager, ManagerDAO}
import models.ManagerRoles.{TypicalManager, Administrator, Role}
import play.api.mvc.{Result, Results, RequestHeader}
import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.{classTag, ClassTag}

trait AuthConfig extends AuthConfigBase with Results {
  this: DatabaseConfiguration =>

  /**
   * A type that is used to identify a user.
   * `String`, `Int`, `Long` and so on.
   */
  type Id = String

  /**
   * A type that represents a user in your application.
   * `User`, `Account` and so on.
   */
  type User = Manager

  /**
   * A type that is defined by every action for authorization.
   * This sample uses the following trait:
   *
   * sealed trait Role
   * case object Administrator extends Role
   * case object NormalUser extends Role
   */
  type Authority = Role

  /**
   * A `ClassTag` is used to retrieve an id from the Cache API.
   * Use something like this:
   */
  val idTag: ClassTag[Id] = classTag[Id]

  /**
   * The session timeout in seconds
   */
  val sessionTimeoutInSeconds: Int = 3600

  /**
   * A function that returns a `User` object from an `Id`.
   * You can alter the procedure to suit your application.
   */
  def resolveUser(email: Id)(implicit ctx: ExecutionContext): Future[Option[User]] = {
    ManagerDAO.byEmail(email)
  }

  protected def successfullLoginLogout(request: RequestHeader): Future[Result] = Future.successful(
    request.headers.get("X-Requested-With") match {
      case Some("XMLHttpRequest") => Ok("OK").as("text/json");
      case _ => Ok(views.html.index("Audi"))
    })

  /**
   * Where to redirect the user after a successful login.
   */
  def loginSucceeded(request: RequestHeader)(implicit ctx: ExecutionContext): Future[Result] =
    successfullLoginLogout(request)

  /**
   * Where to redirect the user after logging out
   */
  def logoutSucceeded(request: RequestHeader)(implicit ctx: ExecutionContext): Future[Result] =
    successfullLoginLogout(request)

  /**
   * If the user is not logged in and tries to access a protected resource then redirct them as follows:
   */
  def authenticationFailed(request: RequestHeader)(implicit ctx: ExecutionContext): Future[Result] =
    Future.successful(request.headers.get("X-Requested-With") match {
      case Some("XMLHttpRequest") => Unauthorized("Authentication failed");
      case _ => Redirect(routes.Application.index)
    })

  /**
   * If authorization failed (usually incorrect password) redirect the user as follows:
   */
  def authorizationFailed(request: RequestHeader, user: User, authority: Option[Authority])(implicit context: ExecutionContext): Future[Result] = {
    Future.successful(Forbidden("no permission"))
  }

  /**
   * A function that determines what `Authority` a user has.
   * You should alter this procedure to suit your application.
   */
  def authorize(user: User, authority: Authority)(implicit ctx: ExecutionContext): Future[Boolean] = Future.successful {
    (user.role, authority) match {
      case (Administrator, _) => true
      case (TypicalManager, TypicalManager) => true
      case _ => false
    }
  }
}