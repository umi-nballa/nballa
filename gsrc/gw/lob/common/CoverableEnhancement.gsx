package gw.lob.common

uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.ExclusionPattern
uses gw.api.productmodel.ConditionPattern
uses gw.api.productmodel.CoveragePattern

enhancement CoverableEnhancement : entity.Coverable {

  function isClauseSelectedOrAvailable( clausePattern : ClausePattern) : boolean {

    if (clausePattern typeis CoveragePattern) {
      return this.isCoverageSelectedOrAvailable(clausePattern)
    } else if (clausePattern typeis ConditionPattern) {
      return this.isConditionSelectedOrAvailable(clausePattern)
    } else if (clausePattern typeis ExclusionPattern) {
      return this.isExclusionSelectedOrAvailable(clausePattern)
    }

    return false
  }
}
