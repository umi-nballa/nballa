package una.rating.bp7

uses gw.lob.bp7.rating.BP7BuildingStep
uses gw.lob.bp7.rating.BP7ClassificationStep
uses gw.lob.bp7.rating.BP7RateRoutineExecutor
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses una.rating.bp7.common.BP7LineStep
uses una.rating.bp7.ratinginfos.BP7ClassificationRatingInfo
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses una.rating.bp7.ratinginfos.BP7LineRatingInfo
uses una.rating.bp7.ratinginfos.BP7StructureRatingInfo
uses una.rating.bp7.ratinginfos.BP7BuildingRatingInfo
uses una.rating.bp7.ratinginfos.BP7BusinessPersonalPropertyRatingInfo
uses una.rating.bp7.common.BP7LocationStep
uses una.rating.bp7.ratinginfos.BP7LocationRatingInfo
uses una.rating.bp7.util.RateFactorUtil
uses gw.lob.bp7.rating.BP7LineCovCostData
uses gw.rating.CostData
uses java.math.BigDecimal
uses java.util.Map
uses gw.lob.bp7.rating.BP7TaxCostData_Ext
uses una.rating.bp7.common.BP7RateRoutineNames
uses gw.rating.rtm.query.RateBookQueryFilter
uses gw.job.RenewalProcess
uses gw.rating.rtm.query.RatingQueryFacade
uses gw.lob.bp7.rating.BP7LineCostData_Ext

/**
*  Class which extends the bp7 abstract rating engine and implements the rating for all the available BP7 coverages
 */
class UNABP7RatingEngine extends UNABP7AbstractRatingEngine<BP7Line> {

  var _executor: BP7RateRoutineExecutor
  final static var _logger = UnaLoggerCategory.UNA_RATING
  var _buildingForLineCov : BP7Building as BuildingForLineCov
  construct(line: BP7Line) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: BP7Line, minimumRatingLevel: RateBookStatus) {
    super(line)
    _logger.info("Initializing the " + line.BaseState.Code + " BOP Rating Engine")
    MinimumRatingLevel = minimumRatingLevel
    _executor = new BP7RateRoutineExecutor(ReferenceDatePlugin, PolicyLine, minimumRatingLevel)
    _buildingForLineCov = RateFactorUtil.getFirstBuildingInPrimaryLocation(PolicyLine)
    BP7RatingInfo = new BP7RatingInfo(line)
    TotalAnnualPremiumBeforeActualIRPM = 0.0
    _logger.info(line.BaseState.Code + " BOP Rating Engine initialized")
  }

  /**
  * function which rates all the selected line coverages
   */
  override function rateLineCoverage(lineCov: BP7LineCov, sliceToRate: DateRange) {
    var lineRatingInfo = new BP7LineRatingInfo(lineCov)
    var step = new BP7LineStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, BP7RatingInfo, lineRatingInfo)
    BP7RatingInfo.NetAdjustmentFactor = RateFactorUtil.setNetAdjustmentFactor(PolicyLine, MinimumRatingLevel, _buildingForLineCov)
    switch(lineCov.Pattern){
      case "IdentityRecovCoverage_EXT" :
      case "BP7CyberOneCov_EXT" :
      case "BP7EmployeeDishty" :
      case "BP7EquipBreakEndor_EXT" :
      case "BP7HiredNonOwnedAuto" :
      case "BP7AddlInsdGrantorOfFranchiseLine_EXT" :
      case "BP7AddlInsdLessorsLeasedEquipmtLine_EXT" :
      case "BP7AddlInsdManagersLessorsPremisesLine_EXT" :
      case "BP7AddlInsdDesignatedPersonOrg" :
      case "DataCmprmiseRspnseExpns_EXT" :
      case "BP7DataCompromiseDfnseandLiabCov_EXT" :
      case "BP7EmploymentPracticesLiabilityCov_EXT" :
          addCostToDB(step.rate(lineCov, sliceToRate))
          break
      case "BP7BusinessLiability" :
        if(lineRatingInfo.MedicalExpensesPerPersonLimit == 10000){
          addCostToDB(step.rateBusinessLiabilityMedicalPaymentIncrease(lineCov, sliceToRate))
        }
        break
      case "BP7ForgeryAlteration" :
        addCostToDB(step.rateForgeryOrAlterationCoverage(lineCov, sliceToRate))
        break
      case "BP7OrdinanceOrLawCov_EXT" :
        addCostToDB(step.rateOrdinanceOrLawCoverage(lineCov, sliceToRate))
        break
      case "BP7AddlInsdMortgageeAsigneeReceiverLine_EXT" :
      case "BP7AddlInsdOwnersLandLeasedToInsuredLine_EXT" :
      case "BP7AddlInsdCoOwnerInsdPremisesLine_EXT" :
      case "BP7AddlInsdControllingInterest" :
        addCostToDB(step.rateNonPremiumAdditionalInsuredCoverages(lineCov, sliceToRate))
    }
  }

  /**
  * function adds the cost to DB
   */
  private function addCostToDB(cost : CostData<Cost, PolicyLine>){
    if(AddCostToDB)
      addCost(cost)
    else
      TotalAnnualPremiumBeforeActualIRPM += cost.ActualTermAmount.roundDollar()
  }

  private function addCostToDB(costs : List<CostData<Cost, PolicyLine>>){
    if(AddCostToDB)
      addCosts(costs)
    else
      TotalAnnualPremiumBeforeActualIRPM += costs.sum( \ elt -> elt.ActualTermAmount).roundDollar()
  }
  /**
  *  function which rates the location coverages
   */
  override function rateLocationCoverage(locationCov: BP7LocationCov, sliceToRate: DateRange) {
    var locationRatingInfo = new BP7LocationRatingInfo(locationCov)
    var step = new BP7LocationStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, BP7RatingInfo, locationRatingInfo)
    switch(locationCov.Pattern){
      case "BP7AddlInsdGrantorOfFranchiseEndorsement":
      case "BP7AddlInsdDesignatedPersonOrgLocation_EXT":
      case "BP7AddlInsdManagersLessorsPremises" :
      case "BP7AddlInsdLessorsLeasedEquipmt" :
        addCostToDB(step.rate(locationCov, sliceToRate))
        break
      case "BP7AddlInsdControllingInterestLocation_EXT" :
      case "BP7AddlInsdOwnersLandLeasedToInsuredLocation_EXT" :
      case "BP7AddlInsdMortgageeAssigneeReceiver" :
      case "BP7AddlInsdCoOwnerInsdPremises" :
        addCostToDB(step.rateNonPremiumAdditionalInsuredCoverages(locationCov, sliceToRate))
    }
  }

  /**
  *  Function which rates all the building coverages
   */
  override function rateBuilding(building: BP7Building, sliceToRate: DateRange) {
    BP7RatingInfo.NetAdjustmentFactor = RateFactorUtil.setNetAdjustmentFactor(PolicyLine, MinimumRatingLevel, building)
    BP7RatingInfo.PropertyBuildingAdjustmentFactor = RateFactorUtil.setPropertyBuildingAdjustmentFactor(PolicyLine, MinimumRatingLevel, building)
    var step = new BP7BuildingStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, BP7RatingInfo)
    var buildingRatingInfo = new BP7BuildingRatingInfo(building)
    if (building.BP7StructureExists) {
      var bp7StructureRatingInfo = new BP7StructureRatingInfo(building.BP7Structure)
      addCostToDB(step.rateBP7Structure(building.BP7Structure, sliceToRate, bp7StructureRatingInfo))
    }
    if(building.BP7BuildingMoneySecurities_EXTExists)
      addCostToDB(step.rate(building.BP7BuildingMoneySecurities_EXT, sliceToRate, buildingRatingInfo))
    if(building.BP7LocationOutdoorSigns_EXTExists)
      addCostToDB(step.rate(building.BP7LocationOutdoorSigns_EXT, sliceToRate, buildingRatingInfo))
    if(building.BP7SinkholeLossCoverage_EXTExists)
      addCostToDB(step.rate(building.BP7SinkholeLossCoverage_EXT, sliceToRate, buildingRatingInfo))
    if(building.BP7DamagePremisisRentedToYou_EXTExists)
      addCostToDB(step.rate(building.BP7DamagePremisisRentedToYou_EXT, sliceToRate, buildingRatingInfo))
  }

  /**
  * function which rates all the coverages at the classification level
   */
  override function rateClassification(classification: BP7Classification, sliceToRate: DateRange) {
    var classificationRatingInfo = new BP7ClassificationRatingInfo(classification)
    BP7RatingInfo.NetAdjustmentFactor = RateFactorUtil.setNetAdjustmentFactor(PolicyLine, MinimumRatingLevel, classification.Building)
    BP7RatingInfo.PropertyContentsAdjustmentFactor = RateFactorUtil.setPropertyContentsAdjustmentFactor(PolicyLine, MinimumRatingLevel, classification)
    var step = new BP7ClassificationStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, BP7RatingInfo, classificationRatingInfo)
    if(classification.BP7ClassificationBusinessPersonalPropertyExists){
      var businessPersonalPropertyRatingInfo = new BP7BusinessPersonalPropertyRatingInfo(classification?.BP7ClassificationBusinessPersonalProperty)
      addCostToDB(step.rateBP7BusinessPersonalProperty(classification.BP7ClassificationBusinessPersonalProperty, sliceToRate, businessPersonalPropertyRatingInfo))
    }
    if (classification.BP7SpoilgCovExists) {
      addCostToDB(step.rate(classification.BP7SpoilgCov, sliceToRate))
    }
    if(classification.BP7ClassificationAccountsReceivableExists){
      addCostToDB(step.rate(classification.BP7ClassificationAccountsReceivable, sliceToRate))
    }
    if(classification.BP7ClassificationValuablePapersExists){
      addCostToDB(step.rate(classification.BP7ClassificationValuablePapers, sliceToRate))
    }
    if(classification.BP7CondoCommlUnitOwnersOptionalCovsLossAssessExists){
      addCostToDB(step.rate(classification.BP7CondoCommlUnitOwnersOptionalCovsLossAssess, sliceToRate))
    }
    if(classification.BP7CondoCommlUnitOwnersOptionalCovMiscRealPropExists){
      addCostToDB(step.rate(classification.BP7CondoCommlUnitOwnersOptionalCovMiscRealProp, sliceToRate))
    }
    if(classification.BP7ClassificationBusinessIncomeFromDependentPropsExists){
      addCostToDB(step.rate(classification.BP7ClassificationBusinessIncomeFromDependentProps, sliceToRate))
    }
    if(classification.BP7BarbersBeauticiansProfessionalLiability_EXTExists){
      addCostToDB(step.rate(classification.BP7BarbersBeauticiansProfessionalLiability_EXT, sliceToRate))
    }
    if(classification.BP7FuneralDirectorsProflLiab_EXTExists){
      addCostToDB(step.rate(classification.BP7FuneralDirectorsProflLiab_EXT, sliceToRate))
    }
    if(classification.BP7OptProfLiabCov_EXTExists){
      addCostToDB(step.rate(classification.BP7OptProfLiabCov_EXT, sliceToRate))
    }
    if(classification.BP7HearingAidSvcsProfLiab_EXTExists){
      addCostToDB(step.rate(classification.BP7HearingAidSvcsProfLiab_EXT, sliceToRate))
    }
  }

  /**
   * function which rates the terrorism coverage
   */
  override function rateTerrorismCoverage(lineCov: BP7CapLossesFromCertfdActsTerrsm, sliceToRate: DateRange){
    var step = new BP7LineStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, BP7RatingInfo, null)
    addCostToDB(step.rateTerrorismCoverageRateRoutine(lineCov, sliceToRate, totalCostWithoutOptionalCoverages()))
  }

  /**
  * rate the policy fee
   */
  override function ratePolicyFee(line: BP7Line){
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = new BP7TaxCostData_Ext(dateRange.start,dateRange.end,line.PreferredCoverageCurrency, RateCache, line.BaseState, ChargePattern.TC_POLICYFEES_EXT)
    costData.init(line)
    costData.NumDaysInRatedTerm = NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_COSTDATA   -> costData
    }
    _executor.executeBasedOnSliceDate(BP7RateRoutineNames.BP7_POLICY_FEE_RATE_ROUTINE, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.StandardAmount = costData.StandardTermAmount
    costData.ActualAmount = costData.StandardAmount
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
  }

  /**
   * rate the EMPA Surcharge
   */
  override function rateEMPASurcharge(line: BP7Line){
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = new BP7TaxCostData_Ext(dateRange.start,dateRange.end,line.PreferredCoverageCurrency, RateCache, line.BaseState, ChargePattern.TC_EMPASURCHARGE_EXT)
    costData.init(line)
    costData.NumDaysInRatedTerm = NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_COSTDATA   -> costData
    }
    _executor.executeBasedOnSliceDate(BP7RateRoutineNames.BP7_EMPA_SURCHARGE_RATE_ROUTINE, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.StandardAmount = costData.StandardTermAmount
    costData.ActualAmount = costData.StandardAmount
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
  }

  /**
   * function which add the adjustment amount if the total premium is less than minimum
  */
  override function rateManualPremiumAdjustment(sliceRange : DateRange){
    var totalPremium : BigDecimal = 0.0
    if(AddCostToDB){
      totalPremium = CostDatas.sum(\costData -> costData.ActualTermAmount)
    } else{
      totalPremium = TotalAnnualPremiumBeforeActualIRPM
    }
    var minimumPremium = 0
    var filter = new RateBookQueryFilter(PolicyLine.Branch.PeriodStart, PolicyLine.Branch.PeriodEnd, PolicyLine.PatternCode)
                                      {: Jurisdiction = PolicyLine.BaseState,
                                        : MinimumRatingLevel = MinimumRatingLevel,
                                        : RenewalJob = (PolicyLine.Branch.JobProcess typeis RenewalProcess)}
    var params = {"Y"}
    minimumPremium = new RatingQueryFacade().getFactor(filter, "bp7_minimum_premium_table", params).Factor
    if (minimumPremium > totalPremium){
      if(_logger.isDebugEnabled())
        _logger.debug("Entering :: rateManualPremiumAdjustment:", this.IntrinsicType)
      var premiumAdjustment = (minimumPremium - totalPremium)
      var costData = new BP7LineCostData_Ext(sliceRange, PolicyLine.PreferredCoverageCurrency, RateCache, BP7CostType_Ext.TC_MINIMUMPREMIUMADJUSTMENT)
      costData.init(PolicyLine)
      costData.NumDaysInRatedTerm = NumDaysInCoverageRatedTerm
      costData.ProrationMethod = typekey.ProrationMethod.TC_FLAT
      var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
          TC_POLICYLINE -> PolicyLine,
          TC_MINIMUMPREMIUMADJUSTMENT_EXT -> premiumAdjustment,
          TC_COSTDATA           -> costData
      }
      _executor.executeBasedOnSliceDate(BP7RateRoutineNames.BP7_MINIMUM_PREMIUM_ADJUSTMENT_RATE_ROUTINE, rateRoutineParameterMap, costData, sliceRange.start, sliceRange.end)
      if (costData != null)
        addCostToDB(costData)
      if(_logger.isDebugEnabled())
        _logger.debug("Minimum Premium Adjustment added Successfully", this.IntrinsicType)
    }
  }

  function hasRateForClassGroup(classification: BP7Classification): boolean {
    return not {"17", "19", "20", "21"}.contains(classification.ClassificationClassGroup)
  }
  /**
  * function that returns the total cost to calculate the terrorism coverage
   */
  private function totalCostWithoutOptionalCoverages() : BigDecimal{
    var costDatasForTerrorism : List<CostData> = {}
    if(!AddCostToDB)
      return TotalAnnualPremiumBeforeActualIRPM
    for(costData in CostDatas){
      if(costData typeis BP7LineCovCostData){
        var cost = costData.getPopulatedCost(PolicyLine)
        if(cost.Coverage.PatternCode == "IdentityRecovCoverage_EXT" || cost.Coverage.PatternCode == "BP7CyberOneCov_EXT" ||
           cost.Coverage.PatternCode == "DataCmprmiseRspnseExpns_EXT" || cost.Coverage.PatternCode == "BP7EmploymentPracticesLiabilityCov_EXT" ||
           cost.Coverage.PatternCode == "BP7DataCompromiseDfnseandLiabCov_EXT" || cost.Coverage.PatternCode == "BP7CapLossesFromCertfdActsTerrsm")
          continue
      }
      costDatasForTerrorism.add(costData)
    }
    return costDatasForTerrorism.sum(\costData -> costData.ActualTermAmount)
  }
}
