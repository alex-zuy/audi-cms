package app.controllers

import controllers.Application
import controllers.Application.{ManagerRegistration, Credentials}
import play.api.test._
import play.api.test.Helpers._
import utility.FakeAppPerSuite
import utility.CrudTestHelper._

import scala.concurrent.Future

class ApplicationTest extends FakeAppPerSuite {

  def controller = new Application

  "The Application controller" must {
    "return main page in index request" in {
      val result = controller.index.apply(FakeRequest())
      status(result) mustBe OK
      contentType(result) mustBe Some("text/html")
      contentAsString(result) must include("Audi")
    }
    "return translations file on translations request and set 'lang' cookie to 'en'" in {
      val result = controller.translations(FakeRequest())
      status(result) mustBe OK
      contentType(result).get mustBe "text/json"
      val maybeLang = cookies(result).get("lang")
      maybeLang mustBe defined
      maybeLang.get.value mustBe "en"
    }
  }
}
