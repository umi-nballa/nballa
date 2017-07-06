package edge.capabilities.quote.lob.homeowners.draft.mappers.contact

uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/17
 * Time: 11:06 AM
 * To change this template use File | Settings | File Templates.
 */
class PolicyAdditionalInterestMapper extends PolicyContactMapper<PolicyAddlInterest, DwellingAdditionalInterestDTO> {
  override function createContactRole(period: PolicyPeriod, portalIndex : Integer, contact: Contact) {
    var newInterestDetail = period.HomeownersLine_HOE.Dwelling.addAdditionalInterestDetail(contact)
    var newAdditionalInterest = newInterestDetail.PolicyAddlInterest
    newAdditionalInterest.PortalIndex = portalIndex
    newAdditionalInterest.ContactDenorm = contact
  }

  override function updateContactRole(entity: PolicyAddlInterest, dto: DwellingAdditionalInterestDTO) {
    var entityInterest = entity.AdditionalInterestDetails.whereTypeIs(HODwellingAddlInt_HOE).single()
    entityInterest.AddlIntEffDate = entityInterest.Branch.PeriodStart
    entityInterest.AdditionalInterestType = dto.Type
    entityInterest.ContractNumber = dto.ContractNumber
    entityInterest.AddlInterestDesc = dto.Description
    entityInterest.CertRequired = dto.CertificateRequired
    entityInterest.InterestTypeIfOther_Ext = dto.InterestTypeIfOther
    entityInterest.VestingInfoRequired_Ext = dto.IsVestingInfoRequired
    entityInterest.VestingInfo_Ext = dto.VestingInfo
  }
}