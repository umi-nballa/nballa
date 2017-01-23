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
uses gw.lob.bp7.rating.BP7LiabilityLessorStep
uses una.rating.bp7.ratinginfos.BP7StructureRatingInfo
uses una.rating.bp7.ratinginfos.BP7BuildingRatingInfo
uses una.rating.bp7.ratinginfos.BP7BusinessPersonalPropertyRatingInfo
uses una.rating.bp7.common.BP7LocationStep
uses una.rating.bp7.ratinginfos.BP7LocationRatingInfo
uses una.rating.bp7.util.RateFactorUtil

/**
*  Class which extends the bp7 abstract rating engine and implements the rating for all the available BP7 coverages
 */
class UNABP7RatingEngine extends UNABP7AbstractRatingEngine<BP7Line> {
  var _minimumRatingLevel: RateBookStatus
  var _executor: BP7RateRoutineExecutor
  var _bp7RatingInfo : BP7RatingInfo
  final static var _logger = UnaLoggerCategory.UNA_RATING
  construct(line: BP7Line) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: BP7Line, minimumRatingLevel: RateBookStatus) {
    super(line)
    _logger.info("Initializing the " + line.BaseState.Code + " BOP Rating Engine")
    _minimumRatingLevel = minimumRatingLevel
    _executor = new BP7RateRoutineExecutor(ReferenceDatePlugin, PolicyLine, minimumRatingLevel)
    _bp7RatingInfo = new BP7RatingInfo(line)
    _logger.info(line.BaseState.Code + " BOP Rating Engine initialized")
  }

  /**
  * function which rates all the selected line coverages
   */
  override function rateLineCoverage(lineCov: BP7LineCov, sliceToRate: DateRange) {
    var lineRatingInfo = new BP7LineRatingInfo(lineCov)
    var step = new BP7LineStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, _bp7RatingInfo, lineRatingInfo)
    switch(lineCov.Pattern){
      case "IdentityRecovCoverage_EXT" :
      case "BP7CyberOneCov_EXT" :
      case "BP7EmployeeDishty" :
      case "BP7ForgeryAlteration" :
      case "BP7EquipBreakEndor_EXT" :
      case "BP7HiredNonOwnedAuto" :
      case "BP7AddlInsdGrantorOfFranchiseLine_EXT" :
      case "BP7AddlInsdLessorsLeasedEquipmtLine_EXT" :
      case "BP7AddlInsdManagersLessorsPremisesLine_EXT" :
      case "BP7AddlInsdDesignatedPersonOrg" :
      //case "BP7EmploymentPracticesLiabilityCov_EXT" :
          addCost(step.rate(lineCov, sliceToRate))
          break
      case "BP7BusinessLiability" :
        if(lineRatingInfo.MedicalExpensesPerPersonLimit == 10000)
          addCost(step.rateBusinessLiabilityMedicalPaymentIncrease(lineCov, sliceToRate))
        break
      case "BP7OrdinanceOrLawCov_EXT" :
        addCosts(step.rateOrdinanceOrLawCoverage(lineCov, sliceToRate))
        break
      case "BP7AddlInsdMortgageeAsigneeReceiverLine_EXT" :
      case "BP7AddlInsdOwnersLandLeasedToInsuredLine_EXT" :
      case "BP7AddlInsdCoOwnerInsdPremisesLine_EXT" :
      case "BP7AddlInsdControllingInterest" :
        addCost(step.rateNonPremiumAdditionalInsuredCoverages(lineCov, sliceToRate))
    }
  }

  /**
  *  function which rates the location coverages
   */
  override function rateLocationCoverage(locationCov: BP7LocationCov, sliceToRate: DateRange) {
    var locationRatingInfo = new BP7LocationRatingInfo(locationCov)
    var step = new BP7LocationStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, _bp7RatingInfo, locationRatingInfo)
    switch(locationCov.Pattern){
      case "BP7AddlInsdGrantorOfFranchiseEndorsement":
      case "BP7AddlInsdDesignatedPersonOrgLocation_EXT":
      case "BP7AddlInsdManagersLessorsPremises" :
      case "BP7AddlInsdLessorsLeasedEquipmt" :
        addCost(step.rate(locationCov, sliceToRate))
        break
      case "BP7AddlInsdControllingInterestLocation_EXT" :
      case "BP7AddlInsdOwnersLandLeasedToInsuredLocation_EXT" :
      case "BP7AddlInsdMortgageeAssigneeReceiver" :
      case "BP7AddlInsdCoOwnerInsdPremises" :
        addCost(step.rateNonPremiumAdditionalInsuredCoverages(locationCov, sliceToRate))
    }
  }

  override function rateLiability(line : BP7BusinessOwnersLine, sliceToRate : DateRange) {
    PolicyLine.AllBuildings.each(\ building -> {
      if (building.LessorOccupied) {
        var step = new BP7LiabilityLessorStep(PolicyLine, building, _executor, NumDaysInCoverageRatedTerm)
        addCost(step.rate(PolicyLine.BP7BusinessLiability, sliceToRate))
      }
      else {
        building.Classifications.each(\ classification -> {
          if(classification.BPPOrFunctionalValuationExists and hasRateForClassGroup(classification)){
            //var step = new BP7LiabilityOccupantStep(PolicyLine, classification, _executor, NumDaysInCoverageRatedTerm)
            //addCost(step.rate(PolicyLine.BP7BusinessLiability, sliceToRate))
          }
        })        
      }      
    })
  }

  /**
  *  Function which rates all the building coverages
   */
  override function rateBuilding(building: BP7Building, sliceToRate: DateRange) {
    _bp7RatingInfo.NetAdjustmentFactor = RateFactorUtil.setNetAdjustmentFactor(PolicyLine, _minimumRatingLevel, building)
    var step = new BP7BuildingStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, _bp7RatingInfo)
    var buildingRatingInfo = new BP7BuildingRatingInfo(building)
    if (building.BP7StructureExists) {
      _bp7RatingInfo.PropertyBuildingAdjustmentFactor = RateFactorUtil.setPropertyBuildingAdjustmentFactor(PolicyLine, _minimumRatingLevel, building)
      var bp7StructureRatingInfo = new BP7StructureRatingInfo(building.BP7Structure)
      addCost(step.rateBP7Structure(building.BP7Structure, sliceToRate, bp7StructureRatingInfo))
    }
    if(building.BP7BuildingMoneySecurities_EXTExists)
      addCost(step.rate(building.BP7BuildingMoneySecurities_EXT, sliceToRate, buildingRatingInfo))
    if(building.BP7LocationOutdoorSigns_EXTExists)
      addCost(step.rate(building.BP7LocationOutdoorSigns_EXT, sliceToRate, buildingRatingInfo))
    if(building.BP7SinkholeLossCoverage_EXTExists)
      addCost(step.rate(building.BP7SinkholeLossCoverage_EXT, sliceToRate, buildingRatingInfo))
    if(building.BP7DamagePremisisRentedToYou_EXTExists)
      addCost(step.rate(building.BP7DamagePremisisRentedToYou_EXT, sliceToRate, buildingRatingInfo))
  }

  /**
  * function which rates all the coverages at the classification level
   */
  override function rateClassification(classification: BP7Classification, sliceToRate: DateRange) {
    var classificationRatingInfo = new BP7ClassificationRatingInfo(classification)
    var step = new BP7ClassificationStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm, _bp7RatingInfo, classificationRatingInfo)
    if(classification.BP7ClassificationBusinessPersonalPropertyExists){
      _bp7RatingInfo.PropertyContentsAdjustmentFactor = RateFactorUtil.setPropertyContentsAdjustmentFactor(PolicyLine, _minimumRatingLevel, classification)
      var businessPersonalPropertyRatingInfo = new BP7BusinessPersonalPropertyRatingInfo(classification?.BP7ClassificationBusinessPersonalProperty)
      addCost(step.rateBP7BusinessPersonalProperty(classification.BP7ClassificationBusinessPersonalProperty, sliceToRate, businessPersonalPropertyRatingInfo))
    }
    if (classification.BP7SpoilgCovExists) {
      addCost(step.rate(classification.BP7SpoilgCov, sliceToRate))
    }
    if(classification.BP7ClassificationAccountsReceivableExists){
      addCost(step.rate(classification.BP7ClassificationAccountsReceivable, sliceToRate))
    }
    if(classification.BP7ClassificationValuablePapersExists){
      addCost(step.rate(classification.BP7ClassificationValuablePapers, sliceToRate))
    }
    if(classification.BP7CondoCommlUnitOwnersOptionalCovsLossAssessExists){
      addCost(step.rate(classification.BP7CondoCommlUnitOwnersOptionalCovsLossAssess, sliceToRate))
    }
    if(classification.BP7CondoCommlUnitOwnersOptionalCovMiscRealPropExists){
      addCost(step.rate(classification.BP7CondoCommlUnitOwnersOptionalCovMiscRealProp, sliceToRate))
    }
    if(classification.BP7ClassificationBusinessIncomeFromDependentPropsExists){
      addCost(step.rate(classification.BP7ClassificationBusinessIncomeFromDependentProps, sliceToRate))
    }
    if(classification.BP7BarbersBeauticiansProfessionalLiability_EXTExists){
      addCost(step.rate(classification.BP7BarbersBeauticiansProfessionalLiability_EXT, sliceToRate))
    }
    if(classification.BP7FuneralDirectorsProflLiab_EXTExists){
      addCost(step.rate(classification.BP7FuneralDirectorsProflLiab_EXT, sliceToRate))
    }
    if(classification.BP7OptProfLiabCov_EXTExists){
      addCost(step.rate(classification.BP7OptProfLiabCov_EXT, sliceToRate))
    }
    if(classification.BP7HearingAidSvcsProfLiab_EXTExists){
      addCost(step.rate(classification.BP7HearingAidSvcsProfLiab_EXT, sliceToRate))
    }
  }

  function hasRateForClassGroup(classification: BP7Classification): boolean {
    return not {"17", "19", "20", "21"}.contains(classification.ClassificationClassGroup)
  }
}
