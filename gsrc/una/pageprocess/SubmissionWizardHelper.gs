package una.pageprocess
/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/1/16
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */
class SubmissionWizardHelper {

  private static final var CLASS_STRING = SubmissionWizardHelper.Type.DisplayName
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

  /**
   * Function for selecting the base state based for submissions
   *
   * @param producerSelection ProducerSelection
   * @param acct Account
   * @return Jurisdiction
   */
  public static function selectBaseState(producerSelection : ProducerSelection, acct : Account) : Jurisdiction{
    //default to base state from account
    var jurisdiction : Jurisdiction =  producerSelection.State
    var regionsOfProducer = producerSelection.Producer.RootGroup.Regions*.Region.getRegionZones()

    /* only one state for producer then default that
    //this is the highest priority */
    if (regionsOfProducer.Count==1)
      jurisdiction = regionsOfProducer.first().Code

    /* if there are more than one state in which producer writes
     and account holder state is not one of hte the UNA states then set it ot null */
    else if (!regionsOfProducer.hasMatch( \ elt1 -> elt1.Code == jurisdiction))
      jurisdiction = null

    return jurisdiction
  }

  /**
   * Function to validate if a submission can be created. This is based on  1 Account - 1 Policy of UN
   *
   * @param acct Account
   * @return boolean
   */
  public static function canAllowSubmission(acct : Account) : boolean {
    return (acct.IssuedPolicies.Count == 0) ? true : false
  }

}