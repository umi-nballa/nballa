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
uses edge.capabilities.quote.draft.dto.AdditionalInsuredDTO
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.quote.lob.homeowners.draft.mappers.EdgePolicyContactMapper
uses java.lang.Integer
uses edge.capabilities.quote.draft.dto.AdditionalNamedInsuredDTO

class DefaultHoDraftPlugin implements ILobDraftPlugin<HoDraftDataExtensionDTO>{
  private final static var HO_QUESTION_SET_CODES = {"HO_PreQual_Ext", "HODwellingUWQuestions_Ext"}
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

    updateConstruction(hoLine.Dwelling, update.Construction)
    setHiddenConstructionFields(hoLine.Dwelling)
    updateCoverages(period, update)
    synchronizeConditionsAndExclusions(period, update)
    updateAdditionalInsureds(period, update)
    updateAdditionalNamedInsureds(period, update)
    updateAdditionalInterests(period, update)
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

    if(update.PolicyAddress != null) {
        _addressPlugin.updateFromDTO(period.PolicyAddress.Address, update.PolicyAddress)
      }

    var policyQuestionSets = getPolicyQuestionSets(period)
    QuestionSetUtil.update(period, policyQuestionSets, update.QuestionAnswers)
    updateYourHome(dwelling, update.YourHome)
    updateConstruction(dwelling, update.Construction)
    updateCoverages(period, update)
    synchronizeConditionsAndExclusions(period, update)
    updateAdditionalInsureds(period, update)
    updateAdditionalNamedInsureds(period, update)
    updateAdditionalInterests(period, update)
    updateRating(dwelling, update.Rating)
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
    res.Construction = toConstructionDTO(hoLine.Dwelling)
    res.Rating = toRatingDTO(hoLine.Dwelling)
    res.Coverages = toCoveragesDTO(hoLine)
    res.AdditionalInsureds = toAdditionalInsuredsDTO(period)
    res.AdditionalInterests = toAdditionalInterestsDTO(period)
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

  protected function toCoveragesDTO(hoLine : HomeownersLine_HOE) : UNACoverageDTO[]{
    return CoveragesUtil.fillBaseProperties(hoLine.Branch)
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

  private function updateCoverages(period : PolicyPeriod, update : HoDraftDataExtensionDTO){
    CoveragesUtil.initCoverages(period)
    CoveragesUtil.updateFrom(period, update.Coverages)
  }

  private function synchronizeConditionsAndExclusions(period: PolicyPeriod, update: HoDraftDataExtensionDTO){
    period.AllCoverables.each(\ coverable -> {
      coverable.syncExclusions()
      coverable.syncConditions()
    })

    if(update.ExcludePersonalProperty){
      if(!period.HomeownersLine_HOE.hasExclusion("HODW_PersonalPropertyExc_HOE_Ext")){
        period.HomeownersLine_HOE.createExclusion("HODW_PersonalPropertyExc_HOE_Ext")
      }
    }else{
      period.AllExclusions.removeWhere( \ exclusion -> exclusion.PatternCode.equalsIgnoreCase("HODW_PersonalPropertyExc_HOE_Ext"))
    }
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
}
