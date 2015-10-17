package internal

import play.api.libs.json._

class FormatEnumeration[A <: Enumeration](enum: A) extends Format[A#Value] {

  def writes(o: A#Value): JsValue = JsString(o.toString)

  def reads(json: JsValue): JsResult[A#Value] = json match {
    case string:JsString => JsSuccess(enum.withName(string.value))
    case _ => JsError("value must be srting")
  }
}