package una.productmodel

uses gw.util.Pair
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.OptionCovTerm
uses java.util.HashMap
uses gw.api.productmodel.CovTermOpt
uses una.logging.UnaLoggerCategory
uses org.apache.commons.lang3.StringUtils
uses java.lang.Double
uses java.util.Map

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/10/16
 * Time: 3:11 PM
 * To change this template use File | Settings | File Templates.
 */
class CoverageTermAvailabilityUtil {
  final static var _logger = UnaLoggerCategory.PRODUCT_MODEL

  private static final var HO_FILTER = "HO"
  private static final var DP_FILTER = "DP"
  private static final var CONDO_RENT_FILTER = "CONDO"
  private static final var AOP = "AOP"
  private static final var COV_LIMIT = "COVLIMIT"
  private static final var SC_NAMED_STORM_RESTRICTION_MAP : Map<String, Double> = {
    StringUtils.join({"HO3", AOP, "2500", "0.01"}) -> 250000,
    StringUtils.join({"HO3", AOP, "2500", "0.02"}) -> 125000,
    StringUtils.join({"HO3", AOP, "5000", "0.01"}) -> 500000,
    StringUtils.join({"HO3", AOP, "5000", "0.02"}) -> 250000,
    StringUtils.join({"HO4", AOP, "1000", "0.02"}) -> 50000,
    StringUtils.join({"HO6", AOP, "2500", "0.02"}) -> 125000,
    StringUtils.join({"HO6", AOP, "5000", "0.02"}) -> 250000,
    StringUtils.join({"HO6", AOP, "5000", "0.05"}) -> 100000,
    StringUtils.join({"HO6", AOP, "5000", "0.10"}) ->50000
  }

  @Param("option", "The CovTermOpt to evaluate availability for.")
  @Param("covTerm", "The CovTerm that the option is associated with.")
  @Param("coverable", "The related Coverable entity.")
  @Returns("Availability of the given option.")
  public static function isCovTermOptionAvailable(option : gw.api.productmodel.CovTermOpt, covTerm : OptionCovTerm, coverable : Coverable) : boolean{
    var result = true

    switch(covTerm.PatternCode){
      case "GLCGLAggLimit":
        result = isAggLimitOptionAvailable (option, coverable as GLLine)
        break
      case "HOLI_MedPay_Limit_HOE":
        result = isMedPayOptionAvailable(option, coverable as entity.HomeownersLine_HOE)
        break
      case "HODW_Hurricane_Ded_HOE":
        result = isHurricaneDedOptionAvailable(option, coverable as Dwelling_HOE)
             and isOptionAvailableForSelectedAOPDeductible(option, coverable as Dwelling_HOE)
        break
      case "DPLI_MedPay_Limit_HOE":
        result = isFireDwellingMedicalPaymentLimitAvailable(option, coverable as HomeownersLine_HOE)
        break
      case "HOPL_LossAssCovLimit_HOE":
        result = isLossAssessmentLimitOptionAvailable(option, coverable as Dwelling_HOE)
        break
      case "HODW_JewelryWatchesFursLimit_HOE":
        result = isSpecialLimitOptionAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_HurricaneDeductible_HOE":
      case "HODW_WindHail_Ded_HOE":
      case "HODW_NamedStrom_Ded_HOE_Ext":
        result = isOptionAvailableForSelectedAOPDeductible(option, coverable as Dwelling_HOE)
        break
      case "EmployPracLiabCovDeduc_EXT":
        result = isOptionAvailableForSelectedEmployPracLiabCovDeduc(coverable as BP7BusinessOwnersLine)
        break
      case "ComputerAttackLimit_EXT":
        result = isOptionAvailableForComputerAttackLimit(option, coverable as BP7BusinessOwnersLine)
        break
      case "BP7NumberOfMonths_EXT":
        result = isOptionAvailableForNumberOfMonths(option,coverable as BP7BusinessOwnersLine)
        break
      case "Deductible_EXT":
        result = isOptionAvailableForCyberOneCovDeduct(option, coverable as BP7BusinessOwnersLine)
        break
      case "DfnseLiabForensicITLegalRvwSublimits_EXT":
        result = isOptionAvailableForDfnseForensicITLegalRvwSublimits(option, coverable as BP7BusinessOwnersLine)
        break
      case "ForensicITLegalRvwSublimits_EXT":
        result = isOptionAvailableForForensicITLegalRvwSublimits(option, coverable as BP7BusinessOwnersLine)
        break
      default:
        break
    }

    return result
  }

  private static function setTermValuesBeforeCheckingAvailability(coverable:Coverable):void
  {
    if(coverable typeis CPBuilding)
    {
      var cLine = coverable.PolicyLine as CommercialPropertyLine
      var cBuilding = coverable as CPBuilding
      if(cLine.CPOrdinanceOrLawType!=null)
      {
        cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCoverage_EXTTerm?.Value = cLine?.CPOrdinanceOrLawType.Code
      }

      if(cLine.CPCoverageB!=null && cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovB_ExtTerm!=null)//!cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovB_ExtTerm?.hasNoAvailableOptionsOrNotApplicableOptionOnly())
      {

        cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovB_ExtTerm?.OptionValue = cLine?.CPCoverageB?.Code
      }

      if(cLine.CPCoverageC!=null && cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm!=null)//!cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm?.hasNoAvailableOptionsOrNotApplicableOptionOnly())
      {
        cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm?.OptionValue = cLine?.CPCoverageC?.Code
      }
    }

  }

  @Param("covTerm", "The CovTerm to evaluate availability for.")
  @Param("coverable", "The related Coverable entity.")
  @Returns("Availability of the given option.")
  public static function isCoverageTermAvailable(patternCode : String, coverable : Coverable) : boolean{

    setTermValuesBeforeCheckingAvailability(coverable)

    var result = true

    switch(patternCode){
      case "HOPL_Deductible_HOE":
        result = isLossAssessmentDeductibleAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_ExecutiveCov_HOE_Ext":
        result = isExecutiveCoverageAvailable(coverable as Dwelling_HOE)
        break
      case "CPOrdinanceorLawCovALimit_EXT":
       result = isOrdinanceCovALimitAvailable(coverable as CPBuilding)
      break
      case "CPOrdinanceorLawCovB_Ext":
          result = isOrdinanceCovBAvailable(coverable as CPBuilding)
          break
      case "CPOrdinanceorLawCovBLimit_EXT":
          result = isOrdinanceCovBLimitAvailable(coverable as CPBuilding)
          break
      case "CPOrdinanceorLawCovBC_Ext":
          result = isOrdinanceCovBCCombinedAvailable(coverable as CPBuilding)
          break
      case "CPOrdinanceorLawCovCLimit_EXT":
          result = isOrdinanceCovCLimitAvailable(coverable as CPBuilding)
          break
      case "CPOrdinanceorLawCovC_Ext":
          result = isOrdinanceCovCAvailable(coverable as CPBuilding)
          break
      case "CPOrdinanceorLawCovBCLimit_EXT":
          result = isOrdinanceCovBCCombinedLimitAvailable(coverable as CPBuilding)
          break
      case "CPOrdinanceorLawCovABCLimit_EXT":
          result = isOrdinanceCovABCCombinedLimitAvailable(coverable as CPBuilding)
          break
      case "NumbOfEmployees_EXT":
          result = isNumberOfEmployeesCovTermAvailable(coverable as BP7BusinessOwnersLine)
          break
      case "BP7ProdCompldOpsAggregateLimit":
          result = isProductsCompletedOpsAggrLimitCovTermAvailable(coverable as BP7BusinessOwnersLine)
          break
      case "HODW_Hurricane_Ded_HOE":
        result = isHurricanePercentageAvailable(coverable as Dwelling_HOE)
        break
      case "DataRestorationCosts_EXT":
      case "SysRestorationCosts_EXT":
        result = isCyberOneCovTermAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "NetworkSecuLimit_EXT":
      case "MalwareTransmission_EXT":
      case "DenialofSvcCompAttackTriggers_EXT":
        result = isCyberOneCoverageTermAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "DataRecreationCosts_EXT":
      case "LossofBusiness_EXT":
      case "PublicRelationsSvcs_EXT":
        result = isCyberOneCovTermsAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "DPLI_Premise_Liability_HOE_Ext":
        result = isDwellingFirePremiseLiabilityAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_Retrofitted_HOE":
        result = isRetrofittedCovTermAvailable(coverable as Dwelling_HOE)
        break
	    case "Cov1Limit_EXT":
        result = isBP7OrdinanceLawCov1LimitCovTermAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "Cov2Limit_EXT":
        result = isBP7OrdinanceLawCov2LimitCovTermAvailable(coverable as BP7BusinessOwnersLine)
        break
      case "Cov3Limit_EXT":
        result = isBP7OrdinanceLawCov3LimitCovTermAvailable(coverable as BP7BusinessOwnersLine)
        break
      default:
        break
    }
    return result
  }

  @Param("homeOwnersLine", "The homeowners line instance to be evaluated.")
  @Returns("The existence type evaluated for the given homeowners instance.")
  static function getFireDwellingPremiseLiabilityExistence(homeOwnersLine : entity.HomeownersLine_HOE) : ExistenceType{
    var result : ExistenceType
    var contact = homeOwnersLine.Branch.PrimaryNamedInsured.ContactDenorm
    switch(homeOwnersLine.BaseState){
      case TC_FL:
      case TC_HI:
          result = TC_REQUIRED
          break
      case TC_CA:
      case TC_TX:
          result = TC_SUGGESTED
          break
        default:
        result = TC_ELECTABLE
    }

    return result
  }

  public static function getLateWildfireClaimReportingExistence(dwelling : Dwelling_HOE) : ExistenceType{
    return (dwelling.HODW_DifferenceConditions_HOE_ExtExists) ? ExistenceType.TC_REQUIRED : ExistenceType.TC_ELECTABLE
  }

  private static function isMedPayOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _hoLine: entity.HomeownersLine_HOE) : boolean {
    var result = true
    var state = _hoLine.Branch.BaseState
    var isValidForMedPayLimitOption = HOPolicyType_HOE.TF_MEDICALPAYMENTSLIMITELIGIBLE.TypeKeys.contains(_hoLine.HOPolicyType)
    var personalLiabilityLimit = _hoLine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value

    if(isValidForMedPayLimitOption){
      if(_hoLine.BaseState != TC_NC and _hoLine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value == 100000bd){
        result = _option.Value == 1000bd
      }else if(state == TC_HI){
        result = isMedPayOptionAvailableVariantFilter(personalLiabilityLimit, _option, state)
      }else{
        result = isMedPayOptionAvailableStandardFilter(personalLiabilityLimit, _option, state)
      }
    }

    return result
  }

  private static function isAggLimitOptionAvailable (option: gw.api.productmodel.CovTermOpt, _glline:GLLine):boolean
  {
     //if(_glline.GLCGLCovExists && _glline?.GLCGLCov?.GLCGLOccLimitTerm?.OptionValue?.Value?.equals(option?.Value))
    if(_glline?.GLCGLCov?.GLCGLOccLimitTerm?.OptionValue?.Value.doubleValue()==100000.0000 && (option?.Value.doubleValue()==100000.0000 || option?.Value.doubleValue()==200000.0000))
       return true
    if(_glline?.GLCGLCov?.GLCGLOccLimitTerm?.OptionValue?.Value.doubleValue()==300000.0000 && (option?.Value.doubleValue()==300000.0000 || option?.Value.doubleValue()==600000.0000))
      return true
    if(_glline?.GLCGLCov?.GLCGLOccLimitTerm?.OptionValue?.Value.doubleValue()==500000.0000 && (option?.Value.doubleValue()==500000.0000 || option?.Value.doubleValue()==1000000.0000))
      return true
    if(_glline?.GLCGLCov?.GLCGLOccLimitTerm?.OptionValue?.Value.doubleValue()==1000000.0000 && (option?.Value.doubleValue()==2000000.0000 || option?.Value.doubleValue()==1000000.0000))
      return true
    else
      return false
  }

  private static function isHurricaneDedOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _dwelling: entity.Dwelling_HOE) : boolean {
    var result = true

    var state = _dwelling.Branch.BaseState
    var otherPerilsValue = _dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
    var dwellingValue = _dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    var dwellingLimitsRange = ConfigParamsUtil.getRange(TC_DWELLINGLIMITRANGEFORHURRICANEDEDRESTRICTION, state)
    var shouldLimitHurricaneDedOptions = ConfigParamsUtil.getBoolean(TC_LimitHurricaneOptions, state, _dwelling.HOPolicyType.Code) and dwellingLimitsRange != null
    var shouldLimitHurricaneDedOptionsForThreshold = ConfigParamsUtil.getBoolean(TC_LimitHurricaneOptionsForThreshold, state)

    if(shouldLimitHurricaneDedOptions
        and dwellingValue > dwellingLimitsRange.LowerBound
        and dwellingValue < dwellingLimitsRange.UpperBound){
      var restrictedValues = ConfigParamsUtil.getList(TC_RestrictedHurricaneDedutibleValues, state, otherPerilsValue?.setScale(0, BigDecimal.ROUND_FLOOR)?.toString())

      if(restrictedValues.HasElements){
        result = restrictedValues?.contains(_option.Value?.toString())
      }
    }

    if(shouldLimitHurricaneDedOptionsForThreshold){
      var excludedValues = ConfigParamsUtil.getList(TC_RestrictedHurricaneDedutibleValuesForThreshold, state)
      var thresholdAmount = ConfigParamsUtil.getDouble(TC_HurricanePerecentageRestrictionCovAThreshold, state)

      if(dwellingValue?.doubleValue() > thresholdAmount and excludedValues.HasElements){
        result = !excludedValues?.contains(_option.Value?.setScale(0, BigDecimal.ROUND_FLOOR).toString())
      }
    }

    return result
    }
    private static function isNumberOfEmployeesCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7EmploymentPracticesLiabilityCov_EXT.EmployPracLiabCovLimit_EXTTerm.OptionValue!=null){
      if(bp7Line.BP7EmploymentPracticesLiabilityCov_EXT.EmployPracLiabCovLimit_EXTTerm.OptionValue.OptionCode.matches("250000_EXT") ){
        return true
      }
    }
      return false
  }

  private static function isOptionAvailableForComputerAttackLimit(option : gw.api.productmodel.CovTermOpt, bp7Line:BP7BusinessOwnersLine):boolean{
    var result = true
    var limitMap : HashMap<typekey.BP7CoverageOptions_Ext, String> = {TC_Limited -> "50000_EXT",
                                                                        TC_Full -> "100000_EXT"
                                                                       }

    if(bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value != null){
      result = limitMap.get(bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value).contains(option.OptionCode)
    }
    return result
  }

  private static function isOptionAvailableForCyberOneCovDeduct(option : gw.api.productmodel.CovTermOpt, bp7Line:BP7BusinessOwnersLine):boolean{
    var result = true

    var deductMap : HashMap<typekey.BP7CoverageOptions_Ext, String> = {TC_Limited -> "5000_EXT",
                                                                      TC_Full -> "10000_EXT"
    }
    if(bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value != null){
      result = deductMap.get(bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value).contains(option.OptionCode)
    }
    return result
  }

  private static function isOptionAvailableForDfnseForensicITLegalRvwSublimits(option : gw.api.productmodel.CovTermOpt, bp7Line:BP7BusinessOwnersLine):boolean{
    var result = true
    var multiplier:BigDecimal = 0.10
    var restrictiveOptions = {"5000/5000_EXT","10000/10000","25000/25000"}
    if(restrictiveOptions.contains(option.OptionCode)){
      if(option.OptionCode == "5000/5000_EXT"){
        result = (bp7Line.BP7DataCompromiseDfnseandLiabCov_EXT.DataCompromiseDfnseandLiabCovLimit_EXTTerm.Value)*multiplier==5000
      }else if(option.OptionCode == "10000/10000"){
        result = (bp7Line.BP7DataCompromiseDfnseandLiabCov_EXT.DataCompromiseDfnseandLiabCovLimit_EXTTerm.Value)*multiplier==10000
      }else if(option.OptionCode == "25000/25000"){
        result = (bp7Line.BP7DataCompromiseDfnseandLiabCov_EXT.DataCompromiseDfnseandLiabCovLimit_EXTTerm.Value)*multiplier==25000
      }
    }
     return result
  }

  private static function isOptionAvailableForForensicITLegalRvwSublimits(option : gw.api.productmodel.CovTermOpt, bp7Line:BP7BusinessOwnersLine):boolean{
    var result = true
    var multiplier:BigDecimal = 0.10
    var restrictiveOptions = {"5000/5000_EXT","10000/10000_EXT","25000/25000_EXT"}
    if(restrictiveOptions.contains(option.OptionCode)){
      if(option.OptionCode == "5000/5000_EXT"){
        result = (bp7Line.DataCmprmiseRspnseExpns_EXT.DataCmprmseRspnseExpnsLimit_EXTTerm.Value)*multiplier==5000
      }else if(option.OptionCode == "10000/10000_EXT"){
        result = (bp7Line.DataCmprmiseRspnseExpns_EXT.DataCmprmseRspnseExpnsLimit_EXTTerm.Value)*multiplier==10000
      }else if(option.OptionCode == "25000/25000_EXT"){
        result = (bp7Line.DataCmprmiseRspnseExpns_EXT.DataCmprmseRspnseExpnsLimit_EXTTerm.Value)*multiplier==25000
      }
    }
    return result
  }

  private static function isProductsCompletedOpsAggrLimitCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{

    if(bp7Line.AllBuildings.IsEmpty && bp7Line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Included_EXT")){
      return true
    }
    for(building in bp7Line.AllBuildings){
      if(!building.BP7ExclusionProductsCompletedOpernsUnrelatedtoBuilOwners_EXTExists){
        return true
      }
    }
    return false
  }
  private static function isBP7OrdinanceLawCov1LimitCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line!=null && bp7Line.BP7OrdinanceOrLawCov_EXTExists && bp7Line.BP7OrdinanceOrLawCov_EXT!=null &&
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm!=null && bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue!=null &&
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov1Only_EXT") ||
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov12and3_EXT") ||
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov1and3_EXT")){
      return true
    }
    return false
  }

  private static function isHurricanePercentageAvailable(dwelling : Dwelling_HOE) : boolean{
    return dwelling.HOLine.BaseState != TC_FL or !dwelling.WHurricaneHailExclusion_Ext
  }
  
  private static function isBP7OrdinanceLawCov2LimitCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm!=null && bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue!=null &&
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov12and3_EXT")){
      return true
    }
    return false
  }

  private static function isBP7OrdinanceLawCov3LimitCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm!=null && bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue!=null &&
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov3Only_EXT") ||
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov12and3_EXT") ||
        bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov1and3_EXT")){
      return true
    }
    return false
  }

  private static function isCyberOneCoverageTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_NETWORKSECURITYLIAB_EXT ||
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT){
      return true
    }
    return false
  }

  private static function isCyberOneCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTACK_EXT ||
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT){
      return true
    }
    return false
  }

  private static function isCyberOneCovTermsAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value == typekey.BP7CoverageOptions_Ext.TC_FULL and
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTACK_EXT ||
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT){
      return true
    }
    return false
  }

  private static function isDwellingFirePremiseLiabilityAvailable(line : HomeownersLine_HOE) : boolean{
    var result = true

    if(line.BaseState == TC_TX){
      result = AccountOrgType.TF_DWELLINGFIREPREMISEELIGIBLETYPES.TypeKeys.contains(line.Branch.Policy.Account.AccountOrgType)
    }

    return result
  }

  private static function isRetrofittedCovTermAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = false
    var yearBuilt = dwelling.OverrideYearbuilt_Ext ? dwelling.YearBuiltOverridden_Ext : dwelling.YearBuilt
    var lowerBound = 1937
    var upperBound = 1954

    result = yearBuilt >= lowerBound and yearBuilt <= upperBound

    return result
  }

  private static function isOptionAvailableForNumberOfMonths(option : gw.api.productmodel.CovTermOpt, bp7Line:BP7BusinessOwnersLine):boolean{
    var result = true
    var restrictiveOptions = {"BP76Months_EXT","BP712Months_EXT"}

    if(restrictiveOptions.contains(option.OptionCode)){
      if(bp7Line.BP7BuildingBusinessIncomeExtraExpense_EXT.BP7AnnualBI_EXTTerm.Value!=null){
        if(option.OptionCode == "BP712Months_EXT"){
          result = bp7Line.BP7BuildingBusinessIncomeExtraExpense_EXT.BP7AnnualBI_EXTTerm.Value<=300000
        }else if(option.OptionCode == "BP76Months_EXT"){
          result = bp7Line.BP7BuildingBusinessIncomeExtraExpense_EXT.BP7AnnualBI_EXTTerm.Value<=600000
        }
      }
    }
    return result
  }

  private static function isOptionAvailableForSelectedEmployPracLiabCovDeduc(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7EmploymentPracticesLiabilityCov_EXT.EmployPracLiabCovLimit_EXTTerm.OptionValue!=null){
      if( bp7Line.BP7EmploymentPracticesLiabilityCov_EXT.EmployPracLiabCovLimit_EXTTerm.OptionValue.OptionCode.matches("100000_EXT")||
          bp7Line.BP7EmploymentPracticesLiabilityCov_EXT.EmployPracLiabCovLimit_EXTTerm.OptionValue.OptionCode.matches("250000_EXT") ){
        return true
     }
    }
    return false
  }
  private static function isOptionAvailableForSelectedAOPDeductible(option : CovTermOpt, dwelling : Dwelling_HOE) : boolean{
    var result = true
    var covTermPatternCode = option.CovTermPattern.CodeIdentifier
    var filterPrefix = getAOPFilterPrefix(dwelling) +  covTermPatternCode
    var state = dwelling.HOLine.BaseState
    var configType = ConfigParameterType_Ext.TC_AOP_RESTRICTEDOPTIONS
    var namedStormValue = dwelling.HODW_SectionI_Ded_HOE.HODW_NamedStrom_Ded_HOE_ExtTerm.Value
    var allPerilsValue = dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value
    var nonHurricaneWindValue = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.Value

    if(ConfigParamsUtil.getBoolean(TC_ShouldLimitDeductibleOptionsForAOP, state, filterPrefix)){
      var optionValue = option.Value?.setScale(3, BigDecimal.ROUND_FLOOR).toString()

      var namedStormRestrictedOptions = ConfigParamsUtil.getList(configType, state, StringUtils.join({filterPrefix, namedStormValue, allPerilsValue.asString()}))
      var nonHurricaneWindRestrictedOptions = ConfigParamsUtil.getList(configType, state, StringUtils.join({filterPrefix, nonHurricaneWindValue, allPerilsValue.asString()}))
      var valueRestrictedOptions = ConfigParamsUtil.getList(configType, state, StringUtils.join({filterPrefix, allPerilsValue.asString()}))
      var defaultRestrictedOptions = ConfigParamsUtil.getList(configType, state, filterPrefix)

      if(namedStormRestrictedOptions != null){
        result = namedStormRestrictedOptions.contains(optionValue)
      }else if(nonHurricaneWindRestrictedOptions != null){
        result = nonHurricaneWindRestrictedOptions.contains(optionValue)
      }else if(valueRestrictedOptions != null){
        result = valueRestrictedOptions.contains(optionValue)
      }else if(defaultRestrictedOptions != null){
        result = defaultRestrictedOptions.contains(optionValue)
      }
    }

    //further filter based on "exceptions" rules
    if(state == TC_SC and covTermPatternCode == "HODW_NamedStrom_Ded_HOE_Ext"){
      var covLimitValue : BigDecimal

      if(dwelling.HOPolicyType == TC_HO4 or dwelling.HOPolicyType == TC_HO6){
        covLimitValue = dwelling.PersonalPropertyLimitCovTerm.Value
      }else if(dwelling.HOPolicyType == TC_HO3){
        covLimitValue = dwelling.DwellingLimitCovTerm.Value
      }

      var restrictionThreshold = SC_NAMED_STORM_RESTRICTION_MAP.get(StringUtils.join({dwelling.HOPolicyType.Code, AOP, allPerilsValue, option.Value}))

      if(result and restrictionThreshold != null and covLimitValue != null){
        result = covLimitValue >= restrictionThreshold
      }
    }

    return result
  }

  private static function getAOPFilterPrefix(dwelling: Dwelling_HOE) : String{
    var result : String

    if(HOPolicyType_HOE.TF_HOTYPES.TypeKeys.contains(dwelling.HOPolicyType)){
      result = HO_FILTER
    }else if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(dwelling.HOPolicyType)){
      result = DP_FILTER
    }else if(HOPolicyType_HOE.TF_CONDOTYPES.TypeKeys.contains(dwelling.HOPolicyType) or dwelling.HOPolicyType == TC_HO4){
      result = CONDO_RENT_FILTER
    }

    return result
  }

  private static function isFireDwellingMedicalPaymentLimitAvailable(covTermOpt : gw.api.productmodel.CovTermOpt, hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true
    var allowedLimitsPersonalLiability = ConfigParamsUtil.getList(TC_FIREDWELLINGMEDICALPAYMENTSRESTRICTEDOPTIONS, hoLine.BaseState, hoLine.DPLI_Personal_Liability_HOE.PatternCode)
    var allowedLimitsPremiseLiability = ConfigParamsUtil.getList(TC_FIREDWELLINGMEDICALPAYMENTSRESTRICTEDOPTIONS, hoLine.BaseState, hoLine.DPLI_Premise_Liability_HOE_Ext.PatternCode)

     if(hoLine.BaseState == TC_CA){
       if({3000d,5000d}.contains(covTermOpt.Value.doubleValue())){
         result = hoLine.DPLI_Personal_Liability_HOEExists
      }else if(hoLine.DPLI_Premise_Liability_HOE_ExtExists and hoLine.Dwelling.Occupancy == TC_NONOWN){
        result = allowedLimitsPremiseLiability.hasMatch( \ limit -> limit?.toDouble() == covTermOpt.Value.doubleValue())
      }else if(hoLine.DPLI_Personal_Liability_HOEExists){
        result = allowedLimitsPersonalLiability.hasMatch( \ limit -> limit?.toDouble() == covTermOpt.Value.doubleValue())
      }

      if(1000d == covTermOpt.Value.doubleValue()){
        result = hoLine.Dwelling.Occupancy == DwellingOccupancyType_HOE.TC_OWNER
      }
    }

    return result
  }

  private static function isLossAssessmentLimitOptionAvailable(covTermOpt : gw.api.productmodel.CovTermOpt, dwelling : entity.Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL and dwelling.HOPolicyType == TC_DP3_Ext){
      if(dwelling.HOLine.DPLI_Personal_Liability_HOEExists){
        result = ConfigParamsUtil.getList(TC_LossAssessmentOptionsWithPersonalLiability, dwelling.Branch.BaseState).contains(covTermOpt.Value?.setScale(0, BigDecimal.ROUND_FLOOR)?.toString())
      }else if(dwelling.ResidenceType == TC_CONDO_EXT){
        result = ConfigParamsUtil.getList(TC_LossAssessmentOptionsCondoOnly, dwelling.Branch.BaseState).contains(covTermOpt.Value?.setScale(0, BigDecimal.ROUND_FLOOR)?.toString())
      }
    }

    return result
  }

  private static function isSpecialLimitOptionAvailable(hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.BaseState == TC_HI or hoLine.BaseState == TC_CA){
      result = hoLine.Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    }

    return result
  }

  private static function isLossAssessmentDeductibleAvailable(dwelling : entity.Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL){
      result = dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value > 2000bd
          and  ((dwelling.HOPolicyType == TC_HO6 and dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null) or (dwelling.HOPolicyType == TC_DP3_EXT and dwelling.ResidenceType == TC_CONDO_EXT))
    }

    return result
  }

  private static function isOrdinanceCovALimitAvailable(building : CPBuilding):boolean
  {
    if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVAONLY_EXT.Code ||
        building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVAANDC_EXT.Code ||
        building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code ||
        building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVACOMBINEDBC_EXT.Code)
      {
      return true
      }
  {
    return false
  }

  }

  private static function isOrdinanceCovBLimitAvailable(building : CPBuilding):boolean
  {
    if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT)
    {
      return true
    }
  {
    return false
  }


  }

  private static function isOrdinanceCovCLimitAvailable(building : CPBuilding):boolean
  {
    if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVCONLY_EXT.Code ||
        building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVAANDC_EXT.Code ||
        building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code)
    {
      return true
    }
  {
    return false
  }


  }

    private static function isOrdinanceCovBCCombinedLimitAvailable(building : CPBuilding):boolean
    {
      if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVACOMBINEDBC_EXT.Code)
      {
        return true
      }
    {
      return false
    }
         }

  private static function isOrdinanceCovABCCombinedLimitAvailable(building : CPBuilding):boolean
  {
    _logger.info("Entered isOrdinanceCovABCCombinedLimitAvailable"+ building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value+":"+typekey.CPOutdoorPropCovType_EXT.TC_COVAANDBCCOMBINED_EXT.Code)

    if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVAANDBCCOMBINED_EXT.Code)
    {
      _logger.info("returning true")
      return true
    }
  {
    _logger.info("returning false")
    return false
  }
  }

  private static function isOrdinanceCovCAvailable(building : CPBuilding):boolean
  {
    _logger.info("Entered isOrdinanceCovCAvailable"+ building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value+":"+typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code)


    if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code)
    {
      _logger.info("returning true")
      return true
    }
  {
    _logger.info("returning false")
    return false
  }


  }


  private static function isOrdinanceCovBAvailable(building : CPBuilding):boolean
{

  _logger.info("Entered isOrdinanceCovBAvailable"+ building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value
  +":"+typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code)

  if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code)
  {
    _logger.info("returning true")
    return true
  }
{
  _logger.info("returning false")
  return false
}

}

  private static function isOrdinanceCovBCCombinedAvailable(building : CPBuilding):boolean
  {
    _logger.info("Entered isOrdinanceCovBCCombinedAvailable " + building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value
    +":"+typekey.CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT.Code)


    if(building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVAANDBCCOMBINED_EXT.Code)
    //|| building.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCoverage_EXTTerm.Value==typekey.CPOutdoorPropCovType_EXT.TC_COVACOMBINEDBC_EXT.Code)
    {
      _logger.info("returning true")
      return true
    }
    else
    {
      _logger.info("returning false")
      return false
      }

  }

  private static function isExecutiveCoverageAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.PolicyLine.BaseState == TC_FL){
      result = dwelling.HOPolicyType == TC_HO3 and !dwelling.IsSecondaryOrSeasonal
    }

    return result
  }

  private static function isMedPayOptionAvailableVariantFilter(personalLiabilityLimit : BigDecimal, _option : gw.api.productmodel.CovTermOpt, state : Jurisdiction): boolean{
    var result = true

    if(state == TC_HI){     //Hawaii is a one-off.  If more than this exists in the future, probably move to a config parameter
      var limitsPairHigh = new Pair<BigDecimal, BigDecimal>(new BigDecimal(500000), new BigDecimal(5000))
      var limitsPairLow = new Pair<BigDecimal, BigDecimal>(new BigDecimal(300000), new BigDecimal(3000))

      if(personalLiabilityLimit == limitsPairHigh.First){
        result = _option.Value == limitsPairHigh.Second
      }else if(personalLiabilityLimit == limitsPairLow.First){
        result = _option.Value == limitsPairLow.Second
      }
    }

    return result
  }

  private static function isMedPayOptionAvailableStandardFilter(personalLiabilityLimit : BigDecimal, _option: gw.api.productmodel.CovTermOpt, state : Jurisdiction) : boolean{
    var result = true
    var personalLiabilityLimitThreshold = ConfigParamsUtil.getBigDecimal(ConfigParameterType_Ext.TC_MEDICALPAYMENTSLIMITTHRESHOLD, state)

    if(personalLiabilityLimit > personalLiabilityLimitThreshold){
      var allowedLimits = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_MEDICALPAYMENTRESTRICTEDOPTIONS, state)
      result = allowedLimits.hasMatch( \ limit -> limit?.toBigDecimal() == _option.Value)
    }

    return result
  }
}