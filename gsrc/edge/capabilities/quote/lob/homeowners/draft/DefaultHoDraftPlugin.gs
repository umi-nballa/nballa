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
uses edge.capabilities.quote.coverage.util.CoverageUtil
uses edge.capabilities.quote.coverage.dto.CoverageDTO
uses edge.capabilities.quote.coverage.util.TermUtil
uses edge.capabilities.quote.coverage.dto.TermDTO
uses edge.capabilities.quote.lob.homeowners.draft.dto.RatingDTO
uses edge.capabilities.quote.lob.homeowners.draft.util.RatingUtil
uses edge.capabilities.quote.questionset.util.QuestionSetUtil
uses edge.PlatformSupport.Logger
uses edge.PlatformSupport.Reflection

class DefaultHoDraftPlugin implements ILobDraftPlugin<HoDraftDataExtensionDTO>{

  final private static var _logger = new Logger(Reflection.getRelativeName(DefaultHoDraftPlugin))

  /** Plugin used to deal with addresses. */
  private var _addressPlugin : IAddressPlugin

  @InjectableNode
  @Param("addressPlugin", "Plugin used to deal with house addresses")
  construct(addressPlugin : IAddressPlugin) {
    this._addressPlugin = addressPlugin
  }

  override function compatibleWithProduct(code: String): boolean {
    return code == "Homeowners"
  }


  override function updateNewDraftSubmission(period: PolicyPeriod, update: HoDraftDataExtensionDTO) {
    if (!period.HomeownersLine_HOEExists) {
      return
    }
    final var hoLine = period.HomeownersLine_HOE
    hoLine.HOPolicyType = HOPolicyType_HOE.TC_HO3
    hoLine.Dwelling.setPolicyTypeAndDefaults()

    hoLine.syncQuestions(getLineQuestionSets(period))
    period.syncQuestions(getPolicyQuestionSets(period))

    updateConstruction(hoLine.Dwelling, update.Construction)
    setHiddenConstructionFields(hoLine.Dwelling)

    updateRating(hoLine.Dwelling, update.Rating)
  }



  override function updateExistingDraftSubmission(period: PolicyPeriod, update: HoDraftDataExtensionDTO) {
    if (!period.HomeownersLine_HOEExists) {
      return
    }
    final var hoLine = period.HomeownersLine_HOE
    if(hoLine.HOPolicyType == null){

      hoLine.HOPolicyType = HOPolicyType_HOE.TC_HO3
      hoLine.Dwelling.setPolicyTypeAndDefaults()
      setHiddenConstructionFields(hoLine.Dwelling)
    }

    final var dwelling = hoLine.Dwelling

    _addressPlugin.updateFromDTO(period.PolicyAddress.Address, update.PolicyAddress)
    QuestionSetUtil.update(hoLine, getLineQuestionSets(period), update.PreQualQuestionSets)
    QuestionSetUtil.update(period, getPolicyQuestionSets(period), update.PreQualQuestionSets)
    updateYourHome(dwelling, update.YourHome)
    updateConstruction(dwelling, update.Construction)
    updateRating(dwelling, update.Rating)
  }



  override function toDraftDTO(period: PolicyPeriod): HoDraftDataExtensionDTO {
    final var hoLine = period.HomeownersLine_HOE
    if (hoLine == null) {
      return null
    }

    final var res = new HoDraftDataExtensionDTO()

    res.PolicyAddress = _addressPlugin.toDto(period.PolicyAddress.Address)
    res.PreQualQuestionSets = QuestionSetUtil.toAnswersDTO(getLineQuestionSets(period).concat(getPolicyQuestionSets(period)), period)
    res.YourHome = toYourHomeDTO(hoLine.Dwelling)
    res.Construction = toConstructionDTO(hoLine.Dwelling)
    res.Rating = toRatingDTO(hoLine.Dwelling)
    return res
  }

  /** Question sets used for the DTO. */
  protected function getLineQuestionSets(period : PolicyPeriod) : QuestionSet[] {
    return {}
  }


  /** Policy-level question sets. */
  protected function getPolicyQuestionSets(period : PolicyPeriod) : QuestionSet[] {
    return {QuestionSetUtil.getByCode("HOGAGenericPreQual_HOE")}
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
}
