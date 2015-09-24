package internal.validation

object ValidatorBuilder {

  def build[V](violationKey: String, messageParameters: (String, Any)*)(predicate: (V, MessageTemplate) => Boolean) = new Rule[V] {
    def validate(value: V) = {
      val mt = MessageTemplate(violationKey)
      if (predicate(value, mt)) None
      else {
        messageParameters.foreach(p => mt.putParameter(p._1 -> p._2.toString))
        Some(mt)
      }
    }
  }
}
