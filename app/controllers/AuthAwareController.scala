package controllers

import internal.DatabaseConfiguration
import jp.t2v.lab.play2.auth.AuthElement
import play.api.mvc.Controller

/**
 * Common base class for all auth aware controllers.
 */
abstract class AuthAwareController extends Controller
with AuthConfig
with AuthElement
with DatabaseConfiguration
