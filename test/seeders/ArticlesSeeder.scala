package seeders

import java.sql.{Time, Timestamp}
import java.time.Instant

import models.{Article, ArticlesDAO}
import internal.PostgresDriverExtended.api._

import play.api.libs.json.Json
import play.api.test.{FutureAwaits, DefaultAwaitTimeout}
import play.api.libs.concurrent.Execution.Implicits._

import slick.backend.DatabaseConfig

import scala.collection.mutable.HashMap
import scala.concurrent.Future
import slick.driver.JdbcProfile

object ArticlesSeeder extends DatabaseSeeder with FutureAwaits with DefaultAwaitTimeout {

  import ArticlesDAO._
  import PhotosSeeder._

  def articleOne = Article(None, photoSetOne, Json.obj("en" -> "article one"), Json.obj("en" -> "article one text"), "news", now)

  def articleTwo = Article(None, photoSetTwo, Json.obj("en" -> "article two"), Json.obj("en" -> "article two text"), "news", now)

  def articleThree = Article(None, photoSetThree, Json.obj("en" -> "article three"), Json.obj("en" -> "article three text"), "offers", now)

  def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    for {
      idOne <- dbConfig.db.run(insert(articleOne))
      idTwo <- dbConfig.db.run(insert(articleTwo))
      idThree <- dbConfig.db.run(insert(articleThree))
    } yield {
      numToId ++= Seq(1 -> idOne, 2 -> idTwo, 3 -> idThree)
    }
  }

  def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    dbConfig.db.run(allArticles.delete).map(_ => numToId.clear())
  }

  def insert(article: Article) =
    (allArticles returning allArticles.map(_.id)) += article

  def idOf(articleNum: Int) = numToId.get(articleNum).get

  private val numToId = HashMap[Int, Int]()

  def now = Timestamp.from(Instant.now())
}
