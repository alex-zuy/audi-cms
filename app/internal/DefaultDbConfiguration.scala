package internal

import play.api.Play.current
import play.api.db.slick.DatabaseConfigProvider
import slick.backend.DatabaseConfig
import slick.dbio
import slick.dbio.DBIOAction
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait DefaultDbConfiguration extends DatabaseConfiguration {

  def runQuery[R, S <: dbio.NoStream, E <: dbio.Effect](query: DBIOAction[R,S,E])(implicit dbConfig: DatabaseConfig[JdbcProfile]): Future[R] =
    dbConfig.db.run(query)

  implicit lazy val dbConfig: DatabaseConfig[JdbcProfile] = DatabaseConfigProvider.get[JdbcProfile]
}
