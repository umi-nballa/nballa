package gw.accelerator.ruleeng

/**
 * A simple class to maintain the selection state of an individual vehicle
 * type.
 */
class VehicleTypeSelection {
  var _selected : boolean as Selected
  var _vehicleType : typekey.VehicleType as VehicleType

  override function toString() : String {
    return "[" + (Selected ? 'X' : ' ') + "] " + VehicleType
  }
}
