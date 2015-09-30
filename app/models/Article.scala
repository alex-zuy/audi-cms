package models

import java.sql.Timestamp

import internal.PostgresDriverExtended.api._

import play.api.libs.json.JsValue

case class Article(
                    id: Option[Int],
                    photoSetId: Option[Int],
                    title: JsValue,
                    text: JsValue,
                    category: String,
                    createdAt: Timestamp)

object ArticlesDAO {

  class ArticlesTable(tag: Tag) extends Table[Article](tag, "articles") with IntegerIdPk {
    def photoSetId = column[Option[Int]]("photo_set_id")

    def title = column[JsValue]("title")

    def text = column[JsValue]("text")

    def category = column[String]("category")

    def createdAt = column[Timestamp]("created_at")

    def * = (id.?, photoSetId, title, text, category, createdAt) <> (Article.tupled, Article.unapply)
  }

  val allArticles = TableQuery[ArticlesTable]

  def byId(id: Int) = allArticles.filter(_.id === id)

  def headersProjection(tq: TableQuery[ArticlesTable]) = tq.map(a => (a.title, a.category, a.createdAt))
}
