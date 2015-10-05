package seeders

import models.{PhotoSet, PhotoDAO}
import internal.PostgresDriverExtended.api._

import play.api.test._
import play.api.libs.concurrent.Execution.Implicits._

import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

import scala.concurrent.Future
import scala.collection.mutable.HashMap

object PhotosSeeder extends DatabaseSeeder with FutureAwaits with DefaultAwaitTimeout {

  def photoSetOne = numberToId.get(1).get

  def photoSetTwo = numberToId.get(2).get

  def photoSetThree = numberToId.get(3).get

  def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]): Future[Any] = {
    for {
      idOne <- dbConfig.db.run(PhotoDAO.createPhotoSet)
      idTwo <- dbConfig.db.run(PhotoDAO.createPhotoSet)
      idThree <- dbConfig.db.run(PhotoDAO.createPhotoSet)
    } yield {
      numberToId ++= Seq(1 -> idOne, 2 -> idTwo, 3 -> idThree)
    }
  }

  def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]): Future[Any] = {
    dbConfig.db.run(PhotoDAO.allPhotoSets.delete).map(_ => numberToId.clear())
  }

  private val numberToId = HashMap[Int, Int]()

}
