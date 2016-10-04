package una.productmodel

uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.OptionCovTerm
uses java.util.HashMap

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
                                                                                                                                               "DPDW_Additional_LivingExpLimit_HOE"}}
                                                                                                                                               //TODO tlv DE18 - Fair Market Value has wrong pattern code
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
      default:
    }

    return result
  }

  public static function isExclusionAvailable(exclusionPattern : String, coverable : Coverable) : boolean{
    var result = true

    switch(exclusionPattern){
      case "HODW_WindstromExteriorPaintandWaterproofingExcl_HOENC_Ext":
      case "HODW_WindstromExteriorPaintandWaterproofingExcl_HOESC_Ext":
        result = isWindstormExteriorPaintExclusionAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_AckNoWindstromHail_HOE_Ext":
        result = isAcknowledgementOfNoWindstormHailExclusionAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_WindHurricaneHailExc_HOE_Ext":
        result = isWindHurricaneAndHailExclusionAvailable(coverable as HomeownersLine_HOE)
      default:
    }

    return result
  }

  public static function isConditionAvailable() : boolean{
    var result = true



    return result
  }

  public static function getExistence(pattern : String, coverable : Coverable) : ExistenceType{
    var result : ExistenceType

    switch(pattern){
      case "HODW_AckNoWindstromHail_HOE_Ext":
        result = getAcknowledgementOfNoWindstormHailCoverageExistence(coverable as HomeownersLine_HOE)
        break
      case "":

        break
      default:
    }

    return result
  }

  private static function isWorkersCompForEmployeesAvailable(hoLine: HomeownersLine_HOE) : boolean{
    return hoLine.BaseState == TC_CA
       and hoLine.DPLI_Personal_Liability_HOEExists
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

  private static function isAcknowledgementOfNoWindstormHailExclusionAvailable(hoLine: HomeownersLine_HOE) : boolean{
    var result = true

    result = !hoLine.Dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm

    return result
  }

  private static function isWindHurricaneAndHailExclusionAvailable(hoLine : HomeownersLine_HOE) : boolean{
    var applicableCounties = ConfigParamsUtil.getList(tc_WindstormHurricaneAndHailExclusionCounties, hoLine.BaseState)

    return applicableCounties.HasElements
       and applicableCounties.hasMatch( \ county -> county.equalsIgnoreCase(hoLine.HOLocation.PolicyLocation.County))
  }

  private static function getAcknowledgementOfNoWindstormHailCoverageExistence(hoLine : HomeownersLine_HOE) : ExistenceType{
    if(hoLine.Dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.OptionValue.OptionCode == "0_Excl"){
      return TC_REQUIRED
    }else{
      return TC_ELECTABLE
    }
  }
}