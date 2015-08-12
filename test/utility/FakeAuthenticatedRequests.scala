package utility

import play.api.test._
import models.Manager
import seeders.ManagersSeeder.{managerOne, admin}
import internal.Authenticate.sessionKeyName

trait FakeAuthenticatedRequests {

  def managerRequest(manager: Manager = managerOne) = FakeRequest().withLoggedIn(manager)

  def adminRequest(managerAdmin: Manager = admin) = {
    require(managerAdmin.isAdmin)
    FakeRequest().withLoggedIn(managerAdmin)
  }

  implicit class AuthenticatedRequest[A](request: FakeRequest[A]) {
    def withLoggedIn(manager: Manager): FakeRequest[A] = {
      request.withSession((sessionKeyName -> manager.email))
    }
  }

}
