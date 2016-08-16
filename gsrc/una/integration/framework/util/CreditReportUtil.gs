package una.integration.framework.util

uses typekey.CreditReportServiceExt
uses entity.PolicyPriNamedInsured
uses typekey.UWCompanyCode
uses typekey.State
uses entity.Contact
uses entity.Person
uses entity.Address
uses entity.PolicyPeriod
uses typekey.PolicyLine
uses typekey.Jurisdiction
uses gw.lang.Returns
uses gw.lang.Param
uses entity.CreditReportParametersExt
uses entity.PolicyContactRole
uses gw.api.database.Query
uses gw.api.util.Logger
uses una.integration.mapping.creditreport.CreditReportRequest

/**
 * Helper class for creating credit reporting service request, mapping the 
 * credit level to a credit score, and determining whether a credit score  
 * is required for this policy.
 */
public class CreditReportUtil {
  
   private static final var _logger = Logger.forCategory("CreditReportUtil")

  /**
   * Retrieves the CreditReportParameter applicable to the following 
   * credit reporting criteria: Line of Business, UW Company and 
   * Jurisdiction. Note that the system table can be further extended 
   * for additional search and credit reporting parameters.
   */
  @Param("period", "PolicyPeriod instance as search criterion")
  @Returns("First matched record from CreditReportParametersExt (system table: credit_report_params.xml)") 
  static function getCreditReportParameters(period : PolicyPeriod) : CreditReportParametersExt {
    
    var result : CreditReportParametersExt = null
    
    if(period != null) {
      result = getCreditReportParameters (
              period.Lines.first().PatternCode,
              period.UWCompanyCode,
              period.BaseState
            )
    }
    
    return result
  }
  
  /**
   * Retrieves the CreditReportParameter applicable to the following 
   * credit reporting criteria: Line of Business, UW Company and 
   * Jurisdiction. Note that the system table can be further extended 
   * for additional search and credit reporting parameters.
   */
  @Param("lobPatternCode", "Line of business pattern code i.e. PersonalAutoLine, BusinessAutoLine")
  @Param("uwCompanyCode", "Underwriting company code")
  @Param("jurisdictionCode", "Jurisdiction code, i.e. CA - California")
  @Returns("First matched record from CreditReportParametersExt (system table: credit_report_params.xml)") 
  static function getCreditReportParameters(lobPatternCode : String, uwCompanyCode : UWCompanyCode, jurisdictionCode : Jurisdiction) : CreditReportParametersExt {
  
    var result : CreditReportParametersExt = null
    //Right now turning this feature off for Jurisdiction and UWCompanyCode..depending on the business
    //requirements need to extend or restrict this functionality
    //if(lobPatternCode != null && uwCompanyCode != null && jurisdictionCode != null) {
    if(lobPatternCode != null && jurisdictionCode != null) {
        result = Query.make(CreditReportParametersExt)
            .compare("LOBPatternCode", Equals, lobPatternCode)
            //.compare("UWCompanyCode", Equals, uwCompanyCode)
            //.compare("JurisdictionCode", Equals, jurisdictionCode)
            .select().FirstResult
      }
     //}

    return result
  } 
  
  /**
   * Returns a CreditReportRequest instance out from a given address,
   * firstName, middleName, lastName and policy period combination.
   */
  @Param("address",  "Address instance of legal entity on Policy, currently limited to customer of individual type")
  @Param("firstName", "First name of customer"  )
  @Param("middleName", "Middle name of customer"  )
  @Param("lastName",  "Last name of customer")
  @Param("policyContact", "PolicyPeriod instance")
  @Returns("CreditReportRequest instance packaging the given credit reporting search parameters")
  static function createCreditReportRequest(address : Address, firstName : String, middleName : String, lastName : String, period : PolicyPeriod, policyContact : PolicyContactRole) : CreditReportRequest {

    var result : CreditReportRequest = null
     
    if(address != null && firstName != null && lastName != null && period != null && policyContact != null) {
      // Expiration date settings are maintained in CreditReportParameters system table.
      var creditReportParameters = getCreditReportParameters(period)
    
      // Use the role contact's public ID as among the identifier to the request
      var publicId = policyContact.PublicID

      if(creditReportParameters <> null) {
        // Calculate and set the new report required date as -X days from today's date
        var cacheExpireDate = gw.api.util.DateUtil.addDays(new java.util.Date(), -1 * (creditReportParameters.CreditReportDaysValid))
        result = new CreditReportRequest
                 .Builder()
                 .withFirstName(firstName)
                 .withMiddleName(middleName)
                 .withLastName(lastName)
                 .withAddress1(address.AddressLine1)
                 .withAddress2(address.AddressLine2)
                 .withAddresscity(address.City)
                 .withAddressState(address.State as java.lang.String )
                 .withAddressZip(address.PostalCode)
                 .withCacheExpireDate(cacheExpireDate)
                 .withPublicId(publicId)
                 .withDateOfBirth(period.PrimaryNamedInsured.DateOfBirth)
                 .withCreditReportService(creditReportParameters.CreditReportService)
                 .create()
        }
      }
          
    return result
  }
   
  /**
   * The credit report is required for policies which meet these three conditions:
   * 1) This is a Homeowners policy.
   * 2) The primary named insured is a person (not a company).
   * 3) The age of the primary insured is less than the "CreditReportMinimumAge" script parameter.
   * Did 
   * Condition #2 can be taken for granted for personal auto policies, but we still want to check
   * this in case other lines (i.e. Commercial Auto) get added to this requirement in the future.
   * 
   * For the age requirement, policy holder date-of-birth may not be available (according to OOTB configuration).
   * Therefore, for this implementation, we will require credit reporting for all ages UNLESS the age is defined
   * and under our minimum age.
  */
  @Param("period", "PolicyPeriod instance for which the credit report is being inquired")
  @Returns("Returns true if the policy is a personal auto policy, the primary insured is a person and the age is less than the minimum age requirement")
  public static function isCreditReportRequired(period : PolicyPeriod) : boolean {
        
    var result : boolean=true

    if(period != null) {
      _logger.debug("*********** Line = " + period.LinePatterns.firstWhere( \ p -> p.Code == typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE.Code))
      
      var primaryNamedInsured = period.PrimaryNamedInsured.ContactDenorm
      var params = getCreditReportParameters(period)
    
      result = period.HomeownersLine_HOEExists
          && primaryNamedInsured typeis Person
          && (primaryNamedInsured.DateOfBirth==null || primaryNamedInsured.Age>=params.CreditReportMinimumAge)
      
      if (_logger.DebugEnabled) {
        _logger.debug("Required flag: " + result)
      }
    }
    
    return result
  }
}