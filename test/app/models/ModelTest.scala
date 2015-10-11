package app.models

import internal.PostgresDriverExtended.api._

import models.Model.ModelDAO
import models.{ModelDAO, ModelRange}
import utility.FakeAppPerSuite
import utility.CrudTestHelper._

class ModelTest extends FakeAppPerSuite {

  val modelRange = ModelRange(None, "test range", Some("test description"))

  //def model(rangeId: Int) = Model(None, rangeId, )

  "Model mappings must be correct for" in {
    "ModelRange model" {

      runQuery(ModelDAO.allModelRanges += modelRange)
    }
    "Model model" {
      fail("unimplemented")
    }
  }

}
