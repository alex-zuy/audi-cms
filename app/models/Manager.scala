package models

import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._

import models.ManagerRoles.{TypicalManager, Administrator}
import org.mindrot.jbcrypt.BCrypt
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent.{Await, Future}
import scala.concurrent.duration._

case class Manager(id: Int, fullName: String, email: String, passwordHash: String, isAdmin: Boolean) {
  import ManagerRoles.{Role, TypicalManager, Administrator}

  def hasRole(role: Role) = role match {
    case TypicalManager => true
    case Administrator => isAdmin
  }

}

object ManagerDAO {

  class ManagersTable(tag: Tag) extends Table[Manager](tag, "managers") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def fullName = column[String]("full_name")

    def email = column[String]("email")

    def passwordHash = column[String]("password_hash")

    def isAdmin = column[Boolean]("is_admin")

    def * = (id, fullName, email, passwordHash, isAdmin) <>(Manager.tupled, Manager.unapply)
  }

  val all = TableQuery[ManagersTable]

  def byEmail(email: String)(implicit dbConfig: DatabaseConfig[JdbcProfile]): Future[Option[Manager]] =
    dbConfig.db.run(all.filter(_.email === email).take(1).result.headOption)

  def byId(id: Int) = all.filter(_.id === id)

  def insert(manager: Manager) = (all returning all.map(_.id)) += manager

  def doesExistsAdminExcept(adminId: Int) = all.filter(_.isAdmin === true).filter(_.id =!= adminId).exists.result

  def updateAdminStatus(managerId: Int, newStatus: Boolean) = byId(managerId).map(m => m.isAdmin).update(newStatus)

  def authorize(email: String, plainPassword: String)(implicit dbConfig: DatabaseConfig[JdbcProfile]): Option[Manager] = {
    Await.result(byEmail(email), 10 seconds) match {
      case Some(m:Manager) => if(BCrypt.checkpw(plainPassword, m.passwordHash)) Some(m) else None
      case _ => None
    }
  }

  implicit val readsManager = Json.reads[Manager]
}

object ManagerRoles {

  sealed trait Role

  case object TypicalManager extends Role

  case object Administrator extends Role

}
