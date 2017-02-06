package gw.accelerator.ruleeng

uses java.util.Date
uses java.util.List
uses java.io.Serializable
uses gw.lang.reflect.ReflectUtil

/**
 * Encapsulates the criteria that can be used to search for rules.
 */
class RuleSearchCriteria implements Serializable {
  //core search criteria vars
  var _ruleClass : String as RuleClass
  var _ruleType : typekey.Rule_Ext as RuleType
  var _ruleJob : String as RuleJob
  var _effectiveDate : Date as EffectiveDate
  var _jurisdiction: typekey.Jurisdiction as Jurisdiction

  //unimplemented criteria vars
  var _issueType : UWIssueType as IssueType
  var _ruleEntityGraphNode : RuleEntityGraphNode as RuleEntityGraphNode
  var _valWarningLevel : typekey.ValidationLevel as ValWarningLevel
  var _valErrorLevel : typekey.ValidationLevel as ValErrorLevel

  //LOB search criteria vars
  var _vehicleType : VehicleType as VehicleType

  /**
   * Called by RuleAdmin page when user select the Reset search criteria button.
   */
  public function resetSearchCriteria() {

    //core search criteria vars
    _ruleClass = null
    _ruleType = null
    _ruleJob = null
    _effectiveDate = null
    _jurisdiction = null

    //unimplemented criteria vars
    _issueType = null
    _ruleEntityGraphNode = null
    _valWarningLevel = null
    _valErrorLevel = null

    //LOB search criteria vars
    _vehicleType = null
  }

  /**
   * Returns true if any selectable criteria on the RuleSearchCriteriaPanelSet is not null.
   */
  public function criteriaHasContent() : boolean {
    return //core search criteria vars
        _ruleClass != null
            or _ruleType != null
            or _ruleJob != null
            or _effectiveDate != null
            or _jurisdiction != null

            //unimplemented criteria vars
            or _issueType != null
            or _ruleEntityGraphNode != null
            or _valWarningLevel != null
            or _valErrorLevel != null

            //LOB search criteria vars
            or _vehicleType != null
  }


  /**
   * Searches Rule_Ext entity for given criteria and returns Rule_Exts matching criteria.
   */
  @Param("repository", "The rule repository in use")
  @Returns("The rules from the repository that match these criteria")
  public function searchRules(repository : IRuleRepository) : List<Rule_Ext> {
    var filteredRules = repository.findAllRules().where(\ rule -> this.matches(rule))
    return filteredRules
  }

  @Param("rule", "A rule")
  @Returns("True if the rule satisfies the search criteria")
  private function matches(rule : Rule_Ext) : boolean {
    if ((_ruleClass != null) and !rule.RuleClass.containsIgnoreCase(_ruleClass)) {
      return false
    }

    if ((_ruleType != null) and (rule.Subtype != _ruleType)) {
      return false
    }

    // Compare jurisdictions
    if (!rule.AllJurisdictions
        and (_jurisdiction != null) and !rule.Jurisdictions.hasMatch(\ j -> j.Jurisdiction == _jurisdiction)) {
      return false
    }

    if ((_ruleJob != null) and !(ReflectUtil.getProperty(rule, _ruleJob) as boolean)) {
      return false
    }

    if ((_effectiveDate != null)
        and (rule.EffectiveDate.after(_effectiveDate)
            or ((rule.ExpirationDate != null) and rule.ExpirationDate.before(_effectiveDate)))) {
      return false
    }

    if ((_ruleEntityGraphNode != null)
        and (rule.GraphNodePath != _ruleEntityGraphNode.Path)) {
      return false
    }

    //unimplemented criteria vars: _issueType

    if (rule typeis ValidationRule_Ext) {
      if ((_vehicleType != null)
          and not rule.VehicleTypes.hasMatch(\ v -> v.VehicleType == _vehicleType)) {
        return false
      }

      if ((_valWarningLevel != null)
          and (rule.WarningLevel != _valWarningLevel)) {
        return false
      }

      if ((_valErrorLevel != null) and (rule.ErrorLevel != _valErrorLevel)) {
        return false
      }
    }

    return true
  }
}
