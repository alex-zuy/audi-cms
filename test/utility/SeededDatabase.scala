package utility

import seeders.ManagersSeeder
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile

trait SeededDatabase extends CleanDatabase {

  def withSeededDatabase(test: => Unit)(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    withCleanDatabase{
      seed
      test
    }
  }

  private def seed(implicit dbConfig: DatabaseConfig[JdbcProfile]) = {
    val f = ManagersSeeder.seed

    wait(f)
  }
}
