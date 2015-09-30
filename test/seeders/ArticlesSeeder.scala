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

  val articleOne = Article(None, None, Json.obj("en" -> "article one"), Json.obj("en" -> "article one text"), "news", now)

  val articleTwo = Article(None, None, Json.obj("en" -> "article two"), Json.obj("en" -> "article two text"), "news", now)

  val articleThree = Article(None, None, Json.obj("en" -> "article three"), Json.obj("en" -> "article three text"), "offers", now)

  def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    insert(articleOne)
    insert(articleTwo)
    insert(articleThree)
    Future.successful()
  }

  def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    instanceToId.clear()
    dbConfig.db.run(allArticles.delete)
  }

  def insert(a: Article)(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    val id = await(dbConfig.db.run((allArticles returning allArticles.map(_.id)) += a))
    instanceToId += a ->  id
  }

  def idOf(a: Article) = instanceToId.get(a).get

  private val instanceToId = HashMap[Article, Int]()

  def now = Timestamp.from(Instant.now())
}
