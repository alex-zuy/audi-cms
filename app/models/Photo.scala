package models

import java.sql.Blob

import internal.PostgresDriverExtended.api._

import play.api.libs.json.JsValue

case class Photo(id: Option[Int], photoSetId: Int, name: JsValue, mimeType: String, image: Option[Array[Byte]])

case class PhotoSet(id: Option[Int], dummy: Option[String])

object PhotoDAO {

  class PhotosTable(tag: Tag) extends Table[Photo](tag, "photos") with IntegerIdPk {
    def photoSetId = column[Int]("photo_set_id")

    def name = column[JsValue]("name")

    def mimeType = column[String]("mime_type")

    def image = column[Option[Array[Byte]]]("image")

    def * = (id.?, photoSetId, name, mimeType, image) <> (Photo.tupled, Photo.unapply)
  }

  class PhotoSetsTable(tag: Tag) extends Table[PhotoSet](tag, "photo_sets") with IntegerIdPk {

    def dummy= column[Option[String]]("dummy")

    def * = (id.?, dummy) <> (PhotoSet.tupled, PhotoSet.unapply)
  }

  val allPhotos = TableQuery[PhotosTable]

  val allPhotoSets = TableQuery[PhotoSetsTable]

  def createPhotoSet = (allPhotoSets returning allPhotoSets.map(_.id)) += PhotoSet(None, None)

  def photoMetaProjection = allPhotos.map(p => (p.photoSetId, p.name, p.mimeType))

  def photoMeta(id: Int) = allPhotos.filter(_.id === id).map(p => (p.photoSetId, p.name, p.mimeType))

  def byId(id: Int) = allPhotos.filter(_.id === id)

  def photoSetPhotos(photoSetId: Int) =
    allPhotos.filter(_.photoSetId === photoSetId).map(p => (p.id, p.photoSetId, p.name, p.mimeType))

}
