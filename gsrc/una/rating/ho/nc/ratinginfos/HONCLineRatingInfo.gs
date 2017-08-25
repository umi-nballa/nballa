package una.rating.ho.nc.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HONCLineRatingInfo {
  var _personalInjuryAgg : boolean as PersonalInjuryAggregate
  var _personalInjuryPer : boolean as PersonalInjuryPerOffense
  var _numberOfResidenceFamily : int as NumberOfResidenceFamily
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _firePersonalLiabilityLimit : BigDecimal as FirePersonalLiabilityLimit
  var _fireMedicalPaymentsLimit : BigDecimal as FireMedicalPaymentsLimit
  var _additionalResidencesRentedToOthers: int as AdditionalResidencesRentedToOthers
  var _line : HomeownersLine_HOE as Line
  var _clericalEmployees : BigDecimal as ClericalEmployees
  var _salespersonsCollectorsIncluded : BigDecimal as SalespersonsCollectorsIncluded
  var _salespersonsCollectorsExcluded : BigDecimal as SalespersonsCollectorsExcluded
  var _teachersWithCorporal : BigDecimal as TeachersWithCorporal
  var _teachersWithoutCorporal : BigDecimal as TeachersWithoutCorporal
  var _teachersNotClassifiedWithCorporal : BigDecimal as TeachersNotClassifiedWithCorporal
  var _teachersNotClassifiedWithoutCorporal : BigDecimal as TeachersNotClassifiedWithoutCorporal

  construct(line: HomeownersLine_HOE){
    _personalInjuryAgg = line.HOLI_PersonalInjuryAggregate_NC_HOE_ExtExists
    _personalInjuryPer = line.HOLI_PersonalInjury_NC_HOE_ExtExists
    if(line.DPLI_Med_Pay_HOEExists)
      _fireMedicalPaymentsLimit = line.DPLI_Med_Pay_HOE?.DPLI_MedPay_Limit_HOETerm?.Value
    if(line.DPLI_Personal_Liability_HOEExists)
      _firePersonalLiabilityLimit = line.DPLI_Personal_Liability_HOE?.DPLI_LiabilityLimit_HOETerm?.Value


     _numberOfResidenceFamily = line?.HOLI_AddResidenceRentedtoOthers_HOE?.CoveredLocations*.NumberOfFamilies?.atMostOne()

    _clericalEmployees = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NumClercEmp_HOE_ExtTerm?.Value
    _salespersonsCollectorsIncluded = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NumSCMIDSOP_HOE_ExtTerm?.Value
    _salespersonsCollectorsExcluded = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NumSCMIDSOP_Excl_HOE_ExtTerm?.Value
    _teachersWithCorporal = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NumTeachers_HOE_ExtTerm?.Value
    _teachersWithoutCorporal = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NumTeachers_NoCP_HOE_ExtTerm?.Value
    _teachersNotClassifiedWithCorporal = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NotOtherwiseclassified_HOE_ExtTerm?.Value
    _teachersNotClassifiedWithoutCorporal = line?.HOLI_BusinessPursuits_HOE_Ext?.HOLI_NotOtherwiseclassified_NoCP_HOE_ExtTerm?.Value








  }


  property get AgeOfHome() : int {
    return  this.Line?.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate -  YearForAgeOfHomeCalc
  }

  property get YearForAgeOfHomeCalc() : int{
    return Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
  }
}