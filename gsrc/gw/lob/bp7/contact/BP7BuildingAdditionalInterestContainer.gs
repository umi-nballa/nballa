package gw.lob.bp7.contact

uses gw.lob.common.contact.AbstractAdditionalInterestContainer

class BP7BuildingAdditionalInterestContainer extends AbstractAdditionalInterestContainer<BP7Building> {

  construct(building: BP7Building) {
    super(building)
  }

  override function createNewAdditionalInterestDetail(): AddlInterestDetail {
    return new BP7BldgAddlInterest(this.PolicyPeriod)
  }

  override property get ContainerIsValid(): boolean {
    return not (_owner == null)
  }

  override property get PolicyLine(): PolicyLine {
    return _owner.Location.Line
  }

  override property get PolicyPeriod(): gw.pc.policy.period.entity.PolicyPeriod {
    return _owner.Branch
  }

  override property get AdditionalInterestDetails() : AddlInterestDetail[] {
    return _owner.AdditionalInterests
  }

  override property get TypeLabel(): String {
    return displaykey.BusinessOwners.Building.AdditionalInterest.LVLabel
  }

  override function addToAdditionalInterestDetails(interestDetail : AddlInterestDetail) {
    if (not (interestDetail typeis BP7BldgAddlInterest)) {
      throw displaykey.BusinessOwners.Building.AdditionalInterest.Error.AdditionalInterestIsWrongType(interestDetail.Subtype)
    }

    _owner.addToAdditionalInterests( interestDetail as BP7BldgAddlInterest )
  }

  override function removeFromAdditionalInterestDetails(interestDetail : AddlInterestDetail ) {
    if (not (interestDetail typeis BP7BldgAddlInterest)) {
      throw displaykey.BusinessOwners.Building.AdditionalInterest.Error.AdditionalInterestIsWrongType(interestDetail.Subtype)
    }

    interestDetail.PolicyAddlInterest.removeFromAdditionalInterestDetails(interestDetail)
  }
}