package internal

import com.github.tminglei.slickpg._
import models.Model.{TransmissionTypes, GearboxTypes, EngineTypes}

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
    implicit val engineTypeMapper = createEnumJdbcType("engine_types", EngineTypes)
    implicit val engineTypeListMapper = createEnumListJdbcType("engine_types", EngineTypes)
    implicit val engineTypeColumnExtensionMethodsBuilder = createEnumColumnExtensionMethodsBuilder(EngineTypes)

    implicit val gearboxTypeMapper = createEnumJdbcType("gearbox_types", GearboxTypes)
    implicit val gearboxTypeListMapper = createEnumListJdbcType("gearbox_types", GearboxTypes)
    implicit val gearboxTypeColumnExtensionMethodsBuilder = createEnumColumnExtensionMethodsBuilder(GearboxTypes)

    implicit val transmissionTypeMapper = createEnumJdbcType("transmission_types", TransmissionTypes)
    implicit val transmissionTypeListMapper = createEnumListJdbcType("transmission_types", TransmissionTypes)
    implicit val transmissionTypeColumnExtensionMethodsBuilder = createEnumColumnExtensionMethodsBuilder(TransmissionTypes)
  }

}

object PostgresDriverExtended extends PostgresDriverExtended
