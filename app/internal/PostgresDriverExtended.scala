package internal

import com.github.tminglei.slickpg._

import play.api.libs.json.{Json, JsValue}

trait PostgresDriverExtended extends ExPostgresDriver
with PgDateSupport
with PgPlayJsonSupport
with PgEnumSupport
with array.PgArrayJdbcTypes {
  def pgjson = "json"

  override val api = ApiExtended

  object ApiExtended extends API with DateTimeImplicits with JsonImplicits with EnumImplicits {
    implicit val strListTypeMapper = new SimpleArrayJdbcType[String]("text").to(_.toList)
    implicit val json4sJsonArrayTypeMapper =
      new AdvancedArrayJdbcType[JsValue](pgjson,
        (s) => utils.SimpleArrayUtils.fromString[JsValue](Json.parse(_))(s).orNull,
        (v) => utils.SimpleArrayUtils.mkString[JsValue](_.toString())(v)
      ).to(_.toList)
  }

  trait EnumImplicits {

  }

}

object PostgresDriverExtended extends PostgresDriverExtended
