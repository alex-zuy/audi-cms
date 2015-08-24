package internal.validation

object ValidatorBuilder {

  def build[V](violationKey: String, messageParameters: (String, Any)*)(predicate: V => Boolean) = new Rule[V] {
    def validate(value: V) = {
      if (predicate(value)) None
      else {
        val mt = MessageTemplate(violationKey)
        messageParameters.foreach(p => mt.putParameter(p._1 -> p._2.toString))
        Some(mt)
      }
    }
  }
}
