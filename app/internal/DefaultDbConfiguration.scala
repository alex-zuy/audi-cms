package internal

import play.api.Play.current
import play.api.db.slick.DatabaseConfigProvider
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

trait DefaultDbConfiguration extends DatabaseConfiguration {

  implicit lazy val dbConfig: DatabaseConfig[JdbcProfile] = DatabaseConfigProvider.get[JdbcProfile]
}
