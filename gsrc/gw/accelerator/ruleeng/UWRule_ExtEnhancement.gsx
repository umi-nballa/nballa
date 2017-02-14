package gw.accelerator.ruleeng

uses java.util.Collections
uses java.util.List

/**
 * This enhancement provides a single property that restricts the available
 * rule application methods to match those of the selected UW issue.
 */
enhancement UWRule_ExtEnhancement : entity.UWRule_Ext {
  property get UWApplyMethods() : List<typekey.RuleApplyMethod_Ext> {
    var issue = this.UWIssueType
    if ((issue != null) and (issue.Comparator != typekey.ValueComparator.TC_NONE)) {
      return Collections.singletonList(typekey.RuleApplyMethod_Ext.TC_EACH)
    } else {
      return typekey.RuleApplyMethod_Ext.getTypeKeys(false)
    }
  }
}
