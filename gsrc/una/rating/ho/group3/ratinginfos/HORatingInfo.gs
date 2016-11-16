package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {

  var _aopKeyFactor: BigDecimal as AOPKeyFactor = 0.0
  var _aopBaseClassPremium: BigDecimal as AOPBaseClassPremium = 0.0
  var _adjustedAOPBasePremium: BigDecimal as AdjustedAOPBasePremium = 0.0
  var _finalAdjustedAOPBasePremium: BigDecimal as FinalAdjustedAOPBasePremium = 0.0

  var _windKeyFactor: BigDecimal as WindKeyFactor = 0.0
  var _windBaseClassPremium: BigDecimal as WindBaseClassPremium = 0.0
  var _windBasePremium: BigDecimal as WindBasePremium = 0.0
  var _adjustedWindBasePremium: BigDecimal as AdjustedWindBasePremium = 0.0
  var _finalAdjustedWindBasePremium: BigDecimal as FinalAdjustedWindBasePremium = 0.0

  var _protectionConstructionFactor: BigDecimal as ProtectionConstructionFactor = 0.0

  //discounts and surcharges for AOP Premium
  var _superiorConstructionDiscountForAOP: BigDecimal as SuperiorConstructionDiscountForAOP = 0.0
  var _seasonalSecondaryResidenceSurchargeForAOP: BigDecimal as SeasonalSecondaryResidenceSurchargeForAOP = 0.0
  var _matureHomeOwnerDiscountAOP : BigDecimal as MatureHomeOwnerDiscountAOP = 0.0
  var _higherAllPerilDeductibleAOP : BigDecimal as HigherAllPerilDeductibleAOP = 0.0
  var _ageOfHomeDiscountAOP: BigDecimal as AgeOfHomeDiscountAOP = 0.0

  //discounts and surcharges for Wind Premium
  var _ageOfHomeDiscountWind: BigDecimal as AgeOfHomeDiscountWind = 0.0
  var _higherAllPerilDeductibleWind : BigDecimal as HigherAllPerilDeductibleWind = 0.0
  var _superiorConstructionDiscountForWind: BigDecimal as SuperiorConstructionDiscountForWind = 0.0
  var _seasonalSecondaryResidenceSurchargeForWind: BigDecimal as SeasonalSecondaryResidenceSurchargeForWind = 0.0
  var _buildingCodeNonParticipatingRisksSurcharge : BigDecimal as BuildingCodeNonParticipatingRisksSurcharge = 0.0
  var _townHouseOrRowHouseSurchargeWind : BigDecimal as TownHouseOrRowHouseSurchargeWind = 0.0
  var _buildingCodeComplianceGradingCredit : BigDecimal as BuildingCodeComplianceGradingCredit = 0.0
  var _windstormResistiveFeaturesOfResidentialConstruction : BigDecimal as WindstormResistiveFeaturesOfResidentialConstruction = 0.0
}