package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/19/16
 * Time: 7:43 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXPolicyPeriodHelper {

  function getPreviousBranch(policyPeriod : PolicyPeriod) : PolicyPeriod {
    var currentBranchNumber = policyPeriod.BranchNumber
    var modelNumber = policyPeriod.ModelNumber
    var termNumber = policyPeriod.TermNumber
    if (modelNumber > 1) {
      var previousBranch = policyPeriod.Policy.BoundPeriods.firstWhere( \ elt -> elt.ModelNumber == modelNumber -1)
      return previousBranch
    } else if (termNumber > 1) {
      var previousBranch = policyPeriod.Policy.BoundPeriods.firstWhere( \ elt -> elt.TermNumber == termNumber -1)
      return previousBranch
    } else return null
  }
}