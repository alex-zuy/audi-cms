package internal

import javax.inject.Inject

import play.api.db.slick.DatabaseConfigProvider
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

trait DefaultDbConfiguration extends DatabaseConfiguration {

  @Inject()
  private var dbConfigProvider: DatabaseConfigProvider = null

  implicit lazy val dbConfig: DatabaseConfig[JdbcProfile] = dbConfigProvider.get[JdbcProfile]
}
