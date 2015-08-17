package models

import internal.PostgresDriverExtended.api._

import slick.lifted.Rep

/**
 *  A common trait for tables that has integer primary key named id. This trait is
 * mainly intended for implementing components that need to lookup records by id,
 * but dont need to know exact data schema. For example, request filter that checks
 * existence of requested record.
 *
 */
trait IntegerIdPk {
  this: Table[_] =>
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
}
