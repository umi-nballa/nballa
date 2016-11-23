package una.rating.ho.group2.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for the discounts and surcharges for the group2 states
 */
class HOGroup2DiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {
  var _namedStormDeductible : BigDecimal as NamedStormDeductible
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    if(line.Dwelling.HODW_SectionI_Ded_HOE.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
      _namedStormDeductible = line.Dwelling.HODW_SectionI_Ded_HOE.HODW_NamedStrom_Ded_HOE_ExtTerm.Value
    }
    _personalPropertyLimit = line.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
  }
}