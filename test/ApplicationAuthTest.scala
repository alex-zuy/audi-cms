import controllers.Application
import controllers.Application.{ManagerRegistration, Credentials}
import play.api.test._
import play.api.test.Helpers._
import utility.FakeAppPerSuite

import scala.concurrent.Future

class ApplicationAuthTest extends FakeAppPerSuite {

  def controller = new Application

  "The Application controller" must {
    "return main page in index request" in {
      val result = controller.index.apply(FakeRequest())
      status(result) mustBe OK
      contentType(result) mustBe Some("text/html")
      contentAsString(result) must include("Audi")
    }
  }
}
