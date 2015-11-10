package models

import internal.PostgresDriverExtended.api._

case class TestDrive(
                      id: Option[Int],
                      preferedContactAddressId: Option[Int],
                      modelEditionId: Int,
                      clientFullName: String,
                      clientEmail: String,
                      clientNumber: String)

object TestDriveDAO {

  val allTestDrives = TableQuery[TestDriveTable]

  def insertTestDrive(td: TestDrive) = (allTestDrives returning allTestDrives.map(_.id)) += td

  def deleteTestDrive(id: Int) = allTestDrives.filter(_.id === id).delete

  class TestDriveTable(tag: Tag) extends Table[TestDrive](tag, "test_drive_arrangements") with IntegerIdPk {
    def preferedContactAddressId = column[Option[Int]]("prefered_contact_address_id")

    def modelEditionId = column[Int]("model_edition_id")

    def clientFullName = column[String]("client_full_name")

    def clientEmail = column[String]("client_email")

    def clientNumber = column[String]("client_number")

    def * = (id.?, preferedContactAddressId, modelEditionId, clientFullName, clientEmail, clientNumber) <>
      (TestDrive.tupled, TestDrive.unapply)
  }
}
