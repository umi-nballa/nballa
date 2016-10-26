package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPPolicyConditionMapper extends HPXPolicyConditionMapper {

  override function createCoverableInfo(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  function createScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()

    switch (currentPolicyCondition.PatternCode) {
      case "CPFloridaHurricanePercentCondition_EXT" :
          var calendarYearHurricaneDeductible = createCalendarYearHurricaneDeductible(currentPolicyCondition, previousPolicyCondition, transactions)
          for (item in calendarYearHurricaneDeductible) { limits.add(item)}
          break
      case "CPFloridaEachHurricanePerctCondition_EXT" :
          var perOccurenceHurricaneDeductible = createPerOccurenceHurricaneDeductible(currentPolicyCondition, previousPolicyCondition, transactions)
          for (item in perOccurenceHurricaneDeductible) { limits.add(item)}
          break
    }
    return limits
  }

  function createCalendarYearHurricaneDeductible(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var deductibleType = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanededtype
    if (deductibleType == typekey.CPHurricaneDedType_Ext.TC_CPBLDGCALENDARYEAR_EXT) {
      var deductiblePercentage = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanepercded
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentPolicyCondition.PatternCode
      limit.CoverageSubCd = deductibleType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = deductiblePercentage != null ? deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED2PERCENT_EXT ? 2 : 0 : 0
      limit.FormatText = ""
      limit.LimitDesc = ""
      limit.WrittenAmt.Amt = 0.00
      limits.add(limit)
    }
    return limits
  }

  function createPerOccurenceHurricaneDeductible(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var deductibleType = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanededtype
    if (deductibleType == typekey.CPHurricaneDedType_Ext.TC_CPBLDGPEROCCURRENCE_EXT) {
      var deductiblePercentage = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanepercded
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentPolicyCondition.PatternCode
      limit.CoverageSubCd = deductibleType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = deductiblePercentage != null ? deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED2PERCENT_EXT ? 2 : 0 : 0
      limit.FormatText = ""
      limit.LimitDesc = ""
      limit.WrittenAmt.Amt = 0.00
      limits.add(limit)
    }
    return limits
  }
}