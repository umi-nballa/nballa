package gw.accelerator.ruleeng

/**
 * A simple class to maintain the selection state of an individual
 * jurisdiction.
 */
class JurisdictionSelection {
  /**
   * The Jurisdiction typekey.
   */
  var _jurisdiction : typekey.Jurisdiction as Jurisdiction
  /**
   * Indicates whether the jurisdiction is selected or not.
   */
  var _selected : boolean as Selected

  override function toString() : String {
    return "[" + (Selected ? 'X' : ' ') + "] " + Jurisdiction
  }
}
