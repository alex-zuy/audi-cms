package utility

import internal.DatabaseConfiguration
import play.api.Application
import play.api.db.slick.DatabaseConfigProvider
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile


trait TestDbConfiguration extends DatabaseConfiguration {

  val application: Application

  implicit lazy val dbConfig = DatabaseConfigProvider.get[JdbcProfile](application)
}
