package una.integration.mapping.creditreport

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

uses gw.api.util.Logger
uses una.integration.service.creditreport.CreditReportServiceFactory
uses una.integration.framework.util.CreditReportUtil
uses java.util.Map
uses java.util.HashMap
uses una.logging.UnaLoggerCategory


/**
 * Validates request and delegates it to the service
 * extends PCValidationBase class in case we want to implement more validation.
 * The validate() method should be implemented if the quote should not 
 * be submitted due to credit report validation errors. 
 */
class CreditReportRequestDispatcher extends PCValidationBase {

  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION

  private var _policyContact : PolicyContactRole
  private var _policyPeriod : PolicyPeriod
  
  @Param("policyContact", "Instance of PolicyContact")
  @Param("policyPeriod", "Intance of PolicyPeriod")
  construct(policyContact : PolicyContactRole, policyPeriod : PolicyPeriod) {
    
    super(new PCValidationContext(ValidationLevel.TC_DEFAULT))
    _policyContact = policyContact
    _policyPeriod = policyPeriod
  }
  
  /**
   * Called from Submission Wizard when user pressed on Order New Report button.
   * Populates PC DB with retrieved credit score
   **/
  @Param("address", "The address under which the credit report should be ordered")
  @Param("firstName", "The first name of the insured under which the credit report should be ordered")
  @Param("middleName", "The middle name of the insured under which the credit report should be ordered")
  @Param("lastName", "The last name of the insured under which the credit report should be ordered")
  @Param("dateOfBirth", "Date of birth of the insured under which the credit report should be ordered")
  @Returns("Credit report information packaged in a CreditReportResponse instance")
  function orderNewCreditReport(address : Address, firstName : String, middleName : String, lastName : String, dob : DateTime) : CreditReportResponse {
     
    // This version is limited to personal credit type    
    if(!(_policyContact.ContactDenorm typeis Person)) {
      return new CreditReportResponse
        .Builder()
        .withFirstName(firstName)
        .withMiddleName(middleName)
        .withLastName(lastName)
        .withDateOfBirth(dob)
        .withAddress1(address.AddressLine1)
        .withAddress2(address.AddressLine2)
        .withAddresscity(address.City)
        .withAddressState(address.State as java.lang.String )
        .withAddressZip(address.PostalCode)
        .withStatusCode(CreditStatusExt.TC_ERROR)
        .withStatusDescription("Credit report can be ordered only for the Person, not company")
        .create()
    }

    // validate, throw exception if problems found
    validate()
    Context.raiseExceptionIfProblemsFound()

    // get credit score
    var creditReport = getCreditReportResponse(address, firstName, middleName, lastName)
    
    return creditReport
  }

  /**
   * Constructs and sends request, and returns the results in a packaged 
   * credit response object instance, either locally 
   * if a recent record has not expired) or from the service
   */  
  @Param("address", "Address instance of legal entity on Policy, currently limited to customer of individual type")
  @Param("firstName", "First name of customer")
  @Param("middleName", "Middle name of customer")
  @Param("lastName", "Last name of customer") 
  @Returns("Credit report information packaged in a CreditReportResponse instance")
  private function getCreditReportResponse(address : Address, 
      firstName : String, 
      middleName : String, 
      lastName : String) : CreditReportResponse {
        
    var creditReportExt = new CreditReportExt(_policyPeriod)

    // Assign a record number to this credit report
    creditReportExt.CreditReportOrder = creditReportExt.PolicyContactRole.CreditReportsExt.length + 1
    
    var rqst = CreditReportUtil.createCreditReportRequest(address, firstName, middleName, lastName, _policyPeriod, this._policyContact)
    // Delegates request to a credit reporting service
    var service = CreditReportServiceFactory.getCreditReportService(rqst.CreditReportService)
    LOGGER.debug("getCreditReportResponse(): Sending request: " + rqst.toString())
    var creditReportResponse : CreditReportResponse = service.getCreditReport(rqst)
    
    populateCreditReportExt(creditReportExt, creditReportResponse, rqst, _policyPeriod)
    _policyContact.addToCreditReportsExt(creditReportExt)
    _policyPeriod.CreditInfoExt.CreditReport = creditReportExt

    return creditReportResponse
  }
  
  /** 
   * Provided as an example of additional validation that can be performed to stop the credit report from being ordered
   * implementations which wish to prevent credit report orders on underage insureds should comment this out   
   */
  override function validateImpl() {
  }   
  
  /**
   * Populates CreditScoreExt instance with passed via params info   
   */
  @Param("creditReportExt", "Target CreditReportExt instance to populate" )
  @Param("creditReportResponse", "Source creditReportResponse instance" )
  private function populateCreditReportExt(creditReportExt : CreditReportExt, creditReportResponse : CreditReportResponse, creditReportRequest : CreditReportRequest, pPeriod : PolicyPeriod) {
    //creditReportResponse.
    creditReportExt.CreditScore = creditReportResponse.Score
    creditReportExt.CreditBureau = creditReportResponse.CreditBureau
    creditReportExt.CreditScoreDate = creditReportResponse.ScoreDate
    creditReportExt.FolderID = creditReportResponse.FolderID
    creditReportExt.CreditStatus = creditReportResponse.StatusCode
    creditReportExt.CreditStatusDescription = creditReportResponse.StatusDescription
    creditReportExt.ProductReferenceNumber = creditReportResponse.ReferenceNumber
    if(creditReportResponse.Reasons <> null){
      creditReportResponse.Reasons.eachKeyAndValue( \ code,val -> {
          var creditStatReason  = new CreditStatusReason(_policyPeriod)
          creditStatReason.CreditStatusReasonCode = code as java.lang.Integer
          creditStatReason.CreditStatusReasonDesc = val
          creditReportExt.addToCreditStatusReasons(creditStatReason)
        })
     }

    creditReportExt.FirstName = creditReportResponse.FirstName
    creditReportExt.MiddleName = creditReportResponse.MiddleName
    creditReportExt.LastName = creditReportResponse.LastName
    creditReportExt.AddressLine1 = creditReportResponse.AddressLine1
    creditReportExt.AddressCity = creditReportResponse.AddressCity
    creditReportExt.AddressState = creditReportResponse.AddressState
    creditReportExt.AddressZip = creditReportResponse.AddressZip
    creditReportExt.SearchFirstName = creditReportRequest.FirstName
    creditReportExt.SearchMiddleName = creditReportRequest.MiddleName
    creditReportExt.SearchLastName = creditReportRequest.LastName
    creditReportExt.SearchAddressLine1 = creditReportRequest.AddressLine1
    creditReportExt.SearchAddressCity = creditReportRequest.AddressCity
    creditReportExt.SearchAddressState = creditReportRequest.AddressState
    creditReportExt.SearchAddressZip = creditReportRequest.AddressZip
    creditReportExt.SearchSSN = creditReportRequest.SocialSecurityNumber
    creditReportExt.SearchDateOfBirth = creditReportRequest.DateOfBirth
    creditReportExt.SearchGender = creditReportRequest.Gender



    // credit report header
    creditReportExt.UserID = pPeriod.UpdateUser.Credential.UserName
    creditReportExt.PncAccount = creditReportResponse.PncAccount
    creditReportExt.ProductReference = creditReportResponse.ProductReference
    creditReportExt.Quoteback = creditReportResponse.Quoteback
    creditReportExt.DateRequestOrdered = creditReportResponse.DateRequestOrdered
    creditReportExt.DateRequestCompleted = creditReportResponse.DateRequestCompleted
    creditReportExt.Status = creditReportResponse.Status
    creditReportExt.ReportCode = creditReportResponse.ReportCode
    creditReportExt.DateOfBirth = creditReportResponse.DateOfBirth
    creditReportExt.Gender = creditReportResponse.Gender
    creditReportExt.SpecialBillingID = creditReportResponse.SpecialBillingID

  }
}