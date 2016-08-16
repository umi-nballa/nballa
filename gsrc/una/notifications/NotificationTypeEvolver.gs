package una.notifications

uses una.config.ConfigParamsUtil
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/2/16
 * Time: 1:48 PM
 * To change this template use File | Settings | File Templates.
 */
class NotificationTypeEvolver {
  private var _policyPeriod : PolicyPeriod

  construct(policyPeriod : PolicyPeriod){
    _policyPeriod = policyPeriod
  }

  function evolveActionType(notificationActionType : NotificationActionType) : NotificationActionType{
    var result : NotificationActionType

    switch(notificationActionType){
      case TC_UWPERIOD:
        result = evolveUWPeriodActionType(notificationActionType)
        break
      default:
        result = notificationActionType
        break
    }

    return result
  }

  function inferActionType(category : NotificationCategory) : NotificationActionType{
    var result : NotificationActionType

    switch(category){
      case tc_uwcancel:
        result = inferUWCancelCategoryActionType(category)
        break
      default:
        break
    }

    return result
  }

  private function evolveUWPeriodActionType(notificationActionType : NotificationActionType) : NotificationActionType {
    var result = notificationActionType
    var notificationTypeCodes = typekey.NotificationActionType.getTypeKeys(false)

    if(ConfigParamsUtil.getBoolean(TC_ShouldEvolveUWFreePeriodActionType, _policyPeriod.BaseState, _policyPeriod.HomeownersLine_HOEExists)){
      result = _policyPeriod.HomeownersLine_HOE.HOPolicyType.Categories.firstWhere( \ elt -> elt.isOneOf(notificationTypeCodes)) as NotificationActionType
    }

    return result
  }

  private function inferUWCancelCategoryActionType(category : NotificationCategory) : NotificationActionType{
    var result : NotificationActionType

    if(ConfigParamsUtil.getBoolean(TC_ShouldInferUWCancelActionType, _policyPeriod.BaseState, _policyPeriod.BP7LineExists)
       and _policyPeriod.BP7Line.AllBuildings*.AdditionalInterests.hasMatch( \ elt1 -> elt1.AdditionalInterestType == TC_MORTGAGEE)){//TODO tlv may need to grab additional interests from other entities if/when they are added
      result = tc_UWCancelInferred
    }

    return result
  }
}