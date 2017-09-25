package una.rating.ho.group3

uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.group3.ratinginfos.HORatingInfo
uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.group3.ratinginfos.HOGroup3LineRatingInfo
uses java.util.Map
uses java.math.BigDecimal
uses una.rating.ho.group3.ratinginfos.HOGroup3DwellingRatingInfo
uses una.rating.ho.common.HOOtherStructuresRatingInfo
uses una.rating.ho.common.HOSpecialLimitsPersonalPropertyRatingInfo
uses una.rating.ho.group3.ratinginfos.HOGroup3DiscountsOrSurchargeRatingInfo
uses una.config.ConfigParamsUtil
uses una.rating.ho.group3.ratinginfos.HOGroup3ScheduledPersonalPropertyRatingInfo
uses una.rating.ho.group3.ratinginfos.HOFloodCoverageRatingInfo
uses gw.rating.CostData
uses una.rating.ho.group3.ratinginfos.HOGroup3LineLevelRatingInfo
uses una.rating.ho.group3.ratinginfos.HOWindResistiveFeaturesCreditRatingInfo
uses una.rating.ho.common.HomeownersLineCostData_HOE

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOGroup3RatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOGroup3RatingEngine.Type.DisplayName
  private var _hoRatingInfo : HORatingInfo
  private var _discountsOrSurchargeRatingInfo : HOGroup3DiscountsOrSurchargeRatingInfo
  private final var BCEG_CODE_FOR_NON_PARTICIPATION = "98"
  private var _dwellingRatingInfo : HOGroup3DwellingRatingInfo

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _hoRatingInfo.PersonalPropertyExists = line.Dwelling.DPDW_Personal_Property_HOEExists
    _dwellingRatingInfo = new HOGroup3DwellingRatingInfo(line.Dwelling)
  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterGroup3(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)

  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOLI_AnimalLiabilityCov_HOE_Ext:
        rateAnimalLiabilityCoverage(lineCov, dateRange)
        break
      case HOLI_PersonalInjury_HOE:
        ratePersonalInjuryCoverage(lineCov, dateRange)
        break
      case HOPS_GolfCartPD_HOE_Ext:
        rateGolfCartPhysicalDamageAndLiabilityCoverage(lineCov, dateRange)
        break
      case HOLI_Personal_Liability_HOE:
        rateIncreasedSectionIILimits(lineCov, dateRange)
        break
      case HOLI_FungiCov_HOE:
        rateLimitedFungiWetOrDryRotOrBacteriaSectionIICoverage(lineCov, dateRange)
        break
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
        rateUnitOwnersRentedToOthersCoverage(lineCov, dateRange)
        break

    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    switch (typeof dwellingCov) {
      case HODW_EquipBreakdown_HOE_Ext:
        rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
        break
      case HODW_IdentityTheftExpenseCov_HOE_Ext:
        rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
        break
      case HODW_RefrigeratedPP_HOE_Ext:
        rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange)
        break
      case HODW_WaterBackUpSumpOverflow_HOE_Ext:
        rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
        break
      case HODW_Personal_Property_HOE:
        if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 and _dwellingRatingInfo.IncreasedPersonalPropertyPremium > 0)
          rateIncreasedPersonalProperty(dwellingCov, dateRange)
        break
      case HODW_BusinessProperty_HOE_Ext:
        rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
        break
      case HODW_Other_Structures_HOE:
      case DPDW_Other_Structures_HOE:
        rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
        break
      case HODW_LossAssessmentCov_HOE_Ext:
        rateLossAssessmentCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecialComp_HOE_Ext:
        rateSpecialComputerCoverage(dwellingCov, dateRange)
        break
      case HODW_SinkholeLoss_HOE_Ext:
        if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 or PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_DP3_EXT){
          rateSinkholeLossCoverage(dwellingCov, dateRange)
        }
        break
      case HODW_SpecificAddAmt_HOE_Ext:
        rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecialLimitsPP_HOE_Ext:
        rateSpecialLimitsPersonalPropertyCoverage(dwellingCov, dateRange)
        break
      case HODW_OrdinanceCov_HOE:
        rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
        break
      case HODW_LimitedScreenCov_HOE_Ext:
        rateLimitedScreenedEnclosureAndCarportCoverage(dwellingCov, dateRange)
        break
      case HODW_FungiCov_HOE:
        rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov, dateRange)
        break
      case HODW_ScheduledProperty_HOE:
        rateScheduledPersonalProperty(dwellingCov, dateRange)
        break
      case HODW_Dwelling_Cov_HOE:
        if (dwellingCov.HODW_ExecutiveCov_HOE_ExtTerm.Value and PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3)
          rateExecutiveCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecificOtherStructure_HOE_Ext:
        rateOtherStructuresRentedToOthersCoverage(dwellingCov, dateRange)
        break
      case HODW_PermittedIncOcp_HOE_Ext:
        ratePermittedIncidentalOccupanciesCoverage(dwellingCov, dateRange)
        break
      case HODW_FloodCoverage_HOE_Ext:
        rateFloodCoverage(dwellingCov, dateRange)
        break
      case HODW_UnitOwnersCovASpecialLimits_HOE_Ext:
        rateUnitOwnersCovASpecialLimitsCoverage(dwellingCov, dateRange)
        break
      case HODW_BuildingAdditions_HOE_Ext:
        if(dwellingCov.HODW_BuildAddInc_HOETerm.LimitDifference > 0){
          rateBuildingAdditionsCoverage(dwellingCov, dateRange)
        }
        break

    }
  }

  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
    var dwelling = PolicyLine.Dwelling
    _discountsOrSurchargeRatingInfo = new HOGroup3DiscountsOrSurchargeRatingInfo(PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
    var windOrHailExcluded = _discountsOrSurchargeRatingInfo.WindOrHailExcluded
    var constructionType = dwelling.OverrideConstructionType_Ext ? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
    if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_DP3_EXT) {
      if (dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
        _discountsOrSurchargeRatingInfo.NumOfUnitsWithinFireDivision = dwelling?.NumUnitsFireDivision_Ext.Numeric ? dwelling?.NumUnitsFireDivision_Ext.toInt() : 0
        rateTownhouseOrRowhouseSurcharge(dateRange, _hoRatingInfo.FireBasePremiumDwelling, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEDWELLING)
        if (_hoRatingInfo.PersonalPropertyExists){
          rateTownhouseOrRowhouseSurcharge(dateRange, _hoRatingInfo.FireBasePremiumPersonalProperty, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEPERSONALPROPERTY)
        }
      }
      rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.FireBasePremiumDwelling, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGEDWELLING, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE)
      if (_hoRatingInfo.PersonalPropertyExists){
        rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.FireBasePremiumPersonalProperty, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGEPERSONALPROPERTY, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE)
      }

      if (windOrHailExcluded){
        rateWindHailExclusionCredit(dateRange, _hoRatingInfo.FireBasePremiumDwelling, HOCostType_Ext.TC_WINDEXCLUSIONCREDITDWELLING, HORateRoutineNames.WIND_EXCLUSION_CREDIT_DWELLING)
        if (_hoRatingInfo.PersonalPropertyExists){
          rateWindHailExclusionCredit(dateRange, _hoRatingInfo.FireBasePremiumPersonalProperty, HOCostType_Ext.TC_WINDEXCLUSIONCREDITPERSONALPROPERTY, HORateRoutineNames.WIND_EXCLUSION_CREDIT_DWELLING)
        }
      }
      if (hasNoPriorInsurance()){
        rateNoPriorInsurance(dateRange, _hoRatingInfo.FireBasePremiumDwelling, HOCostType_Ext.TC_NOPRIORINSURANCEDWELLING)
        if (_hoRatingInfo.PersonalPropertyExists){
          rateNoPriorInsurance(dateRange, _hoRatingInfo.FireBasePremiumPersonalProperty, HOCostType_Ext.TC_NOPRIORINSURANCEPERSONALPROPERTY)
        }
      }

      if (_discountsOrSurchargeRatingInfo.AOPDeductibleLimit != 1000){
        rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.FireBasePremiumDwelling, HOCostType_Ext.TC_AOPDEDUCTIBLEDWELLING, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE )
        if (_hoRatingInfo.PersonalPropertyExists){
          rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.FireBasePremiumPersonalProperty, HOCostType_Ext.TC_AOPDEDUCTIBLEPERSONALPROPERTY, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE )
        }
      }
      rateProtectiveDeviceCredit(dateRange, HOCostType_Ext.TC_PROTECTIVEDEVICECREDITDWELLING, _hoRatingInfo.FireBasePremiumDwelling)
      if (_hoRatingInfo.PersonalPropertyExists){
        rateProtectiveDeviceCredit(dateRange, HOCostType_Ext.TC_PROTECTIVEDEVICECREDITPERSONALPROPERTY, _hoRatingInfo.FireBasePremiumPersonalProperty)
      }

      if(dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT or dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY
          or dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ){
        rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.FireBasePremiumDwelling, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONPERSONALPROPERTY, HORateRoutineNames.DP_SUPERIOR_CONSTRUCTION_DISCOUNT_RATE_ROUTINE)
        if(_hoRatingInfo.PersonalPropertyExists){
          rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.FireBasePremiumPersonalProperty, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONPERSONALPROPERTY, HORateRoutineNames.DP_SUPERIOR_CONSTRUCTION_DISCOUNT_RATE_ROUTINE)
        }

      }


      //TODO update when extended coverage added
      var extendedCoverage = true
      if (extendedCoverage){

        //deductible
        if(windOrHailExcluded){
          if(_discountsOrSurchargeRatingInfo.AOPDeductibleLimit != 1000){
            rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_AOPDEDUCTIBLEECDWELLING, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE_EC_WIND_EXCLUDED )
            if (_hoRatingInfo.PersonalPropertyExists){
              rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_AOPDEDUCTIBLEECPERSONALPROPERTY, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE_EC_WIND_EXCLUDED )
            }
          }
        } else {
          rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_AOPDEDUCTIBLEECDWELLING, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE_EC_WIND_INCLUDED_DWELLING )
          if (_hoRatingInfo.PersonalPropertyExists){
            rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_AOPDEDUCTIBLEECPERSONALPROPERTY, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE_EC_WIND_INCLUDED_PERSONAL_PROPERTY )
          }
        }

        if(dwelling.BCEGOrOverride == typekey.BCEGGrade_Ext.TC_98 or dwelling.BCEGOrOverride == typekey.BCEGGrade_Ext.TC_99 ){
          rateBCEGNonParticipatingSurcharge(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_ECBCEGNONPARTICIPATINGRISKSDWELLING, HORateRoutineNames.BUILDING_CODE_NON_PARTICIPATING_RISKS_SURCHARGE_RATE_ROUTINE )
          if(_hoRatingInfo.PersonalPropertyExists){
            rateBCEGNonParticipatingSurcharge(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_ECBCEGNONPARTICIPATINGRISKSPERSONALPROPERTY, HORateRoutineNames.BUILDING_CODE_NON_PARTICIPATING_RISKS_SURCHARGE_RATE_ROUTINE )
          }
        }else{
          rateWindPremium(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_WINDPREMIUMBCEGECDWELLING, HORateRoutineNames.WIND_PREMIUM_BCEG_DWELLING_RATE_ROUTINE )
          if(_hoRatingInfo.PersonalPropertyExists){
            rateWindPremium(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_WINDPREMIUMBCEGECPERSONALPROPERTY, HORateRoutineNames.WIND_PREMIUM_BCEG_PERSONAL_PROPERTY_RATE_ROUTINE )
          }

        }

        if(dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT or dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY
            or dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ){
          rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONECDWELLING, HORateRoutineNames.DP_SUPERIOR_CONSTRUCTION_DISCOUNT_EC_RATE_ROUTINE)
          if(_hoRatingInfo.PersonalPropertyExists){
            rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONECPERSONALPROPERTY, HORateRoutineNames.DP_SUPERIOR_CONSTRUCTION_DISCOUNT_EC_RATE_ROUTINE)
          }

        }

        if (dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
          _discountsOrSurchargeRatingInfo.NumOfUnitsWithinFireDivision = dwelling?.NumUnitsFireDivision_Ext.Numeric ? dwelling?.NumUnitsFireDivision_Ext.toInt() : 0
          rateTownhouseOrRowhouseSurcharge(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEECDWELLING)
          if(_hoRatingInfo.PersonalPropertyExists){
            rateTownhouseOrRowhouseSurcharge(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEECPERSONALPROPERTY)
          }
        }

        rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGEECDWELLING, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE)
        if (_hoRatingInfo.PersonalPropertyExists){
          rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGEECPERSONALPROPERTY, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE)
        }

        if (hasNoPriorInsurance()){
          rateNoPriorInsurance(dateRange, _hoRatingInfo.FireECBasePremiumDwelling, HOCostType_Ext.TC_NOPRIORINSURANCEECDWELLING)
          if (_hoRatingInfo.PersonalPropertyExists){
            rateNoPriorInsurance(dateRange, _hoRatingInfo.FireECBasePremiumPersonalProperty, HOCostType_Ext.TC_NOPRIORINSURANCEECPERSONALPROPERTY)
          }
        }

        updateSectionBECTotals()
        calculateAdjustmentFactor(dateRange)

        if(windOrHailExcluded) {
          rateBuildingCodeComplianceGradingCredit(dateRange, _hoRatingInfo.SectionbECDwellingTotal, HOCostType_Ext.TC_BUILDINGCODECOMPLIANCEGRADECREDITDWELLING, HORateRoutineNames.DP_BCEG_DWELLING)
          rateWindstormResistiveFeaturesOfResidentialConstructionCredit(dateRange, _hoRatingInfo.SectionbECDwellingTotal, HOCostType_Ext.TC_WINDSTORMRESISTIVEFEATURESCREDITDWELLING, HORateRoutineNames.WINDSTORM_RESISTIVE_FEATURES_OF_RESIDENTIAL_CONSTRUCTION_CREDIT_RATE_ROUTINE_DWELLING)
          rateAdjustmentToBCEGAndWPDCCredit(dateRange, HOCostType_Ext.TC_ADJUSTMENTTOBCEGANDWPDCCREDITDWELLING)

          if(_hoRatingInfo.PersonalPropertyExists){
            rateBuildingCodeComplianceGradingCredit(dateRange, _hoRatingInfo.SectionbECPersonalPropertyTotal, HOCostType_Ext.TC_BUILDINGCODECOMPLIANCEGRADECREDITPERSONALPROPERTY, HORateRoutineNames.DP_BCEG_PERSONAL_PROPERTY)
            rateWindstormResistiveFeaturesOfResidentialConstructionCredit(dateRange, _hoRatingInfo.SectionbECPersonalPropertyTotal, HOCostType_Ext.TC_WINDSTORMRESISTIVEFEATURESCREDITPERSONALPROPERTY, HORateRoutineNames.WINDSTORM_RESISTIVE_FEATURES_OF_RESIDENTIAL_CONSTRUCTION_CREDIT_RATE_ROUTINE_PERSONAL_PROPERTY)
            rateAdjustmentToBCEGAndWPDCCredit(dateRange, HOCostType_Ext.TC_ADJUSTMENTTOBCEGANDWPDCCREDITPERSONALPROPERTY)
          }
        }

      }
    } else {                       //HO3, HO4, HO6 POLICYTYPES

      if (constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT){
        rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNTAOPPREMIUM, HORateRoutineNames.SUPERIOR_CONSTRUCTION_DISCOUNT_ROUTINE)
      }

      if (_discountsOrSurchargeRatingInfo.AOPDeductibleLimit != 1000){
        rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_DEDUCTIBLEFACTORAOP, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE )
      }

      if (hasNoPriorInsurance()){
        rateNoPriorInsurance(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_NOPRIORINSURANCE)
      }

      if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 || PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6){
        if (dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC){
          rateSeasonalOrSecondaryResidenceSurcharge(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGEAOPPREMIUM)
        }

        rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGE, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE)

        if (PolicyLine.Branch.PreferredBuilder_Ext != null and _discountsOrSurchargeRatingInfo.AgeOfHome < 10)
          ratePreferredBuilderCredit(dateRange)

        if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
          if (dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
            _discountsOrSurchargeRatingInfo.NumOfUnitsWithinFireDivision = dwelling?.NumUnitsFireDivision_Ext.Numeric ? dwelling?.NumUnitsFireDivision_Ext.toInt() : 0
            rateTownhouseOrRowhouseSurcharge(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEAOP)
          }
          if (isMatureHomeOwnerDiscountApplicable(PolicyLine) and not dwelling.IsSecondary){
            rateMatureHomeOwnerDiscount(dateRange, HOCostType_Ext.TC_MATUREHOMEOWNERDISCOUNT)
          }

        }
      }

      //rating all wind hail included, credit and discounts
      if (!windOrHailExcluded){
        rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_DEDUCTIBLEFACTORWIND, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE )
        if (constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT.Code)
          rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNTWINDPREMIUM, HORateRoutineNames.SUPERIOR_CONSTRUCTION_DISCOUNT_ROUTINE)
        if (_discountsOrSurchargeRatingInfo.BCEGGrade == BCEG_CODE_FOR_NON_PARTICIPATION)
          rateBuildingCodeNonParticipatingRisks(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_BUILDINGCODENONPARTICIPATINGRISKSSURCHARGE)

        if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 || PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6)
          if (dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC)
            rateSeasonalOrSecondaryResidenceSurcharge(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGEWINDPREMIUM)

        if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
          rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_AGEOFHOMEPREMIUMMODIFIER, HORateRoutineNames.AGE_OF_HOME_PREMIUM_MODIFIER_RATE_ROUTINE)
          if (dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
            _discountsOrSurchargeRatingInfo.NumOfUnitsWithinFireDivision = dwelling?.NumUnitsFireDivision_Ext.Numeric ? dwelling?.NumUnitsFireDivision_Ext.toInt() : 0
            rateTownhouseOrRowhouseSurcharge(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEWIND)
          }
        }

        if (_discountsOrSurchargeRatingInfo.BCEGGrade != 98 and _discountsOrSurchargeRatingInfo.BCEGGrade != 99){
          rateBuildingCodeComplianceGradingCredit(dateRange, _hoRatingInfo.AdjustedWindBasePremium, HOCostType_Ext.TC_BUILDINGCODECOMPLIANCEGRADECREDIT, HORateRoutineNames.BUILDING_CODE_COMPLIANCE_GRADING_CREDIT_RATE_ROUTINE)
        }
        rateWindstormResistiveFeaturesOfResidentialConstructionCredit(dateRange, _hoRatingInfo.AdjustedWindBasePremium, HOCostType_Ext.TC_WINDSTORMRESISTIVEFEATURESCREDIT, HORateRoutineNames.WINDSTORM_RESISTIVE_FEATURES_OF_RESIDENTIAL_CONSTRUCTION_CREDIT_RATE_ROUTINE)
        rateAdjustmentToBCEGAndWPDCCredit(dateRange, HOCostType_Ext.TC_ADJUSTMENTTOBCEGANDWPDCCREDIT)
      }

      if (dwelling?.HODW_Personal_Property_HOEExists){
        if (dwelling?.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm?.Value != ValuationMethod.TC_PERSPROP_ACV){
          ratePersonalPropertyReplacementCost(dateRange)
        }
      }

      rateProtectiveDeviceCredit(dateRange, HOCostType_Ext.TC_PROTECTIVEDEVICECREDIT, _hoRatingInfo.TotalBasePremium)

      updateWindBasePremium()

      rateMaximumDiscountAdjustmentForAOP(dateRange)

      updateFinalAdjustedAOPBasePremium()

      _hoRatingInfo.FinalAdjustedWindBasePremium = _hoRatingInfo.AdjustedWindBasePremium + _hoRatingInfo.BuildingCodeComplianceGradingCredit + _hoRatingInfo.WindstormResistiveFeaturesOfResidentialConstruction + _hoRatingInfo.AdjustmentToBCEGAndWPDCCredit
      _hoRatingInfo.TotalBasePremium = _hoRatingInfo.FinalAdjustedAOPBasePremium + _hoRatingInfo.FinalAdjustedWindBasePremium
      _dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium

      if (dwelling.HOLine.HODW_PersonalPropertyExc_HOE_ExtExists){
        ratePersonalPropertyExclusion(dwelling.HOLine.HODW_PersonalPropertyExc_HOE_Ext, dateRange)
      }

    }




  }


  function rateWindPremium(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateWindPremium", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("rateWindPremium Rated Successfully", this.IntrinsicType)
  }

  function rateWindHailExclusionCredit(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateWindHailExclusionCredit", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("rateWindHailExclusionCredit Rated Successfully", this.IntrinsicType)
  }

  function rateBCEGNonParticipatingSurcharge(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBCEGNonParticipatingSurcharge", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("rateBCEGNonParticipatingSurcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Equipment breakdown coverage
   */
  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, _discountsOrSurchargeRatingInfo)
    if (costData != null)
      addCost(costData)
    _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIdentityTheftExpenseCoverage to rate Identity Theft Expense Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateIdentityTheftExpenseCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Identity Theft Expense Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Refrigerated Personal Property coverage
   */
  function rateRefrigeratedPersonalPropertyCoverage(dwellingCov: HODW_RefrigeratedPP_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateRefrigeratedPersonalPropertyCoverage to rate Refrigerated Personal Property Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Refrigerated Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Water backup Sump Overflow coverage
   */
  function rateWaterBackupSumpOverflowCoverage(dwellingCov: HODW_WaterBackUpSumpOverflow_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateWaterBackupSumpOverflowCoverage to rate Water Backup Sump Overflow Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.WATER_BACKUP_SUMP_OVERFLOW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov: HOLI_AnimalLiabilityCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    if(lineRatingInfo.AnimalLiabilityLimit != 0){
      var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Animal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate personal injury line coverage
   */
  function ratePersonalInjuryCoverage(lineCov: HOLI_PersonalInjury_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalInjury to rate Personal Injury Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, null)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Golf Cart Physical Damage And Liability coverage
   */
  function rateGolfCartPhysicalDamageAndLiabilityCoverage(lineCov: HOPS_GolfCartPD_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateGolfCartPhysicalDamageAndLiabilityCoverage to rate Golf Cart Physical Damage And Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.GOLF_CART_PHYSICAL_DAMAGE_AND_LIABILITY_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Golf Cart Physical Damage And Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Limited Fungi Wet Or Dry Rot Or Bacteria SectionII Coverage
   */
  function rateLimitedFungiWetOrDryRotOrBacteriaSectionIICoverage(lineCov: HOLI_FungiCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedFungiWetOrDryRotOrBacteriaSectionIICoverage to rate Limited Fungi Wet Or Dry Rot Or Bacteria SectionII Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONII_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Limited Fungi Wet Or Dry Rot Or Bacteria SectionII Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
 * Rate Unit Owners Rented To Others Coverage
 */
  function rateUnitOwnersRentedToOthersCoverage(lineCov: HOLI_UnitOwnersRentedtoOthers_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersRentedToOthersCoverage to rate Unit Owners Rented To Others Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_RATINGINFO -> _hoRatingInfo}
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Unit Owners Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Increased Section II Limits
   */
  function rateIncreasedSectionIILimits(lineCov: HOLI_Personal_Liability_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedSectionIILimits to rate Increased Section II Limits", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.INCREASED_SECTION_II_LIMITS_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount != 0)
      addCost(costData)
    _logger.debug("Increased Section II Limits Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Business property - Increased Limits
   */
  function rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov : HODW_BusinessProperty_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBusinessPropertyIncreasedLimitsCoverage to rate Business Property Increased Limits Coverage", this.IntrinsicType)
    if(_dwellingRatingInfo.BusinessPropertyIncreasedLimit > 0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Other structures - Increased or decreased Limits coverage
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var otherStructuresRatingInfo = new HOOtherStructuresRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getOtherStructuresCovParameterSet(PolicyLine, otherStructuresRatingInfo)
    var costData : CostData
    if(dwellingCov.Dwelling.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT){
      costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm, HOCostType_Ext.TC_DWELLING )
    } else{
      costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    }
    if (costData != null){
      addCost(costData)
    }
    //TODO update with extended coverage check
    var EC = true
    if(EC and dwellingCov.Dwelling.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT){
      costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.DP_OTHER_STRUCTURES, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm, HOCostType_Ext.TC_EC)
      if (costData != null){
        addCost(costData)
      }
    }

    _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Loss assessment Coverage
   */
  function rateLossAssessmentCoverage(dwellingCov: HODW_LossAssessmentCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    if(_dwellingRatingInfo.LossAssessmentLimit != 1000){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Loss Asssessment Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Special Computer coverage
   * TODO : update the special computer coverage when the limit is made available on the UI screen
   */
  function rateSpecialComputerCoverage(dwellingCov: HODW_SpecialComp_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialComputerCoverage to rate Special Computer Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_COMPUTER_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Special Computer Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Loss assessment Coverage
   */
  function rateSinkholeLossCoverage(dwellingCov: HODW_SinkholeLoss_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSinkholeLossCoverage to rate Sinkhole Loss Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SINKHOLE_LOSS_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Sinkhole Loss Coverage Rated Successfully", this.IntrinsicType)
  }


  /**
   * Rate Building Additions Coverage
   */
  function rateBuildingAdditionsCoverage(dwellingCov: HODW_BuildingAdditions_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingAdditionsCoverage to rate Building Additions Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUILDING_ADDITIONS_AND_ALTERATIONS_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Building Additions and Alterations Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Permitted Incidental Occupancies Coverage
   */
  function ratePermittedIncidentalOccupanciesCoverage(dwellingCov: HODW_PermittedIncOcp_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePermittedIncidentalOccupanciesCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERMITTED_INCIDENTAL_OCCUPANCIES_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Permitted Incidental Occupancies Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Flood Coverage
   */
  function rateFloodCoverage(dwellingCov: HODW_FloodCoverage_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateFloodCoverage ", this.IntrinsicType)
    var floodCovRatingInfo = new HOFloodCoverageRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getFloodCovParameterSet(PolicyLine, floodCovRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.FLOOD_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Flood Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Special Limits Personal property coverage
   */
  function rateSpecialLimitsPersonalPropertyCoverage(dwellingCov: HODW_SpecialLimitsPP_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialLimitsPersonalPropertyCoverage to rate Special Limits Personal Property Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getSpecialLimitsPersonalPropertyCovParameterSet(PolicyLine, dwellingCov)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_LIMITS_PERSONAL_PROPERTY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Special Limits Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Personal Property Exclusion
   */
  function ratePersonalPropertyExclusion(personalPropertyExcl : HODW_PersonalPropertyExc_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyExclusion", this.IntrinsicType)
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_PERSONALPROPERTYEXCLUSIONBASELIMIT_EXT -> _hoRatingInfo.TotalBasePremium
    }
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PERSONAL_PROPERTY_EXCLUSION_RATE_ROUTINE, HOCostType_Ext.TC_PERSONALPROPERTYEXCLUSION,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Property Exclusion Rated Successfully", this.IntrinsicType)
  }

  /**
   * Function which rates the Personal property replacement cost
   */
  function ratePersonalPropertyReplacementCost(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyReplacementCost", this.IntrinsicType)
    var costDataForIncreasedPersonalProperty : CostData = null
    if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
      var rateRoutineParameter = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
      costDataForIncreasedPersonalProperty = HOCreateCostDataUtil.createCostDataForDwellingCoverage(PolicyLine.Dwelling?.HODW_Dwelling_Cov_HOE, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameter, Executor, this.NumDaysInCoverageRatedTerm)
    }
    var lineLevelRatingInfo = new HOGroup3LineLevelRatingInfo(PolicyLine)
    lineLevelRatingInfo.IncreasedPersonalPropertyPremium = costDataForIncreasedPersonalProperty?.ActualTermAmount
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, lineLevelRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_REPLACEMENTCOSTONPERSONALPROPERTY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Personal Property Replacement Cost Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Superior Construction Discount
   */
  function rateSuperiorConstructionDiscount(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSuperiorConstructionDiscount", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.SuperiorConstructionDiscountForAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.SuperiorConstructionDiscountForWind = costData?.ActualTermAmount
    }
    _logger.debug("Superior Construction Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the No prior insurance
   */
  function rateNoPriorInsurance(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateNoPriorInsurance", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.NO_PRIOR_INSURANCE_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.NoPriorInsurance = costData?.ActualTermAmount
    }
    if(_logger.DebugEnabled)
      _logger.debug("No Prior Insurance Rated Successfully", this.IntrinsicType)
  }




  /**
   *  Function to rate the Mature Homeowner Discount
   */
  function rateMatureHomeOwnerDiscount(dateRange: DateRange, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateMatureHomeOwnerDiscount", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedAOPBasePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.MATURE_HOME_OWNER_DISCOUNT_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.MatureHomeOwnerDiscountAOP = costData.ActualTermAmount
    }
    _logger.debug("Mature Home owner Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Age of Home Discount or Surcharge
   */
  function rateAgeOfHomeDiscount(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, routineName : String) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAgeOfHomeDiscount", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, routineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.AgeOfHomeDiscountAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.AgeOfHomeDiscountWind = costData?.ActualTermAmount
    }
    _logger.debug("Age Of Home Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Deductible Factor
   */
  function rateHigherAllPerilDeductible(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateHigherAllPerilDeductible", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.HigherAllPerilDeductibleAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.HigherAllPerilDeductibleWind = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Higher All Peril Deductible Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Preferred Builder Credit
   */
  function ratePreferredBuilderCredit(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePreferredBuilderCredit", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedAOPBasePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PREFERRED_BUILDER_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_PREFERREDBUILDERCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.PreferredBuilderCredit = costData?.ActualTermAmount
    }
    _logger.debug("Preferred Builder Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Building Code Non Participating Risks
   */
  function rateBuildingCodeNonParticipatingRisks(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingCodeNonParticipatingRisks", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BUILDING_CODE_NON_PARTICIPATING_RISKS_SURCHARGE_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.BuildingCodeNonParticipatingRisksSurcharge = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Building Code Non Participating Risks Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Building Code Compliance Grading Credit
   */
  function rateBuildingCodeComplianceGradingCredit(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingCodeComplianceGradingCredit", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.BuildingCodeComplianceGradingCredit = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Building Code Compliance Grading Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Windstorm Resistive Features Of Residential Construction Credit
   */
  function rateWindstormResistiveFeaturesOfResidentialConstructionCredit(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, rateRoutineName : String) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateWindstormResistiveFeaturesOfResidentialConstructionCredit", this.IntrinsicType)
    var windResistiveFeaturesCreditRatingInfo = new HOWindResistiveFeaturesCreditRatingInfo(PolicyLine.Dwelling)
    windResistiveFeaturesCreditRatingInfo.WindPremium = basePremium
    var rateRoutineParameterMap = getWPDCParameterSet(PolicyLine, windResistiveFeaturesCreditRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, rateRoutineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.WindstormResistiveFeaturesOfResidentialConstruction = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Windstorm Resistive Features Of Residential Construction Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Adjustment To BCEG And WPDC Credit
   */
  function rateAdjustmentToBCEGAndWPDCCredit(dateRange: DateRange, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAdjustmentToBCEGAndWindstormResistiveCredit", this.IntrinsicType)
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
                                            TC_POLICYLINE -> PolicyLine,
                                            TC_RATINGINFO -> _hoRatingInfo }
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.ADJUSTMENT_TO_BCEG_AND_WPDC_CREDIT_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and  costData.ActualTermAmount != 0){
      _hoRatingInfo.AdjustmentToBCEGAndWPDCCredit = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Adjustment To BCEG And WPDC Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Seasonal Or Secondary Residence Surcharge
   */
  function rateSeasonalOrSecondaryResidenceSurcharge(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSeasonalOrSecondaryResidenceSurcharge", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var costData = HOCommonRateRoutinesExecutor.rateSeasonalOrSecondaryResidenceSurcharge(dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, costType, _discountsOrSurchargeRatingInfo)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForWind = costData?.ActualTermAmount
    }
    _logger.debug("Seasonal And Secondary Residence Surcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Town house Or Row house Surcharge
   */
  function rateTownhouseOrRowhouseSurcharge(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateTownhouseOrRowhouseSurcharge", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.TOWNHOUSE_OR_ROWHOUSE_SURCHARGE_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.TownHouseOrRowHouseSurchargeAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.TownHouseOrRowHouseSurchargeWind = costData?.ActualTermAmount
    }
    _logger.debug("Townhouse Or Surcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
    var costDataForIncreasedPersonalProperty : CostData = null
    if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
      var rateRoutineParameter = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
      costDataForIncreasedPersonalProperty = HOCreateCostDataUtil.createCostDataForDwellingCoverage(PolicyLine.Dwelling?.HODW_Dwelling_Cov_HOE, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameter, Executor, this.NumDaysInCoverageRatedTerm)
    }
    _dwellingRatingInfo.IncreasedPersonalPropertyPremium = costDataForIncreasedPersonalProperty?.ActualTermAmount
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Limited Screened Enclosure And Carport
   */
  function rateLimitedScreenedEnclosureAndCarportCoverage(dwellingCov: HODW_LimitedScreenCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedScreenedEnclosureAndCarportCoverage", this.IntrinsicType)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LIMITED_SCREENED_ENCLOSURE_AND_CARPORT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Limited Screened Enclosure And Carport Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage
   */
  function rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov: HODW_FungiCov_HOE, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONI_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Other Structures Rented To Others Coverage
   */
  function rateOtherStructuresRentedToOthersCoverage(dwellingCov: HODW_SpecificOtherStructure_HOE_Ext, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresRentedToOthersCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_RENTED_TO_OTHERS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Other Structures Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Unit Owners CovA Special Limits Coverage
   */
  function rateUnitOwnersCovASpecialLimitsCoverage(dwellingCov: HODW_UnitOwnersCovASpecialLimits_HOE_Ext, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersCovASpecialLimitsCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.UNIT_OWNERS_COVA_SPECIAL_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Unit Owners CovA Special Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Executive Coverage
   */
  function rateExecutiveCoverage(dwellingCov: HODW_Dwelling_Cov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateExecutiveCoverage to rate Executive Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCommonRatingInfoParameterSet(PolicyLine, _hoRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.EXECUTIVE_COVERAGE_RATE_ROUTINE, HOCostType_Ext.TC_EXECUTIVECOVERAGE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Executive Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Scheduled Personal property
   */
  function rateScheduledPersonalProperty(dwellingCov: HODW_ScheduledProperty_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateScheduledPersonalProperty to rate Personal Property Scheduled Coverage", this.IntrinsicType)
    for (item in dwellingCov.ScheduledItems) {
      var rateRoutineParameterMap = getScheduledPersonalPropertyCovParameterSet(PolicyLine, item)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SCHEDULED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Scheduled Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  private function calculateAdjustmentFactor(dateRange: DateRange){
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.DP_SUBTOTAL_ADJUSTMENT_FACTOR_DWELLING_RATE_ROUTINE, HOCostType_Ext.TC_FIREECDWELLING,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _discountsOrSurchargeRatingInfo.SectionbECDwellingAdjustmentFactor = costData.ActualTermAmount
    _hoRatingInfo.SectionbECDwellingAdjustmentFactor = costData.ActualTermAmount
    costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.DP_SUBTOTAL_ADJUSTMENT_FACTOR_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_FIREECPERSONALPROPERTY,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _discountsOrSurchargeRatingInfo.SectionbECPersonalPropertyAdjustmentFactor = costData.ActualTermAmount
    _hoRatingInfo.SectionbECPersonalPropertyAdjustmentFactor = costData.ActualTermAmount

  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line : PolicyLine, lineRatingInfo : HOGroup3LineRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the Dwelling coverages
   */
  private function getDwellingCovParameterSet(line : PolicyLine, dwellingRatingInfo : HOGroup3DwellingRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the flood coverage
   */
  private function getFloodCovParameterSet(line : PolicyLine, floodCovRatingInfo : HOFloodCoverageRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_DWELLINGRATINGINFO_EXT -> floodCovRatingInfo
    }
  }

  /**
  *  Returns the parameter set with rating info and dwelling rating info
  */
  private function getRatingInfoParameterSet(line : PolicyLine, dwellingRatingInfo : HOGroup3DwellingRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_RATINGINFO -> _hoRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Other structures
   */
  private function getOtherStructuresCovParameterSet(line : PolicyLine, otherStructuresRatingInfo : HOOtherStructuresRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> otherStructuresRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Special Limits Personal Property Cov
   */
  private function getSpecialLimitsPersonalPropertyCovParameterSet(line : PolicyLine, dwellingCov : HODW_SpecialLimitsPP_HOE_Ext) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_SPECIALLIMITSPERSONALPROPERTYRATINGINFO_Ext -> new HOSpecialLimitsPersonalPropertyRatingInfo(dwellingCov)
    }
  }

  /**
   * Returns the parameter set for the Discounts / surcharges
   */
  private function getHOLineDiscountsOrSurchargesParameterSet(line : PolicyLine, discountOrSurchargeRatingInfo : HOGroup3DiscountsOrSurchargeRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Discounts / surcharges
   */
  private function getWPDCParameterSet(line : PolicyLine, windResistiveFeaturesCreditRatingInfo : HOWindResistiveFeaturesCreditRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> windResistiveFeaturesCreditRatingInfo,
        TC_RATINGINFO -> _hoRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Scheduled Personal Property Cov
   */
  private function getScheduledPersonalPropertyCovParameterSet(line: PolicyLine, item: ScheduledItem_HOE): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_SCHEDULEDPERSONALPROPERTYRATINGINFO_Ext -> new HOGroup3ScheduledPersonalPropertyRatingInfo(item,item.DwellingCov.Dwelling.HOLocation.PolicyLocation.County)
    }
  }

  /**
   * Returns the parameter set for the HO Line param set
   */
  private function getHOLineParameterSet(line: PolicyLine, hoLineLevelRatingInfo: HOGroup3LineLevelRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_LINERATINGINFO_EXT -> hoLineLevelRatingInfo,
        TC_RATINGINFO -> _hoRatingInfo
    }
  }

  /**
   * Return true if the primary named insured or additional named insured age is greater than or equal to 60yrs.
  */
  private function isMatureHomeOwnerDiscountApplicable(line: HomeownersLine_HOE) : boolean {
    var period = line.Dwelling.PolicyPeriod
    var dateOfBirth : java.util.Date = null
    var minAgeLimit = ConfigParamsUtil.getInt(TC_MATUREHOMEOWNERMINIMUMAGE, line.Dwelling.CoverableState, line.HOPolicyType.Code)
    var primaryNamedInsured = period.PolicyContactRoles.whereTypeIs(PolicyPriNamedInsured).first()
    if(primaryNamedInsured != null){
      dateOfBirth = primaryNamedInsured.DateOfBirth
      if(dateOfBirth != null and (determineAge(dateOfBirth?.YearOfDate) >= minAgeLimit))
        return true
    }
    var additionalNamedInsured = period.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)
    for(addlInsured in additionalNamedInsured){
      dateOfBirth = addlInsured.DateOfBirth
      if(dateOfBirth != null and (determineAge(dateOfBirth?.YearOfDate) >= minAgeLimit))
        return true
    }
    return false
  }

  /**
   *  Function to rate Protection Devices Credit
   */
  function rateProtectiveDeviceCredit(dateRange: DateRange, costType : HOCostType_Ext, basePremium : BigDecimal) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateProtectiveDeviceCredit", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PROTECTIVE_DEVICE_CREDIT_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.ProtectiveDevicesDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Protection Devices Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   * Adjusting the total discount if it exceeds the maximum discount
   */
  function rateMaximumDiscountAdjustmentForAOP(dateRange: DateRange) {
    var totalDiscountAmount = _hoRatingInfo.SuperiorConstructionDiscount + _hoRatingInfo.NoPriorInsurance + _hoRatingInfo.ProtectiveDevicesDiscount +
                              _hoRatingInfo.TownHouseOrRowHouseSurchargeAOP + _hoRatingInfo.PreferredBuilderCredit + _hoRatingInfo.MatureHomeOwnerDiscountAOP +
                              _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForAOP
    if (_hoRatingInfo.AgeOfHomeDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.AgeOfHomeDiscount
    if (_hoRatingInfo.HigherAllPerilDeductibleAOP < 0)
      totalDiscountAmount += _hoRatingInfo.HigherAllPerilDeductibleAOP
    _hoRatingInfo.DiscountAdjustment = rateMaximumDiscountAdjustment(dateRange, totalDiscountAmount, _hoRatingInfo.AdjustedAOPBasePremium)
  }

  private function determineAge(year : int) : int{
    return PolicyLine.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate - year
  }

  private function updateWindBasePremium(){
    _hoRatingInfo.AdjustedWindBasePremium = _hoRatingInfo.WindBasePremium + _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForWind + _hoRatingInfo.TownHouseOrRowHouseSurchargeWind +
                                            _hoRatingInfo.AgeOfHomeDiscountWind + _hoRatingInfo.BuildingCodeNonParticipatingRisksSurcharge + _hoRatingInfo.SuperiorConstructionDiscountForWind +
                                            _hoRatingInfo.HigherAllPerilDeductibleWind
  }

  private function updateFinalAdjustedAOPBasePremium(){
    _hoRatingInfo.FinalAdjustedAOPBasePremium = _hoRatingInfo.AdjustedAOPBasePremium + _hoRatingInfo.NoPriorInsurance + _hoRatingInfo.SuperiorConstructionDiscountForAOP + _hoRatingInfo.TownHouseOrRowHouseSurchargeAOP +
                                                _hoRatingInfo.ProtectiveDevicesDiscount + _hoRatingInfo.HigherAllPerilDeductibleAOP + _hoRatingInfo.AgeOfHomeDiscountAOP + _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForAOP +
                                                _hoRatingInfo.PreferredBuilderCredit + _hoRatingInfo.MatureHomeOwnerDiscountAOP + _hoRatingInfo.DiscountAdjustment

  }

  private function hasNoPriorInsurance() : boolean {
    var priorPoliciesWithNoPriorInsurance = PolicyLine.Branch?.Policy?.PriorPolicies?.where( \ pp -> pp.CarrierType == CarrierType_Ext.TC_NOPRIORINS)
    if(priorPoliciesWithNoPriorInsurance.Count > 0){
      for(priorPolicy in priorPoliciesWithNoPriorInsurance){
        if(priorPolicy.ReasonNoPriorIns_Ext == ReasonNoPriorIns_Ext.TC_PRIORCOVERAGELAPSEDOVER45DAYS ||
           priorPolicy.ReasonNoPriorIns_Ext == ReasonNoPriorIns_Ext.TC_PRIORCOVERAGELAPSEDOVER60DAYS ||
           priorPolicy.ReasonNoPriorIns_Ext == ReasonNoPriorIns_Ext.TC_NOINSURANCEEVERCARRIEDATTHISPROPERTY)
          return true
      }
    }
    return false
  }

  private function sectionbECDwellingTotal() : BigDecimal{
    var sectionBDwellingCostTypes = {HOCostType_Ext.TC_AOPDEDUCTIBLEECDWELLING, HOCostType_Ext.TC_ECBCEGNONPARTICIPATINGRISKSDWELLING, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONECDWELLING, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEECDWELLING,
        HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGEECDWELLING, HOCostType_Ext.TC_NOPRIORINSURANCEECDWELLING, HOCostType_Ext.TC_WINDPREMIUMBCEGECDWELLING}

    var costDatas = this.CostDatas.where( \ elt -> elt typeis HomeownersLineCostData_HOE and sectionBDwellingCostTypes.contains(elt.CostType_Ext))

    return costDatas.sum(\ elt -> elt.ActualTermAmount)
  }


  private function sectionbECPersonalPropertyTotal() : BigDecimal{
    var sectionBDwellingCostTypes = {HOCostType_Ext.TC_AOPDEDUCTIBLEECPERSONALPROPERTY, HOCostType_Ext.TC_ECBCEGNONPARTICIPATINGRISKSPERSONALPROPERTY, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONECPERSONALPROPERTY, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGEECPERSONALPROPERTY,
        HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGEECPERSONALPROPERTY, HOCostType_Ext.TC_NOPRIORINSURANCEECPERSONALPROPERTY, HOCostType_Ext.TC_WINDPREMIUMBCEGECPERSONALPROPERTY}

    var costDatas = this.CostDatas.where( \ elt -> elt typeis HomeownersLineCostData_HOE and sectionBDwellingCostTypes.contains(elt.CostType_Ext))

    return costDatas.sum(\ elt -> elt.ActualTermAmount)
  }

  private function updateSectionBECTotals(){
    _hoRatingInfo.SectionbECDwellingTotal = sectionbECDwellingTotal()
    _hoRatingInfo.SectionbECPersonalPropertyTotal = sectionbECPersonalPropertyTotal()

  }


}