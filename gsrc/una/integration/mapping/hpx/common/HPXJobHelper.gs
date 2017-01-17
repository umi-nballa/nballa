package una.integration.mapping.hpx.common

uses gw.plugin.Plugins
uses gw.plugin.diff.IPolicyPeriodDiffPlugin
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/6/17
 * Time: 8:33 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXJobHelper {
  function getChangedCoveragePatterns(policyPeriod : PolicyPeriod, coverable : Coverable) : List<String> {
    var changedPatternCodes = new ArrayList<String>()
    if (policyPeriod != null and policyPeriod.BasedOn != null) {
      var diffPlugin = Plugins.get(IPolicyPeriodDiffPlugin)
      var diffs = diffPlugin.compareBranches(DiffReason.TC_COMPAREJOBS, policyPeriod.BasedOn, policyPeriod)
      for (diff in diffs) {
        if (diff.Bean typeis Coverage) {
          if (diff.Bean.OwningCoverable == coverable) {
            changedPatternCodes.add((diff.Bean as Coverage).PatternCode)
          }
        }
      }
    }
    return changedPatternCodes
  }
}