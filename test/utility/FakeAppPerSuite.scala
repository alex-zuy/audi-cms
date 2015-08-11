package utility

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.db.slick.DatabaseConfigProvider
import play.api.test.FakeApplication
import slick.driver.JdbcProfile

/**
 * Convinience trait for tests that need fake application
 * and clean or seeded database for tests.
 */
trait FakeAppPerSuite extends PlaySpec with OneAppPerSuite with BeforeAndAfter {

  implicit override lazy val app: FakeApplication = FakeApplication(
    additionalConfiguration = Map("slick.dbs.default.db.properties.databaseName" -> "audi-cms-test")
  )

  implicit val dbConfig = DatabaseConfigProvider.get[JdbcProfile]

}
