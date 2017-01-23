package una.rating.bp7.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/7/16
 * Common Rating info which stores all the factors used to calculate rates for BP7 Coverages
 */
class BP7RatingInfo {

  var _netAdjustmentFactor : BigDecimal as NetAdjustmentFactor = 1.0
  var _otherAdjustmentFactor : BigDecimal as OtherAdjustmentFactor = 1.0
  var _propertyBuildingAdjustmentFactor : BigDecimal as PropertyBuildingAdjustmentFactor = 1.0
  var _propertyContentsAdjustmentFactor : BigDecimal as PropertyContentsAdjustmentFactor = 1.0
  var _buildingBaseRate : BigDecimal as BuildingBaseRate = 1.0
  var _businessPersonalPropertyBaseRate : BigDecimal as BusinessPersonalPropertyBaseRate = 1.0

  construct(line : BP7Line){
    var policyPeriod = line.AssociatedPolicyPeriod
    var adjFactor = policyPeriod?.Factor_Ext
    if(policyPeriod?.ConsentToRateReceived_Ext and adjFactor != null and adjFactor != 0)
      _otherAdjustmentFactor = adjFactor
  }
}