package internal

import internal.validation.Validator
import play.api._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

trait RequestBodyValidation {

  import Results._

  implicit def toValidatableBodyParser[A](bodyParser: BodyParser[A]) = new {
    def validateWith(f: (A) => Validator) = {
      bodyParser.validate { v: A =>
        if (f(v).violations.isEmpty) Right(v)
        else Left(Conflict)
      }
    }
  }

}
