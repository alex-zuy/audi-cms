package app.controllers

import controllers.Articles
import controllers.Articles.{StoreResponse, ArticleTextUpdate, ArticleHeaders}
import internal.FormatTimestamp
import models.{Article, ArticlesDAO}
import org.scalatest.BeforeAndAfterAll
import org.scalatest.MustMatchers._
import seeders.ArticlesSeeder
import utility.{CrudTestHelper, FakeAuthenticatedRequests, FakeAppPerSuite}

import play.api.libs.json._
import play.api.test.FakeRequest
import play.api.test._
import play.api.test.Helpers._

class ArticlesTest extends FakeAppPerSuite with FakeAuthenticatedRequests with BeforeAndAfterAll {

  import ArticlesSeeder.{articleOne, now, idOf}
  import CrudTestHelper._
  import ArticlesDAO._

  before {
    await(ArticlesSeeder.clean)
    await(ArticlesSeeder.seed)
  }

  def controller = new Articles

  implicit val formatsTimestamp = FormatTimestamp

  implicit val formatsArticle = Json.format[Article]

  implicit val formatsArticleHeaders = Json.format[ArticleHeaders]

  implicit val formatsArticleTextUpdate = Json.format[ArticleTextUpdate]

  implicit val formatsStoreResponse = Json.format[StoreResponse]

  lazy val testHelper = new CrudTestHelper[Article, ArticlesTable](allArticles)

  "Articles controller" must {
    "list articles" in {
      val response = invokeWithBodyCheckingStatus(controller.list, "", OK)
      val json = contentAsJson(response)
      json match {
        case JsArray(articles) => articles.length mustBe 3 // because there are 3 records seeded to DB
        case _ => fail("response body must be json array")
      }
    }
    "store article headers" in {
      val na = ArticleHeaders(Json.obj("en" -> "new article"), "category", now)
      val recordsBefore = recordsCount(allArticles)
      val response = invokeWithRecordCheckingStatus(controller.storeHeaders, na, OK)
      val recordsAfter = recordsCount(allArticles)
      recordsAfter mustBe (recordsBefore + 1)
      val newId = contentAsJson(response).validate[StoreResponse].asOpt.get.id
      val article = testHelper.byId(newId)
      article.title mustBe na.title
      article.category mustBe na.category
      article.createdAt mustBe na.createdAt
    }
    "update article headers" in {
      val articleUpdate = ArticleHeaders(Json.obj("en" -> "updated title"), "updated category", now)
      val updatableId = idOf(articleOne)
      invokeWithRecordCheckingStatus(controller.updateHeaders(updatableId), articleUpdate, OK)
      val updatedArticle = testHelper.byId(updatableId)
      updatedArticle.title mustBe articleUpdate.title
      updatedArticle.category mustBe articleUpdate.category
      updatedArticle.createdAt mustBe articleUpdate.createdAt
    }
    "update article text, replacing text for existing lang" in {
      val atu = ArticleTextUpdate("en", "new text")
      val articleId = idOf(articleOne)
      invokeWithRecordCheckingStatus(controller.updateText(articleId), atu, OK)
      val article = testHelper.byId(articleId)
      article.text match {
        case obj:JsObject => obj.value.get("en").get mustBe JsString(atu.text)
        case _ => fail("text field must be JsObject")
      }
    }
    "update article text, adding text for previously absent lang" in {
      val atu = ArticleTextUpdate("ru", "heh, its not russian")
      val articleId = idOf(articleOne)
      invokeWithRecordCheckingStatus(controller.updateText(articleId), atu, OK)
      val article = testHelper.byId(articleId)
      article.text match {
        case obj:JsObject => {
          val objMap = obj.value
          objMap.get("en") mustBe articleOne.text.asInstanceOf[JsObject].value.get("en")
          objMap.get("ru").get mustBe JsString(atu.text)
        }
        case _ => fail("text field must be JsObject")
      }
    }
    "delete article" in {
      val articleId = idOf(articleOne)
      testHelper.testValidDelete(controller.delete(articleId), articleId)
    }
  }

}
