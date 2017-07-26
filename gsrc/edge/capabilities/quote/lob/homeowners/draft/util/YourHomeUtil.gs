package edge.capabilities.quote.lob.homeowners.draft.util

uses edge.capabilities.quote.draft.dto.BaseTunaValueUtil
uses edge.capabilities.quote.lob.homeowners.draft.dto.YourHomeDTO

uses java.lang.Integer
uses java.lang.UnsupportedOperationException
uses gw.api.database.Query

final class YourHomeUtil extends BaseTunaValueUtil {

  construct() {
    throw new UnsupportedOperationException("This is an utility class.")
  }
  /**
   * Fills Guidewire-provided properties on the dto.
   */
  public static function fillBaseProperties(dto : YourHomeDTO, data : Dwelling_HOE) {

    mapTunaFields(data, dto, YourHomeDTO, TO)

    dto.DistanceToFireHydrant = data.HOLocation.DistanceToFireHydrant
    dto.DistanceToFireStation = data.HOLocation.DistanceToFireStation
    dto.DwellingLocation =   data.DwellingLocation
    dto.DwellingUsage = data.DwellingUsage
    dto.FloodingOrFireHazard = data.HOLocation.FloodingHazard
    dto.NearCommercial = data.HOLocation.NearCommercial
    dto.Occupancy = data.Occupancy
    dto.ResidenceType  = data.ResidenceType
    dto.BuilderWarranty = data.BuilderWarranty_Ext
    dto.BaseFloodElevationLevel = data.AbveBlwBaseFldElvtn_Ext
    dto.MultiPolicyDiscount = data.HOLine.MultiPolicyDiscount_Ext
    dto.InsuredTenantDiscount = data.InsuredTenantDiscount_Ext
    dto.ProtectedSubdivision = data.HOLocation.ProtectedSubDivision_Ext
    dto.SubdivisionName = data.HOLocation.SubdivisionName_Ext
    dto.FirePolicyNumber = data.PolicyPeriod.MultiPolicyDiscountPolicies_Ext.firstWhere( \ p -> p.PolicyType == typekey.TypeofPolicy_Ext.TC_DWELLINGFIRE).PolicyNumber
    dto.FloodPolicyNumber = data.PolicyPeriod.MultiPolicyDiscountPolicies_Ext.firstWhere( \ p -> p.PolicyType == typekey.TypeofPolicy_Ext.TC_FLOOD).PolicyNumber
    dto.HomeownersPolicyNumber  = data.PolicyPeriod.MultiPolicyDiscountPolicies_Ext.firstWhere( \ p -> p.PolicyType == typekey.TypeofPolicy_Ext.TC_HOMEOWNER).PolicyNumber
    dto.NumberOfUnitsBetweenFirewalls = Integer.valueOf(data.NumUnitsFireDivision_Ext)
    dto.IsRentedToOthers = data.DwellingRentedEverToOthers_Ext
    dto.IsNewPurchase = data.HomeNewPurchase_Ext
    dto.PurchaseDateNew = data.HomePurchaseDate_Ext
    dto.PurchaseDateOld = data.HomePurchaseMMYYYY_Ext
    dto.MoveInDate = data.MoveInDate_Ext
    dto.PriorResidenceType = data.PriorResidenceWas_Ext
    dto.IsPostFirm = data.PostFIRM_Ext
    dto.PriorFloodInsuranceProvider = data.PriorFloodInsProvider_Ext
    dto.PriorFloodInsuranceExpirationDate = data.PriorFloodInsuranceExpirationDate_Ext
    dto.HasBasementForFloodCoverage = data.BasementHome_Ext
    dto.IsOnBarrierIsland = data.BarrierIsland_Ext
    dto.IsPropertyInNonNFIPCommunity = data.PropertyLocatedIn_Ext
    dto.HasPropertyEverSustainedFloodDamage = data.SustainedFloodDmge_Ext
    dto.ElevatedRiskCredit = data.ElevatedRiskCredit_Ext
    dto.HasPreExistingDamage_EQCoverage = data.PreExstngEarthqukeDmg_Ext
    dto.IsBuiltOnSteepGrade_EQCoverage = data.Dwellingbuilt_Ext
    dto.IsDwellingBolted_EQCoverage = data.Dwellingbolted_Ext
    dto.HasCrippleWalls_EQCoverage = data.Cripplewalls_Ext
    dto.IsHotWaterHeaterSecured_EQCoverage = data.BldngFrameHeater_Ext
    dto.IsMasonryChimneyStrapped_EQCoverage = data.Masonrychimney_Ext
    dto.Construction_EQCoverage = data.EarthquakeConstrn_Ext
    dto.HasAffinityDiscount = data.PolicyPeriod.QualifiesAffinityDisc_Ext
    dto.PreferredEmployerName = data.PolicyPeriod.PreferredEmpGroup_Ext
    dto.DoesStoveSitOnNonCombustibleBase = data.Sittingonnoncombustiblebase
    dto.DoesStoveMeetOrdinancesAndCodes = data.HeatSrcInstalledbyLicIns
    dto.IsStoveULListed = data.ULListedstoveandchimneyflue
    dto.PreferredBuilderName = data.Branch.PreferredBuilder_Ext
    dto.FloodRiskType = data.FloodRiskType_Ext
    dto.CoastLocation = data.CoastLocation_Ext
    dto.OnBarrierIsland = data.BarrierIsland_Ext
    dto.ElectricalType = data.ElectricalType
    dto.EstimatedReplacementCost = data.CoverageAEstRepCostValue_Ext?.toBigDecimal()
  }

  /**
   * Updates base construction properties on the data if <code>dto</code> is not <code>null</code>.
   * If <code>dto</code> is <code>null</code> this method does nothing.
   */
  public static function updateFrom(data : Dwelling_HOE, dto : YourHomeDTO) {
    if (dto == null) {
      return
    }

    mapTunaFields(data, dto, YourHomeDTO, FROM)

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
    data.BuilderWarranty_Ext = dto.BuilderWarranty
    data.AbveBlwBaseFldElvtn_Ext = dto.BaseFloodElevationLevel
    data.HOLine.MultiPolicyDiscount_Ext = dto.MultiPolicyDiscount
    data.InsuredTenantDiscount_Ext = dto.InsuredTenantDiscount
    data.HOLocation.ProtectedSubDivision_Ext = dto.ProtectedSubdivision
    data.HOLocation.SubdivisionName_Ext = dto.SubdivisionName
    addOrRemovePolicyFromMultiDiscount(dto.FirePolicyNumber, data, typekey.TypeofPolicy_Ext.TC_DWELLINGFIRE)
    addOrRemovePolicyFromMultiDiscount(dto.FloodPolicyNumber, data, typekey.TypeofPolicy_Ext.TC_FLOOD)
    addOrRemovePolicyFromMultiDiscount(dto.HomeownersPolicyNumber, data, typekey.TypeofPolicy_Ext.TC_HOMEOWNER)
    data.NumUnitsFireDivision_Ext = Integer.toString(dto.NumberOfUnitsBetweenFirewalls)
    data.DwellingRentedEverToOthers_Ext = dto.IsRentedToOthers
    data.HomeNewPurchase_Ext = dto.IsNewPurchase
    data.HomePurchaseDate_Ext = dto.PurchaseDateNew
    data.HomePurchaseMMYYYY_Ext = dto.PurchaseDateOld
    data.MoveInDate_Ext = dto.MoveInDate
    data.PriorResidenceWas_Ext = dto.PriorResidenceType
    data.PostFIRM_Ext = dto.IsPostFirm
    data.PriorFloodInsProvider_Ext = dto.PriorFloodInsuranceProvider
    data.PriorFloodInsuranceExpirationDate_Ext = dto.PriorFloodInsuranceExpirationDate
    data.BasementHome_Ext = dto.HasBasementForFloodCoverage
    data.BarrierIsland_Ext = dto.IsOnBarrierIsland
    data.PropertyLocatedIn_Ext = dto.IsPropertyInNonNFIPCommunity
    data.SustainedFloodDmge_Ext = dto.HasPropertyEverSustainedFloodDamage
    data.ElevatedRiskCredit_Ext = dto.ElevatedRiskCredit
    data.PreExstngEarthqukeDmg_Ext = dto.HasPreExistingDamage_EQCoverage
    data.Dwellingbuilt_Ext = dto.IsBuiltOnSteepGrade_EQCoverage
    data.Dwellingbolted_Ext = dto.IsDwellingBolted_EQCoverage
    data.Cripplewalls_Ext = dto.HasCrippleWalls_EQCoverage
    data.BldngFrameHeater_Ext = dto.IsHotWaterHeaterSecured_EQCoverage
    data.Masonrychimney_Ext = dto.IsMasonryChimneyStrapped_EQCoverage
    data.EarthquakeConstrn_Ext = dto.Construction_EQCoverage
    data.PolicyPeriod.QualifiesAffinityDisc_Ext = dto.HasAffinityDiscount
    data.PolicyPeriod.PreferredEmpGroup_Ext = dto.PreferredEmployerName
    data.HeatSrcInstalledbyLicIns = dto.DoesStoveMeetOrdinancesAndCodes
    data.Sittingonnoncombustiblebase = dto.DoesStoveSitOnNonCombustibleBase
    data.ULListedstoveandchimneyflue = dto.IsStoveULListed
    data.Branch.PreferredBuilder_Ext = dto.PreferredBuilderName
    data.FloodRiskType_Ext = dto.FloodRiskType
    data.CoastLocation_Ext = dto.CoastLocation
    data.BarrierIsland_Ext = dto.OnBarrierIsland
    data.ElectricalType = dto.ElectricalType
    data.CoverageAEstRepCostValue_Ext = dto.EstimatedReplacementCost?.toPlainString()
  }

  private static function addOrRemovePolicyFromMultiDiscount(policyNumber : String, data : Dwelling_HOE, policyType : typekey.TypeofPolicy_Ext){
    var multiPolicyDiscount = data.PolicyPeriod.MultiPolicyDiscountPolicies_Ext.firstWhere( \ p -> p.PolicyType == policyType)
    if(policyNumber != null && !policyNumber.Empty){
      if(multiPolicyDiscount == null){
        addPolicyNumberToMultiDiscount(policyNumber, data, policyType)
      }
      else if(!policyNumber.equals(multiPolicyDiscount.PolicyNumber)){
        data.PolicyPeriod.removeFromMultiPolicyDiscountPolicies_Ext(multiPolicyDiscount)
        addPolicyNumberToMultiDiscount(policyNumber, data, policyType)
      }
    }
    else if((policyNumber == null || policyNumber.Empty) && multiPolicyDiscount != null){
      data.PolicyPeriod.removeFromMultiPolicyDiscountPolicies_Ext(multiPolicyDiscount)
    }
  }

  private static function addPolicyNumberToMultiDiscount(policyNumber : String, data : Dwelling_HOE,  policyType : typekey.TypeofPolicy_Ext){
    var policyForDiscount = new MultiPolicyDiscPolicy_Ext(data.PolicyPeriod)
    data.PolicyPeriod.addToMultiPolicyDiscountPolicies_Ext(policyForDiscount)
  }

}
