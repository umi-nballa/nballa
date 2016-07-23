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
    validateSpecialLimitsDirectCovTerms()
  }
  
  function checkEmptyLocations() {
    if (_holine.HOLI_OtherInsuredResidence_HOEExists) {
      if (_holine.HOLI_OtherInsuredResidence_HOE.CoveredLocations.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.OtherInsuredResidenceEmpty)
      }
    }
  }
  
  function checkEmptyScheduledItems() {
    if (_dwelling.HODW_PersonalPropertyOffResidence_HOEExists) {
      if (_dwelling.HODW_PersonalPropertyOffResidence_HOE.ScheduledItems.length == 0) {
        Result.addError(_dwelling, "default", displaykey.Web.Policy.HomeownersLine.Validation.PersonalPropertyOffResidenceEmpty)
      }
    }
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

  private function validateSpecialLimitsDirectCovTerms(){
    var covTermPatternsToValidate = ConfigParamsUtil.getList(TC_DERIVEDSPECIALLIMITSCOVTERMPATTERNS, _holine.BaseState)
    var covTermsToValidate = _holine.Dwelling.HODW_SpecialLimitsPP_HOE_Ext.CovTerms?.whereTypeIs(DirectCovTerm)
        ?.where( \ covTerm -> covTermPatternsToValidate?.contains(covTerm.PatternCode))

    covTermsToValidate?.each( \ covTerm -> {
      var minimumAllowed = determineMinimumAllowed(covTerm)
      var maximumAllowed = determineMaximumAllowed(covTerm)
      var incrementAmount = ConfigParamsUtil.getDouble(TC_SpecialLimitsIncrementAmount, _holine.BaseState, covTerm.PatternCode)
      var moneyFormatter = NumberFormat.getCurrencyInstance()

      if(covTerm.Value < minimumAllowed or covTerm.Value > maximumAllowed or !isAllowedValue(minimumAllowed, maximumAllowed, incrementAmount, covTerm)){
        Context.Result.addError(_dwelling, "default", displaykey.SpecialLimitErrorMessage(covTerm.Pattern.Name, moneyFormatter.format(minimumAllowed), moneyFormatter.format(maximumAllowed), moneyFormatter.format(incrementAmount)), "HOCoverages")
      }
    })
  }

  private function determineMinimumAllowed(covTerm : DirectCovTerm) : double{
    return ConfigParamsUtil.getDouble(TC_SpecialLimitsDirectMinimumDefault, _holine.BaseState, covTerm.PatternCode)
  }

  private function determineMaximumAllowed(covTerm : DirectCovTerm) : double{
    return ConfigParamsUtil.getDouble(TC_SpecialLimitsDirectMaximum, _holine.BaseState, covTerm.PatternCode)
  }

  private function isAllowedValue(minimumAllowed : double, maximumAllowed : double, incrementValue : double, covTerm : DirectCovTerm) : boolean {
    var baseState = _holine.BaseState
    var allowedIncrement = minimumAllowed
    var allowedIncrements : List<Double> = {allowedIncrement}

    while(allowedIncrement <= maximumAllowed){
      allowedIncrement += incrementValue
      allowedIncrements.add(allowedIncrement)
    }

    return allowedIncrements.contains(covTerm.Value.doubleValue())
  }
  
  static function validateCoveragesStep(holine : HomeownersLine_HOE) {
    PCValidationContext.doPageLevelValidation(\ context -> {
      var validation = new CoveragesValidation_HOE(context, holine)
      validation.validate()
    })
  }
}
