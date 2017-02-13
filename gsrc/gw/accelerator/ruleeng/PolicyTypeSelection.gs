package gw.accelerator.ruleeng

/**
 * A simple class to maintain the selection state of an individual
 * policyType.
 */
class PolicyTypeSelection {
  /**
   * The policyType typekey.
   */
  var _policyType : typekey.HOPolicyType_HOE as polType
  /**
   * Indicates whether the policyType is selected or not.
   */
  var _selected : boolean as Selected

  override function toString() : String {
    return "[" + (Selected ? 'X' : ' ') + "] " + polType
  }
}
