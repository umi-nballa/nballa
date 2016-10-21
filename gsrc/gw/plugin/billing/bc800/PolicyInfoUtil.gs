package gw.plugin.billing.bc800

/**
 * Helper class to retireve specific info from Policy and used in more than one place.
 * User: VTadi
 */
class PolicyInfoUtil {

  /**
   * Retrieves the loan number from the Mortgagee additional interest that is selected as billing contact on the policy period.
   * @param period the PolicyPeriod
   */
  static function getMortgageeLoanNumber(period: PolicyPeriod): String {
    var loanNumber: String = null
    if (period.BillingContact != null) {
      if (period.HomeownersLine_HOEExists) {
        loanNumber = retrieveLoanNumber(period.HomeownersLine_HOE.Dwelling?.AdditionalInterests, period.BillingContact)
      } else if (period.CPLineExists) {
        var building = period.CPLine.getDefaultContainerForAddlInterest()
        loanNumber = retrieveLoanNumber(building?.AdditionalInterests, period.BillingContact)
      } else if (period.BOPLineExists) {
        var building = period.BOPLine.getDefaultContainerForAddlInterest()
        loanNumber = retrieveLoanNumber(building?.AdditionalInterests, period.BillingContact)
      } else if (period.BP7LineExists) {
        var building = period.BP7Line.AllBuildings?.firstWhere( \ building -> {
          return building.AdditionalInterests?.hasMatch( \ addlInt -> addlInt.AdditionalInterestType == AdditionalInterestType.TC_MORTGAGEE)
        })
        loanNumber = retrieveLoanNumber(building?.AdditionalInterests, period.BillingContact)
      }
    }
    return loanNumber
  }

  /**
   * Retrieves the loan number from the additional interest of type Mortgagee and selected as the policy billing contact
   */
  private static function retrieveLoanNumber(addlInterests: AddlInterestDetail[], billingContact: PolicyBillingContact) : String {
    var loanNumber = addlInterests?.firstWhere( \ addlInt -> {
      return addlInt.AdditionalInterestType == AdditionalInterestType.TC_MORTGAGEE
          && addlInt.PolicyAddlInterest.ContactDenorm.AddressBookUID == billingContact.ContactDenorm.AddressBookUID
    })?.ContractNumber
    return loanNumber
  }
}