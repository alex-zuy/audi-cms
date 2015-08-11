package controllers

import play.api._
import play.api.mvc._
import play.mvc.BodyParser._
import internal.{DatabaseConfiguration, DefaultDbConfiguration}

class Managers extends AuthAwareController with DefaultDbConfiguration {
  def list = TODO

  def store = TODO

  def update(id: Int) = TODO

  def delete(id: Int) = TODO

  def grantAdmin(id: Int) = TODO

  def revokeAdmin(id: Int) = TODO

  def changePassword(id: Int) = TODO
}
