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
import utility.{FakeAppPerSuite, TestDbConfiguration, SeededDatabase, CleanDatabase}
import slick.driver.PostgresDriver.api._

import scala.concurrent.Future

class ApplicationAuthTest extends FakeAppPerSuite {

  def controller = new ApplicationImpl with TestDbConfiguration {
    override val application = app
  }

  "The Application controller" must {
    "return main page in index request" in {
      var result = controller.index.apply(FakeRequest())
      status(result) mustBe OK
      contentType(result) mustBe Some("text/html")
      contentAsString(result) must include("Audi")
    }
  }
}
