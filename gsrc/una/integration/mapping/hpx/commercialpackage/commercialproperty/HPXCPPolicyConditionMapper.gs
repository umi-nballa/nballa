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

  override function createScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var deductibles = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>()
    return null
  }

  override function createDeductibleScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    var deductibles = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>()

    switch (currentPolicyCondition.PatternCode) {
      case "CPFloridaHurricanePercentCondition_EXT" :
          var calendarYearHurricaneDeductible = createCalendarYearHurricaneDeductible(currentPolicyCondition, previousPolicyCondition, transactions)
          for (item in calendarYearHurricaneDeductible) { deductibles.add(item)}
          break
      case "CPFloridaEachHurricanePerctCondition_EXT" :
          var perOccurenceHurricaneDeductible = createPerOccurenceHurricaneDeductible(currentPolicyCondition, previousPolicyCondition, transactions)
          for (item in perOccurenceHurricaneDeductible) { deductibles.add(item)}
          break
    }
    return deductibles
  }

  function createCalendarYearHurricaneDeductible(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    var deductibles = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>()
    var deductibleType = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanededtype
    if (deductibleType == typekey.CPHurricaneDedType_Ext.TC_CPBLDGCALENDARYEAR_EXT) {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      var deductiblePercentage = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanepercded
      deductible.FormatCurrencyAmt.Amt = 0.00
      deductible.FormatPct = deductiblePercentage != null ? deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED2PERCENT_EXT ? 2 : 0 : 0
      deductible.CoverageCd = currentPolicyCondition.PatternCode
      deductible.CoverageSubCd = deductibleType
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductibles.add(deductible)
    }
    return deductibles
  }

  function createPerOccurenceHurricaneDeductible(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    var deductibles = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>()
    var deductibleType = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanededtype
    if (deductibleType == typekey.CPHurricaneDedType_Ext.TC_CPBLDGPEROCCURRENCE_EXT) {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      var deductiblePercentage = (currentPolicyCondition.PolicyLine as CommercialPropertyLine).hurricanepercded
      deductible.FormatCurrencyAmt.Amt = 0.00
      deductible.FormatPct = deductiblePercentage != null ? deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED2PERCENT_EXT ? 2 : 0 : 0
      deductible.CoverageCd = currentPolicyCondition.PatternCode
      deductible.CoverageSubCd = deductibleType
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductibles.add(deductible)
    }
    return deductibles
  }
}