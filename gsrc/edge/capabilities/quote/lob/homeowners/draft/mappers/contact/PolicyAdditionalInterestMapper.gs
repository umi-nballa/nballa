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

  public override function toDTO(period: PolicyPeriod): List<DwellingAdditionalInterestDTO> {
    var results : List<DwellingAdditionalInterestDTO> = {}

    period.PolicyContactRoles.whereTypeIs(PolicyAddlInterest)?.each( \ additionalInterest -> {
      results.add(toDTO(additionalInterest))
    })

    return results
  }

  protected override function toDTO(role: PolicyAddlInterest): DwellingAdditionalInterestDTO {
    var result = new DwellingAdditionalInterestDTO()

    result.ContractNumber = role.AdditionalInterestDetails.first().ContractNumber
    result.Type = role.AdditionalInterestDetails.first().AdditionalInterestType
    result.InterestTypeIfOther = role.AdditionalInterestDetails.first().InterestTypeIfOther_Ext
    result.Description = (role.AdditionalInterestDetails.first() as HODwellingAddlInt_HOE).AddlInterestDesc
    result.CertificateRequired = role.AdditionalInterestDetails.first().CertRequired
    result.EffectiveDate = (role.AdditionalInterestDetails.first() as HODwellingAddlInt_HOE).AddlIntEffDate
    result.IsVestingInfoRequired = role.AdditionalInterestDetails.first().VestingInfoRequired_Ext
    result.VestingInfo = role.AdditionalInterestDetails.first().VestingInfo_Ext

    return result
  }
}