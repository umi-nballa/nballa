package edge.capabilities.quote.lob.homeowners.quoting

uses edge.capabilities.quote.lob.ILobQuotingPlugin
uses edge.capabilities.quote.lob.homeowners.quoting.dto.HOPremiumCostsDTO
uses edge.capabilities.quote.lob.homeowners.quoting.dto.ScheduledPropertyDTO
uses edge.di.annotations.InjectableNode
uses edge.capabilities.quote.coverage.util.CoverageUtil
uses gw.api.productmodel.CoveragePattern
uses gw.pl.currency.MonetaryAmount
uses edge.util.helper.CurrencyOpUtil
uses edge.capabilities.quote.coverage.dto.CoverageDTO
uses edge.capabilities.currency.dto.AmountDTO
uses java.util.ArrayList
uses java.lang.IllegalArgumentException
uses java.util.Collection
uses edge.util.mapping.ArrayUpdater
uses edge.security.authorization.IAuthorizerProviderPlugin
uses edge.util.mapping.Mapper
uses una.pageprocess.QuoteScreenPCFController
uses edge.capabilities.policy.coverages.UNACoverageDTO
uses edge.capabilities.quote.lob.homeowners.draft.util.CoveragesUtil
uses edge.capabilities.quote.lob.homeowners.quoting.dto.AdditionalChargeDTO
uses java.math.BigDecimal
uses edge.capabilities.quote.quoting.util.QuoteUtil

class HoQuotingPlugin implements ILobQuotingPlugin < HOPremiumCostsDTO > {
  // Coverage codes contributing to the base premium
  static var baseCoverageCodes = {
      "HODW_SectionI_Ded_HOE",
      "HODW_Dwelling_Cov_HOE",
      "HODW_Other_Structures_HOE",
      "HODW_Personal_Property_HOE",
      "HODW_Loss_Of_Use_HOE",
      "HOLI_Personal_Liability_HOE",
      "HOLI_Med_Pay_HOE",
      "DPDW_Dwelling_Cov_HOE",
      "DPDW_Other_Structures_HOE",
      "DPDW_Personal_Property_HOE",
      "DPDW_FairRentalValue_Ext",
      "DPDW_Additional_Living_Exp_HOE",
      "HODW_LateWildlifeClaimReporting_Ext",
      "DPLI_Personal_Liability_HOE",
      "DPLI_Med_Pay_HOE",
      "DPLI_Premise_Liability_HOE_Ext"
  }

  // Categories for used coverages
  static var categories = {
      "HODW_SectionI_HOE",
      "HODW_SectionII_HOE",
      "HOLI_Additional_HOE",
      "HODW_Additional_HOE",
      "DPDW_LiabilityCoverages_HOE",
      "HODW_AdditionalScheduled_HOE_Ext",
      "HOSL_AdditionalSchedLiab_HOE_Ext",
      "HOLI_Optional_HOE",
      "HODW_Optional_HOE",
      "HODW_SchedulesCov_HOE",
      "HODW_SchedLiabCov_HOE_Ext"
  }

  var _schedulePropertyUpdater : ArrayUpdater<Dwelling_HOE,ScheduledItem_HOE,ScheduledPropertyDTO>
  var _schedulePropertyMapper : Mapper;

  @InjectableNode
  construct(authzProvider:IAuthorizerProviderPlugin) {
    _schedulePropertyUpdater = new ArrayUpdater<Dwelling_HOE,ScheduledItem_HOE,ScheduledPropertyDTO>(authzProvider) {
      : ToCreateAndAdd = \ dwelling, dto -> dwelling.createAndAddScheduledItem(dwelling.HODW_ScheduledProperty_HOE.Pattern.Code),
      : ToRemove = \ dwelling, e -> dwelling.HODW_ScheduledProperty_HOE.removeScheduledItem(e),
      : ToAdd = \ dwelling, e -> dwelling.HODW_ScheduledProperty_HOE.addScheduledItem(e),
      : DtoKey = \ dto -> dto.FixedId,
      : EntityKey = \ e -> e.FixedId.toString()
    }
    _schedulePropertyMapper = new Mapper(authzProvider)

  }

  override function getQuoteDetails(pp: PolicyPeriod): HOPremiumCostsDTO {
    if (!pp.HomeownersLine_HOEExists) {
      return null
    }

    final var hoeLine = pp.HomeownersLine_HOE

    final var res = new HOPremiumCostsDTO ()
    res.BaseCoverages = getBaseCoverages(hoeLine)
    res.AdditionalCoverages = getAdditionalCoverages(hoeLine)
    res.DiscountsAndSurcharges = getDiscountsAndSurcharges(hoeLine)
    res.Fees = getFees(hoeLine)
    res.FloodPremium = pp.Submission.Periods.atMostOneWhere( \ floodVersion ->
                                                               floodVersion.BranchName ==  QuoteUtil.HO_FLOOD_BRANCH_NAME)
                                            .HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.Cost.ActualAmount.Amount
    return res
  }

  override function updateCustomQuote(pp: PolicyPeriod, update: HOPremiumCostsDTO) {
    if (!pp.HomeownersLine_HOEExists) {
      return
    }

    final var hoeLine = pp.HomeownersLine_HOE
    var allPatterns = getAllCoveragePatterns(hoeLine)
    var baseCoverages = selectBaseCoverages(allPatterns).toTypedArray()
    var additionalCoverages = selectAdditionalCoverages(allPatterns).toTypedArray()

    updateScheduledProperties(hoeLine.Dwelling, update.ScheduledProperties)
  }

  /**
   * Returns all the coverage patterns available for the Homeowners line
   */
  protected function getAllCoveragePatterns(hoeLine:HomeownersLine_HOE) : Collection<CoveragePattern> {
    return categories.flatMap(\code -> {
      var lineCoverages = hoeLine.Pattern.getCoverageCategory(code).coveragePatternsForEntity(HomeownersLine_HOE)
      var dwellingCoverages = hoeLine.Pattern.getCoverageCategory(code).coveragePatternsForEntity(Dwelling_HOE)
      return lineCoverages.concat(dwellingCoverages).toList()
    }).where(\pattern -> findCoverable(hoeLine, pattern).hasCoverage(pattern))
  }

  override function generateVariants(base: PolicyPeriod) {
    if (!base.HomeownersLine_HOEExists) {
      return
    }

    var newPeriod = base.createDraftMultiVersionJobBranch()
    newPeriod.BranchName = "BASE"
  }

  /**
   * Filters base coverages from a list of coverage patterns
   */
  protected function selectBaseCoverages(allPatterns:Collection<CoveragePattern>):Collection<CoveragePattern>{
    return allPatterns
        .where(\pattern -> baseCoverageCodes.hasMatch(\code -> code == pattern.Code))
  }

  /**
   * Filters additional coverages from a list of coverage patterns
   */
  protected function selectAdditionalCoverages(allPatterns:Collection<CoveragePattern>):Collection<CoveragePattern>{
    return allPatterns
        .where(\pattern -> !baseCoverageCodes.hasMatch(\code -> code == pattern.Code))
  }

  /**
   * Returns the cost associated to a given coverage
   */
  protected function costOfCoverage(cov: Coverage): AmountDTO {
    var cost : MonetaryAmount
    if ( cov typeis HomeownersLineCov_HOE ) {
      return AmountDTO.fromMonetaryAmount(CurrencyOpUtil.sumArray(cov.Costs))
    } else if ( cov typeis DwellingCov_HOE ){
      return AmountDTO.fromMonetaryAmount(CurrencyOpUtil.sumArray(cov.Costs))
    } else {
      throw new IllegalArgumentException("Only homeowners and dwelling coverages supported")
    }
  }

  /**
   * Computes the base premium
   */
  protected function basePremium(hoeLine: HomeownersLine_HOE): MonetaryAmount {
    return hoeLine.VersionList.HomeownersCosts.where(\cvl -> cvl.AllVersions.first() typeis HomeownersBaseCost_HOE).flatMap(\h -> h.AllVersions)
        .map(\c -> c.ActualAmount)
        .sum()
  }

  /**
   * Helper function to get the coverable from a coverage pattern
   */
  static function findCoverable(hoe: HomeownersLine_HOE, pattern: CoveragePattern): Coverable {
    if (pattern.OwningEntityType == HomeownersLine_HOE.Type.RelativeName) {
      return hoe
    } else if (pattern.OwningEntityType == Dwelling_HOE.Type.RelativeName) {
      return hoe.Dwelling
    } else {
      throw new IllegalArgumentException("pattern must be a HomeownersLine pattern")
    }
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

  function getBaseCoverages(hoeLine : HomeownersLine_HOE) : UNACoverageDTO[]{
    var results : List<UNACoverageDTO> = {}

    var baseCoveragePatterns = selectBaseCoverages(getAllCoveragePatterns(hoeLine))

    baseCoveragePatterns?.each( \ baseCoveragePattern -> {
      var baseCoverageEntity = findCoverable(hoeLine, baseCoveragePattern).getCoverage(baseCoveragePattern)
      results.add(CoveragesUtil.fillBaseProperties(baseCoverageEntity))
    })

    return results.toTypedArray()
  }

  function getAdditionalCoverages(hoeLine : HomeownersLine_HOE) : UNACoverageDTO[]{
    var results : List<UNACoverageDTO> = {}

    var allPatterns = getAllCoveragePatterns(hoeLine)
    var baseCoveragePatterns = selectBaseCoverages(allPatterns)
    var additionalCoveragePatterns = allPatterns?.where( \ pattern -> !baseCoveragePatterns.contains(pattern))

    additionalCoveragePatterns?.each( \ addlCoveragePattern -> {
      var additionalCoverageEntity = findCoverable(hoeLine, addlCoveragePattern).getCoverage(addlCoveragePattern)

      if(additionalCoverageEntity != null){
        results.add(CoveragesUtil.fillBaseProperties(additionalCoverageEntity))
      }
    })


    return results.toTypedArray()
  }

  function getDiscountsAndSurcharges(hoeLine : HomeownersLine_HOE) : List<AdditionalChargeDTO>{
    var results : List<AdditionalChargeDTO> = {}

    var otherCosts = (hoeLine.HomeownersCosts.whereTypeIs(HomeownersLineCost_EXT).where( \ cost -> cost.HOCostType != null and !typekey.HOCostType_Ext.TF_SECTIONIDEDCOSTS.TypeKeys.contains(cost.HOCostType))) as List<entity.HomeownersLineCost_EXT>

    otherCosts?.where( \ otherCost -> otherCost.ActualTermAmount.Amount != BigDecimal.ZERO)
        ?.each( \ otherCost -> {
      var discountOrSurcharge = new AdditionalChargeDTO ()
      discountOrSurcharge.Name = otherCost.HOCostType.Description
      discountOrSurcharge.Amount = otherCost.ActualTermAmount.Amount

      results.add(discountOrSurcharge)
    })

    return results
  }

  function getFees(hoeLine: HomeownersLine_HOE) : List<AdditionalChargeDTO>{
    var results : List<AdditionalChargeDTO>= {}

    var feeCosts = hoeLine.HomeownersCosts.whereTypeIs(HOTaxCost_HOE) as List<entity.HOTaxCost_HOE>

    feeCosts?.each( \ fee -> {
      var feeDTO = new AdditionalChargeDTO()
      feeDTO.Amount = fee.ActualTermAmount.Amount
      feeDTO.Name = fee.ChargePattern.Description
      results.add(feeDTO)
    })

    return results
  }
}
