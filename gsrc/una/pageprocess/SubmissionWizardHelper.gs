package una.pageprocess

uses una.utils.EnvironmentUtil
uses gw.api.util.DisplayableException
uses gw.api.productmodel.Product
uses com.guidewire.pc.system.dependency.PCDependencies
uses java.util.Date

/**
* Submission UI PCF Helper Class
*/
class SubmissionWizardHelper {

  private static final var CLASS_STRING = SubmissionWizardHelper.Type.DisplayName
  private static var status = 0

  @Param("state","the jurisdiction for the policy types for")
  @Returns("The filtered policy type list.")
  public static function filterHOPolicyTypes(state : Jurisdiction) : HOPolicyType_HOE[] {
    return HOPolicyType_HOE.getTypeKeys(false).where( \ policyType -> policyType.hasCategory(state))
  }

  /**
   * Function to validate if a submission can be created. This is based on  1 Account - 1 Policy of UN
   *
   * @param acct Account
   * @return boolean
   */
  public static function canAllowSubmission(acct : Account) : boolean {

    if(acct == null){
      return false
    }
    /* It Enable submission for developer testing which is identified by a combination of
    * of environment check and script parameter to be set to true
     */
    if (EnvironmentUtil.isLocal() && ScriptParameters.EnableMultiPolicyForLocal){
      return true
    }

    return (acct?.IssuedPolicies?.Count == 0) ? true : false
  }


  /**
   * Function to copy number of employees into coverage term. Should be called all places where such copy is required.
   * Eg: BP7EmployeeDishty
   * @param covTerm: gw.api.domain.covterm.DirectCovTerm
   * @param noOfEmployees : int
   * @return void
   */
  public static function populateNumberOfEmployeesForAllCovTerms(line : BP7BusinessOwnersLine):int {
    var partialEmp : int
    var noOfPartialEmp : int = line.NoOfPartEmployee_Ext
    var fullTimeEmployees : int = line.NoOfEmployees_Ext
    if(noOfPartialEmp % 2 == 0){
      partialEmp = noOfPartialEmp/2
    } else {
      partialEmp = noOfPartialEmp/2 + 1
    }
    if(line.BP7EmployeeDishtyExists){
      line.BP7EmployeeDishty.BP7NoOfEmployeesEmployeeDishonesty_EXTTerm.setValue(fullTimeEmployees + partialEmp)
    }
    if(line.BP7EmploymentPracticesLiabilityCov_EXTExists && line.BP7EmploymentPracticesLiabilityCov_EXT.HasNumbOfEmployees_EXTTerm ){
      line.BP7EmploymentPracticesLiabilityCov_EXT.NumbOfEmployees_EXTTerm.setValue(fullTimeEmployees + partialEmp)
    }
    return fullTimeEmployees + partialEmp
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

  public static function isThisProductAvailable(producerSelection : ProducerSelection, productSelection : ProductSelection) : boolean {
    var foundIt = false
    var theSelectedState = producerSelection.State
    var theSelectedDate =  producerSelection.DefaultPPEffDate
    var theSelectedProducerCode = producerSelection.ProducerCode
    var theSelectedProduct = productSelection.Product
    for(availableProduct in theSelectedProducerCode.AvailableProductsExt){
      var theAvailableProduct = PCDependencies.getProductModel().getAllInstances(Product).where(\ p -> p.Code.equalsIgnoreCase(availableProduct.ProductCode))?.first()
      if(theAvailableProduct != null && (theSelectedProduct == theAvailableProduct && theSelectedDate >= availableProduct.EffectiveDateExt && theSelectedDate <= availableProduct.ExpirationDateExt) && availableProduct.JurisdictionExt == theSelectedState){
        foundIt = true
      }
    }
    return foundIt
  }

  public static function whatIsTheProductStatus(producerSelection : ProducerSelection, productSelection : ProductSelection, theProductSelectionStatus : String) : String {
    var isThisProductAvailable = isThisProductAvailable(producerSelection,productSelection)
    var whatIsTheStatus = isThisProductAvailable ? theProductSelectionStatus : "Not Available"
    return whatIsTheStatus
  }

  public static function isDateRangeValid(theExpirationDate : Date, theEffectiveDate : Date) : String{
    if((theExpirationDate != null && theEffectiveDate != null ) && theExpirationDate < theEffectiveDate){
      throw new DisplayableException("Invalid Expiration Date, should be after Effective Date")
    }
    return null
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
