package edge.capabilities.policychange.lob.homeowners.draft.util

uses edge.util.mapping.ArrayUpdater
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin

class DwellingAdditionalInterestUtil {

  /**
   * Return a DTO representing the given dwelling additional interest entity
   */
  static function toDTO(accountContactPlugin : IAccountContactPlugin,
                        additionalInterest : HODwellingAddlInt_HOE) : DwellingAdditionalInterestDTO {

    var contactDTO = accountContactPlugin.toDTO(
        additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact)

    return new DwellingAdditionalInterestDTO (){
        : FixedId = additionalInterest.FixedId.Value,
        : Type = additionalInterest.AdditionalInterestType,
        : ContractNumber = additionalInterest.ContractNumber,
        : Description = additionalInterest.AddlInterestDesc,
        : CertificateRequired = additionalInterest.CertRequired,
        : EffectiveDate = additionalInterest.AddlIntEffDate,
        : Contact = contactDTO
    }
  }

  /**
   * Update the dwelling additional interests entity from a DTO
   */
  static function updateAdditionalInterests(accountContactPlugin : IAccountContactPlugin,
                                            updater: ArrayUpdater<Dwelling_HOE, HODwellingAddlInt_HOE, DwellingAdditionalInterestDTO>,
                                            dwelling: Dwelling_HOE,
                                            additionalInterestDTOs: DwellingAdditionalInterestDTO[]) {
    if ( additionalInterestDTOs.HasElements ) {
      var additionalInterestCov = dwelling.AdditionalInterests
      updater.updateArray(dwelling,additionalInterestCov,additionalInterestDTOs,\ item, dto ->{
        item.ContractNumber = dto.ContractNumber
        item.AddlInterestDesc = dto.Description
        item.CertRequired = dto.CertificateRequired
        item.AddlIntEffDate = dto.EffectiveDate
        item.AdditionalInterestType = dto.Type


        accountContactPlugin.updateContact(
            item.PolicyAddlInterest.AccountContactRole.AccountContact.Contact, dto.Contact)

      })
    } else {
      // Remove all additional interests
      dwelling.AdditionalInterests.each( \ elt -> elt.remove())
    }
  }
}
