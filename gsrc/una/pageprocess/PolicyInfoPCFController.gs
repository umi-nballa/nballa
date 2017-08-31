package una.pageprocess

uses gw.api.web.job.JobWizardHelper
/**
 * Created with IntelliJ IDEA.
 * User: ABrown
 * Date: 8/29/17
 * Time: 3:37 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicyInfoPCFController {

  public static function onEnter(period : PolicyPeriod, jobWizardHelper : JobWizardHelper, openForEdit : Boolean){
    if(openForEdit){
      if(period.BaseState == TC_TX and period.HomeownersLine_HOE.HOPolicyType == TC_TDP1_Ext and period.includedPerilsCovered_Ext == null){
        period.includedPerilsCovered_Ext = TC_fireAndlightning
      }
    }
  }
}
