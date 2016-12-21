package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper

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
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentPolicyCondition.PatternCode) {
      case "CPFloridaPolicyChangesCondition_EXT" :
          var floridaPropertyChanges = createFloridaPropertyChanges(currentPolicyCondition, previousPolicyCondition, transactions)
          for (item in floridaPropertyChanges) { limits.add(item)}
          break
    }
    return limits
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
      deductible.FormatPct = deductiblePercentage != null ? deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED2PERCENT_EXT ? 2 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED3PERCENT_EXT ? 3 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED5PERCENT_EXT ? 5 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED10PERCENT_EXT ? 10 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDEDNOTAPPLICABLE_EXT ? 0 : 0 : 0
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
      deductible.FormatPct = deductiblePercentage != null ? deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED2PERCENT_EXT ? 2 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED3PERCENT_EXT ? 3 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED5PERCENT_EXT ? 5 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDED10PERCENT_EXT ? 10 :
                                                            deductiblePercentage == typekey.CPHurricanePercDed_Ext.TC_HURRICANEDEDNOTAPPLICABLE_EXT ? 0 : 0 : 0
      deductible.CoverageCd = currentPolicyCondition.PatternCode
      deductible.CoverageSubCd = deductibleType
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductibles.add(deductible)
    }
    return deductibles
  }


  function createFloridaPropertyChanges(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.FormatText = ""
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var currentPolicyPeriod = (currentPolicyCondition.OwningCoverable as CPLine).AssociatedPolicyPeriod
    var previousPolicyPeriod = policyPeriodHelper.getPreviousBranch(currentPolicyPeriod)
    var insured = (currentPolicyCondition.OwningCoverable as CPLine).AssociatedPolicyPeriod.PrimaryNamedInsured
    var insuredNameChanged = !insured.DisplayName.equals(insured.DisplayName)
    var insuredNameCurrent = insured.DisplayName
    var insuredNamePrevious = previousPolicyPeriod.PrimaryNamedInsured.DisplayName != null ? previousPolicyPeriod.PrimaryNamedInsured.DisplayName : ""
    var insuredName = insuredNameChanged ? "Insured_Name:" + insuredNameCurrent + "#" + insuredNamePrevious + "|"  : ""
    var mailingAddressChanged = true
    var mailingAddress = mailingAddressChanged ? "Mailing_Address: " + currentPolicyCondition.OwningCoverable.PolicyLocations.first().addressString(",", true, true) : ""
    limit.LimitDesc = insuredName + mailingAddress
    limit.WrittenAmt.Amt = 0.00
    limits.add(limit)
    return limits
  }


}