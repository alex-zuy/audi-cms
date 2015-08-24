package controllers

import models.ManagerRoles.{Administrator, TypicalManager}
import models.{Manager, ManagerDAO}
import org.mindrot.jbcrypt.BCrypt
import play.api._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import play.mvc.BodyParser._
import play.api.libs.json._
import play.api.libs.json.Json
import internal.{Authenticate, DefaultDbConfiguration}

import internal.validation.{Required, Validator}
import internal.validation.Validators._
import internal.PostgresDriverExtended.api._

import scala.concurrent.Future

class Managers extends Controller with DefaultDbConfiguration {

  def list = Authenticate(Administrator).async { implicit request =>
    dbConfig.db.run(ManagerDAO.all.map(m => (m.id, m.fullName, m.email, m.isAdmin)).result).map { tuples =>
      val managers = tuples.map {
        (ManagerList.apply _).tupled
      }
      Ok(Json.toJson(managers))
    }
  }

  def show(id: Int) = Authenticate(TypicalManager).async { implicit request =>
    if(request.manager.isAdmin || request.manager.id == id) {
      runQuery(ManagerDAO.byId(id).map(m => (m.id, m.fullName, m.email, m.isAdmin)).result.head).map { tuple =>
        Ok(Json.toJson((ManagerList.apply _).tupled(tuple)))
      }
    }
    else Future.successful(Unauthorized)
  }

  def store = Authenticate(Administrator).async(parse.json) { implicit request =>
    request.body.validate[ManagerStore].map { m =>
      val manager = Manager(0, m.fullName, m.email, hashPassword(m.password), false)
      dbConfig.db.run(ManagerDAO.insert(manager)).map { id =>
        Ok(Json.obj("id" -> id))
      } fallbackTo Future.successful(Conflict)
    } getOrElse Future.successful(BadRequest)
  }

  def validateStore = Authenticate(Administrator)(parse.json[ManagerStore]) { implicit request =>
    Ok(Json.toJson(storeValidator(request.body).violations))
  }

  def update(id: Int) = Authenticate(Administrator).async(parse.json) { implicit request =>
    request.body.validate[ManagerUpdate].map { updated =>
      val query = ManagerDAO.byId(id).map(m => (m.fullName, m.email)).update((updated.fullName, updated.email))
      dbConfig.db.run(query).map { result => Ok } fallbackTo Future.successful(Conflict)
    } getOrElse Future.successful(BadRequest)
  }

  def delete(id: Int) = Authenticate(Administrator).async { implicit request =>
    dbConfig.db.run(ManagerDAO.byId(id).filter(_.isAdmin === false).delete).map { affectedRows =>
      if (affectedRows == 0) Conflict
      else Ok
    }
  }

  def grantAdmin(id: Int) = Authenticate(Administrator).async { implicit request =>
    dbConfig.db.run(ManagerDAO.updateAdminStatus(id, true)).map { affectedRows =>
      if (affectedRows == 0) Conflict
      else Ok
    }
  }

  def revokeAdmin(id: Int) = Authenticate(Administrator).async { implicit request =>
    dbConfig.db.run(ManagerDAO.doesExistsAdminExcept(id)).filter {
      identity
    }.flatMap { _ =>
      dbConfig.db.run(ManagerDAO.updateAdminStatus(id, false)).map { _ => Ok }
    } fallbackTo Future.successful(Conflict)
  }

  def changePassword(id: Int) = Authenticate(TypicalManager).async(parse.json) { implicit request =>
    if (typicalManagerChangesAnothersPassword(request.manager, id)) Future.successful(Unauthorized)
    else {
      request.body.validate[PasswordUpdate].asOpt.map { passwordUpdate =>
        val passwordHash = hashPassword(passwordUpdate.password)
        dbConfig.db.run(ManagerDAO.byId(id).map(m => m.passwordHash).update(passwordHash)).map { _ =>
          Ok
        } fallbackTo Future.successful(InternalServerError)
      } getOrElse Future.successful(BadRequest)
    }
  }

  private def typicalManagerChangesAnothersPassword(manager: Manager, targetId: Int) =
    manager.isAdmin == false && manager.id != targetId

  private def hashPassword(password: String) = BCrypt.hashpw(password, BCrypt.gensalt())

  case class ManagerList(id: Int, fullName: String, email: String, isAdmin: Boolean)

  case class ManagerStore(fullName: String, email: String, password: String)

  case class ManagerUpdate(fullName: String, email: String)

  case class PasswordUpdate(password: String)

  implicit val writesManagerList = Json.writes[ManagerList]

  implicit val readsManagerStore = Json.reads[ManagerStore]

  implicit val readsManagerUpdate = Json.reads[ManagerUpdate]

  implicit val readsPasswordUpdate = Json.reads[PasswordUpdate]

  def storeValidator(mgr: ManagerStore) = new Validator {
    def rules = Seq(
      "fullName" -> Required(mgr.fullName)( Length(50) ),
      "email" -> Required(mgr.email)( Length(50), Email ),
      "password" -> Required(mgr.password)( Length(50) )
    )
  }
}
