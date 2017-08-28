package una.pageprocess
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/22/17
 * Time: 2:39 PM
 * To change this template use File | Settings | File Templates.
 */
class ContactPCFController {
  public static function areAdditionalInsuredCoverageFieldsAvailable(branch : PolicyPeriod) : boolean{
    return branch.HomeownersLine_HOEExists
       and branch.HomeownersLine_HOE.BaseState == TC_TX
       and {HOPolicyType_HOE.TC_HOA_EXT, HOPolicyType_HOE.TC_HOB_EXT, HOPolicyType_HOE.TC_HCONB_EXT}.contains(branch.HomeownersLine_HOE.HOPolicyType)
  }
}