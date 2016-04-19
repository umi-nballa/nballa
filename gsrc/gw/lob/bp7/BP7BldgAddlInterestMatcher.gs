package gw.lob.bp7

uses gw.contact.AbstractAddlInterestDetailMatcher
uses gw.entity.ILinkPropertyInfo

class BP7BldgAddlInterestMatcher extends AbstractAddlInterestDetailMatcher<BP7BldgAddlInterest> {

  construct(interest : BP7BldgAddlInterest) {
    super(interest)
  }

  override property get CoveredInterestColumns() : List<ILinkPropertyInfo> {
    return {BP7BldgAddlInterest.Type.TypeInfo.getProperty("BP7Building") as ILinkPropertyInfo}
  }
}