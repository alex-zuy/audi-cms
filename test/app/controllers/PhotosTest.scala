package app.controllers

import controllers.Photos
import models.PhotoDAO.PhotoSetsTable
import models.{PhotoDAO, PhotoSet}
import org.scalatest.BeforeAndAfterAll
import seeders.PhotosSeeder
import utility.{CrudTestHelper, FakeAuthenticatedRequests, FakeAppPerSuite}
import internal.PostgresDriverExtended.api._

import play.api.libs.json._
import play.api.test.Helpers._

class PhotosTest extends FakeAppPerSuite with FakeAuthenticatedRequests with BeforeAndAfterAll {

  import CrudTestHelper._
  import PhotoDAO._

  before {
    await(PhotosSeeder.clean)
    await(PhotosSeeder.seed)
  }

  def controller = new Photos()

  implicit val formatsPhotoSet = Json.format[PhotoSet]

  val photoSetTestHelper = new CrudTestHelper[PhotoSet, PhotoSetsTable](PhotoDAO.allPhotoSets)

  "Photos controller" must {
    "create empty photo set" in {
      checkRecordsCountDifference(allPhotoSets, +1) {
        val response = call(controller.storePhotoSet(), managerRequest())
        status(response) mustBe OK
      }
    }
  }

}
