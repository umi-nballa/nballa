package una.productmodel

uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.OptionCovTerm
uses java.util.HashMap
uses gw.api.domain.covterm.CovTerm

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/22/16
 * Time: 3:06 PM
 * To change this template use File | Settings | File Templates.
 */

class CoveragesUtil {
  public static final var DEPENDENT_LIMIT_PATTERNS_TO_DERIVING_LIMIT_PATTERNS : HashMap<String, List<String>> = {"HODW_PersonalPropertyLimit_HOE" -> {"HODW_LossOfUseDwelLimit_HOE"},
                                                                                                                 "HODW_Dwelling_Limit_HOE" -> {"HODW_OtherStructures_Limit_HOE",
                                                                                                                                               "HODW_PersonalPropertyLimit_HOE",
                                                                                                                                               "HODW_LossOfUseDwelLimit_HOE"},
                                                                                                                 "DPDW_Dwelling_Limit_HOE" -> {"DPDW_OtherStructuresLimit_HOE",
                                                                                                                                               "DPDW_PersonalPropertyLimit_HOE",
                                                                                                                                               "DPDW_Additional_LivingExpLimit_HOE",
                                                                                                                                               "DPDW_FairRentalValue_Ext"}}
  public static function isCoverageAvailable(coveragePattern : String, coverable : Coverable) : boolean{
    var result = true

    switch(coveragePattern){
      case "HOLI_WC_PrivateResidenceEmployee_HOE_Ext":
        result = isWorkersCompForEmployeesAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_FloodCoverage_HOE_Ext":
        result = isFloodCoverageAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_SpecialPersonalProperty_HOE_Ext":
        result = isSpecialPersonalPropertyAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_LossAssessmentCov_HOE":
        result = isLossAssessmentCoverageAvailable(coverable as Dwelling_HOE)
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
      case "HODW_PremisesLiability_HOE_Ext":
        result = isPremiseLiabilityCoverageAvailable(coverable as HomeownersLine_HOE)
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
      default:
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
        result = isProductsCompletedOpernsUnrelatedtoBuilOwnersExclusionAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "BP7WindstormOrHailExcl_EXT":
        result = isWindstormOrHailExclusionAvailable(coverable as BP7BusinessOwnersLine)
        break
      default:
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
        default:
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
      case "HOLI_UnitOwnersRentedtoOthers_HOE_Ext":
        covTermsToInitialize.add((coverable as HomeownersLine_HOE).HOLI_UnitOwnersRentedtoOthers_HOE_Ext.HOLI_UnitOwnersRentedOthers_Deductible_HOE_ExtTerm)
        break
      case "HODW_Limited_Earthquake_CA_HOE":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm)
        break
      case "HODW_Comp_Earthquake_CA_HOE_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovD_HOE_ExtTerm)
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovA_HOETerm)
        break
      case "HODW_LossAssessmentCov_HOE_Ext":
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_LossAssessmentCov_HOE_Ext.HOPL_Deductible_HOETerm)
        covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm)
        break
      case "HODW_BuildingAdditions_HOE_Ext":
          covTermsToInitialize.add((coverable as Dwelling_HOE).HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm)
          break
      default:
        break
    }

    covTermsToInitialize.each( \ covTerm -> covTerm?.onInit())
  }

  private static function initDwelling_Cov_HOE(coverable : Coverable){
    var valuationCovTerm = (coverable as Dwelling_HOE).DwellingValuationMethodCovTerm

    if(valuationCovTerm.AvailableOptions.Count == 1){
      valuationCovTerm.setOptionValue(valuationCovTerm.AvailableOptions.single())
    }else{
      var stringVal = ((coverable as Dwelling_HOE).HOLine.BaseState == TC_TX) ? "Actual" : "Replacement"
      //using setValueFromString right now.  may eventually be changed to a typekey cov term.  also might move from
      valuationCovTerm.setValueFromString(stringVal)
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

  private static function isFloodCoverageAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = true
    var floodIneligibleZips = ConfigParamsUtil.getList(TC_FloodCoverageIneligibleZipCodes, dwelling.PolicyLine.BaseState)

    if(floodIneligibleZips.HasElements){
      var zipCode = dwelling.HOLocation.PolicyLocation.PostalCode?.trim()

      if(zipCode.length >= 5){
        zipCode = zipCode.substring(0, 5)
        result = !floodIneligibleZips.contains(zipCode)
      }
    }

    return result
  }

  private static function isSpecialPersonalPropertyAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.PolicyLine.BaseState == TC_FL){
      result = dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    }

    return result
  }

  private static function isLossAssessmentCoverageAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL and dwelling.HOPolicyType == TC_DP3_Ext){
      result = dwelling.HOLine.DPLI_Personal_Liability_HOEExists or dwelling.HOLine.Dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO_EXT
    }

    return result
  }

  private static function isWindstormExteriorPaintExclusionAvailable(hoLine : HomeownersLine_HOE) : boolean{
    var result = true
    var dependentCovTerm = ConfigParamsUtil.getString(TC_WindHailExclusionCoverageTermPair, hoLine.BaseState)
    var dependentCovTermTerritories = ConfigParamsUtil.getList(tc_WindHailExclusionRestrictionTerritories, hoLine.BaseState)

    result = hoLine.Dwelling.HODW_SectionI_Ded_HOE.hasCovTerm(dependentCovTerm)
         and (hoLine.Dwelling.HODW_SectionI_Ded_HOE.getCovTerm(dependentCovTerm) as OptionCovTerm).Value > 0
         and dependentCovTermTerritories.HasElements
         and dependentCovTermTerritories?.intersect(hoLine.Dwelling.HOLocation.PolicyLocation.TerritoryCodes*.Code).Count > 0

    return result
  }

  private static function isWindHurricaneAndHailExclusionAvailable(hoLine : HomeownersLine_HOE) : boolean{
    var applicableCounties = ConfigParamsUtil.getList(tc_WindstormHurricaneAndHailExclusionCounties, hoLine.BaseState)

    return applicableCounties.HasElements
       and applicableCounties.hasMatch( \ county -> county.equalsIgnoreCase(hoLine.HOLocation.PolicyLocation.County))
  }

  /*Available when the Occupancy type is:
  1. Building Owner (or)
  2. Building Owner and Occupant and the under the Building Coverage, the 'building owner occupies' field is either < or > 65% (or)
  3. Condominium Association (or)
  4. Condominium Unit Owner*/
  private static function isProductsCompletedOpernsUnrelatedtoBuilOwnersExclusionAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    for(building in bp7Line.AllBuildings){
      if( building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BUILDINGOWNER ||
          ( building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BOOCCUPANT &&
              (building.BP7Structure.BP7BuildingOwnerOccupies_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("BP7<65%_EXT")|| building.BP7Structure.BP7BuildingOwnerOccupies_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("BP7>65%_EXT")) ) ||
                (building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMASSOCIATION || building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMUNITOWNER ) ){
        return true
      }
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
    var result : ExistenceType = TC_Electable
    if(bp7Classification.ClassCode_Ext=="65121B" || bp7Classification.ClassCode_Ext=="65121K"){
      result = TC_REQUIRED
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

  private static function isCyberOneSERPCoverageAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if( bp7Line.BP7CyberOneCov_EXTExists && bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value!=null &&
        (bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_NETWORKSECURITYLIAB_EXT ||
            bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT) ){
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

  private static function isPremiseLiabilityCoverageAvailable(line: HomeownersLine_HOE) : boolean {
    var result : boolean

    switch(line.HOPolicyType){
      case TC_HO3:
      case TC_DP3_Ext:
        result = line.Dwelling.IsSecondaryOrSeasonal
        break
      case TC_HO6:
        result = line.Dwelling.Occupancy == TC_NonOwn  //the description for this code is (don't ask me why) is tenant / non owner  Had to do this because someone retired the original code :/
        break
      default:
        break
    }

    return result
  }
}