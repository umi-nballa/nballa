package gw.lob.ho

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext
uses java.util.HashSet
uses java.lang.Integer
uses java.util.TreeMap
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses java.lang.Double
uses java.text.NumberFormat
uses gw.api.domain.covterm.OptionCovTerm

class CoveragesValidation_HOE extends PCValidationBase {

  var _holine : HomeownersLine_HOE
  var _dwelling : Dwelling_HOE
  
  construct(valContext : PCValidationContext, holine: HomeownersLine_HOE) {
    super(valContext)
    _holine = holine
    _dwelling = holine.Dwelling
  }
  
  override function validateImpl() {
    Context.addToVisited(this, "validateImpl")
    checkEmptyLocations()
    checkEmptyScheduledItems()
    _dwelling.Coverages.each(\ d -> checkUniqueDescription(d))
    _dwelling.Coverages.each(\ d -> checkUniqueDwellingLocation(d))
    _holine.HOLineCoverages.each(\ d -> checkUniqueLocation(d))
    validateDeductibleAmounts()
  }
  
  function checkEmptyLocations() {
    if (_holine.HOLI_OtherInsuredResidence_HOEExists) {
      if (_holine.HOLI_OtherInsuredResidence_HOE.CoveredLocations.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.OtherInsuredResidenceEmpty)
      }
    }
  }
  
  function checkEmptyScheduledItems() {
    if (_dwelling.HODW_SpecificStructuresOffPremise_HOEExists) {
      if (_dwelling.HODW_SpecificStructuresOffPremise_HOE.ScheduledItems.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.SpecificStructuresOffPremiseEmpty)
      }
    }
    if (_dwelling.HODW_ScheduledProperty_HOEExists) {
      if (_dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.ScheduledPropertyEmpty)
      }
    }
    if (_dwelling.HODW_SpecialLimitsCovC_HOEExists) {
      if (_dwelling.HODW_SpecialLimitsCovC_HOE.ScheduledItems.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.SpecialLimitsCovC)
      }
    }
    if (_dwelling.HODW_OtherStructuresOnPremise_HOEExists) {
      if (_dwelling.HODW_OtherStructuresOnPremise_HOE.ScheduledItems.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.OtherStructuresOnPremiseEmpty)
      }
    }
    if (_holine.HOSL_OutboardMotorsWatercraft_HOE_ExtExists) {
      if (_holine.HOSL_OutboardMotorsWatercraft_HOE_Ext.scheduledItem_Ext.length == 0) {
        Result.addError(_holine, "default", displaykey.Web.Policy.HomeownersLine.Validation.OutboardMotorsWatercraftEmpty_Ext)
      }
    }
    if (_holine.HOSL_WatercraftLiabilityCov_HOE_ExtExists) {
      if (_holine.HOSL_WatercraftLiabilityCov_HOE_Ext.scheduledItem_Ext.length == 0) {
        Result.addError(_holine, "default", displaykey.Web.Policy.HomeownersLine.Validation.WatercraftLiabilityEmpty_Ext)
      }
    }

  }
  
  function checkUniqueDescription(cov: DwellingCov_HOE){
    var descriptions = new HashSet<String>()
    var items = new TreeMap<Integer,ScheduledItem_HOE>()
    cov.ScheduledItems.each(\ s -> items.put(s.ItemNumber, s))
    for(item in items.Values index row){
      if(item.Description != null){
        if(descriptions.contains(item.Description.toUpperCase())){
          Context.Result.addError(item, "default", displaykey.Web.Policy.HomeownersLine.Validation.DuplicateItemDescription(cov.DisplayName), "HOCoverages")
          break
        }
        descriptions.add(item.Description.toUpperCase())
      }
    }
  }
  
  function checkUniqueDwellingLocation(cov: DwellingCov_HOE){
    if (!(cov typeis HODW_SpecificStructuresOffPremise_HOE)) {
      var locations = new HashSet<entity.PolicyLocation>()
      var items = new TreeMap<Integer,ScheduledItem_HOE>()
      cov.ScheduledItems.each(\ s -> items.put(s.ItemNumber, s))
      for(item in items.Values index row){
        if(item.PolicyLocation != null){
          if(locations.contains(item.PolicyLocation)){
            Context.Result.addError(item, "default", displaykey.Web.Policy.HomeownersLine.Validation.DuplicateLocationDescription(cov.DisplayName), "HOCoverages")
            break
          }
          locations.add(item.PolicyLocation)
        }
      }
    }
  }

  function checkUniqueLocation(cov: HomeownersLineCov_HOE){
    var locations = new HashSet<entity.PolicyLocation>()
    var covLocations = new TreeMap<Integer,CoveredLocation_HOE>()
    cov.CoveredLocations.each(\ s -> covLocations.put(s.LocationNumber, s))
    for(covLocation in covLocations.Values index row){
      if(covLocation.PolicyLocation != null){
        if(locations.contains(covLocation.PolicyLocation)){
          Context.Result.addError(covLocation, "default", displaykey.Web.Policy.HomeownersLine.Validation.DuplicateLocationDescription(cov.DisplayName), "HOCoverages")
          break
        }
        locations.add(covLocation.PolicyLocation)
      }
    }
  }

  private function validateDeductibleAmounts(){
    validateNamedStormDeductible()
    validateHurricaneDeductible()
    validateMinimumWindHailDeductible()
    validateAllOtherPerilsDeductible()
  }

  private function validateNamedStormDeductible(){
    var namedStormCovTerm = _holine.Dwelling.HODW_SectionI_Ded_HOE.HODW_NamedStrom_Ded_HOE_ExtTerm
    var currentTerritoryCodes = _holine.Dwelling.TerritoryCodeOrOverride

    validateNamedStormPercentage(namedStormCovTerm, {currentTerritoryCodes})
    validateNamedStormDollarAmount(namedStormCovTerm, {currentTerritoryCodes})
  }

  private function validateHurricaneDeductible(){
    var allOtherPerilsValue = _holine.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
    var covAValue = _holine.Dwelling.DwellingLimitCovTerm.Value
    var territoriesToValidate = ConfigParamsUtil.getList(TC_TerritoryCodesToValidateHurricanePercentage, _holine.BaseState, _holine.HOPolicyType)
    var territoryCodes = {_holine.Dwelling.TerritoryCodeOrOverride}
    var hurricaneCovTerm = _holine.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm
                                                 var hurricaneCovTermValue = hurricaneCovTerm.Value
    if(territoriesToValidate?.intersect(territoryCodes)?.Count > 0){
      var minimum = ConfigParamsUtil.getDouble(TC_HurricaneDeductiblePerecentageMinimum, _holine.BaseState)
      var minText = (minimum < 1) ? ((minimum * 100) + "%") : new Double(minimum)?.asMoney()

      if(hurricaneCovTerm.Value.doubleValue() < minimum){
        Context.Result.addError(_dwelling, "default", displaykey.una.coverages.SectionIDeductibleError(hurricaneCovTerm.Pattern.Name, territoryCodes.toList(), minText), "HOCoverages")
      }
    }else if(_holine.BaseState == TC_FL and (covAValue!= null and hurricaneCovTerm.Value != null and (hurricaneCovTerm.Value * covAValue) < allOtherPerilsValue)){
      Context.Result.addError(_dwelling, "default", displaykey.una.coverages.SectionIDeductibleHurricaneAOPError, "HOCoverages")
    }
  }

  private function validateMinimumWindHailDeductible(){
    var windHailCovTerm = _holine.Dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
    var territoriesToValidate = ConfigParamsUtil.getList(TC_TerritoryCodesToValidateWindHail, _holine.BaseState, _holine.HOPolicyType)
    var territoryCodes =  {_holine.Dwelling.TerritoryCodeOrOverride}
    var minimum = ConfigParamsUtil.getDouble(TC_WindHailDeductibleMinimumPercentage, _holine.BaseState)
    var minText = (minimum < 1) ? ((minimum * 100) + "%") : new Double(minimum)?.asMoney()

    if(territoriesToValidate?.intersect(territoryCodes)?.Count > 0 and isCalculatedDeductibleLessThanCalculatedMinimum(windHailCovTerm.Value, minimum)){
      Context.Result.addError(_dwelling, "default", displaykey.una.coverages.SectionIDeductibleError(windHailCovTerm.Pattern.Name, territoryCodes.toList(), minText), "HOCoverages")
    }
  }

  private function validateAllOtherPerilsDeductible(){
    var allPerilsCovTerm = _holine.Dwelling.AllPerilsOrAllOtherPerilsCovTerm
    var territoriesToValidate = ConfigParamsUtil.getList(TC_TerritoryCodesToValidateAllPerils, _holine.BaseState, _holine.HOPolicyType)
    var territoryCodes =  {_holine.Dwelling.TerritoryCodeOrOverride}
    var minimum = ConfigParamsUtil.getDouble(TC_AllPerilsMinimumPercentage, _holine.BaseState)
    var minText = (minimum < 1) ? ((minimum * 100) + "%") : new Double(minimum)?.asMoney()

    if(territoriesToValidate?.intersect(territoryCodes)?.Count > 0 and isCalculatedDeductibleLessThanCalculatedMinimum(allPerilsCovTerm.Value, minimum)){
      Context.Result.addError(_dwelling, "default", displaykey.una.coverages.SectionIDeductibleError(allPerilsCovTerm.Pattern.Name, territoryCodes.toList(), minText), "HOCoverages")
    }
  }

  private function validateNamedStormPercentage(namedStormCovTerm : OptionCovTerm, currentTerritoryCodes : List<String>){
    var policyTypesToValidate = ConfigParamsUtil.getList(TC_PolicyTypesToValidateNamedStormPercentage, _holine.BaseState)

    if(policyTypesToValidate?.contains(_holine.HOPolicyType.Code)){
      var territoryCodesToValidate = ConfigParamsUtil.getList(TC_TerritoryCodesToValidateNamedStormPercentage, _holine.BaseState)

      if(territoryCodesToValidate?.intersect(currentTerritoryCodes).Count > 0 or shouldValidateForCounty()){
        var minimum = ConfigParamsUtil.getDouble(TC_NamedStormDeductibleMinPercentage, _holine.BaseState)

        if(minimum > namedStormCovTerm.Value){
          Context.Result.addError(_dwelling, "default", displaykey.una.coverages.SectionIDeductibleError(namedStormCovTerm.Pattern.Name, currentTerritoryCodes.toList(), (minimum * 100) + "%"), "HOCoverages")
        }
      }
    }
  }

  private function validateNamedStormDollarAmount(covTerm : OptionCovTerm, territoryCodes : List<String>){
    var policyTypesToValidate = ConfigParamsUtil.getList(TC_NamedStormValuePolicyTypes, _holine.BaseState)
    var covAValue = _holine.Dwelling.DwellingLimitCovTerm.Value

    if(policyTypesToValidate?.contains(_holine.HOPolicyType.Code)){
      var territoryCodesToValidate = ConfigParamsUtil.getList(tc_TerritoryCodesToValidateNamedStormValue, _holine.BaseState)

      if(territoryCodesToValidate.intersect(territoryCodes).Count > 0){
        var minimum = ConfigParamsUtil.getInt(tc_NamedStormDeductileDollarMin, _holine.BaseState)

        if(covAValue != null and covTerm.Value != null and minimum > (covTerm.Value * covAValue)){
          Context.Result.addError(_dwelling, "default", displaykey.una.coverages.SectionIDeductibleError(covTerm.Pattern.Name, territoryCodes.toList(), (minimum * 100) + "%"), "HOCoverages")
        }
      }
    }
  }

  private function shouldValidateForCounty() : boolean{
    var county = _holine.Dwelling.HOLocation.PolicyLocation.County
    return _holine.BaseState == TC_SC
            and (_holine.Dwelling.HOLocation.PolicyLocation.PostalCode?.startsWith("29492")
                 or county?.equalsIgnoreCase("Beaufort")
                 or county?.equalsIgnoreCase("Georgetown") and {_holine.Dwelling.TerritoryCodeOrOverride}?.contains("14"))
  }

  private function isCalculatedDeductibleLessThanCalculatedMinimum(deductible: double, minimum: double) : boolean{
    var result : boolean
    var coverageAValue = _holine.Dwelling.DwellingLimitCovTerm.Value

    if((minimum < 1 and deductible < 1) or (minimum > 1 and deductible > 1)){// if both are values that do not need to be converted
      result = deductible < minimum
    }else if(minimum < 1 and deductible > 1){//need to convert min to a dollar amount
      var calculatedMin = coverageAValue * minimum
      result = deductible < calculatedMin
    }else if(minimum > 1 and deductible < 1){
      var calculatedPercentage = deductible / coverageAValue
      result = minimum < calculatedPercentage
    }

    return result
  }

  static function validateCoveragesStep(holine : HomeownersLine_HOE) {
    PCValidationContext.doPageLevelValidation(\ context -> {
      var validation = new CoveragesValidation_HOE(context, holine)
      validation.validate()
    })
  }
}
