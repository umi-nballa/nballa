package una.integration.plugins.numbergeneration

uses gw.plugin.policynumgen.IPolicyNumGenPlugin
uses gw.plugin.util.SequenceUtil
uses una.logging.UnaLoggerCategory
uses una.utils.StringUtil

/**
 * PolicyNumGenPluginImpl is Plugin Implementation class ,it includes logic for Policy Number Generation
 * User:
 */
class PolicyNumGenPluginImpl implements IPolicyNumGenPlugin {
  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION

  /**
   *  This Method creates new Policy Number
   *  @param policyPeriod
   */
  override function genNewPeriodPolicyNumber(policyPeriod: PolicyPeriod ) : String {
    if (policyPeriod.Status == PolicyPeriodStatus.TC_LEGACYCONVERSION) {
      LOGGER.debug("New Policy Number create is :"+genSeqNumber(policyPeriod))
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
   */
  private function genSeqNumber(policyPeriod: PolicyPeriod): String {
    LOGGER.info("Generating sequence number")
    var strUtil = new StringUtil(policyPeriod)
    var counterString = "P" + policyPeriod.BaseState + strUtil.firstLetterLOB()
    return counterString + String.format("%010d" , {SequenceUtil.getSequenceUtil().next(0000000001, counterString)})
  }


}
