package seeders

import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait DatabaseSeeder {

  def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]): Future[Any]

  def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]): Future[Any]

}
