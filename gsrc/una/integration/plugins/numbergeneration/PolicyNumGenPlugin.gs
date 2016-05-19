package una.integration.plugins.numbergeneration

uses java.lang.Math
uses java.lang.Integer
uses java.lang.StringBuilder
uses gw.plugin.util.SequenceUtil
uses una.utils.StringUtil
uses gw.plugin.policynumgen.IPolicyNumGenPlugin
uses una.logging.UnaLoggerCategory

/**
 * PolicyNumGenPlugin is Plugin Implementation class ,it includes logic for Policy Number Generation
 * User:
 */
@Export
class PolicyNumGenPlugin implements IPolicyNumGenPlugin {
  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION


  /**
   *  This Method creates new Policy Number
   *
   **/
   override function genNewPeriodPolicyNumber( policyPeriod: PolicyPeriod ) : String {
     LOGGER.info("Creating New Policy Number")
    if (policyPeriod.Status == PolicyPeriodStatus.TC_LEGACYCONVERSION) {
      return genSeqNumber(policyPeriod)
    }
    var job = policyPeriod.Job
    if (job == null) throw "Cannot have null job"

    if (job typeis Submission or job typeis Rewrite or job typeis RewriteNewAccount) {
      return genSeqNumber(policyPeriod)
    } else {
      return policyPeriod.PolicyNumber
    }
  }
  /**
   *  This Method generates sequence number start from '0000000001'
   *
   **/
  private function genSeqNumber(policyPeriod: PolicyPeriod): String {
    LOGGER.info("Generating sequence number")
    var strUtil = new StringUtil(policyPeriod)
    var counterString = "P" + policyPeriod.BaseState + strUtil.firstLetterLOB()
    return counterString + String.format("%010d" , {SequenceUtil.getSequenceUtil().next(0000000001, counterString)})
  }


}
