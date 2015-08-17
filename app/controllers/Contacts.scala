package controllers

import internal.DefaultDbConfiguration

import play.api._
import play.api.mvc._

class Contacts extends Controller with DefaultDbConfiguration {

  def list = TODO

  def store = TODO

  def show(id: Int) = TODO

  def update(id: Int) = TODO

  def delete(id: Int) = TODO

  def storeAddress(id: Int) = TODO

  def updateAddress(addressId: Int) = TODO

  def deleteAddress(addressId: Int) = TODO

  def storeNumber(id: Int) = TODO

  def updateNumber(numberId: Int) = TODO

  def deleteNumber(numberId: Int) = TODO

  def storeEmail(id: Int) = TODO

  def updateEmail(emailId: Int) = TODO

  def deleteEmail(emailId: Int) = TODO

}
