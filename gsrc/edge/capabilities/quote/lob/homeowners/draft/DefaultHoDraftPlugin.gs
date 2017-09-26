package edge.capabilities.quote.lob.homeowners.draft

uses edge.di.annotations.InjectableNode
uses edge.capabilities.quote.lob.ILobDraftPlugin
uses edge.capabilities.quote.lob.homeowners.draft.dto.HoDraftDataExtensionDTO
uses edge.capabilities.address.IAddressPlugin
uses gw.api.productmodel.QuestionSet
uses edge.capabilities.address.dto.AddressDTO
uses edge.capabilities.quote.lob.homeowners.draft.dto.ConstructionDTO
uses edge.capabilities.quote.lob.homeowners.draft.util.ConstructionUtil
uses edge.capabilities.quote.lob.homeowners.draft.util.YourHomeUtil
uses edge.capabilities.quote.lob.homeowners.draft.dto.YourHomeDTO
uses edge.capabilities.quote.lob.homeowners.draft.dto.RatingDTO
uses edge.capabilities.quote.lob.homeowners.draft.util.RatingUtil
uses edge.capabilities.quote.questionset.util.QuestionSetUtil
uses edge.PlatformSupport.Logger
uses edge.PlatformSupport.Reflection
uses edge.capabilities.policy.coverages.UNACoverageDTO
uses edge.capabilities.quote.lob.homeowners.draft.util.CoveragesUtil
uses edge.capabilities.quote.lob.homeowners.draft.dto.YourHomeProtectionDTO
uses edge.capabilities.quote.lob.homeowners.draft.util.YourHomeProtectionUtil
uses edge.capabilities.quote.draft.dto.AdditionalInsuredDTO
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.quote.lob.homeowners.draft.mappers.EdgePolicyContactMapper
uses edge.capabilities.quote.draft.dto.AdditionalNamedInsuredDTO
uses edge.capabilities.quote.draft.dto.TrustDTO
uses edge.capabilities.reports.dto.clue.PriorLossDTO
uses edge.capabilities.reports.dto.clue.ClaimPaymentDTO
uses edge.capabilities.policy.dto.PriorPolicyDTO
uses edge.capabilities.policy.util.PriorPolicyUtil
uses edge.capabilities.quote.quoting.util.QuoteUtil
uses gw.entity.ITypeList
uses gw.entity.TypeKey

class DefaultHoDraftPlugin implements ILobDraftPlugin<HoDraftDataExtensionDTO>{
  private final static var HO_QUESTION_SET_CODES = {"HO_PreQual_Ext", "HODwellingUWQuestions_Ext"}
  private final static var PORTAL_EXCLUSIONS_AND_CONDITIONS = {"HODW_PersonalPropertyExc_HOE_Ext",
                                                               "HODW_LossSettlement_HOE",
                                                               "HODW_CashSettlementWindOrHailRoofSurfacing_HOE",
                                                               "HODW_ReplaceCostCovAPaymentSched_HOE",
                                                               "HOLI_ActualCashValueLossSettlement_Ext",
                                                               "HODW_LossPayableClause_HOE"}
  final private static var _logger = new Logger(Reflection.getRelativeName(DefaultHoDraftPlugin))

  /** Plugin used to deal with addresses. */
  private var _addressPlugin : IAddressPlugin

  private var _accountContactPlugin : IAccountContactPlugin

  @InjectableNode
  @Param("addressPlugin", "Plugin used to deal with house addresses")
  @Param("contactPlugin", "Plugin used to deal with contact updates")
  construct(addressPlugin : IAddressPlugin, contactPlugin : IAccountContactPlugin) {
    this._addressPlugin = addressPlugin
    this._accountContactPlugin = contactPlugin
  }

  override function compatibleWithProduct(code: String): boolean {
    return code == "Homeowners"
  }

  override function updateNewDraftSubmission(period: PolicyPeriod, update: HoDraftDataExtensionDTO) {
    if (!period.HomeownersLine_HOEExists) {
      return
    }
    final var hoLine = period.HomeownersLine_HOE

    if(update.PolicyType != null) {
      hoLine.HOPolicyType = HOPolicyType_HOE.get(update.PolicyType)
    } else if(hoLine.HOPolicyType == null) {
      hoLine.HOPolicyType = HOPolicyType_HOE.TC_HO3
    }

    hoLine.Dwelling.setPolicyTypeAndDefaults()

//    QuestionSetUtil.update(hoLine, getLineQuestionSets(period), update.QuestionAnswers)
//    QuestionSetUtil.update(period, getPolicyQuestionSets(period), update.QuestionAnswers)
//CLM - Commenting out for now, the above lines add the answers if supplied
    hoLine.syncQuestions(getLineQuestionSets(period))
    period.syncQuestions(getPolicyQuestionSets(period))
    updateYourHome(hoLine.Dwelling, update.YourHome)
    updateYourHomeProtection(hoLine.Dwelling, update.YourHomeProtection)
    updatePriorPolicy(period,update.PriorPolicy)
    updateConstruction(hoLine.Dwelling, update.Construction)
    setHiddenConstructionFields(hoLine.Dwelling)
    updateRating(hoLine.Dwelling, update.Rating)
  }

  override function updateExistingDraftSubmission(period: PolicyPeriod, update: HoDraftDataExtensionDTO) {
    if (!period.HomeownersLine_HOEExists) {
      return
    }
    final var hoLine = period.HomeownersLine_HOE

    setQuoteFlood(period, update)

    hoLine.HOPolicyType = HOPolicyType_HOE.get(update.PolicyType)
    hoLine.Dwelling.setPolicyTypeAndDefaults()
    setHiddenConstructionFields(hoLine.Dwelling)

    final var dwelling = hoLine.Dwelling

    if(update.PolicyAddress != null) {
        _addressPlugin.updateFromDTO(period.PolicyAddress.Address, update.PolicyAddress)
        _addressPlugin.updateFromDTO(period.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AccountLocation, update.PolicyAddress)
    }

    var policyQuestionSets = getPolicyQuestionSets(period)
    QuestionSetUtil.update(period, policyQuestionSets, update.QuestionAnswers)
    updateYourHome(dwelling, update.YourHome)
    updateYourHomeProtection(dwelling, update.YourHomeProtection)
    updatePriorPolicy(period,update.PriorPolicy)
    updateConstruction(dwelling, update.Construction)
    updateCoverages(period, update)
    updateConditionsAndExclusions(period, update)
    updateAdditionalInsureds(period, update)
    updateAdditionalNamedInsureds(period, update)
    updateAdditionalInterests(period, update)
    updateTrusts(period, update)
    updatePriorLosses(period, update)
    updateRating(dwelling, update.Rating)
    updateAdditionalParameters(period, update)
  }

  override function toDraftDTO(period: PolicyPeriod): HoDraftDataExtensionDTO {
    final var hoLine = period.HomeownersLine_HOE
    if (hoLine == null) {
      return null
    }

    final var res = new HoDraftDataExtensionDTO()

    res.PolicyAddress = _addressPlugin.toDto(period.PolicyAddress.Address)
    var policyQuestionSets = getPolicyQuestionSets(period)
    res.QuestionAnswers = QuestionSetUtil.toAnswersDTO(policyQuestionSets, period)
    res.YourHome = toYourHomeDTO(hoLine.Dwelling)
    res.YourHomeProtection = toYourHomeProtectionDTO(hoLine.Dwelling)
    res.PriorPolicy = toPriorPolicyDTO(period)
    res.Construction = toConstructionDTO(hoLine.Dwelling)
    res.Rating = toRatingDTO(hoLine.Dwelling)
    res.ConditionsAndExclusions = toConditionsAndExclusionsDTO(period)
    res.AdditionalInsureds = toAdditionalInsuredsDTO(period)
    res.AdditionalInterests = toAdditionalInterestsDTO(period)
    res.AdditionalNamedInsureds = toAdditionalNamedInsuredsDTO(period)
    res.Trusts = toTrustDTOs(period)
    res.SelfReportedPriorLosses = toSelfReportPriorLosses(period)
    mapReturnedAdditionalParameters(period, res)

    return res
  }

  /** Question sets used for the DTO. */
  protected function getLineQuestionSets(period : PolicyPeriod) : QuestionSet[] {
    return {}
  }


  /** Policy-level question sets. */
  protected function getPolicyQuestionSets(period : PolicyPeriod) : QuestionSet[] {
    return period.Policy.Product.QuestionSets.where( \ questionSet -> HO_QUESTION_SET_CODES.containsIgnoreCase(questionSet.CodeIdentifier))
  }

  /**
   * Updates construction-related properties. Do nothing is <code>dto</code> is <code>null</code>.
   * <p>This implementation delegates all the work to ConstructionUtil.updateFrom
   */
  protected function updateConstruction(dwelling : Dwelling_HOE, dto : ConstructionDTO) {
    ConstructionUtil.updateFrom(dwelling, dto)
  }

  /**
   * Updates rating-related properties. Do nothing is <code>dto</code> is <code>null</code>.
   * <p>This implementation delegates all the work to RatingUtil.updateFrom
   */
  protected function updateRating(dwelling : Dwelling_HOE, dto : RatingDTO) {
    RatingUtil.updateFrom(dwelling, dto)
  }

  /**
   * Updates home related properties. Do nothing is <code>dto</code> is <code>null</code>.
   * <p>This implementation delegates all the work to DwellingUtil.updateFrom
   */
  protected function updateYourHome(dwelling : Dwelling_HOE, dto : YourHomeDTO) {
    YourHomeUtil.updateFrom(dwelling, dto)
  }


  /**
   * Updates home related protection properties. Do nothing is <code>dto</code> is <code>null</code>.
   * <p>This implementation delegates all the work to YourHomeProtectionUtil
   */
  protected function updateYourHomeProtection(dwelling : Dwelling_HOE, dto : YourHomeProtectionDTO) {
    YourHomeProtectionUtil.updateFrom(dwelling, dto)
  }

  protected function updatePriorPolicy(policyPeriod : PolicyPeriod, dto : PriorPolicyDTO){
    PriorPolicyUtil.updateFrom(policyPeriod,dto)
  }

  /**
   * Sets a construction fields hidden from a customer but required by the quoting process. This implementation sets
   * following fields: <ul>
   *   <li>WindClass to "Ordinary Construction"</li>
   *   <li>Construction Classification Code to "1"</li>
   * </ul>
   */
  protected function setHiddenConstructionFields(dwelling : Dwelling_HOE) {
    dwelling.WindClass = WindRating.get("ord")
    dwelling.ConstructionCode = "1"
  }


  /**
   * Converts dwelling into the construction DTO (if it is applicable at a given stage).
   * <p>This implementation
   * calls ConstructionUtil.fillBaseProperties on a DTO object if YearBuilt property is set on the dwelling.
   */
  protected function toConstructionDTO(dwelling : Dwelling_HOE) : ConstructionDTO {
    if (dwelling.YearBuilt == null) {
      return null
    }

    final var res = new ConstructionDTO()
    ConstructionUtil.fillBaseProperties(res, dwelling)
    return res
  }

  /**
   * Converts dwelling into the rating DTO (if it is applicable at a given stage).
   * <p>This implementation
   * calls RatingUtil.fillBaseProperties on a DTO object if FireExtinguishers property is set on the dwelling.
   */
  protected function toRatingDTO(dwelling : Dwelling_HOE) : RatingDTO {
    /*if (dwelling.FireExtinguishers == null) {
      return null
    }*/

    final var res = new RatingDTO()
    RatingUtil.fillBaseProperties(res, dwelling)
    return res
  }

  protected function toConditionsAndExclusionsDTO(period : PolicyPeriod) : List<String>{
    var results : List<String> = {}

    PORTAL_EXCLUSIONS_AND_CONDITIONS.each( \ conditionOrExclusion -> {
      if(period.HomeownersLine_HOE.CoveragesConditionsAndExclusionsFromCoverable*.Pattern*.CodeIdentifier?.containsIgnoreCase(conditionOrExclusion)){
        results.add(conditionOrExclusion)
      }
    })

    return results
  }

  /**
   * Converts YourHome / Location into the YourHome DTO (if it is applicable at a given stage).
   * <p>This implementation
   * calls DwellingUtil.fillBaseProperties on a DTO object.
   */
  protected function toYourHomeDTO(dwelling : Dwelling_HOE) : YourHomeDTO {
    if (dwelling.ReplacementCost == null){
      return null
    }

    final var res = new YourHomeDTO()
    YourHomeUtil.fillBaseProperties(res, dwelling)
    return res
  }

  protected function toYourHomeProtectionDTO(dwelling : Dwelling_HOE) : YourHomeProtectionDTO {
    final var res = new YourHomeProtectionDTO()
    YourHomeProtectionUtil.fillBaseProperties(res, dwelling)
    return res
  }

  protected function toPriorPolicyDTO(policyPeriod : PolicyPeriod) : PriorPolicyDTO{
    return PriorPolicyUtil.fillBaseProperties(policyPeriod)
  }

  /**
   * Updates a contact address (but not a policy) address on the submission. If address is shared between policy and
   * account holder, then this address is unlinked.
   */
  protected function updateContactAddress(period : PolicyPeriod, update : AddressDTO) {
    final var hoAddress = getNonPolicyAccountHolderAddress(period)
    _addressPlugin.updateFromDTO(hoAddress, update)
  }


  /**
   * Returns a non-policy policyholder address. In other words, returned address _is_ primary insured's address but
   * this address instance is not used as a policy address (changes in returned address would not affect policy address).
   */
  protected function getNonPolicyAccountHolderAddress(period: PolicyPeriod): Address {
    final var policyOwnerAddress = period.Policy.Account.AccountHolderContact.PrimaryAddress as Address
    if (policyOwnerAddress !== period.PolicyAddress.Address) {
      return policyOwnerAddress
    }
    _logger.logInfo("Address cloned")

    final var clonedAddress = policyOwnerAddress.copy() as Address
    period.Policy.Account.AccountHolderContact.PrimaryAddress = clonedAddress
    return clonedAddress
  }

  private function updateCoverages(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    CoveragesUtil.initCoverages(period)
    CoveragesUtil.updateFrom(period, update.Coverages)
  }

  private function updateConditionsAndExclusions(period: PolicyPeriod, update: HoDraftDataExtensionDTO){
      period.AllCoverables.each(\ coverable -> {
        coverable.syncExclusions()
        coverable.syncConditions()
      })

      PORTAL_EXCLUSIONS_AND_CONDITIONS.each( \ conditionOrExclusion -> {
        if(update.ConditionsAndExclusions?.containsIgnoreCase(conditionOrExclusion)){
          if(period.HomeownersLine_HOE.isCoverageConditionOrExclusionAvailable(conditionOrExclusion) and !period.HomeownersLine_HOE.hasCoverageConditionOrExclusion(conditionOrExclusion)){
            period.HomeownersLine_HOE.createCoverageConditionOrExclusion(conditionOrExclusion)
          }
        }else{
          period.AllExclusionsConditionsAndCoverages?.atMostOneWhere( \ elt -> elt.Pattern.CodeIdentifier?.equalsIgnoreCase(conditionOrExclusion))?.remove()
        }
      })
  }

  private function updateAdditionalInsureds(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    new EdgePolicyContactMapper<PolicyAddlInsured, AdditionalInsuredDTO >(_accountContactPlugin).updateFrom(period, update.AdditionalInsureds?.toList())
  }

  private function toAdditionalInsuredsDTO(period : PolicyPeriod) : AdditionalInsuredDTO []{
    return new EdgePolicyContactMapper<PolicyAddlInsured, AdditionalInsuredDTO >(_accountContactPlugin).fillBaseProperties(period)
  }

  private function updateAdditionalNamedInsureds(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    new EdgePolicyContactMapper<PolicyAddlNamedInsured, AdditionalNamedInsuredDTO >(_accountContactPlugin).updateFrom(period, update.AdditionalNamedInsureds?.toList())
  }

  private function toAdditionalNamedInsuredsDTO(period : PolicyPeriod) : AdditionalNamedInsuredDTO []{
    return new EdgePolicyContactMapper<PolicyAddlNamedInsured, AdditionalNamedInsuredDTO >(_accountContactPlugin).fillBaseProperties(period)
  }

  private function updateAdditionalInterests(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    new EdgePolicyContactMapper<PolicyAddlInterest, DwellingAdditionalInterestDTO>(_accountContactPlugin).updateFrom(period, update.AdditionalInterests?.toList())
  }

  private function toAdditionalInterestsDTO(period : PolicyPeriod) : DwellingAdditionalInterestDTO[]{
    return new EdgePolicyContactMapper<PolicyAddlInterest, DwellingAdditionalInterestDTO>(_accountContactPlugin).fillBaseProperties(period)
  }

  private function updateTrusts(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    if(update != null){
      var trustEntities = period.TrustResidings?.orderBy(\ trust -> trust.PortalIndex)
      var trustDTOs = update.Trusts
      var entityCount = trustEntities.Count
      var dtoCount = trustDTOs.Count

      if(dtoCount > entityCount){
        for(i in entityCount..dtoCount - 1){
          var trust = new HOTrustResiding_Ext(period)
          trust.PortalIndex = (trustEntities.last().PortalIndex == null ? 0 : trustEntities.last().PortalIndex + 1)
        }
      }else if(dtoCount < entityCount){
        for(i in dtoCount..entityCount - 1){
          trustEntities[i].remove()
        }
      }

      trustEntities = period.TrustResidings?.orderBy(\ trust -> trust.PortalIndex)

      trustDTOs?.eachWithIndex( \ dto, i -> {
        updateTrust(trustEntities[i], dto)
      })

      //renumber portal indices after updating
      var newIndex = 0
      trustEntities.each( \ trust -> {
        trust.PortalIndex = newIndex
        newIndex++
      })
    }
  }

  private function toTrustDTOs(period : PolicyPeriod) : TrustDTO[]{
    var results : List<TrustDTO> = {}

    period.TrustResidings.each( \ trust -> {
      var dto = new TrustDTO()
      dto.IsTrustTypeLivingAndRevocable = trust.TypeOfTrustRevocable
      dto.NameOfBeneficiary = trust.NameOfBeneficiary
      dto.NameOfGrantor = trust.NameOfGrantor
      dto.IsPartyToTrustACorporation = !trust.IsPerson
      //TODO tlv this is where we will map other fields for trusts and for the address.  There is a CR for this

      results.add(dto)
    })

    return results
  }

  private function toSelfReportPriorLosses(period : PolicyPeriod) : PriorLossDTO[]{
    var results : List<PriorLossDTO> = {}

    period.HomeownersLine_HOE.HOPriorLosses_Ext?.where( \ priorLoss -> priorLoss.Source == TC_INSURED)
                                               ?.each( \ priorLoss -> {
      var lossDTO = new PriorLossDTO()
      lossDTO.Source = priorLoss.Source
      lossDTO.Status = priorLoss.ClaimStatus
      lossDTO.DateOfLoss = priorLoss.ReportedDate

      if(priorLoss.ClaimPayment.HasElements){
        //we assume only one claim payment since that's how Portal processes the two fields we are setting (lives at the prior loss level)
        lossDTO.ClaimPayments = {new ClaimPaymentDTO(){:Amount = priorLoss.ClaimPayment.first().ClaimAmount, :LossCause = priorLoss.ClaimPayment.first().LossCause_Ext}}
      }

      results.add(lossDTO)
    })

    return results
  }

  private function updateTrust(trustEntity : HOTrustResiding_Ext, trustDTO : TrustDTO){
    trustEntity.TrustResident = trustDTO.TrustResident
    trustEntity.IsPerson = !trustDTO.IsPartyToTrustACorporation
    trustEntity.NameOfBeneficiary = trustDTO.NameOfBeneficiary
    trustEntity.NameOfGrantor = trustDTO.NameOfGrantor
    trustEntity.TypeOfTrustRevocable = trustDTO.IsTrustTypeLivingAndRevocable
    //TODO tlv this is where we'll add an address - i think there is a CR for this.
  }

  private function updatePriorLosses(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    if(update != null){
      //losses need to be added to current bundle because of the soft relationship between losses and HOLine
      //remove all and re-add all user-reported losses
      var lossEntities = period.HomeownersLine_HOE.HOPriorLosses_Ext.where( \ priorLoss -> priorLoss.Source == TC_INSURED)

      lossEntities?.each( \ loss -> {edge.PlatformSupport.Bundle.getCurrent().add(loss)
        loss.remove()
      })


      update.SelfReportedPriorLosses?.each( \ dto -> {
        var entityLoss = new HOPriorLoss_Ext(period)
        period.HomeownersLine_HOE.addToHOPriorLosses_Ext(entityLoss)
        updatePriorLoss(entityLoss, dto)
      })
    }
  }

  private function updatePriorLoss(priorLoss : HOPriorLoss_Ext, dto : PriorLossDTO){
    priorLoss.ClaimDesc = dto.Description
    priorLoss.ClaimStatus = dto.Status
    priorLoss.ReportedDate = dto.DateOfLoss
    priorLoss.LocationOfLoss = dto.LossLocation
    priorLoss.Source = TC_INSURED

    //clear and then re-populate.  would only ever truly expect one from portal since fields are up one level.
    //leaving fields at this level for consistency sake with our data model
    priorLoss.ClaimPayment?.each( \ entityPayment -> entityPayment?.remove())

    dto.ClaimPayments?.each( \ dtoPayment -> {
      var newPayment = new ClaimPayment_Ext(priorLoss)
      newPayment.ClaimAmount = dtoPayment.Amount
      newPayment.LossCause_Ext = dtoPayment.LossCause

      priorLoss.addToClaimPayment(newPayment)
    })
  }

  private function updateAdditionalParameters(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    if(update != null){
      period.Policy.Account.OwnershipInterestLLC_Ext = update.AreAllOwnershipInterestsLLCs
      period.Policy.Account.UnderCommonOwnership_Ext = update.PropertiesUnderCommonOwnership
      period.Policy.Account.OccupyPrimaryResidence_Ext = update.IsDwellingOccupiedAsPrimaryResidenceByAllOwners
      period.Policy.Account.AccountOrgType = update.OwnershipEntityType
      period.Policy.Account.OtherOrgTypeDescription = update.OwnershipEntityTypeOtherDescription
      if(period.CreditInfoExt == null){
        period.CreditInfoExt = new CreditInfoExt(period)

      }

      period.CreditInfoExt.CreditLevel = update.CreditLevel
      period.Submission.PortalSubmissionContext.IsPortalRequest = update.IsPortalRequest
      period.includedPerilsCovered_Ext = update.SelectedPeril
    }
  }

  private function mapReturnedAdditionalParameters(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    if(update != null){
      update.PropertiesUnderCommonOwnership = period.Policy.Account.UnderCommonOwnership_Ext
      update.AreAllOwnershipInterestsLLCs = period.Policy.Account.OwnershipInterestLLC_Ext
      update.IsDwellingOccupiedAsPrimaryResidenceByAllOwners = period.Policy.Account.OccupyPrimaryResidence_Ext
      update.OwnershipEntityType = period.Policy.Account.AccountOrgType
      update.OwnershipEntityTypeOtherDescription = period.Policy.Account.OtherOrgTypeDescription
      update.CreditLevel = period.CreditInfoExt.CreditLevel
      update.SelectedPeril = period.includedPerilsCovered_Ext
    }
  }

  private function setQuoteFlood(period: PolicyPeriod, hoDraftData : HoDraftDataExtensionDTO) {

    if(hoDraftData.FloodDefaults == null) {
      return
    }

    var floodZoneChanged = getTunaValue(FloodZoneOverridden_Ext, hoDraftData.YourHome.FloodZone.Value as String) != period.HomeownersLine_HOE.Dwelling.FloodZoneOrOverride
    var postalCodeChanged = !hoDraftData.PolicyAddress.PostalCode?.equalsIgnoreCase(period.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode)
    var countyChanged = !hoDraftData.PolicyAddress.County?.equalsIgnoreCase(period.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.County)
    var bodyOfWaterChanged = getTunaValue(DistBOWOverridden_Ext, hoDraftData.YourHome.DistanceToBodyOfWater.Value as String) != period.HomeownersLine_HOE.Dwelling.HOLocation.DistBOW_Ext
    var distanceToCoastChanged = getTunaValue(DistToCoastOverridden_Ext, hoDraftData.YourHome.DistanceToCoast.Value as String) != period.HomeownersLine_HOE.Dwelling.HOLocation.DistToCoast_Ext

    period.Submission.PortalSubmissionContext.QuoteFlood  = floodZoneChanged or postalCodeChanged or countyChanged or bodyOfWaterChanged or distanceToCoastChanged
  }

  public static function getTunaValue(typeList : ITypeList, alias : String) : TypeKey{
    var result : TypeKey

    if(alias != null){
      var internalCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getInternalCodeByAlias(typeList.RelativeName, "tuna", alias)

      if(internalCode == null){
        result = typeList.getTypeKey(alias)
      }else{
        result = typeList.getTypeKey(internalCode)
      }
    }

    return result
  }
}
