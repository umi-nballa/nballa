package gw.lob.ho.contact

uses gw.lob.common.contact.AbstractAdditionalInterestContainer

@Export
class DwellingAdditionalInterestContainer_HOE extends AbstractAdditionalInterestContainer<Dwelling_HOE>
{
  construct(dwelling : Dwelling_HOE) {
    super(dwelling)
  }

  override property get PolicyPeriod() : PolicyPeriod {
    return this.PolicyLine.Branch
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.PolicyLine
  }
  
  override property get AdditionalInterestDetails() : AddlInterestDetail[] {
    return _owner.AdditionalInterests
  }

  override property get TypeLabel() : String {
    return displaykey.Web.Homeowners.Dwelling.AdditionalInterest.LVLabel
  }
  
  override function addToAdditionalInterestDetails( interestDetail: AddlInterestDetail ) {
    if (not (interestDetail typeis HODwellingAddlInt_HOE)) {
      throw displaykey.Web.Homeowners.Dwelling.AdditionalInterest.Error.AdditionalInterestIsWrongType(interestDetail.Subtype)
    }
    _owner.addToAdditionalInterests( interestDetail as HODwellingAddlInt_HOE )
  }

  override function removeFromAdditionalInterestDetails( interestDetail: AddlInterestDetail ) {
    if (not (interestDetail typeis HODwellingAddlInt_HOE)) {
      throw displaykey.Web.Homeowners.Dwelling.AdditionalInterest.Error.AdditionalInterestIsWrongType(interestDetail.Subtype)
    }
    interestDetail.PolicyAddlInterest.removeFromAdditionalInterestDetails(interestDetail)
  }

  override function createNewAdditionalInterestDetail() : HODwellingAddlInt_HOE {
    var addlIntDetail = new HODwellingAddlInt_HOE(this.PolicyPeriod)
    addlIntDetail.AddlIntEffDate = this.PolicyPeriod.PeriodStart
    return addlIntDetail
  }

  override property get ContainerIsValid() : boolean {
    return not (_owner == null)
  }
}
