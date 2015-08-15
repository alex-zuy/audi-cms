package app.internal.validation

import internal.validation.{Validator, Optional, Required}
import internal.validation._
import Validators._
import models.{ManagerDAO, Manager}

import seeders.ManagersSeeder
import utility.FakeAppPerSuite

import org.scalatest.{FlatSpec, Spec, MustMatchers}
import org.scalatest.MustMatchers._

import slick.driver.PostgresDriver.api._

import play.api.test.Helpers._

class ValidatorTest extends FakeAppPerSuite with MustMatchers {

  import ManagersSeeder.{managerOne, managerTwo, admin}

  before {
    await(ManagersSeeder.clean)
    await(ManagersSeeder.seed)
  }

  class ManagerValidator(manager: Manager) extends Validator {

    def rules = Seq (
      "fullName" -> Required(manager.fullName) (
        Length(50)
      ),
      "email" -> Required(manager.email) (
        Length(50), Email, Unique(ManagerDAO.all.filter(m => m.id =!= manager.id && m.email === manager.email).exists.result)
      )
    )

  }

  "Manager validator" must {
    "not complain for valid record" in {
      val manager = Manager(0, "Hello", "new@example.net", "p", false)
      val violations = new ManagerValidator(manager).violations
      violations mustBe empty
    }
    "contain violations for full name length and email format" in {
      val manager = Manager(0, "Some name that does not pass length constraint: Albus Dambledore", "name,@mail.ru", "p", false)
      val violations = new ManagerValidator(manager).violations
      violations must have size 2
      violations.get("fullName") mustBe defined
      violations.get("fullName").get.key must include("length")
      violations.get("email") mustBe defined
      violations.get("email").get.key must include("email")
    }
    "contain violations for non unique email" in {
      val violations = new ManagerValidator(managerOne).violations
      violations must have size 1
      violations.get("email") mustBe defined
      violations.get("email").get.key must include("unique")
    }
  }

}
