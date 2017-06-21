package una.productmodel

uses una.config.ConfigParamsUtil
uses java.util.HashMap
uses gw.api.domain.covterm.CovTerm
uses java.lang.Double
uses gw.api.domain.covterm.TypekeyCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/22/16
 * Time: 3:06 PM
 * To change this template use File | Settings | File Templates.
 */

class CoveragesUtil {
  public static final var SCHEDULED_PERSONAL_PROPERTY_DEFAULTS : HashMap<typekey.ScheduleType_HOE, Double> = {ScheduleType_HOE.TC_GUNSTHEFT_EXT -> 5000,
                                                                                                              ScheduleType_HOE.TC_SILVERWARETHEFT_EXT -> 10000,
                                                                                                              ScheduleType_HOE.TC_JEWELRYTHEFT_EXT -> 5000,
                                                                                                              ScheduleType_HOE.TC_WATERCRAFT_EXT -> 2000,
                                                                                                              ScheduleType_HOE.TC_TRAILEROTHERS_EXT -> 2000}
  public static final var DEPENDENT_LIMIT_PATTERNS_TO_DERIVING_LIMIT_PATTERNS : HashMap<String, List<String>> = {"HODW_PersonalPropertyLimit_HOE" -> {"HODW_LossOfUseDwelLimit_HOE"},
                                                                                                                 "HODW_Dwelling_Limit_HOE" -> {"HODW_OtherStructures_Limit_HOE",
                                                                                                                                               "HODW_PersonalPropertyLimit_HOE",
                                                                                                                                               "HODW_LossOfUseDwelLimit_HOE"},
                                                                                                                 "DPDW_Dwelling_Limit_HOE" -> {"DPDW_OtherStructuresLimit_HOE",
                                                                                                                                               "DPDW_PersonalPropertyLimit_HOE",
                                                                                                                                               "DPDW_Additional_LivingExpLimit_HOE",
                                                                                                                                               "DPDW_FairRentalValue_Ext"}}
  private static final var REPLACEMENT_COST_CONDITION_ELIGIBLE_TERRITORY_CODES = {"2", "3", "4", "16C", "17", "19C", "19N"}

  public static function isCoverageAvailable(coveragePattern : String, coverable : Coverable) : boolean{
    var result = true

    switch(coveragePattern){
      case "HOLI_WC_PrivateResidenceEmployee_HOE_Ext":
        result = isWorkersCompForEmployeesAvailable(coverable as HomeownersLine_HOE)
        break
	    case "BP7ForgeryAlteration":
        result = isEmployDishonestCoverageAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7BuildingMoneySecurities_EXT":
        result = isBuildingMoneySecuritiesCoverageAvailable(coverable as BP7Building)
        break
      case "BP7OrdinanceOrLawCov_EXT":
        result = isOrdinanceOrLawCovAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7InterruptionComputerOps":
        result = isInterruptionComputerOpsCovAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7CapLossesFromCertfdActsTerrsm":
        result = isBP7CapLossesFromCertfdActsTerrsmCovAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7CondoCommlUnitOwnersOptionalCovsLossAssess":
      case "BP7CondoCommlUnitOwnersOptionalCovMiscRealProp":
        result = isCondominiumCoveragesAvailable(coverable as BP7Classification)
        break
      case "BP7TheftLimitations":
        result = isTheftCoverageAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7BarbersBeauticiansProfessionalLiability_EXT":
        result = isBarbAndBeautiProfLiabCoverageAvailable(coverable as BP7Classification)
        break
      case "BP7FuneralDirectorsProflLiab_EXT":
        result = isFuneralDirectorsProfLiabCoverageAvailable(coverable as BP7Classification)
        break
      case "BP7OptProfLiabCov_EXT":
        result = isOpticiansProfLiabCoverageAvailable(coverable as BP7Classification)
        break
      case "BP7HearingAidSvcsProfLiab_EXT":
        result = isHearingAidSvcsProfLiabCoverageAvailable(coverable as BP7Classification)
        break
      case "SupplExtendedReportingPeriodEndrsmnt_EXT":
        result = isCyberOneSERPCoverageAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "EPLSupplExtendedReportingPeriodEndrsmnt_EXT":
        result = isEPLSERPCoverageAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "HODW_LossAssessmentCov_HOE_Ext":
        result = isLossAssessmentCoverageAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_Comp_Earthquake_CA_HOE_Ext":
        result = isComprehensiveEarthquakeCoverageAvailable(coverable as Dwelling_HOE)
        break
      case "BP7FLChngsEmployPracLiabInsCov_EXT":
        result = isFLChngsEmployPracLiabInsCovAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "HODW_Personal_Property_HOE":
      case "HODW_RefrigeratedPP_HOE_Ext":
      case "HODW_SpecialLimitsPP_HOE_Ext":
      case "HODW_ScheduledProperty_HOE":
        result = isFLHO3PersPropCoveragesAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_SpecialComp_HOE_Ext":
        result = isSpecialCompCovAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_BusinessProperty_HOE_Ext":
        result = isBusinessPropertyCovAvailable(coverable as Dwelling_HOE)
        break
      case "HOPS_GolfCartPD_HOE_Ext":
        result = isGolfCartPDCovAvailable(coverable as HomeownersLine_HOE)
        break
      default:
        break
    }

    return result
  }

  public static function isCoverageVisible(coveragePattern:String, coverable : Coverable):boolean
  {
    if(coveragePattern=="CPTerrorismCoverage_EXT")
      {
        if(coverable typeis CPBuilding && (coverable.PolicyLine as CommercialPropertyLine).TerrorismCoverage==true)
           return true
        else
          return false
      }
    else
      return true
  }

  public static function isExclusionAvailable(exclusionPattern : String, coverable : Coverable) : boolean{
    var result = true

    switch(exclusionPattern){
      case "HODW_WindstromExteriorPaintandWaterproofingExcl_HOENC_Ext":
      case "HODW_WindstromExteriorPaintandWaterproofingExcl_HOESC_Ext":
        result = isWindstormExteriorPaintExclusionAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_WindHurricaneHailExc_HOE_Ext":
        result = isWindHurricaneAndHailExclusionAvailable(coverable as HomeownersLine_HOE)
        break
      case "BP7ExclusionProductsCompletedOpernsUnrelatedtoBuilOwners_EXT":
        result = isProductsCompletedOpernsUnrelatedtoBuilOwnersExclusionAvailable(coverable as BP7Building)
        break
      case "BP7WindstormOrHailExcl_EXT":
        result = isWindstormOrHailExclusionAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "HODW_WindstromHailExc_HOE_Ext":
        result = isWindstormOrHailExclusionAvailableHO(coverable as HomeownersLine_HOE)
        break
      case "BP7ExclCertfdActsTerrsmCovFireLosses":
        result = isBP7ExclCertfdActsTerrsmCovFireLossesAvailable(coverable as BP7BusinessOwnersLine)
        break
      default:
        //do nothing intentionally
    }

    return result
  }

  public static function isConditionAvailable(conditionPattern : String, coverable : Coverable) : boolean{
    var result = true

    switch(conditionPattern){
      case "BP7FloridaChangesCondoAssociation_EXT":
        result = isFloridaChangesCondoAssociationConditionAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7FloridaChangesCondoUnitOwner_EXT":
        result = isFloridaChangesCondoUnitOwnerConditionAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "HODW_ReplaceCostCovAPaymentSched_HOE":
        result = isReplaceCostWithRoofPayScheduleConditionAvailable(coverable as HomeownersLine_HOE)
        break
      default:
        break
    }
    return result
  }

  public static function getExistence(pattern : String, coverable : Coverable) : ExistenceType{
    var result : ExistenceType = null

    switch(pattern){
      case "HODW_AckNoWindstromHail_HOE_Ext":
        result = getAcknowledgementOfNoWindstormHailCoverageExistence(coverable as HomeownersLine_HOE)
        break
      case "BP7ClassifnExclPersonalAdvertisingInjury_Ext":
        result = getPersonalAdvertisingInjuryExclusionExistence(coverable as BP7Classification)
        break
      case "BP7FLChngsEmployPracLiabInsCov_EXT":
        result = getFLChngsEmployPracLiabInsCoverageExistence(coverable as BP7BusinessOwnersLine)
        break
      case "CPProtectiveSafeguards_EXT":
          result = getProtectiveSafeguardsExistence(coverable as CPBuilding)
      break
      case "CPFloridaChangesCondoCondition_EXT":
          result = getFloridaChangesCondoExistence(coverable as CommercialPropertyLine)
          break
      case "BP7CrossSuitsExcl_EXt":
          result = getCrossSuitsExistence(coverable as BP7BusinessOwnersLine)
          break
      default:
        break
    }

    return result
  }

  public static function initCoverage(coveragePattern : String, coverable : Coverable){
    var covTermsToInitialize : List<CovTerm> = {}

    switch(coveragePattern){
      case "GLHiredAutoNonOwnedLiab_EXT":
        {

          var gline = coverable as GeneralLiabilityLine
          if(gline.GLHiredAutoNonOwnedLiab_EXTExists)
          {
            gline.GLHiredAutoNonOwnedLiab_EXT.HiredAutoNonOwnedLimit_EXTTerm.Value= gline.GLCGLCov.GLCGLOccLimitTerm.OptionValue.Value
          }
          break
        }
      case "HODW_Dwelling_Cov_HOE":
      case "DPDW_Dwelling_Cov_HOE":
        initDwelling_Cov_HOE(coverable)
        break
      case "DPDW_Additional_Living_Exp_HOE":
        covTermsToInitialize.add((coverable as Dwelling_HOE).DPDW_Additional_Living_Exp_HOE.DPDW_Additional_LivingExpLimit_HOETerm)
        break
      case "HODW_FungiCov_HOE":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_FungiCov_HOE.HODW_FungiSectionILimit_HOETerm)
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_FungiCov_HOE.HODW_FungiSectionII_HOETerm)
        break
      case "HODW_OrdinanceCov_HOE":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm)
        break
      case "HODW_SpecialLimitsPP_HOE_Ext":
        covTermsToInitialize.addAll((coverable as Dwelling_HOE).HODW_SpecialLimitsPP_HOE_Ext.CovTerms)
        break
      case "HOLI_AnimalLiabilityCov_HOE_Ext":
        covTermsToInitialize.add((coverable as HomeownersLine_HOE).HOLI_AnimalLiabilityCov_HOE_Ext.HOLI_AnimalLiabLimit_HOETerm)
        break
      case "HODW_Limited_Earthquake_CA_HOE":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm)
        break
      case "HODW_Comp_Earthquake_CA_HOE_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovD_HOE_ExtTerm)
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovA_HOETerm)
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Comp_Earthquake_CA_HOE_Ext.HODW_CompEarthquakeCovC_ExtTerm)
        break
      case "HODW_LossAssessmentCov_HOE_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_LossAssessmentCov_HOE_Ext.HOPL_Deductible_HOETerm)
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm)
        break
      case "HODW_BuildingAdditions_HOE_Ext":
          covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm)
          break
      case "HODW_BusinessProperty_HOE_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_BusinessProperty_HOE_Ext.HODW_OffPremises_Limit_HOETerm)
        break
      case "HOLI_Med_Pay_HOE":
        covTermsToInitialize.add((coverable as HomeownersLine_HOE).HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm)
        break
      case "HODW_SinkholeLoss_HOE_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_SinkholeLoss_HOE_Ext.HODW_SinkholeLossDeductible_ExtTerm)
        break
	    case "BP7HiredNonOwnedAuto":
        var bp7Line = coverable as BP7BusinessOwnersLine
        if(bp7Line.BP7HiredNonOwnedAutoExists){
          if(bp7Line.BP7BusinessLiability.BP7EachOccLimitTerm.OptionValue.OptionCode.equalsIgnoreCase("300000")){
            bp7Line.BP7HiredNonOwnedAuto.BP7HiredAutoLimit_EXTTerm.setValueFromString("300000_EXT")
          }else if(bp7Line.BP7BusinessLiability.BP7EachOccLimitTerm.OptionValue.OptionCode.equalsIgnoreCase("500000")){
            bp7Line.BP7HiredNonOwnedAuto.BP7HiredAutoLimit_EXTTerm.setValueFromString("500000_EXT")
          }else if(bp7Line.BP7BusinessLiability.BP7EachOccLimitTerm.OptionValue.OptionCode.equalsIgnoreCase("1000000")){
            bp7Line.BP7HiredNonOwnedAuto.BP7HiredAutoLimit_EXTTerm.setValueFromString("1000000_EXT")
          }else if(bp7Line.BP7BusinessLiability.BP7EachOccLimitTerm.OptionValue.OptionCode.equalsIgnoreCase("2000000")){
            bp7Line.BP7HiredNonOwnedAuto.BP7HiredAutoLimit_EXTTerm.setValueFromString("2000000_EXT")
          }
        }
        break
      case "DPLI_Med_Pay_HOE":
        covTermsToInitialize.add((coverable as HomeownersLine_HOE).DPLI_Med_Pay_HOE.DPLI_MedPay_Limit_HOETerm)
        initDPLIMedPayOrPL_Cov_HOE(coveragePattern,coverable)
        break
      case "DPLI_Personal_Liability_HOE":
        initDPLIMedPayOrPL_Cov_HOE(coveragePattern,coverable)
        break
      case "DPDW_FairRentalValue_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).DPDW_FairRentalValue_Ext.DPDW_FairRentalValue_ExtTerm)
        break
      default:
        break
    }

    covTermsToInitialize.each( \ covTerm -> covTerm?.onInit())
  }


  public static function getAvailableValuationMethods(covTerm: TypekeyCovTerm): List<gw.entity.TypeKey>{
    var results : List<gw.entity.TypeKey>
    var line = covTerm.Clause.PolicyLine

    if(covTerm == null){
      return null
    }

    if(covTerm.Pattern.TypeList != typekey.ValuationMethod) {
      return covTerm.Pattern.OrderedAvailableValues
    }

    var state = covTerm.Clause.PolicyLine.BaseState
    var policyType: typekey.HOPolicyType_HOE

    if(covTerm.Clause.OwningCoverable typeis Dwelling_HOE) {

      policyType = (covTerm.Clause.OwningCoverable as Dwelling_HOE).HOPolicyType
    } else{

      policyType = (covTerm.Clause.OwningCoverable as HomeownersLine_HOE).HOPolicyType
    }

    results = covTerm.Pattern.OrderedAvailableValues.where( \ elt -> elt.hasCategory(policyType) and elt.hasCategory(state))


    if(line typeis HomeownersLine_HOE and covTerm.Pattern == "HODW_DwellingValuation_HOE_Ext"){
      var restrictedTerritories = ConfigParamsUtil.getList(TC_ReplacementCostWithRoofSurfacePaymentTerritories, line.BaseState, line.HOPolicyType.Code)

      if(restrictedTerritories?.containsIgnoreCase(line.Dwelling.TerritoryCodeOrOverride)){
        results = results.where( \ result -> result.Code == "ReplWRoof")
      }
    }

    return results

  }

  private static function initDwelling_Cov_HOE(coverable : Coverable){

    var valuationCovTerm = (coverable as Dwelling_HOE).DwellingValuationMethodCovTerm
    var availableValuationMethods = getAvailableValuationMethods(valuationCovTerm)

    if(availableValuationMethods.Count == 1){
      valuationCovTerm.Value =   availableValuationMethods.single()
    }else{
      valuationCovTerm.setValue(((coverable as Dwelling_HOE).HOLine.BaseState == TC_TX) ?  typekey.ValuationMethod.TC_ACV : typekey.ValuationMethod.TC_REPLCOST)
    }
  }

  private static function initDPLIMedPayOrPL_Cov_HOE(covPattern:String,coverable:Coverable){
    if(coverable.PolicyLine.BaseState == TC_HI && (coverable as HomeownersLine_HOE).HOPolicyType == TC_DP3_Ext){
      if(covPattern === "DPLI_Personal_Liability_HOE" and !(coverable as HomeownersLine_HOE).DPLI_Med_Pay_HOEExists ){
        (coverable as HomeownersLine_HOE).createCoverage("DPLI_Med_Pay_HOE")
      }else if(covPattern === "DPLI_Med_Pay_HOE" and !(coverable as HomeownersLine_HOE).DPLI_Personal_Liability_HOEExists){
        (coverable as HomeownersLine_HOE).createCoverage("DPLI_Personal_Liability_HOE")
      }
    }
  }

  private static function isTheftCoverageAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(!bp7Line.BP7TheftExclusion_EXTExists){
      return true
    }else{//If Theft Exclusion Exists remove Theft Coverage and its Coverage Terms
      for(classification in bp7Line.AllClassifications){
        if(classification.theftLimitationsAvailable()){
          classification.BP7TheftLimitations.remove()
        }
      }
    }
    return false
  }

  private static function isWorkersCompForEmployeesAvailable(hoLine: HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.HOPolicyType == TC_DP3_Ext){
      result =  hoLine.DPLI_Personal_Liability_HOEExists
    }

    return result
  }

  private static function isLossAssessmentCoverageAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL and dwelling.HOPolicyType == TC_DP3_Ext){
      result = dwelling.HOLine.DPLI_Personal_Liability_HOEExists or dwelling.HOLine.Dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO
    }

    return result
  }

  private static function isComprehensiveEarthquakeCoverageAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = false
    var earthquakeCoverageElected = dwelling.EarthquakeCoverage_Ext
    var numberOfStories = dwelling.NumberStoriesOrOverride
    var yearBuilt = dwelling.YearBuiltOrOverride
    var isQualifyingResidenceType = {ResidenceType_HOE.TC_SINGLEFAMILY_EXT, ResidenceType_HOE.TC_DUPLEX}.contains(dwelling.ResidenceType)
    var isQualifyingFoundationType = dwelling.Foundation != TC_StiltsPilings_Ext
    var constructionTypes = {dwelling.ConstructionTypeOrOverride, dwelling.ConstructionTypeL1OrOverride}
    constructionTypes.removeWhere( \ elt -> elt == null)
    var isQualifyingConstructionType = constructionTypes.subtract(typekey.ConstructionType_HOE.TF_WOODFRAMECONSTRUCTIONTYPES.TypeKeys).Count == 0

    if(earthquakeCoverageElected and isQualifyingFoundationType and isQualifyingResidenceType and isQualifyingConstructionType){
      result = ((yearBuilt >= 1931 and yearBuilt <= 1972) and typekey.NumberOfStories_HOE.TF_TWOORLESSSTORIES.TypeKeys.contains(dwelling.NumberStoriesOrOverride))
            or (yearBuilt > 1972 and typekey.NumberOfStories_HOE.TF_THREESTORIESORLESS.TypeKeys.contains(dwelling.NumberStoriesOrOverride))
    }

    return result
  }

  private static function isFLChngsEmployPracLiabInsCovAvailable(bp7Line:BP7BusinessOwnersLine) : boolean{
    if(bp7Line.BP7EmploymentPracticesLiabilityCov_EXTExists){
      return true
    }
    return false
  }

  private static function isFLHO3PersPropCoveragesAvailable(dwelling:Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState==TC_FL && dwelling.HOPolicyType == TC_HO3){
      result = !dwelling.HOLine.HODW_PersonalPropertyExc_HOE_ExtExists
    }

    return result
  }

  private static function isSpecialCompCovAvailable(dwelling:Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState==TC_FL && dwelling.HOPolicyType == TC_HO3){
      result = !dwelling.HOLine.HODW_PersonalPropertyExc_HOE_ExtExists
    }

    if(dwelling.Branch.BaseState==TC_CA && (dwelling.HOPolicyType == TC_HO3 || dwelling.HOPolicyType == TC_HO4 || dwelling.HOPolicyType == TC_HO6)){
      result = !dwelling.HODW_SpecialPersonalProperty_HOE_ExtExists
    }
    return result
  }

  private static function isBusinessPropertyCovAvailable(dwelling:Dwelling_HOE) : boolean{
    var result = true
    if(dwelling.HOLine.BaseState == TC_HI){
      result = !(dwelling.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC)
    }else if(dwelling.CoverableState==TC_FL && dwelling.HOPolicyType == TC_HO3){
      result = !dwelling.HOLine.HODW_PersonalPropertyExc_HOE_ExtExists
    }
    return result
  }

  private static function isGolfCartPDCovAvailable(hoLine : HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.BaseState==TC_FL && hoLine.HOPolicyType == TC_HO3){
      result = !hoLine.HODW_PersonalPropertyExc_HOE_ExtExists
    }

    return result
  }


  private static function isWindstormExteriorPaintExclusionAvailable(hoLine : HomeownersLine_HOE) : boolean{
    var result = true
    var dependentCovTerm = ConfigParamsUtil.getString(TC_WindHailExclusionCoverageTermPair, hoLine.BaseState)
    var dependentCovTermTerritories = ConfigParamsUtil.getList(tc_WindHailExclusionRestrictionTerritories, hoLine.BaseState)

    result = !hoLine.hasExclusion(dependentCovTerm) and dependentCovTermTerritories.contains(hoLine.Dwelling.TerritoryCodeOrOverride)

    return result
  }

  private static function isWindHurricaneAndHailExclusionAvailable(hoLine : HomeownersLine_HOE) : boolean{
    var applicableCounties = ConfigParamsUtil.getList(tc_WindstormHurricaneAndHailExclusionCounties, hoLine.BaseState)

    return hoLine.Dwelling.WHurricaneHailExclusion_Ext
       and applicableCounties?.containsIgnoreCase(hoLine.HOLocation.PolicyLocation.County?.trim())
  }

  /*Available when the Occupancy type is:
  1. Building Owner (or)
  2. Building Owner and Occupant and the under the Building Coverage, the 'building owner occupies' field is either < or > 65% (or)
  3. Condominium Association (or)
  4. Condominium Unit Owner*/
  private static function isProductsCompletedOpernsUnrelatedtoBuilOwnersExclusionAvailable(bp7Building : BP7Building):boolean{
      if( bp7Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BUILDINGOWNER ||
          ( bp7Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BOOCCUPANT &&
              (bp7Building.BP7Structure.BP7BuildingOwnerOccupies_EXTTerm.OptionValue!=null && (bp7Building.BP7Structure.BP7BuildingOwnerOccupies_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("BP7<65%_EXT")||
                  bp7Building.BP7Structure.BP7BuildingOwnerOccupies_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("BP7>65%_EXT"))) ) ||
                (bp7Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMASSOCIATION || bp7Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMUNITOWNER ) ){
        return true
      }
   return false
  }

  private static function isWindstormOrHailExclusionAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7LocationPropertyDeductibles_EXT.BP7WindHailDeductible_EXTTerm.OptionValue!=null &&
        bp7Line.BP7LocationPropertyDeductibles_EXT.BP7WindHailDeductible_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("NA_EXT")){
      return true
    }
    return false
  }
  private static function isBP7ExclCertfdActsTerrsmCovFireLossesAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(!bp7Line.BP7CapLossesFromCertfdActsTerrsmExists){
      return true
    }
    return false
  }

  private static function isWindstormOrHailExclusionAvailableHO(line : HomeownersLine_HOE) : boolean{
    return line.Dwelling.WHurricaneHailExclusion_Ext
  }

  private static function getAcknowledgementOfNoWindstormHailCoverageExistence(hoLine : HomeownersLine_HOE) : ExistenceType{
    var result : ExistenceType = null

    if(!hoLine.Dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm
     or hoLine.Dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.Value == null
     or hoLine.Dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.Value == -1){
      result = TC_REQUIRED
    }

    return result
  }

  private static function getPersonalAdvertisingInjuryExclusionExistence(bp7Classification:BP7Classification):ExistenceType{
    var result : ExistenceType
    if(bp7Classification.ClassCode_Ext=="65121B" || bp7Classification.ClassCode_Ext=="65121K"){
      result = TC_REQUIRED
    }else{
      result = TC_ELECTABLE
    }
    return result
  }

  private static function getFLChngsEmployPracLiabInsCoverageExistence(bp7Line : BP7BusinessOwnersLine):ExistenceType{
    var result : ExistenceType = null
    if(bp7Line.BP7EmploymentPracticesLiabilityCov_EXTExists){
      result = TC_REQUIRED
    }
    return result
  }
  private static function getProtectiveSafeguardsExistence(building : CPBuilding) : ExistenceType{
    var result : ExistenceType


    if(building.AutomaticFireSuppress)
       result = TC_REQUIRED
    else
     result = TC_ELECTABLE

    return result
  }


  private static function getFloridaChangesCondoExistence(line : CommercialPropertyLine) : ExistenceType{
    var result : ExistenceType


    if(line.AssociatedPolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_CONDOMINIUMASSOCIATION)
      result = TC_REQUIRED
    else
      result = TC_ELECTABLE

    return result
  }

  private static function getCrossSuitsExistence(bp7Line : BP7BusinessOwnersLine) : ExistenceType{
    var result : ExistenceType
    if(bp7Line.AssociatedPolicyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured).Count>=1){
      result = TC_REQUIRED
    }else
      result = TC_ELECTABLE

    return result
  }

  private static function isEmployDishonestCoverageAvailable(bp7Line : BP7BusinessOwnersLine):boolean{
    return  bp7Line.BP7EmployeeDishtyExists
  }

  private static function isInterruptionComputerOpsCovAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7BuildingBusinessIncomeExtraExpense_EXT.BP7NumberOfMonths_EXTTerm.OptionValue!=null &&
        !bp7Line.BP7BuildingBusinessIncomeExtraExpense_EXT.BP7NumberOfMonths_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("BP7NoCoverage_EXT")){
      return true
    }
    return false
  }


  private static function isBP7CapLossesFromCertfdActsTerrsmCovAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    return !bp7Line.BP7ExclCertfdActsTerrsmCovFireLossesExists
  }

  private static function isFloridaChangesCondoUnitOwnerConditionAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    for(classification in bp7Line.AllClassifications){
      if(classification.ClassCode_Ext=="60999A"){
        return true
      }
    }
    return false
  }

  private static function isReplaceCostWithRoofPayScheduleConditionAvailable(hoLine : HomeownersLine_HOE) : boolean{
    return REPLACEMENT_COST_CONDITION_ELIGIBLE_TERRITORY_CODES.containsIgnoreCase(hoLine.Dwelling.TerritoryCodeOrOverride)
  }

  private static function isFloridaChangesCondoAssociationConditionAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    for(classification in bp7Line.AllClassifications){
      if(classification.ClassCode_Ext=="60999"){
        return true
      }
    }
    return false
  }

  private static function isBarbAndBeautiProfLiabCoverageAvailable(bp7Classification:BP7Classification):boolean{
    if( (bp7Classification.ClassCode_Ext=="71332" || bp7Classification.ClassCode_Ext=="71952") ){
      return true
    }
    return false
  }

  private static function isFuneralDirectorsProfLiabCoverageAvailable(bp7Classification:BP7Classification):boolean{
    if(bp7Classification.ClassCode_Ext=="71865"){
      return true
    }
    return false
  }

  private static function isOpticiansProfLiabCoverageAvailable(bp7Classification:BP7Classification):boolean{
    if(bp7Classification.ClassCode_Ext=="59954"){
      return true
    }
    return false
  }

  private static function isHearingAidSvcsProfLiabCoverageAvailable(bp7Classification:BP7Classification):boolean{
    if(bp7Classification.ClassCode_Ext=="59974"){
      return true
    }
    return false
  }

  //Should be available only when Cyber one Coverage is selected and when Coverage Type is 'Network Security Liability' or ' Computer Attack and Network Security Limit' in the original policy
  //Should be available in PolicyChange ONLY
  private static function isCyberOneSERPCoverageAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    var basedOnBP7Line = bp7Line.Branch.BasedOn.BP7Line
    var isCyberOneCovAvailableInOrigPolicy = (basedOnBP7Line!=null && basedOnBP7Line.BP7CyberOneCov_EXTExists && basedOnBP7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value!=null &&
        (basedOnBP7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_NETWORKSECURITYLIAB_EXT ||
            basedOnBP7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT))
    if(bp7Line.Branch.Job.Subtype == typekey.Job.TC_POLICYCHANGE && basedOnBP7Line!=null && isCyberOneCovAvailableInOrigPolicy){
      return true
    }
    return false
  }

  //Should be available only when EPL Coverage is added to the original policy
  //Should be available in PolicyChange ONLY
  private static function isEPLSERPCoverageAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    var basedOnBP7Line = bp7Line.Branch.BasedOn.BP7Line
    if(bp7Line.Branch.Job.Subtype == typekey.Job.TC_POLICYCHANGE && basedOnBP7Line!=null && basedOnBP7Line.BP7EmploymentPracticesLiabilityCov_EXTExists){
      return true
    }
    return false
  }

  private static function isCondominiumCoveragesAvailable(bp7Classification:BP7Classification):boolean{
    if(bp7Classification.Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMUNITOWNER || bp7Classification.Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOUNITOWNEROCCUPANT ){
      return true
    }
    return false
  }

  private static function isBuildingMoneySecuritiesCoverageAvailable(bp7Building :BP7Building) : boolean {
    return !(bp7Building.PolicyLine as BP7Line).BP7NamedPerilsExists
  }

  private static function isOrdinanceOrLawCovAvailable(bp7Line:BP7BusinessOwnersLine) : boolean {
    for(building in bp7Line.AllBuildings){
      if(building.BP7FunctlBldgValtnExists){
        return false
      }else{
       return true
      }
    }
    return false
  }
}