package una.pcf_gs
/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/1/16
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */
class SubmissionWizard {

  private static final var CLASS_STRING = SubmissionWizard.Type.DisplayName
  private static var status = 0

  @Param("polPeriod","Current policy period")

  public static function filterHOPolicyTypes(state : Jurisdiction) : HOPolicyType_HOE[] {
    var policyTypes : HOPolicyType_HOE[]
    if(Jurisdiction.TC_CA == state) {
      policyTypes = typekey.HOPolicyType_HOE.TF_CALIFORNIA_EXT.TypeKeys.toTypedArray()
    }
    else if (Jurisdiction.TC_TX == state)
    {
      policyTypes = typekey.HOPolicyType_HOE.TF_TEXAS_EXT.TypeKeys.toTypedArray()
    }
    else if (Jurisdiction.TC_NC == state)
      {
        policyTypes = typekey.HOPolicyType_HOE.TF_NORTHCAROLINA_EXT.TypeKeys.toTypedArray()
      }
      else {
        policyTypes = typekey.HOPolicyType_HOE.TF_ALLOTHERSTATE_EXT.TypeKeys.toTypedArray()
      }
    return policyTypes
  }

}