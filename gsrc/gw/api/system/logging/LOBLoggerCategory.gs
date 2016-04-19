package gw.api.system.logging

uses gw.api.system.PCLoggerCategory
uses gw.pl.logging.Logger

class LOBLoggerCategory extends PCLoggerCategory {
  static final var _transformation : Logger as TRANSFORMATION = createLogger("Transformation")
}