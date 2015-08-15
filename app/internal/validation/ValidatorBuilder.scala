package internal.validation

object ValidatorBuilder {

  def build[V](violationKey: String)(predicate: V => Boolean) = new Rule[V] {
    def validate(value: V) = {
      if (predicate(value)) None
      else Some(MessageTemplate(violationKey))
    }
  }
}
