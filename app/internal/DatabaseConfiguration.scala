package internal

import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

trait DatabaseConfiguration {

  implicit val dbConfig: DatabaseConfig[JdbcProfile]
}
