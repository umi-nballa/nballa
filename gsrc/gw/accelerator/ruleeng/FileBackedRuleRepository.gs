package gw.accelerator.ruleeng

uses java.util.List
uses gw.util.concurrent.LocklessLazyVar
uses gw.transaction.Transaction
uses gw.pl.persistence.core.Bundle
uses gw.transaction.AbstractBundleTransactionCallback
uses java.util.Collection
uses java.io.File
uses gw.api.util.DisplayableException
uses gw.xml.XmlElement
uses java.util.ArrayList
uses java.lang.IllegalStateException
uses gw.api.database.Query

/**
 * This implementation of the repository uses {@link RuleImportExport} to read
 * and write rules to a file.
 *
 * Note: This implementation is not complete; it is just meant as a starting
 * point for projects that require this kind of functionality.
 */
class FileBackedRuleRepository implements IRuleRepository {
  /**
   * The name of the attribute containing an entity's public ID.
   */
  static final var PUBLIC_ID = "public-id"

  static final var GSRC_ROOT = ScriptParameters.$GSRC_ROOT.replace(
      "$PC_ROOT", ScriptParameters.$PC_ROOT.trim())

  var _bundle = Transaction.newBundle()

  var _allRules = new LocklessLazyVar<List<Rule_Ext>>() {
    override function init() : List<Rule_Ext> {
      _bundle = Transaction.newBundle()
      _bundle.addBundleTransactionCallback(new AbstractBundleTransactionCallback() {
        override function beforeCommit(bundle: Bundle) {
          // Do nothing
          bundle.InsertedBeans.each(\ elt -> elt.remove())
        }
      })
      return loadXMLRules(_bundle)
    }
  }

  construct() {
  }

  @Param("rule", "Rule that was selected for edit")
  override function editRule(rule : Rule_Ext) : Rule_Ext {
    return AllRules.firstWhere(\ r -> r.PublicID == rule.PublicID)
  }

  @Param("selectedRules", "Set of rules that are selected for deletion")
  override function deleteRules(selectedRules : List<Rule_Ext>) {
    var allRules = findAllRules()

    //cannot use 'substract' or 'removeAll' to remove selectedRules directly from allRules since
    //fixedID in allRules do not match those of selectedRules.  Need to remove using an alternative key (such as publicID)
    for (rule in selectedRules) {
      allRules.removeWhere(\ r -> r.PublicID == rule.PublicID)
    }

    RuleImportExport.exportRules(allRules)
  }

  @Param("rule", "Rule to be deleted")
  override function deleteRule(rule : Rule_Ext) {
    AllRules.remove(rule)
  }

  override function addRule(rule : Rule_Ext) {
//    AllRules.add(rule)
  }

  override function beforeCommit(rule : Rule_Ext) {
    // Transfer the bean (and dependents?) to our local bundle
    if (rule.Bundle != _bundle) {
      rule.Bundle.InsertedBeans.each(\ bean -> {
        _bundle.add(bean)
        _bundle.delete(bean)
      })
      // UpdatedBeans should be empty; we should always be editing a temporary rule
      rule.Bundle.UpdatedBeans.each(\ bean -> _bundle.add(bean))
      rule.Bundle.RemovedBeans.each(\ bean -> _bundle.delete(bean))
    }
    AllRules.add(_bundle.loadBean(rule.ID) as Rule_Ext)
    createPackageIfNotExists(rule.RulePackage)
    var rules = _bundle.getBeansByRootType(Rule_Ext) as Collection<Rule_Ext>
    RuleImportExport.exportRules(rules)
    _allRules.clear()
    // Make sure we don't commit the new rule to the database
//    rule.remove()
  }

  property get AllRules() : List<Rule_Ext> {
    return _allRules.get()
  }

  override function findAllRules() : List<Rule_Ext> {
    return _allRules.get()
  }

  override property get Bundle(): Bundle {
    return _bundle
  }

  /**
   * loadXMLRules:  Main method responsible for loading the Rule_Ext.xml system table into RuleAdmin.pcf's RuleLV in file mode.
   *   Invoked by initialization of RuleAdmin.pcf's 'rules' variable when in file mode.
   */
  private static function loadXMLRules(bundle : Bundle) : List<Rule_Ext> {
    var importFile = RuleImportExport.ImportFile
    if (!importFile.exists()) {
      throw new DisplayableException(
          displaykey.Accelerator.RulesFramework.RuleAdminExt.FileLocationBad)
    }
    var xml = XmlElement.parse(importFile)

    var rulesList = new ArrayList<Rule_Ext>()

    var ruleVar : Rule_Ext
    for (c in xml.Children.where(\ x -> x.QName.LocalPart.endsWith("Rule_Ext"))) {
      // Find subtype to initialize instance
      var subtypeNode = c.getChild(Rule_Ext#Subtype.PropertyInfo.Name)
      if (subtypeNode == null) {
        throw new IllegalStateException("Can't find subtype of rule to create")
      }
      switch (typekey.Rule_Ext.get(subtypeNode.Text)) {
        case TC_AUTOUPDATERULE_EXT:
            ruleVar = new AutoupdateRule_Ext(bundle)
            break
        case TC_UWRULE_EXT:
            ruleVar = new UWRule_Ext(bundle)
            break
        case TC_VALIDATIONRULE_EXT:
            ruleVar = new ValidationRule_Ext(bundle)
            break
          default:
          throw new IllegalStateException("Unknown rule subtype " + subtypeNode.Text)
      }
      ruleVar.PublicID = c.getAttributeValue(PUBLIC_ID)
      for (a in c.Children) {
        populateRules(a, ruleVar)
      }
      rulesList.add(ruleVar)
    }

    var rulesByPublicId = rulesList.mapToKeyAndValue(
        \ rule -> rule.PublicID,
            \ rule -> rule
    )

    // Map jurisdictions for underwriting rules
    for (c in xml.getChildren(RuleJurisdiction_Ext.Type.RelativeName)) {
      var jurisdiction = new RuleJurisdiction_Ext(bundle)
      jurisdiction.Jurisdiction = typekey.Jurisdiction.get(
          c.getChild(RuleJurisdiction_Ext#Jurisdiction.PropertyInfo.Name).Text
      )

      var rulePublicId = c.getChild(RuleJurisdiction_Ext#Rule.PropertyInfo.Name)
          .getAttributeValue(PUBLIC_ID)
      rulesByPublicId[rulePublicId].addToJurisdictions(jurisdiction)
    }

    rulesList.each(\ rule -> {
      if (!rule.AllJurisdictions and rule.Jurisdictions.IsEmpty) {
        // TODO: Temp workaround
        // log error
        rule.AllJurisdictions = true
      }
    })

    // Map vehicle types for validation rules
    for (c in xml.getChildren(ValidationRuleVehType_Ext.Type.RelativeName)) {
      var vehType = new ValidationRuleVehType_Ext(bundle)
      vehType.VehicleType = typekey.VehicleType.get(
          c.getChild(ValidationRuleVehType_Ext#VehicleType.PropertyInfo.Name).Text
      )

      var rulePublicId = c.getChild(ValidationRuleVehType_Ext#Rule.PropertyInfo.Name)
          .getAttributeValue(PUBLIC_ID)
      (rulesByPublicId[rulePublicId] as ValidationRule_Ext).addToVehicleTypes(vehType)
    }

    // Now map JobTypes to the rules we just imported
    for (c in xml.getChildren(RuleJob_Ext.Type.RelativeName)) {
      var ruleJob = new RuleJob_Ext(bundle)
      ruleJob.JobType = typekey.Job.get(c.getChild(RuleJob_Ext#JobType.PropertyInfo.Name).Text)
      ruleJob.FullApplication = Boolean.valueOf(
          c.getChild(RuleJob_Ext#FullApplication.PropertyInfo.Name).Text)

      var ruleId = c.getChild(RuleJob_Ext#Rule.PropertyInfo.Name).getAttributeValue(PUBLIC_ID)
      rulesByPublicId[ruleId].addToJobs(ruleJob)
    }

    return rulesList
  }

  /**
   * populateRules:  Called from the loadXMLRules method (above) during load of
   * the Rule_Ext.xml file into the RuleAdmin.pcf's RuleLV in file mode.
   */
  private static function populateRules(c : XmlElement, rule : Rule_Ext) {
    switch (c.QName.LocalPart) {
      case Rule_Ext#RuleClass.PropertyInfo.Name:
          rule.RuleClass = c.Text
          break
      case UWRule_Ext#UWIssueType.PropertyInfo.Name:
          if (rule typeis UWRule_Ext) {
            rule.UWIssueType = UWIssueType.finder.findUWIssueTypeByCode(c.Text)
          } else {
            throw new IllegalStateException("Attempt to set UWIssueType on a "
                + rule.IntrinsicType.RelativeName)
          }
          break
      case Rule_Ext#AllJurisdictions.PropertyInfo.Name:
          rule.AllJurisdictions = Boolean.parseBoolean(c.Text)
          break
      case Rule_Ext#GraphNodePath.PropertyInfo.Name:
          rule.GraphNodePath = c.Text
          break
      case Rule_Ext#RuleApplyMethod.PropertyInfo.Name:
          rule.RuleApplyMethod = typekey.RuleApplyMethod_Ext.get(c.Text)
          break
      case ValidationRule_Ext#WarningLevel.PropertyInfo.Name:
          if (rule typeis ValidationRule_Ext) {
            rule.WarningLevel = typekey.ValidationLevel.get(c.Text)
          } else {
            throw new IllegalStateException("Attempt to set WarningLevel on a "
                + rule.IntrinsicType.RelativeName)
          }
          break
      case ValidationRule_Ext#ErrorLevel.PropertyInfo.Name:
          if (rule typeis ValidationRule_Ext) {
            rule.ErrorLevel = typekey.ValidationLevel.get(c.Text)
          } else {
            throw new IllegalStateException("Attempt to set ErrorLevel on a "
                + rule.IntrinsicType.RelativeName)
          }
          break
      case Rule_Ext#EffectiveDate.PropertyInfo.Name:
          rule.EffectiveDate = c.Text as DateTime
          break
      case Rule_Ext#ExpirationDate.PropertyInfo.Name:
          rule.ExpirationDate = c.Text as DateTime
          break
      case Rule_Ext#Priority.PropertyInfo.Name:
          rule.Priority = c.Text as int
          break
      case Rule_Ext#RuleCondition.PropertyInfo.Name:
          rule.RuleCondition = c.Text
          break
      case Rule_Ext#RuleMessage.PropertyInfo.Name:
          rule.RuleMessage = c.Text
          break
    }
  }

  private static function createPackageIfNotExists(rulePackage : String) {
    var targetDir = GSRC_ROOT + "/" + rulePackage.replace(".", "/")
    var dir = new File(targetDir)
    if (not dir.exists()) {
      dir.mkdir()
    }
  }
}
