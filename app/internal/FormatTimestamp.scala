package internal

import java.sql.Timestamp

import play.api.libs.json._

object FormatTimestamp extends Format[Timestamp] {
  def reads(json: JsValue): JsResult[Timestamp] = {
    json match {
      case JsString(str) => JsSuccess(Timestamp.valueOf(str))
      case _ => JsError()
    }
  }

  def writes(o: Timestamp): JsValue = JsString(o.toString)
}
