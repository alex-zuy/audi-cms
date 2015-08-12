import org.scalatest._
import org.scalatestplus.play._
import internal.{Authenticate, DefaultDbConfiguration}
import models.ManagerRoles
import models.ManagerRoles._
import internal.Authenticate.{Credentials}
import play.api.libs.json.Json
import play.api.mvc.{Action, Cookie, Controller}
import play.api.mvc.Security.AuthenticatedRequest
import play.api.test._
import play.api.test.Helpers._
import seeders.ManagersSeeder
import utility.{FakeAuthenticatedRequests, FakeAppPerSuite}

class AuthenticationTest extends FakeAppPerSuite with FakeAuthenticatedRequests {

  import seeders.ManagersSeeder.{admin, managerOne, passwordOf}

  before {
    await(ManagersSeeder.clean)
    await(ManagersSeeder.seed)
  }

  def controller = new Controller {

    def jsonAction = Authenticate(TypicalManager)(parse.json) { implicit request =>
      request.manager // just to make sure it compiles
      Ok
    }

    def managerAction = Authenticate(TypicalManager) { implicit request =>
      Ok
    }

    def adminAction = Authenticate(Administrator) { implicit request =>
      Ok
    }

    def login = Authenticate.loginAction

    def logout = Authenticate.logoutAction
  }

  def unauthorizedRequest = FakeRequest()

  "Authenticated manager action" must {
    "not be executed for unauthorized request" in {
      status(controller.managerAction.apply(unauthorizedRequest)) mustBe UNAUTHORIZED
    }
    "be executed for manager request" in {
      status(controller.managerAction.apply(managerRequest())) mustBe OK
    }
    "be executed for admin request" in {
      status(controller.managerAction.apply(adminRequest())) mustBe OK
    }
  }

  "Authenticated admin action" must {
    "not be executed for manager request" in {
      status(controller.adminAction.apply(managerRequest())) mustBe UNAUTHORIZED
    }
    "be executed for admin request" in {
      status(controller.adminAction.apply(adminRequest())) mustBe OK
    }
  }

  implicit val writesCredentials = Json.writes[Credentials]

  "Authentication status" must {
    "be preserved during session" in {
      // First login
      val credentials = Credentials(managerOne.email, passwordOf(managerOne))
      val loginRequest = FakeRequest().withJsonBody(Json.toJson(credentials))
      val loginResponse = call(controller.login, loginRequest)
      status(loginResponse) mustBe OK
      // Then perform manager action
      val managerActionResponse = controller.managerAction.apply(FakeRequest().withSession(session(loginResponse).data.toSeq: _*))
      status(managerActionResponse) mustBe OK
      // Logout
      val logoutResponse = controller.logout.apply(FakeRequest().withSession(session(managerActionResponse).data.toSeq: _*))
      status(logoutResponse) mustBe OK
      // Make sure we can not call managerAction anymore
      val postLogoutManagerActionResponse = controller.managerAction.apply(FakeRequest().withSession(session(logoutResponse).data.toSeq: _*))
      status(postLogoutManagerActionResponse) mustBe UNAUTHORIZED
    }
  }
}
