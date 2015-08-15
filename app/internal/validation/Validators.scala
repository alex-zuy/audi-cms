package internal.validation

import ValidatorBuilder.build

import java.util.regex.Pattern

import slick.backend.DatabaseConfig
import slick.dbio.{NoStream, DBIOAction}
import slick.driver.JdbcProfile

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.concurrent.Await.result

object Validators {

  def Length(max: Int) = build[String]("key.violation.string.length") {
    _.length <= max }

  def NoWhitespace = build[String]("key.violation.string.whitespace") {
    ! _.exists(_.isWhitespace) }

  def LowCase = build[String]("key.violation.string.uppercase") {
    ! _.exists(_.isUpper) }

  def Email = build[String]("key.violation.string.email") {
    emailPattern.matcher(_).matches }

  def PhoneNumber = build[String]("key.violation.string.phonenumber") {
    phoneNumberPattern.matcher(_).matches }

  def NonNegative[T](implicit n :Numeric[T]) = build[T]("key.violation.numeric.negative") {
    n.gteq(_, n.zero) }

  def Min[T](min: T)(implicit n: Numeric[T]) = build[T]("key.violation.numeric.min") {
    n.gteq(_, min) }

  def Max[T](max: T)(implicit n: Numeric[T]) = build[T]("key.violation.numeric.max") {
    n.lteq(_, max) }

  def InRange[T](min: T, max: T)(implicit n: Numeric[T]) = build[T]("key.violation.numeric.range") {
    v => n.gteq(v, min) && n.lteq(v, max) }

  /**
   * @param existsConflictRow a query that returns true if there is some record that will conflict with
   *                          record under validation
   */
  def Unique[V](existsConflictRow: DBIOAction[Boolean, NoStream, Nothing])(implicit dbConfig: DatabaseConfig[JdbcProfile]) =
    build[V]("key.violation.value.nonunique") { _ => result(dbConfig.db.run(existsConflictRow), 10 seconds) == false }

  val emailPattern = Pattern.compile("""^\p{Alpha}[a-zA-Z_.0-9]*@\p{Alpha}+\.\p{Alpha}+$""")

  val phoneNumberPattern = Pattern.compile("""^\+?\d{9,12}$""")

}
