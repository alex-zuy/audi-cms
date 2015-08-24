package app.internal.validation

import internal.validation.MessageTemplate

import play.api.libs.json._

import org.scalatest.FlatSpec
import org.scalatest.MustMatchers._

class MessageTemplateTest extends FlatSpec {

  "MessageTemplate json writes" must "correctly serialize message template" in {
    val mt = new MessageTemplate("key.msg").putParameter("value" -> "12").putParameter("position" -> "unknown")
    val expectedJson = Json.parse(
      """
        |{
        |   "key":"key.msg",
        |   "args": {
        |       "value":"12",
        |       "position":"unknown"
        |   }
        |}
      """.stripMargin)

    Json.toJson(mt) mustBe expectedJson
  }
}
