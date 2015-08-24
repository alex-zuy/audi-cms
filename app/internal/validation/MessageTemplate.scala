package internal.validation

import play.api.libs.json._

import scala.collection.{parallel, mutable}
import scala.collection.parallel.immutable

/**
 * Holds data necessary to render message text:
 * - message text key
 * - parameter values
 */
class MessageTemplate(val key: String) {

  private val parameterMap = new mutable.HashMap[String, String]

  def parameters = parameterMap.toMap

  def putParameter(parameter: (String, String)): MessageTemplate = {
    parameterMap += parameter
    this
  }

}

object MessageTemplate {
  def apply(key: String, parameters: (String, String)*) = {
    val mt = new MessageTemplate(key)
    parameters.foreach(mt.putParameter(_))
    mt
  }
  implicit val writesMessageTemplate = new Writes[MessageTemplate] {
    def writes(o: MessageTemplate): JsValue = Json.obj(
      "key" -> o.key,
      "args" -> JsObject(o.parameterMap.map(m => m._1 -> JsString(m._2)))
    )
  }
}
