package gw.lob.bp7.line.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7NamedPerilsEnhancement : productmodel.BP7NamedPerils {
  function isMoneySecOnPremisesLimitOptionAvaliable(optionCode : String) : boolean {
    var map = {
        "BurglaryRobberyCoverag" -> this.BP7BurglaryRobberyTerm.Value?.toYesNoString()
    }
    var results = SystemTableQuery.query(BP7MonSecOnPremisesLimit, map)
    return results.contains(optionCode)
  }

  function isMoneySecOffPremisesLimitOptionAvaliable(optionCode : String) : boolean {
    var map = {
        "BurglaryRobberyCoverag" -> this.BP7BurglaryRobberyTerm.Value?.toYesNoString()
    }
    var results = SystemTableQuery.query(BP7MonSecOffPremisesLimit, map)
    return results.contains(optionCode)
  }
}
