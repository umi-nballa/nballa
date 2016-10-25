package gw.web.productmodel

uses gw.api.web.job.JobWizardHelper
uses gw.api.util.LocationUtil
uses java.lang.Throwable

/**
 * Created with IntelliJ IDEA.
 * User: adash
 * Date: 5/12/16
 * Time: 5:28 AM
 * To change this template use File | Settings | File Templates.
 */
class LineWizardStepHelper_Ext {

  static function coveragesOnEnterHO(_coverables : Coverable[], wizard : JobWizardHelper) {

    try {
      ProductModelSyncIssuesHandler.syncCoverages(_coverables, wizard)
      ProductModelSyncIssuesHandler.syncConditions(_coverables, wizard)
      ProductModelSyncIssuesHandler.syncExclusions(_coverables, wizard)
    } catch(err : Throwable) {
      LocationUtil.addRequestScopedErrorMessage("Error entering the Coverages screen: ${err}")
    }
  }
}