package gw.lob.bp7.defaults

uses gw.api.domain.Clause
uses gw.api.domain.covterm.CovTerm
uses gw.api.productmodel.CovTermPattern
uses gw.api.web.job.JobWizardHelper

abstract class AbstractCovTermDefault<T extends CovTerm, P extends CovTermPattern> implements CovTermDefault {

  override function setDefault(wizard : JobWizardHelper = null) {
    makeTermAvailable(wizard)
    setTermDefault()
  }

  override property get TermValueString() : String {
    return Term.ValueAsString
  }

  override property set TermValueString(val : String) {
    Term.setValueFromString(val)
  }

  protected function makeTermAvailable(wizard : JobWizardHelper) {
    var clause = DefaultToClause
    if (DefaultToClause.CovTerms.hasMatch( \ term -> term.Pattern == DefaultToTerm)) {
      BP7ProductModelSyncIssuesHelper.syncClause(clause, wizard)
    }
  }

  protected property get Term() : T {
    return DefaultToClause.CovTerms.firstWhere( \ term -> term.Pattern == DefaultToTerm) as T
  }

  abstract protected function setTermDefault()

  abstract protected property get DefaultFromTerm() : T

  abstract protected property get DefaultToTerm() : P
}