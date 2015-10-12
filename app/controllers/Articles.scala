package controllers

import java.sql.Timestamp

import internal.validation.{ValidateAction, Required, Validator}
import internal.validation.Validators._
import internal.{RequestBodyValidation, FormatTimestamp, Authenticate, DefaultDbConfiguration}
import internal.PostgresDriverExtended.api._
import models.ArticlesDAO._
import models.ManagerRoles.TypicalManager
import models.{ArticlesDAO, Article}

import play.api._
import play.api.libs.json._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

class Articles extends Controller with DefaultDbConfiguration with RequestBodyValidation {

  import Articles._
  import Json.toJson

  implicit val formatsTimestamp = FormatTimestamp

  implicit val writesStoreResponse = Json.writes[StoreResponse]

  implicit val formatsArticles = Json.format[Article]

  implicit val readsArticleHeaders = Json.reads[ArticleHeaders]

  implicit val readsArticleTextUpdate = Json.reads[ArticleTextUpdate]

  def list = Action.async { implicit request =>
    runQuery(allArticles.result).map(articles => Ok(Json.toJson(articles)))
  }

  def storeHeaders = Authenticate(TypicalManager).async(parse.json[ArticleHeaders].validateWith(
    new ArticleHeadersValidator(_))) { implicit request =>
    runQuery(headersProjection(allArticles) returning allArticles.map(_.id)
      += ArticleHeaders.unapply(request.body).get).map(id => Ok(toJson(StoreResponse(id))))
  }

  def validateHeaders = ValidateAction[ArticleHeaders](TypicalManager, new ArticleHeadersValidator(_))

  def show(id: Int) = Action.async { implicit request =>
    runQuery(byId(id).result.head).map(article => Ok(Json.toJson(article)))
  }

  def updateHeaders(id: Int) = Authenticate(TypicalManager).async(parse.json[ArticleHeaders].validateWith(
    new ArticleHeadersValidator(_))) { implicit request =>
    runQuery(byId(id).map(a => (a.photoSetId, a.title, a.category, a.createdAt))
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

  class ArticleHeadersValidator(news: ArticleHeaders) extends Validator {
    def rules = Seq(
      "photoSetId" -> Required(news.photoSetId)(),
      "title" -> Required(news.title)(
        I18nTexts
      ),
      "category" -> Required(news.category)(
        Length(50)
      ),
      "createdAt" -> Required(news.createdAt)()
    )
  }

}
