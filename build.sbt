name := """audi-cms"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .enablePlugins(SbtWeb)

scalaVersion := "2.11.6"

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus" %% "play" % "1.4.0-M3" % "test",
  "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
  "com.typesafe.play" %% "play-slick" % "1.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "1.0.0",
  "com.github.tminglei" %% "slick-pg" % "0.9.1",
  "de.svenkubiak" % "jBCrypt" % "0.4",
  "org.hjson" % "hjson" % "1.1.0",
  "org.webjars.npm" % "requirejs" % "2.1.20",
  "org.webjars.npm" % "react" % "0.13.3",
  "org.webjars.bower" % "react-router" % "0.13.3",
  "org.webjars.npm" % "jquery" % "2.1.4",
  "org.webjars.npm" % "intl-messageformat" % "1.1.0",
  // we dont put dependency for material-ui here because we use
  // our own unmanaged webjar for it located in libs.
  "org.webjars.npm" % "react-draggable2" % "0.5.1",
  "org.webjars.npm" % "classnames" % "2.1.3"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

resolvers += "Madoushi sbt-plugins" at "https://dl.bintray.com/madoushi/sbt-plugins/"

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator

parallelExecution in Test := false
