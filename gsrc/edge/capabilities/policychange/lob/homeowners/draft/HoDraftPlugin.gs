package edge.capabilities.policychange.lob.homeowners.draft

uses edge.capabilities.policychange.dto.PolicyChangeHistoryDTO
uses edge.capabilities.policychange.lob.ILobDraftPlugin

uses edge.capabilities.policychange.lob.homeowners.draft.dto.HoDraftDataExtensionDTO

uses edge.di.annotations.InjectableNode
uses edge.security.authorization.IAuthorizerProviderPlugin
uses edge.util.mapping.EntityCreationContextProvider
uses edge.util.mapping.Mapper
uses gw.api.diff.DiffItem
uses edge.capabilities.address.IAddressPlugin
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingDTO
uses edge.capabilities.policychange.lob.homeowners.draft.util.DwellingUtil
uses edge.util.mapping.ArrayUpdater
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.capabilities.policychange.lob.homeowners.draft.dto.ScheduledPropertyDTO

class HoDraftPlugin implements ILobDraftPlugin <HoDraftDataExtensionDTO> {
  private var _accountContactPlugin : IAccountContactPlugin
  private var _entityCreationContextProvider: EntityCreationContextProvider
  private var _additionalInterestUpdater : ArrayUpdater<Dwelling_HOE, HODwellingAddlInt_HOE, DwellingAdditionalInterestDTO>
  private var _additionalInterestMapper : Mapper;
  private var _schedulePropertyUpdater : ArrayUpdater<Dwelling_HOE,ScheduledItem_HOE,ScheduledPropertyDTO>
  private var _schedulePropertyMapper : Mapper;

  private var _addressPlugin : IAddressPlugin

  @InjectableNode
  construct(authzProvider:IAuthorizerProviderPlugin,
            addressPlugin : IAddressPlugin, accountContactPlugin : IAccountContactPlugin) {
    this._addressPlugin = addressPlugin
    this._accountContactPlugin = accountContactPlugin

    _entityCreationContextProvider = new EntityCreationContextProvider()

    _additionalInterestUpdater = new ArrayUpdater<Dwelling_HOE,HODwellingAddlInt_HOE,DwellingAdditionalInterestDTO>(authzProvider) {
        : ToCreateAndAdd = \ dwelling, dto -> dwelling.createAndAddAdditionalInterestDetail(typekey.ContactType.get(dto.Contact.Subtype)) as HODwellingAddlInt_HOE,
        : ToRemove = \ dwelling, e -> dwelling.removeFromAdditionalInterestDetails(e) ,
        : ToAdd = \ dwelling, e -> dwelling.addToAdditionalInterestDetails(e),
        : DtoKey = \ dto -> dto.FixedId,
        : EntityKey = \ e -> e.FixedId.Value
    }
    _additionalInterestMapper = new Mapper(authzProvider)

    _schedulePropertyUpdater = new ArrayUpdater<Dwelling_HOE,ScheduledItem_HOE,ScheduledPropertyDTO>(authzProvider) {
        : ToCreateAndAdd = \ dwelling, dto -> dwelling.createAndAddScheduledItem(dwelling.HODW_ScheduledProperty_HOE.Pattern.Code),
        : ToRemove = \ dwelling, e -> dwelling.HODW_ScheduledProperty_HOE.removeScheduledItem(e),
        : ToAdd = \ dwelling, e -> dwelling.HODW_ScheduledProperty_HOE.addScheduledItem(e),
        : DtoKey = \ dto -> dto.FixedId,
        : EntityKey = \ e -> e.FixedId.Value
    }
    _schedulePropertyMapper = new Mapper(authzProvider)
  }

  override function compatibleWithProduct(code: String): boolean {
    return code == "HomeOwners"
  }

  /**
   * Updates the policy period entity in the HO policy change with the changes in the DTO
   */
  override function updateExistingDraftSubmission(period: PolicyPeriod, update: HoDraftDataExtensionDTO) {
    if ( period.HomeownersLine_HOE == null ) {
      return
    }

    var hoeLine = period.HomeownersLine_HOE
    DwellingUtil.updateDwelling(_accountContactPlugin, _additionalInterestUpdater, hoeLine.Dwelling, update.Dwelling)

    updateScheduledProperties(hoeLine.Dwelling, update.ScheduledProperties)
  }

  /**
   * Returns a DTO representing the policy change
   */
  override function toDraftDTO(period: PolicyPeriod): HoDraftDataExtensionDTO {
    final var hoeLine = period.HomeownersLine_HOE
    if (hoeLine == null) {
      return null
    }

    final var res = new HoDraftDataExtensionDTO()

    res.PolicyAddress = _addressPlugin.toDto(period.PolicyAddress.Address)

    res.Dwelling = new DwellingDTO()
    DwellingUtil.fillBaseProperties(_accountContactPlugin, res.Dwelling, hoeLine.Dwelling)

    if ( hoeLine.Dwelling.HODW_ScheduledProperty_HOEExists) {
      res.ScheduledProperties = _schedulePropertyMapper.mapArray<ScheduledItem_HOE,ScheduledPropertyDTO>(
          hoeLine.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems,
              \ item -> {
                return new ScheduledPropertyDTO(){
                    : FixedId = item.FixedId.Value,
                    : Description = item.Description,
                    : ExposureValue = item.ExposureValue,
                    : Type = item.ScheduleType
                }
              }
      )
    } else {
      res.ScheduledProperties = new ScheduledPropertyDTO[]{};
    }

    return res
  }

  /**
   * Helper function to update scheduled properties.
   */
  protected function updateScheduledProperties(dwelling: Dwelling_HOE, scheduledPropertyDTOs: ScheduledPropertyDTO[]) {
    var pattern = dwelling.PolicyLine.Pattern.getCoveragePattern("HODW_ScheduledProperty_HOE")
    if ( scheduledPropertyDTOs.HasElements ) {
      dwelling.setCoverageConditionOrExclusionExists(pattern,true)
      var scheduleItemsCov = dwelling.HODW_ScheduledProperty_HOE.ScheduledItems
      _schedulePropertyUpdater.updateArray(dwelling,scheduleItemsCov,scheduledPropertyDTOs,\ item, dto ->{
        item.Description = dto.Description
        item.ScheduleType = dto.Type
        item.ExposureValue = dto.ExposureValue
      })
    } else {
      dwelling.setCoverageConditionOrExclusionExists(pattern,false)
    }
  }

  /**
   * Returns a DTO representing the history of changes that were made in the policy change
   */
  override function toHistoryDTO(diff: DiffItem): PolicyChangeHistoryDTO {
    var dto = new PolicyChangeHistoryDTO()

    if (diff.Bean typeis Coverage) {
      var cov = diff.Bean as Coverage
      if (cov.PolicyLine.Pattern.Code != 'HomeownersLine_HOE') {
        return null;
      } else {
        mapCoverageHistory(diff, dto)
      }
    } else if (diff.Bean typeis PolicyAddlInterest) {
      var anItem = diff.Bean as PolicyAddlInterest
      var addlInterest = anItem.AdditionalInterestDetails.firstWhere(\elt -> elt typeis HODwellingAddlInt_HOE)
      if (addlInterest.AdditionalInterestType == typekey.AdditionalInterestType.TC_MORTGAGEE){
        dto.EntityType = "mortgagee"
        dto.ItemName = anItem.DisplayName
        dto.FixedId = addlInterest.FixedId.Value
        dto.EffectiveDate = anItem.EffectiveDate
      }
    } else if (diff.Bean typeis ScheduledItem_HOE) {
      var item = diff.Bean as ScheduledItem_HOE
      dto.EntityType = "scheduledProperty"
      dto.ItemName = item.Description
      dto.FixedId = item.FixedId.Value
    } else {
      return null
    }

    if (!dto.EntityType.Empty){
      if (diff.Add) {
        dto.Action = "added"
      } else if (diff.Remove) {
        dto.Action = "removed"
      } else if (diff.Property) {
        dto.Action = "changed"
      }
    }

    return dto.Action == null ? null : dto
  }

  private function mapCoverageHistory(diff: DiffItem, dto : PolicyChangeHistoryDTO) {
    var cov = diff.Bean as Coverage

    dto.EntityType = "coverage"
    dto.ItemName = diff.Bean.DisplayName.HasContent ? diff.Bean.DisplayName : cov.Pattern.DisplayName
    dto.FixedId = cov.FixedId.Value

    if(diff.Add){
      dto.Action = "added"
    } else if (diff.Remove){
      dto.Action = "removed"
    } else if (diff.Property){
      dto.Action = "changed"
    }

    if (cov.OwningCoverable == null) {
      dto.Action = null
    } else if (!(cov.OwningCoverable typeis PolicyLine)) {
      dto.ParentId = cov.OwningCoverable.FixedId.Value
    }
  }
}
