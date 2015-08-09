import controllers.ApplicationImpl
import controllers.ApplicationImpl.{ManagerRegistration, Credentials}
import models.{Manager, ManagerDAO}
import org.mindrot.jbcrypt.BCrypt
import org.scalatest._
import org.scalatestplus.play.{PlaySpec, OneAppPerSuite}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.Result
import play.api.test._
import play.api.test.Helpers._
import seeders.ManagersSeeder
import slick.driver.JdbcProfile
import utility.{TestDbConfiguration, SeededDatabase, CleanDatabase}
import slick.driver.PostgresDriver.api._

import scala.concurrent.Future

class ApplicationAuthTest extends PlaySpec with OneAppPerSuite with SeededDatabase {

  implicit override lazy val app = FakeApplication(
    additionalConfiguration = Map("slick.dbs.default.db.properties.database" -> "audi-cms-test")
  )

  implicit val dbConfig = DatabaseConfigProvider.get[JdbcProfile](app)

  implicit val writesCredentials = Json.writes[Credentials]

  implicit val writesManagerRegistration = Json.writes[ManagerRegistration]

  class ApplicationController extends ApplicationImpl with TestDbConfiguration {
    override val application = app
  }

  withSeededDatabase {
    import ManagersSeeder._

    "The Application controller" must {
      "authorize admin user with valid credentials" in {
        val adminJson = Json.toJson(Credentials(admin.email, passwordOf(admin)))
        attemptingToLoginWith(adminJson) { result =>
          status(result) mustBe OK
          contentType(result) mustBe Some("text/json")
          contentAsString(result) mustBe "OK"
        }
      }
    }

    "reject authorization with invalid password" in {
      val invalidCredentials = Json.toJson(Credentials(admin.email, "wrong"))
      attemptingToLoginWith(invalidCredentials) { res =>
        status(res) mustBe UNAUTHORIZED
      }
    }

    "reject authorization with invalid credentials" in {
      val invalidCredentials = Json.toJson(Credentials("dummy", "dummy"))
      attemptingToLoginWith(invalidCredentials) { res =>
        status(res) mustBe UNAUTHORIZED
      }
    }

    "respond BadRequest when credentials malformed" in {
      val invalidRequest = Json.parse( """{"imail":"admin","password":"nothing"}""")
      attemptingToLoginWith(invalidRequest) { res =>
        status(res) mustBe BAD_REQUEST
      }
    }

    "respond Badrequest when invalid registration info provided" in {
      val invalidRequest = Json.parse( """{"fullNameZ":"New Manager","email":"new@example.net","password":"new"}""")
      attemptingToAddManagerWith(invalidRequest) { res =>
        status(res) mustBe BAD_REQUEST
      }
    }

    "respond CREATED and create new db record when valid registration info provided" in {
      val mgrToRegister = ManagerRegistration("New Manager", "new@example.net", "new", Some(false))
      attemptingToAddManagerWith(Json.toJson(mgrToRegister)) { res =>
        await(res)
        val manager: Manager = await(ManagerDAO.byEmail("new@example.net")).get
        status(res) mustBe CREATED
        manager.fullName mustBe mgrToRegister.fullName
        manager.email mustBe mgrToRegister.email
        assert(BCrypt.checkpw(mgrToRegister.password, manager.passwordHash))
        manager.isAdmin mustBe mgrToRegister.isAdmin.get
      }
    }

    "authorize new manager" in {
      attemptingToLoginWith(Json.toJson(Credentials("new@example.net", "new"))) { res =>
        status(res) mustBe OK
      }
    }
  }

  def attemptingToLoginWith(requestBody: JsValue, method: String = "GET")(verification: Future[Result] => Unit) = {
    val request = fakeAjaxRequest(requestBody)
    val controller = new ApplicationController
    val result = controller.login().apply(request)
    verification(result)
  }

  def attemptingToAddManagerWith(requestBody: JsValue)(verification: Future[Result] => Unit) = {
    val request = fakeAjaxRequest(requestBody, "POST")
    val controller = new ApplicationController
    val result = call(controller.addManager, request)
    verification(result)
  }

  def fakeAjaxRequest[B](body: B, requestMethod: String = "GET", url: String = "/"): FakeRequest[B] = {
    FakeRequest(requestMethod, url).withBody(body).withHeaders(("X-Requested-With", "XMLHttpRequest"))
  }
}
