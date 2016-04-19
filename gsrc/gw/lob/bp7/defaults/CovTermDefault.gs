package gw.lob.bp7.defaults

uses gw.api.web.job.JobWizardHelper
uses gw.api.domain.Clause

interface CovTermDefault {
  function setDefault(wizard : JobWizardHelper = null)
  property get TermValueString() : String
  property set TermValueString(val : String)
  property get DefaultToClause() : Clause
}