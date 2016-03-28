package gw.rating.flow

uses gw.lang.reflect.ITypeLoaderListener
uses gw.lang.reflect.RefreshRequest
uses gw.rating.flow.domain.CalcRoutine
uses gw.rating.RateFlowLogger
uses gw.api.system.PLDependenciesGateway
uses gw.lang.reflect.TypeSystem

// Temporary workaround for bug in PC 8.0.3 and earlier, whereby garbage collection "unwires" the callback
// that normally clears the CalcRoutine cache after a typesystem refresh (e.g. PCF reload).
//
// To use this in a PC server: add gw.rating.flow.CacheClearWorkaround#initialize to preload.txt
// To use this in a Test server, invoke gw.rating.flow.CacheClearWorkaround.initialize() in Gosu scratchpad
class CacheClearWorkaround {
  static function initialize() {
    if (instance == null) {
      instance = new CacheClearWorkaround()
    }
  }

  static var instance : CacheClearWorkaround

  static var listener = new ITypeLoaderListener() {
    var _rfLogger = RateFlowLogger.Logger
    override function refreshedTypes(p0: RefreshRequest) {
      CalcRoutine.clearCache()
      _rfLogger.info("CCW: Calc Routine cache cleared because of typesystem refresh.")
    }

    override function refreshed() {
      CalcRoutine.clearCache()
      _rfLogger.info("CCW: Calc Routine cache cleared because of typesystem refresh.")
    }
  }

  private construct() {
    RateFlowLogger.Logger.info("CacheClearWorkaround installed.")
    TypeSystem.addTypeLoaderListenerAsWeakRef(listener)
  }
}