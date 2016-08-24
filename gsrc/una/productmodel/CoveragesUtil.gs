package una.productmodel

uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/22/16
 * Time: 3:06 PM
 * To change this template use File | Settings | File Templates.
 */

class CoveragesUtil {
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
}