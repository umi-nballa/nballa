package gw.lob.bp7.defaults

uses gw.api.domain.Clause
uses gw.api.web.job.JobWizardHelper
uses gw.web.productmodel.ProductModelSyncIssuesHandler

class BP7ProductModelSyncIssuesHelper {

  static function syncClause(clause : Clause, jobWizardHelper : JobWizardHelper = null) {
    if (clause typeis Coverage) {
      ProductModelSyncIssuesHandler.syncSpecifiedCoverages({clause}, jobWizardHelper)
    } else if (clause typeis Exclusion) {
      ProductModelSyncIssuesHandler.syncSpecifiedExclusions({clause}, jobWizardHelper)
    } else if (clause typeis PolicyCondition) {
      ProductModelSyncIssuesHandler.syncSpecifiedConditions({clause}, jobWizardHelper)
    }
  }
}