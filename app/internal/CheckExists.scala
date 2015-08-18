package internal

import models.IntegerIdPk
import internal.PostgresDriverExtended.api._

import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile
import slick.lifted.{AbstractTable, TableQuery}

import scala.concurrent.Future

object CheckExists extends Results {
  def apply[R[_], E <: AbstractTable[_] with IntegerIdPk](id: Int, table: TableQuery[E])(
    implicit dbConfig: DatabaseConfig[JdbcProfile]) = new ActionFilter[R] {
    override protected def filter[A](request: R[A]): Future[Option[Result]] = {
      dbConfig.db.run(table.filter(_.id === id).exists.result).map { exists =>
        if(exists) None
        else Some(NotFound)
      }
    }
  }
}
