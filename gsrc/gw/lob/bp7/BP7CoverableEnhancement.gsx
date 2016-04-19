package gw.lob.bp7

uses gw.api.productmodel.Schedule
uses gw.api.web.job.JobWizardHelper

enhancement BP7CoverableEnhancement : entity.Coverable {
  
  function bp7sync(helper : JobWizardHelper) {
    gw.web.productmodel.ProductModelSyncIssuesHandler.sync({this}, null, null, this.PolicyLine.Branch, helper)
    this.CoveragesConditionsAndExclusionsFromCoverable.each( \ cov -> {

      if(cov typeis Schedule) {
        cov.ScheduledItems.each( \ item -> (item as Coverable).bp7sync(helper))
      }

      cov.CovTerms*.bp7sync(helper)
    })
  }
  
}
