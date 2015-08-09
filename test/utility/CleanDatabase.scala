package utility

import seeders.ManagersSeeder
import slick.backend.DatabaseConfig
import slick.dbio.{NoStream, DBIOAction}
import slick.driver.JdbcProfile

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

trait CleanDatabase {

  def withCleanDatabase(test: => Unit)(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    clean
    test
  }

  private def clean(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    val f = ManagersSeeder.clean

    wait(f)
  }

  protected def wait[R](future: Future[R], timeout: Duration = 30 seconds): R = {
    Await.result(future, timeout)
  }

  trait SyncRunnable {
    val dbConfig: DatabaseConfig[JdbcProfile]

    def runSynchronously[R](q: DBIOAction[R, NoStream, Nothing]): R = {
      Await.result(dbConfig.db.run(q), 30 seconds)
    }
  }

  implicit def dbToSyncRunner(dbConf: DatabaseConfig[JdbcProfile]) =
    new SyncRunnable {
      override val dbConfig = dbConf
    }

}
