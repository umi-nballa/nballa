package gw.lob.bp7

uses gw.contact.AddlInterestDetailMergeableImpl
uses gw.api.domain.account.Mergeable

@Export
class BP7BldgAddlInterestMergeableImpl extends AddlInterestDetailMergeableImpl<BP7BldgAddlInterest> {

  construct(addlInterstDetail : BP7BldgAddlInterest) {
    super(addlInterstDetail)
  }

  override function mergeFields(merged : BP7BldgAddlInterest) : boolean {
    var superRetVal = super.mergeFields(merged)

    // Once we are able to merge buildings, this will have to be changed
    // to merge merged.BP7Building into Survivor.BP7Building

    if (merged.BP7Building typeis Mergeable) {
       throw "BP7Building is mergeable, and should no longer be ignored."
    }

    return superRetVal
  }
}