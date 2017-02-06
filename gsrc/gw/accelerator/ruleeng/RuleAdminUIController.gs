package gw.accelerator.ruleeng

uses gw.api.util.SearchUtil
uses gw.entity.IEntityType

uses java.util.List
uses java.lang.IllegalStateException
uses gw.api.database.Query
uses gw.api.web.PebblesUtil
uses pcf.api.Location

/**
 * RuleAdminUIController provides utility and support methods for the rules
 * administration UI screens.
 */
class RuleAdminUIController {
  /**
   * Describes the toolbar actions that are used to launch the detail popup.
   */
  enum ToolbarAction {
    /** Creating a new rule. */
    CREATE,
    /** Editing an existing rule. */
    EDIT,
    /** Copying an existing rule. */
    COPY
  }

  /** The rule repository contains all rules. */
  var _repository : IRuleRepository as readonly Repository

  /**
   * Constructs the UI controller.
   */
  @Param("repoType", "The type of repository to use")
  construct(repoType : gw.accelerator.ruleeng.RuleRepositoryFactory.RuleRepository) {
    changeRepositoryType(repoType)
  }

  /**
   * (Re-)initializes the rule repository.
   */
  @Param("repoType", "The type of repository to use")
  final function changeRepositoryType(
      repoType : gw.accelerator.ruleeng.RuleRepositoryFactory.RuleRepository) {
    _repository = RuleRepositoryFactory.getInstance(repoType)
  }

  /**
   * Returns an array used by the RuleSearchCriteriaPanelSet's Job dropdown
   * range property.
   */
  function ruleJobRange() : String[] {
    var returnVar = {"QuickQuote", "FullApplication"}
      .union(typekey.Job.TF_RULEJOB.TypeKeys.map(\ job -> job.Code))
    return returnVar as String[]
  }

  /**
   * Exports all rules from the database to the configured import file.
   */
  @Param("location", "The current location")
  function exportRules(location : Location) {
    var result = RuleImportExport.exportRules(
        Query.make(Rule_Ext).select().toList())
    PebblesUtil.addWebMessages(location, {result})
  }

  /**
   * The popup uses this method to intialize its rule variable based on the
   * arguments to push().
   */
  @Param("rule", "An existing rule passed to the popup")
  @Param("ruleType", "The type of rule to create when creating a new rule")
  @Param("callersToolbarAction", "The toolbar button used to launch the popup")
  @Returns("The appropriate value for the 'rule' variable")
  function findRuleToEdit(rule : Rule_Ext,
                          ruleType : typekey.Rule_Ext,
                          callersToolbarAction : ToolbarAction) : Rule_Ext {
    switch (callersToolbarAction) {
      case CREATE:
        return newEmptyRule(ruleType)
      case COPY:
        return cloneRule(rule)
      case EDIT:
        return rule
      default:
        throw new IllegalStateException(
            "Unknown action " + callersToolbarAction)
    }
  }

  /**
   * editRule: Called when the RuleAdminExt rulelist iterator's rule.RuleClass
   * cell is selected.
   */
  @Param("rule", "Rule that was selected for edit")
  function editRule(rule : Rule_Ext) {
    rule = _repository.editRule(rule)
    pcf.RuleAdminDetailPopup.push(rule, rule.Subtype, EDIT, this)
  }

  /**
   * copyRule: Called by RuleAdminExt's "Copy Rule" button. Clones the
   * selected rule, then appends "-COPY" to the rule.RuleClass.
   */
  @Param("rule", "Rule to be copied (i.e. clone's source)")
  function copyRule(rule : Rule_Ext) {
    pcf.RuleAdminDetailPopup.push(rule, rule.Subtype, COPY, this)
  }

  /**
   * deleteRules: Called by RuleAdminExt's "Delete" button and by the deleteAll
   * method above. Deletes selected (or all) rows in the RuleLV.
   */
  @Param("selectedRules", "Set of rules that are selected for deletion")
  function deleteRules(selectedRules : List<Rule_Ext>) {
    _repository.deleteRules(selectedRules)
    SearchUtil.search()
  }

  /**
   * beforeCommit: Called from RuleAdminDetailPopup's beforeCommit property.
   */
  @Param("rule", "rule that is being created or edited")
  @Param("ruleStateList", "The jurisdiction selections for the rule")
  @Param("ruleVehicleTypeList", "The vehicle types for the rule")
  function beforeCommit(rule : Rule_Ext,
                        ruleStateList : List<JurisdictionSelection>,
                        ruleVehicleTypeList : List<VehicleTypeSelection>) {
    updateNewRule(rule, ruleStateList, ruleVehicleTypeList)

    _repository.beforeCommit(rule)
  }

  /**
   * updateNewRule: Updates the selection status of jurisdictions and vehicle
   * types for the updated rule.
   */
  @Param("rule", "rule being created or updated")
  @Param("jurisdictionList", "Jurisdictions selected for the rule")
  @Param("vehicleTypesList", "vehicle types selected for the rule")
  function updateNewRule(rule : Rule_Ext,
                         jurisdictionList : List<JurisdictionSelection>,
                         vehicleTypesList : List<VehicleTypeSelection>) {
    // Populate jurisdictions
    rule.updateJurisdictions(jurisdictionList)

    if (rule typeis ValidationRule_Ext) {
      // And vehicle types for validation rules
      rule.updateVehicleTypes(vehicleTypesList)
    }

    _repository.addRule(rule)
  }

  /**
   * cloneRule: Creates a new rule based on an existing rule.
   */
  @Param("sourceRule", "rule being cloned")
  @Returns("newly created rule")
  private function cloneRule(sourceRule : Rule_Ext) : Rule_Ext {
    var ruleToCreate : Rule_Ext
    var ruleType : IEntityType
    switch (sourceRule.Subtype) {
      case TC_AUTOUPDATERULE_EXT:
        ruleType = AutoupdateRule_Ext
        ruleToCreate = new AutoupdateRule_Ext()
        break
      case TC_UWRULE_EXT:
        ruleType = UWRule_Ext
        ruleToCreate = new UWRule_Ext()
        break
      case TC_VALIDATIONRULE_EXT:
        ruleType = ValidationRule_Ext
        ruleToCreate = new ValidationRule_Ext()
        break
      default:
        throw "Unknown rule subtype " + sourceRule.Subtype
    }

    ruleToCreate.AllJurisdictions = sourceRule.AllJurisdictions

    var entityProperties = ruleType.EntityProperties.toList().where(
        \ i -> i.Autogenerated == false)

    for (entityProperty in entityProperties) {
      var entityPropertyValue = entityProperty.Accessor.getValue(sourceRule)
      entityProperty.Accessor.setValue(ruleToCreate, entityPropertyValue)
    }

    ruleToCreate.RuleClass =
        displaykey.Accelerator.RulesFramework.ClonedRuleClassName(
            ruleToCreate.RuleClass)
    _repository.addRule(ruleToCreate)

    return ruleToCreate
  }

  /**
   * Constructs a new rule fo the given type.
   */
  @Param("ruleType", "The type of rule to create")
  @Returns("A new instance of the given type of rule")
  function newEmptyRule(ruleType : typekey.Rule_Ext) : Rule_Ext {
    var result : Rule_Ext
    switch (ruleType) {
      case TC_AUTOUPDATERULE_EXT:
        result = new AutoupdateRule_Ext(Repository.Bundle)
        break
      case TC_UWRULE_EXT:
        result = new UWRule_Ext(Repository.Bundle)
        break
      case TC_VALIDATIONRULE_EXT:
        result = new ValidationRule_Ext(Repository.Bundle)
        break
      default:
        throw "Unknown rule type " + ruleType
    }

    // Set default job types
    result.FullApplication = true
    result.QuickQuote = true
    result.PolicyChange = true
    result.Renewal = true
    result.Rewrite = true

    return result
  }
}
