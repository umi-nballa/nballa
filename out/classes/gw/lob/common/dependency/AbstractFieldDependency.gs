package gw.lob.common.dependency

uses gw.api.diff.DiffItem
uses gw.api.web.job.JobWizardHelper
uses gw.validation.PCValidationContext
uses gw.web.productmodel.ProductModelSyncIssuesHandler

abstract class AbstractFieldDependency<T extends KeyableBean> implements FieldDependency {
  var _dependant : T as Dependant
  var _dependenciesContext : DependenciesContext as DependenciesContext
  var _eventNotifier = DependencyEventNotifier.Instance
  var _wizard : JobWizardHelper as Wizard

  construct(entity : T) {
    _dependant = entity
  }

  final override function updateDependentFields() {
    updateDependentFields(null, null)
  }

  final override function updateDependentFields(depContext : DependenciesContext) {
    updateDependentFields(depContext, null)
  }

  final override function updateDependentFields(depContext : DependenciesContext, wizard : JobWizardHelper) {
    if(depContext == null){
      _dependenciesContext = new DependenciesContext()
    } else {
      _dependenciesContext = depContext
    }
    _wizard = wizard
    doUpdate()
    syncProductModel()
    Children*.updateDependentFields(_dependenciesContext.contextForNextLevel(), wizard)

    _eventNotifier.publishUpdate(Dependant)
  }

  protected function syncProductModel() {
    if (_dependant typeis Coverable) {
      ProductModelSyncIssuesHandler.sync({_dependant}, null, null, _dependant.PolicyLine.Branch, _wizard)
    }
  }

  final override function validateDependentFields(valContext : PCValidationContext) {
    validateDependentFields(valContext, null)
  }

  final override function validateDependentFields(valContext : PCValidationContext, depContext : DependenciesContext) {
    if(depContext == null){
      _dependenciesContext = new DependenciesContext()
    } else {
      _dependenciesContext = depContext
    }
    doValidate(valContext)
    Children*.validateDependentFields(valContext, _dependenciesContext.contextForNextLevel())
  }

  final override function shouldSuppressOOSConflict(diffItem : DiffItem) : boolean {
    return isOOSConflict(diffItem)
  }

  abstract protected function doUpdate()
  abstract protected function doValidate(valContext : PCValidationContext)
  abstract protected property get Children() : List<FieldDependency>

  protected function isOOSConflict(diffItem: DiffItem) : boolean {
    return false
  }
}
