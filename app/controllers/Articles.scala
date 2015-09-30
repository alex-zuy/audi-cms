package controllers

import java.sql.Timestamp

import internal.validation.{ValidateAction, Required, Validator}
import internal.validation.Validators._
import internal.{FormatTimestamp, Authenticate, DefaultDbConfiguration}
import internal.PostgresDriverExtended.api._
import models.ManagerRoles.TypicalManager
import models.{ArticlesDAO, Article}

import play.api._
import play.api.libs.json._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

class Articles extends Controller with DefaultDbConfiguration {

  import Articles._
  import ArticlesDAO._
  import Json.toJson

  implicit val formatsTimestamp = FormatTimestamp

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val formatsArticles = Json.format[Article]

  implicit val readsArticleHeaders = Json.reads[ArticleHeaders]

  implicit val readsArticleTextUpdate = Json.reads[ArticleTextUpdate]

  def adapter[A](f: (A)=>Validator) = { v: A =>
    if(f(v).violations.isEmpty) Right(v)
    else Left(Conflict)
  }

  def list = Action.async { implicit request =>
    runQuery(allArticles.result).map(articles => Ok(Json.toJson(articles)))
  }

  def storeHeaders = Authenticate(TypicalManager).async(parse.json[ArticleHeaders].validate(
    adapter(new ArticleHeadersValidator(_)))) { implicit request =>
    runQuery(headersProjection(allArticles) returning allArticles.map(_.id)
      += ArticleHeaders.unapply(request.body).get).map(id => Ok(toJson(StoreResponse(id))))
  }

  def validateHeaders = ValidateAction[ArticleHeaders](TypicalManager, new ArticleHeadersValidator(_))

  def show(id: Int) = Action.async { implicit request =>
    runQuery(byId(id).result.head).map(article => Ok(Json.toJson(article)))
  }

  def updateHeaders(id: Int) = Authenticate(TypicalManager).async(parse.json[ArticleHeaders].validate(
    adapter(new ArticleHeadersValidator(_)))) { implicit request =>
    runQuery(byId(id).map(a => (a.title, a.category, a.createdAt))
      .update(ArticleHeaders.unapply(request.body).get)).map(_ => Ok)
  }

  def updateText(id: Int) = Authenticate(TypicalManager).async(parse.json[ArticleTextUpdate]) { implicit request =>
    val langText = Json.obj(request.body.lang -> JsString(request.body.text))
    runQuery(byId(id).map(_.text).result.head).flatMap { text =>
      runQuery(byId(id).map(_.text).update(text match {
        case obj:JsObject => obj ++ langText
        case _ => langText
      }))
    } map(_ => Ok)
  }

  def delete(id: Int) = Authenticate(TypicalManager).async { implicit request =>
    runQuery(byId(id).delete).map(_ => Ok)
  }

}

object Articles {

  case class StoreResponse(id: Int)

  case class ArticleHeaders(title: JsValue, category: String, createdAt: Timestamp)

  case class ArticleTextUpdate(lang: String, text: String)

  class ArticleHeadersValidator(news: ArticleHeaders) extends Validator {
    def rules = Seq(
      "title" -> Required(news.title)(
        JsonObject(Seq(Application.defaultLanguage))
      ),
      "category" -> Required(news.category)(
        Length(50)
      ),
      "createdAt" -> Required(news.createdAt)()
    )
  }

}
