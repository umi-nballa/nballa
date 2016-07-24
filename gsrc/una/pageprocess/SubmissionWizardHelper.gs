package una.pageprocess

uses una.utils.EnvironmentUtil
uses gw.api.productmodel.DirectCovTermPattern
uses java.lang.Integer
uses gw.api.util.DisplayableException
uses gw.api.productmodel.Product
uses java.util.ArrayList

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
     else if (Jurisdiction.TC_AZ == state)
          {
           policyTypes = typekey.HOPolicyType_HOE.TF_ARIZONA_EXT.TypeKeys.toTypedArray()
          }
     else if (Jurisdiction.TC_HI == state || Jurisdiction.TC_FL == state)
          {
          policyTypes = typekey.HOPolicyType_HOE.TF_HAWAIFLORIDA_EXT.TypeKeys.toTypedArray()
          }
      else {
        policyTypes = typekey.HOPolicyType_HOE.TF_ALLOTHERSTATE_EXT.TypeKeys.toTypedArray()
      }
    return policyTypes
  }

  /**
   * Function to validate if a submission can be created. This is based on  1 Account - 1 Policy of UN
   *
   * @param acct Account
   * @return boolean
   */
  public static function canAllowSubmission(acct : Account) : boolean {

    /* It Enable submission for developer testing which is identified by a combination of
    * of environment check and script parameter to be set to true
     */
   if (EnvironmentUtil.isLocal() && ScriptParameters.EnableMultiPolicyForLocal)
      return true

    return (acct.IssuedPolicies.Count == 0) ? true : false
  }


  /**
   * Function to copy number of employees into coverage term. Should be caleed all places where such copy is required.
   * Eg: BP7EmployeeDishty
   * @param covTerm: gw.api.domain.covterm.DirectCovTerm
   * @param noOfEmployees : int
   * @return void
   */
  public static function populateNumberOfEmployeesForAllCovTerms(covTerm: gw.api.domain.covterm.DirectCovTerm, noOfEmployees : int) : void {
    covTerm.setValue(noOfEmployees)
  }


  /**
   * Function to copy number of employees into coverage term. Should be caleed all places where such copy is required.
   * Eg: BP7EmployeeDishty
   * @param covTerm: gw.api.domain.covterm.DirectCovTerm
   * @param noOfEmployees : int
   * @return void
   */
  public static function populateForSubmission(covTerm: gw.api.domain.covterm.DirectCovTerm, noOfEmployees : int) : void {
    covTerm.setValue(noOfEmployees)
  }

  /**
   * Function to filter product selection by state.
   * @param productSelection: ProductSelection[]
   * @param jurisdiction : typekey.Jurisdiction
   * @return ProductSelection[] - Filtered products
   */
  public static function filterProductSelection(productSelection: ProductSelection[], jurisdiction : typekey.Jurisdiction) : ProductSelection[] {
    if(jurisdiction == typekey.Jurisdiction.TC_FL or jurisdiction == null) {
      return productSelection
    } else {
      return productSelection.where( \ elt -> elt.Product.CodeIdentifier=='Homeowners')
    }
  }
  /**
   * Function to validate if a submission can be created. This is based on  1 Account - 1 Policy of UN
   *
   * @param acct Account
   * @return boolean
   */
  public static function doesProducerHaveJurisdiction(producer : Organization) : boolean {
    var regionsOfProducer = producer.RootGroup.Regions*.Region.getRegionZones()
    if (regionsOfProducer == null or regionsOfProducer.Count == 0 ) {
      throw new DisplayableException(displaykey.Ext.Submission.SubmissionWizardHelper.ProducerNoRegions)
    }
    return true
  }

  public static function isSameProduct(productSelection : ProductSelection, acct : Account) : boolean {
    var isSameProduct = false
    var prod : Product
    if (acct.SubmissionGroups.HasElements && acct.SubmissionGroups.first().Submissions.HasElements)  {
      prod = acct.SubmissionGroups.first().Submissions.first().Policy.Product
      if (productSelection.Product != prod) {
        throw new DisplayableException(displaykey.Ext.Submission.SubmissionWizardHelper.DifferntProductError(prod))
      }
      else
        return true

    } else
      return true
  }
}
