package seeders

import models.{ManagerDAO, Manager}
import org.mindrot.jbcrypt.BCrypt
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import scala.collection.mutable.HashMap

object ManagersSeeder extends DatabaseSeeder {

  val admin = Manager(0, "AdminF AdminS AdminP", "admin@example.net", hashPassword("admin"), true)

  val managerOne = Manager(0, "ManagerOneF ManagerOneS ManagerOneP", "managerOne@example.net", hashPassword("managerOne"), null.asInstanceOf[Boolean])

  val managerTwo = Manager(0, "ManagerTwoF ManagerTwoS ManagerTwoP", "managerTwo@example.net", hashPassword("managerTwo"), false)

  def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    dbConfig.db.run(ManagerDAO.all ++= Seq(admin, managerOne, managerTwo))
  }

  def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    dbConfig.db.run(ManagerDAO.all.delete)
  }

  def hashPassword(password: String): String = {
    val hash = BCrypt.hashpw(password, BCrypt.gensalt())
    hashToPlainPassword += (hash -> password)
    hash
  }

  def passwordOf(mgr: Manager): String = hashToPlainPassword(mgr.passwordHash)

  private lazy val hashToPlainPassword = new HashMap[String, String]
}
