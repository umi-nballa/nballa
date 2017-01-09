package gw.plugin.billing.bc800

/**
 * Helper class to retireve specific info from Policy and used in more than one place.
 * User: VTadi
 */
class PolicyInfoUtil {

  /**
   * Checks for any new additional interests added or existing additional interests updated on the given PolicyPeriod.
   * @param period
   */
  static function hasAddlInterestsUpdated(period: PolicyPeriod) : boolean {
    var isUpdated = false
    var addlInterests = retrieveAdditionalInterests(period)
    if (addlInterests != null) {
      isUpdated = addlInterests.hasMatch( \ addlInt -> (addlInt.BasedOn == null or (addlInt.ContractNumber != addlInt.BasedOn.ContractNumber)))
    }
    return isUpdated
  }

  /**
   * Retrieves the additional interest detail objects associated to the given Policy Period.
   * @param period
   */
  static function retrieveAdditionalInterests(period: PolicyPeriod): AddlInterestDetail[] {
    if (period.HomeownersLine_HOEExists) {
      return period.HomeownersLine_HOE.Dwelling?.AdditionalInterestDetails
    } else if (period.CPLineExists) {
      return period.CPLine.getDefaultContainerForAddlInterest()?.AdditionalInterestDetails
    } else if (period.BOPLineExists) {
      return period.BOPLine.getDefaultContainerForAddlInterest()?.AdditionalInterestDetails
    } else if (period.BP7LineExists) {
      return period.BP7Line.AllBuildings*.AdditionalInterests
    } else {
      return null
    }
  }

  /**
   * Retrieves the risk location detail objects associated to the given Policy Period.
   * @param period
   */
  static function retrieveRiskAddress(period: PolicyPeriod): PolicyLocation[] {
    if (period.HomeownersLine_HOEExists) {
      return period.HomeownersLine_HOE.Dwelling?.PolicyLocations
    } else if (period.CPLineExists) {
      return period.CPLine.CPLocations*.PolicyLocation
    } else if (period.BOPLineExists) {
      return period.BOPLine.BOPLocations*.PolicyLocation
    } else if (period.BP7LineExists) {
      return period.BP7Line.BP7Locations*.PolicyLocation
    } else {
      return null
    }
  }

}