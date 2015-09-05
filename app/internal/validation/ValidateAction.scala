package internal.validation

import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.mvc.BodyParsers._
import internal.Authenticate
import models.ManagerRoles.Role

object ValidateAction extends Results {

  def apply[A](authority: Role, validate: (A) => Validator)(implicit reads: Reads[A]) = Authenticate(authority)(parse.json[A]) { implicit request =>
    Ok(Json.toJson(validate(request.body).violations))
  }

}
