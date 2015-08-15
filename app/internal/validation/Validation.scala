package internal.validation

trait Validator {

  def rules: Seq[(String, RuleSet[_])]

  lazy val violations = validate

  protected def validate: Map[String, MessageTemplate] = {
    rules.map { kv =>
      val (field, ruleSet) = kv
      ruleSet.validate.map( field -> _.putParameter("field" -> field))
    }.filter(_.isDefined).map(_.get).toMap[String, MessageTemplate]
  }
}

abstract class RuleSet[V](rules: Rule[V]*) {

  def validate: Option[MessageTemplate]

  protected def performValidation(value: V): Option[MessageTemplate] = {
    rules.toStream.map(_.validate(value)).find(_.isDefined).getOrElse(None)
  }
}

trait Rule[V] {
  def validate(value: V): Option[MessageTemplate]
}

object Required {

  def apply[V](value: V)(rules: Rule[V]*) = new Required(value, rules: _*)

  class Required[V](value: V, rules: Rule[V]*) extends RuleSet[V](rules: _*) {
    def validate = {
      if (value == null) Some(MessageTemplate("key.violation.required"))
      else performValidation(value)
    }
  }

}

object Optional {

  def apply[V](value: Option[V])(rules: Rule[V]*) = new Optional(value, rules: _*)

  final class Optional[V](value: Option[V], rules: Rule[V]*) extends RuleSet[V](rules: _*) {

    def validate = {
      if (value.isDefined) super.performValidation(value.get)
      else None
    }
  }

}
