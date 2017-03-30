package edge.capabilities.policychange.lob.homeowners.draft.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingDTO
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.util.mapping.ArrayUpdater

final class DwellingUtil {
  construct() {
    throw new UnsupportedOperationException("This is an utility class.")
  }
  /**
   * Fills the dwelling DTO from the given dwelling entity
   */
  public static function fillBaseProperties(accountContactPlugin : IAccountContactPlugin,
                                            dto : DwellingDTO, data : Dwelling_HOE) {
    dto.AdditionalInterests = data.AdditionalInterests.map( \ elt -> {
        return DwellingAdditionalInterestUtil.toDTO(accountContactPlugin, elt)
    })

    dto.DistanceToFireHydrant = data.HOLocation.DistanceToFireHydrant
    dto.DistanceToFireStation = data.HOLocation.DistanceToFireStation
    dto.NearCommercial = data.HOLocation.NearCommercial
    dto.ResidenceType  = data.ResidenceType
    dto.DwellingLocation =   data.DwellingLocation
    dto.FloodingOrFireHazard = data.HOLocation.FloodingHazard
    dto.DwellingUsage = data.DwellingUsage
    dto.Occupancy = data.Occupancy
  }

  /**
   * Updates the dwelling entity from a DTO
   */
  public static function updateDwelling(accountContactPlugin : IAccountContactPlugin,
                                        updater: ArrayUpdater<Dwelling_HOE, HODwellingAddlInt_HOE, DwellingAdditionalInterestDTO>,
                                        dwelling : Dwelling_HOE, dto : DwellingDTO) {
    if (dto == null) {
      return
    }
    dwelling.HOLocation.DistanceToFireHydrant = dto.DistanceToFireHydrant
    dwelling.HOLocation.DistanceToFireStation = dto.DistanceToFireStation
    dwelling.HOLocation.NearCommercial = dto.NearCommercial
    dwelling.ResidenceType = dto.ResidenceType
    dwelling.DwellingLocation = dto.DwellingLocation
    dwelling.HOLocation.FloodingHazard = dto.FloodingOrFireHazard
    dwelling.DwellingUsage = dto.DwellingUsage
    dwelling.Occupancy = dto.Occupancy

    // Update the additional interests
    DwellingAdditionalInterestUtil.updateAdditionalInterests(
        accountContactPlugin, updater, dwelling, dto.AdditionalInterests)

  }

}
