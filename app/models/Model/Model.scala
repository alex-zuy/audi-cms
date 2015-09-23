package models.Model

import internal.PostgresDriverExtended.api._
import models.IntegerIdPk

case class ModelRange(id: Option[Int], name: String, description: Option[String])

case class Model(
                  id: Option[Int],
                  modelRangeId: Int,
                  photoSetId: Int,
                  name: String,
                  passengerCapacity: Int,
                  width: Float,
                  height: Float,
                  length: Float,
                  groundClearance: Float,
                  luggageSpace: Int)

case class ModelEdition(
                         id: Option[Int],
                         modelId: Int,
                         name: String,
                         engineType: EngineTypes.EngineType,
                         engineVolume: Float,
                         engineCylinderCount: Int,
                         enginePower: Int,
                         fuelTank: Int,
                         fuelConsumption: Float,
                         acceleration: Float,
                         maxSpeed: Int,
                         gearboxType: GearboxTypes.GearboxType,
                         gearboxLevels: Int,
                         transmissionType: TransmissionTypes.TransmissionType)

object EngineTypes extends Enumeration {
  type EngineType = Value
  val diesel, benzine = Value
}

object GearboxTypes extends Enumeration {
  type GearboxType = Value
  val automatic, manual = Value
}

object TransmissionTypes extends Enumeration {
  type TransmissionType = Value
  val front, rear, all, adjustable = Value
}

object ModelDAO {

  val allModels = TableQuery[ModelsTable]

  val allModelRanges = TableQuery[ModelRangesTable]

  val allModelEditions = TableQuery[ModelEditionsTable]

  def insertModelRange(mr: ModelRange) = (allModelRanges returning allModelRanges.map(_.id)) += mr

  def insertModel(m: Model) = (allModels returning allModels.map(_.id)) += m

  def insertModelEdition(me: ModelEdition) = (allModelEditions returning allModelEditions.map(_.id)) += me

  class ModelRangesTable(tag: Tag) extends Table[ModelRange](tag, "model_ranges") with IntegerIdPk {
    def name = column[String]("name")

    def description = column[Option[String]]("description")

    def * = (id.?, name, description) <>(ModelRange.tupled, ModelRange.unapply)
  }

  class ModelsTable(tag: Tag) extends Table[Model](tag, "models") with IntegerIdPk {
    def modelRangeId = column[Int]("model_range_id")

    def photoSetId = column[Int]("photo_set_id")

    def name = column[String]("name")

    def passengerCapacity = column[Int]("passenger_capacity")

    def width = column[Float]("width")

    def height = column[Float]("height")

    def length = column[Float]("length")

    def groundClearance = column[Float]("ground_clearance")

    def luggageSpace = column[Int]("luggage_space")

    def * = (id.?, modelRangeId, photoSetId, name, passengerCapacity, width, height, length, groundClearance, luggageSpace) <>
      (Model.tupled, Model.unapply)
  }

  class ModelEditionsTable(tag: Tag) extends Table[ModelEdition](tag, "model_editions") with IntegerIdPk {
    def modelId = column[Int]("model_id")

    def name = column[String]("name")

    def engineType = column[EngineTypes.EngineType]("engine_type")

    def engineVolume = column[Float]("engine_volume")

    def engineCylinderCount = column[Int]("engine_cylinder_count")

    def enginePower = column[Int]("engine_power")

    def fuelTank = column[Int]("fuel_tank")

    def fuelConsumption = column[Float]("fuel_consumption")

    def acceleration = column[Float]("acceleration")

    def maxSpeed = column[Int]("max_speed")

    def gearboxType = column[GearboxTypes.GearboxType]("gearbox_type")

    def gearboxLevels = column[Int]("gearbox_levels")

    def transmissionType = column[TransmissionTypes.TransmissionType]("transmission_type")

    def * = (id.?, modelId, name, engineType, engineVolume, engineCylinderCount, enginePower, fuelTank, fuelConsumption, acceleration, maxSpeed, gearboxType, gearboxLevels, transmissionType) <>
      (ModelEdition.tupled, ModelEdition.unapply)
  }

}