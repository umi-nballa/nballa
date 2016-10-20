package gw.plugin.billing.bc800

/**
 * Helper class to retireve specific info from Policy and used in more than one place.
 * User: VTadi
 */
class PolicyInfoUtil {

  /**
   * Retrieves the Mortgagee loan number which is the billing contact on the policy period.
   * @param period the PolicyPeriod
   */
  static function getMortgageeLoanNumber(period: PolicyPeriod): String {
    var loanNumber: String
    if (period.HomeownersLine_HOEExists) {
      loanNumber = retrieveLoanNumber(period.HomeownersLine_HOE.Dwelling?.AdditionalInterests)
    } else if (period.CPLineExists) {
      var building = period.CPLine.getDefaultContainerForAddlInterest()
      loanNumber = retrieveLoanNumber(building?.AdditionalInterests)
    } else if (period.BP7LineExists) {
      var building = period.BP7Line?.AllBuildings?.firstWhere( \ building -> {
        return building.AdditionalInterests?.hasMatch( \ addlInt -> addlInt.AdditionalInterestType == AdditionalInterestType.TC_MORTGAGEE)
      })
      loanNumber = retrieveLoanNumber(building?.AdditionalInterests)
    }
    return loanNumber
  }

  /**
   * Retrieves the loan number from the first additional interest of type Mortgagee with billing contact role
   */
  private static function retrieveLoanNumber(addlInterests: AddlInterestDetail[]) : String {
    var loanNumber = addlInterests?.firstWhere( \ addlInt -> {
      return addlInt.AdditionalInterestType == AdditionalInterestType.TC_MORTGAGEE
          && addlInt.PolicyAddlInterest.AccountContactRole.AccountContact.hasRole(typekey.AccountContactRole.TC_BILLINGCONTACT)
    })?.ContractNumber
    return loanNumber
  }
}