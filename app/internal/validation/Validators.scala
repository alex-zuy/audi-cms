package internal.validation

import ValidatorBuilder.build
import controllers.Application

import java.util.regex.Pattern

import play.api.libs.json.{JsString, JsArray, JsObject, JsValue}

import slick.backend.DatabaseConfig
import slick.dbio.{NoStream, DBIOAction}
import slick.driver.JdbcProfile

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.concurrent.Await.result
import scala.collection.JavaConversions._

object Validators {

  def Length(max: Int) = build[String]("validators.errors.string.length", "maxLength" -> max) { (s, mt) =>
    s.length <= max }

  def NoWhitespace = build[String]("validators.errors.string.whitespace") { (s, mt) =>
    ! s.exists(_.isWhitespace) }

  def LowCase = build[String]("validators.errors.string.uppercase") { (s, mt) =>
    ! s.exists(_.isUpper) }

  def Email = build[String]("validators.errors.string.email") { (s, mt) =>
    emailPattern.matcher(s).matches }

  def PhoneNumber = build[String]("validators.errors.string.phoneNumber") { (s, mt) =>
    phoneNumberPattern.matcher(s).matches }

  def NonNegative[T](implicit n :Numeric[T]) = build[T]("validators.errors.numeric.negative") { (v, mt) =>
    n.gteq(v, n.zero) }

  def Min[T](min: T)(implicit n: Numeric[T]) = build[T]("validators.errors.numeric.min", "minValue" -> min) { (v, mt) =>
    n.gteq(v, min) }

  def Max[T](max: T)(implicit n: Numeric[T]) = build[T]("validators.errors.numeric.max", "maxValue" -> max) { (v, mt) =>
    n.lteq(v, max) }

  def InRange[T](min: T, max: T)(implicit n: Numeric[T]) = build[T]("validators.errors.numeric.range", "minValue" -> min, "maxValue" -> max) {
    (v, mt) => n.gteq(v, min) && n.lteq(v, max) }

  def I18nTexts = build[JsValue]("validators.errors.jsonObject.keys") { (json, mt) =>
    json match {
      case jsObj:JsObject => {
        val requiredLanguages = Seq(Application.defaultLanguage)
        val absentKeys = requiredLanguages.filter(!jsObj.keys.contains(_))
        mt.putParameter("absentKeys" -> JsArray(absentKeys.map(JsString.apply)).toString())
        absentKeys.isEmpty
      }
      case _ => false
    }
  }

  /**
   * @param existsConflictRow a query that returns true if there is some record that will conflict with
   *                          record under validation
   */
  def Unique[V](existsConflictRow: DBIOAction[Boolean, NoStream, Nothing])(implicit dbConfig: DatabaseConfig[JdbcProfile]) =
    build[V]("validators.errors.value.nonunique") { (_,_) => result(dbConfig.db.run(existsConflictRow), 10 seconds) == false }

  val emailPattern = Pattern.compile("""^\p{Alpha}[a-zA-Z_.0-9]*@\p{Alpha}+\.\p{Alpha}+$""")

  val phoneNumberPattern = Pattern.compile("""^\+?\d{9,12}$""")

}
