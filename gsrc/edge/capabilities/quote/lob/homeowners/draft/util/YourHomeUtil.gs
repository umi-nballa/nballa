package edge.capabilities.quote.lob.homeowners.draft.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.lob.homeowners.draft.dto.YourHomeDTO
uses edge.capabilities.quote.draft.dto.BaseTunaValueUtil
uses gw.lang.reflect.IType

final class YourHomeUtil extends BaseTunaValueUtil {

  construct() {
    throw new UnsupportedOperationException("This is an utility class.")
  }
  /**
   * Fills Guidewire-provided properties on the dto.
   */
  public static function fillBaseProperties(dto : YourHomeDTO, data : Dwelling_HOE) {

    mapTunaFields(data.HOLocation, dto, YourHomeDTO, TO)

    dto.DistanceToFireHydrant = data.HOLocation.DistanceToFireHydrant
    dto.DistanceToFireStation = data.HOLocation.DistanceToFireStation
    dto.DwellingLocation =   data.DwellingLocation
    dto.DwellingUsage = data.DwellingUsage
    dto.FloodingOrFireHazard = data.HOLocation.FloodingHazard
    dto.NearCommercial = data.HOLocation.NearCommercial
    dto.Occupancy = data.Occupancy
    dto.ResidenceType  = data.ResidenceType
  }

  /**
   * Updates base construction properties on the data if <code>dto</code> is not <code>null</code>.
   * If <code>dto</code> is <code>null</code> this method does nothing.
   */
  public static function updateFrom(data : Dwelling_HOE, dto : YourHomeDTO) {
    if (dto == null) {
      return
    }

    mapTunaFields(data.HOLocation, dto, YourHomeDTO, FROM)


    data.HOLocation.DistanceToFireHydrant = dto.DistanceToFireHydrant
    data.HOLocation.DistanceToFireStation = dto.DistanceToFireStation
    data.HOLocation.NearCommercial = dto.NearCommercial
    data.ResidenceType  = dto.ResidenceType
    data.DwellingLocation =   dto.DwellingLocation
    data.HOLocation.FloodingHazard = dto.FloodingOrFireHazard
    data.DwellingUsage = dto.DwellingUsage
    data.Occupancy = dto.Occupancy
    data.PolicyPeriod.CreditInfoExt.CreditReport.CreditStatus = dto.CreditStatus
    data.PolicyPeriod.HomeownersLine_HOE?.Dwelling.FirstTimeDeededHome_Ext = dto.FirstTimeDeededHome_Ext
    data.PolicyPeriod.HomeownersLine_HOE.ClueHit_Ext = dto.ClueHit_Ext




//    var pattern = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_Dwelling_Cov_HOE")
//    //Added for portal GPA - Start
//    var patternStructures = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_Other_Structures_HOE")
//    var patternProperty = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_Personal_Property_HOE")
//    var patternLossOfUse = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_Loss_Of_Use_HOE")
//    /*var pattern4 = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HOLI_Personal_Liability_HOE") - Not Required
//    var pattern5 = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HOLI_Med_Pay_HOE") - Not Required*/
//    var patternEFT = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_CC_EFT_HOE_Ext")
//    var patternFireDepartmentService = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_FireDepartmentService_HOE_Ext")
//    var patternHODebrisRemoval = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_HODebrisRemoval_HOE_Ext")
//    var patternLossAssessmentCov = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_LossAssessmentCov_HOE_Ext")
//    var patternTreesandPlans = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_TreesandPlans_HOE_Ext")
//    var patternHurricane = data.PolicyPeriod.HomeownersLine_HOE.Pattern.getCoveragePattern("HODW_SectionI_Ded_HOE")
//   //Added for portal GPA -End
//
//    if (data.ReplacementCost != null) {
//      data.setCoverageConditionOrExclusionExists(pattern, true)
//      //Added for portal GPA -START
//      data.setCoverageConditionOrExclusionExists(patternStructures, true)
//      data.setCoverageConditionOrExclusionExists(patternProperty, true)
//      data.setCoverageConditionOrExclusionExists(patternLossOfUse, true)
//      data.setCoverageConditionOrExclusionExists(patternEFT, true)
//      data.setCoverageConditionOrExclusionExists(patternFireDepartmentService, true)
//      data.setCoverageConditionOrExclusionExists(patternHODebrisRemoval, true)
//      data.setCoverageConditionOrExclusionExists(patternLossAssessmentCov, true)
//      data.setCoverageConditionOrExclusionExists(patternTreesandPlans, true)
//      data.setCoverageConditionOrExclusionExists(patternHurricane, true)
//      //Added for portal GPA -End
//
//      if (data.HODW_Dwelling_Cov_HOE.HasHODW_Dwelling_Limit_HOETerm){
//        data.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.setValue(data.ReplacementCost)
//
//        data.PolicyPeriod.CreditInfoExt.CreditReport.CreditStatus = dto.CreditStatus
//        data.PolicyPeriod.HomeownersLine_HOE?.Dwelling.FirstTimeDeededHome_Ext = dto.FirstTimeDeededHome_Ext
//        data.PolicyPeriod.HomeownersLine_HOE.ClueHit_Ext = dto.ClueHit_Ext
//        //data.policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClasscode = dto.DwellingProtectionClasscode
//        //data.policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeTunaReturned_Ext =dto.TerritoryCodeTunaReturned_Ext.
//
//      }
//    } else {
//      data.setCoverageConditionOrExclusionExists(pattern, false)
//    }

  }


}
