package una.pageprocess.credit

uses java.util.ArrayList
uses una.logging.UnaLoggerCategory
/**
 * User: amohammed
 * Date: 8/23/16
 * Time: 4:39 PM
 * This class will be have the functions that will be called by HOCreditREportScreen.pcf
 */
class CreditReportScreen {

  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION

  /**
   * Common code to determine whether to enable/disable credit report name/address fields.
   */
  static function isCreditReportInputFieldAvailable(period : PolicyPeriod) : boolean {
    return period.CreditInfoExt.CreditReport == null
  }

  static function editCreditReportDetails(period : PolicyPeriod) : PolicyPeriod{
    period.CreditInfoExt.CreditReport = null
    return period
  }

  /**
   * Build the alternative full-name that was on a credit report
   */
  static function buildCreditReportAltName(period : PolicyPeriod) : String {
    var alternateName = ""
    if (period.CreditInfoExt.CreditReport.AlternateFirstName != null) {alternateName += period.CreditInfoExt.CreditReport.AlternateFirstName + " "}
    if (period.CreditInfoExt.CreditReport.AlternateMiddleName != null) {alternateName += period.CreditInfoExt.CreditReport.AlternateMiddleName + " "}
    if (period.CreditInfoExt.CreditReport.AlternateLastName != null) {alternateName += period.CreditInfoExt.CreditReport.AlternateLastName}
    return alternateName
  }

  static function updateFormerAddressFields(hasPrimaryNamedInsuredMoved : boolean, aFormerAddress : Address,
                                            creditReportContact : PolicyContactRole) : Address {
    if (hasPrimaryNamedInsuredMoved) {
      // Copy policy address to credit report address
      //period.CreditInfoExt.CreditReport.AlternateAddress = new Address()
      aFormerAddress.AddressLine1 = creditReportContact.ContactDenorm.PrimaryAddress.AddressLine1
      aFormerAddress.AddressLine2 = creditReportContact.ContactDenorm.PrimaryAddress.AddressLine2
      aFormerAddress.AddressLine3 = creditReportContact.ContactDenorm.PrimaryAddress.AddressLine3

      aFormerAddress.City = creditReportContact.ContactDenorm.PrimaryAddress.City
      aFormerAddress.State = creditReportContact.ContactDenorm.PrimaryAddress.State
      aFormerAddress.County = creditReportContact.ContactDenorm.PrimaryAddress.County
      aFormerAddress.Country = creditReportContact.ContactDenorm.PrimaryAddress.Country

    } else {
      // Reset credit report address
      aFormerAddress = new Address()
    }

    return aFormerAddress
  }

  static function deActiveLiveCreditReport(period : PolicyPeriod) : PolicyPeriod {
    //Whenever we change screen mode or credit report parameters, we need to deactivate the active (live) credit report.
    //period.CreditReportExt.ActiveOnPolicy = false
    period.CreditInfoExt.CreditReport = null
    period.CreditInfoExt.CreditLevel = null

    return period
  }

  static function orderCreditReport(creditReportContact: PolicyContactRole, period : PolicyPeriod, hasPrimaryNamedInsuredMoved : boolean,
            hasPrimaryNamedInsuredNameChanged : boolean, aFormerAddress : Address, formerFirstName : String, formerMiddleName : String,
            formerLastName : String) : PolicyPeriod {

    var dispatcher = new una.integration.mapping.creditreport.CreditReportRequestDispatcher(creditReportContact, period)
    var address = hasPrimaryNamedInsuredMoved ? aFormerAddress : creditReportContact.ContactDenorm.PrimaryAddress
    var firstName = hasPrimaryNamedInsuredNameChanged ? formerFirstName : (creditReportContact.ContactDenorm as Person).FirstName
    var middleName = hasPrimaryNamedInsuredNameChanged ? formerMiddleName : (creditReportContact.ContactDenorm as Person).MiddleName
    var lastName = hasPrimaryNamedInsuredNameChanged ? formerLastName : (creditReportContact.ContactDenorm as Person).LastName
    var dateOfBirth = (creditReportContact.ContactDenorm as Person).DateOfBirth

    // Download the credit report
    var response = dispatcher.orderNewCreditReport(address, firstName, middleName, lastName, dateOfBirth)
    period.createCustomHistoryEvent(CustomHistoryType.TC_CREDIT_ORDERED, \ -> displaykey.Web.SubmissionWizard.CreditReporting.CreditOrdered)
    LOGGER.debug("Credit Ordered for Person "+firstName +" "+lastName)

    // Populate former (alternative) address field
    if ( hasPrimaryNamedInsuredMoved) {
      period.CreditInfoExt.CreditReport.AlternateAddressInd = true
      period.CreditInfoExt.CreditReport.AlternateAddress = aFormerAddress
    }

    // Populate former (alternative) name field
    if (hasPrimaryNamedInsuredNameChanged) {
      period.CreditInfoExt.CreditReport.AlternateNameInd = true
      period.CreditInfoExt.CreditReport.AlternateFirstName = formerFirstName
      period.CreditInfoExt.CreditReport.AlternateMiddleName = formerMiddleName
      period.CreditInfoExt.CreditReport.AlternateLastName = formerLastName
    }
    return period
  }

  static function getPersonContactRoles(period : PolicyPeriod) : ArrayList<PolicyContactRole>{
    var policyContactRoles = period.PolicyContactRoles.where(\ p -> p.Subtype == "PolicyPriNamedInsured" || p.Subtype == "PolicyAddlNamedInsured")
    var personContactRoles : ArrayList<PolicyContactRole> = new List<PolicyContactRole>()
    for (policyContactRole in policyContactRoles){
      if(policyContactRole.CompanyName == null){
          //Commenting below condition as per below defect 
		  // DE671 # Credit reporting should be available based on Risk state not Policy Mailing Address
          //and contactDoesNotBelongToStates(policyContactRole.ContactDenorm.PrimaryAddress.State)   ){
        personContactRoles.add(policyContactRole)
      }
    }
    return personContactRoles
  }

  private static function contactDoesNotBelongToStates(state : State): boolean{
    if(!(state == State.TC_HI or state == State.TC_CA)){
      return true
    }
    return false
  }
}