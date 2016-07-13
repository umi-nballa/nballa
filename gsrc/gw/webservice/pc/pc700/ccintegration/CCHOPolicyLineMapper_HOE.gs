package gw.webservice.pc.pc700.ccintegration

uses gw.webservice.pc.pc700.ccintegration.ccentities.CCPolicySummaryProperty
uses gw.webservice.pc.pc700.ccintegration.ccentities.CCPropertyRU
uses gw.webservice.pc.pc700.ccintegration.ccentities.CCPropertyCoverage

uses java.util.ArrayList
uses gw.api.domain.covterm.CovTerm
uses gw.webservice.pc.pc700.ccintegration.ccentities.CCCoverage
uses gw.webservice.pc.pc700.ccintegration.ccentities.CCCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.TypekeyCovTerm
uses gw.webservice.pc.pc700.ccintegration.ccentities.CCClassificationCovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.DirectCovTerm
uses gw.webservice.pc.pc700.ccintegration.ccentities.CCFinancialCovTerm
uses gw.api.domain.covterm.PackageCovTerm
uses gw.api.util.DisplayableException

@Deprecated("As of 8.0 use gw.webservice.pc.pc800.ccintegration.lob.CCHOPolicyLineMapper_HOE instead")
class CCHOPolicyLineMapper_HOE extends CCBasePolicyLineMapper {
  var _hoLine : HomeownersLine_HOE
  var _RUCount : int
  var _dwellingBasisForPercentage: BigDecimal
  var _propertyBasisForPercentage: BigDecimal
  
  construct(line : PolicyLine, policyGen : CCPolicyGenerator) {
    super(line, policyGen)
    _hoLine = line as HomeownersLine_HOE;
    choosePercentageBasis()
  }

  // Create a summary list of covered buildings for the PolicySummary that is returned for a search result (not a full policy mapping)
  override function mapPropertySummaries(propertyList : ArrayList<CCPolicySummaryProperty>) {
    var count = propertyList.Count;   // Use for numbering the properties across multiple lines    

    var dwelling = _hoLine.Dwelling
     
    if (_policyGen.meetsPolicySystemIDFilteringCriteria(dwelling.TypeIDString)) {
      var ccBld = new CCPolicySummaryProperty();
      ccBld.BuildingNumber = ""
      ccBld.PolicySystemID = dwelling.TypeIDString
      propertyList.add(ccBld);
        
      count = count + 1
      ccBld.PropertyNumber = count;

      var loc = dwelling.HOLocation.PolicyLocation
      ccBld.Location = loc.LocationNum.toString();

      ccBld.Address = loc.AddressLine1;
      if (loc.AddressLine2 <> "") { 
        ccBld.Address = ccBld.Address + ", " + loc.AddressLine2;
      }
      ccBld.City = loc.City;
    }
  }

  override function getLineCoverages() : List<entity.Coverage> {
    return _hoLine.HOLineCoverages as List<entity.Coverage>
  }
  
  /*
  override protected function setLineSpecificFields() {
    super.setLineSpecificFields()
    _ccPolicy.TotalProperties = 1 // TODO: I don't think this is correct
    
    // What else to set?    
  }
  */
  
  override function createRiskUnits() {
    // Keep a count as we add risk units.  This may start > 0 if other lines have been processed first.
    _RUCount = _ccPolicy.RiskUnits.Count;
    var startingCount = _RUCount;
    var skipCount = 0;   // Used to track how many "properties" were filtered out

    var dwelling = _hoLine.Dwelling
    var ccLoc = _policyGen.getOrCreateCCLocation(dwelling.HOLocation.PolicyLocation)
    var dwellingRU = new CCPropertyRU()
    _ccPolicy.addToRiskUnits(dwellingRU)

    _RUCount = _RUCount + 1
    dwellingRU.RUNumber = _RUCount

    dwellingRU.PolicyLocation = ccLoc
    dwellingRU.PolicySystemID = dwelling.TypeIDString
    
    // Create dwelling-level coverages
    for (cov in dwelling.Coverages) {
      var ccCov = new CCPropertyCoverage()
      populateCoverage(ccCov, cov)
      dwellingRU.addToCoverages( ccCov )
    }

    addToPropertiesCount(_RUCount - startingCount + skipCount);
  }
  
  override function handleCovTermSpecialCases(pcCov : Coverage, pcCovTerm : CovTerm, ccCov : CCCoverage, ccCovTerms : CCCovTerm[]) {

    super.handleCovTermSpecialCases(pcCov, pcCovTerm, ccCov, ccCovTerms);

    // Handle valuation method (Actual Cash Value vs. Replacement Cost)
    if ((pcCov.PatternCode == "DPDW_Dwelling_Cov_HOE") and (pcCovTerm.PatternCode == "DPDW_ValuationMethod_HOE"))   {
      // Map the values in PC that have corresponding values in CC
      (ccCov as CCPropertyCoverage).CoverageBasis = mapValuationMethod((pcCovTerm as TypekeyCovTerm).Value.Code)
    }
    if (isValuationMethodOptionCovTerm(pcCovTerm)){
      // Map the values in PC that have corresponding values in CC
      (ccCov as CCPropertyCoverage).CoverageBasis = mapValuationMethod((pcCovTerm as OptionCovTerm).OptionValue.OptionCode)
    }
    
    //Handle dwelling theft basis (Broad vs. Limited)
    if(isTheftBasisOptionCovTerm(pcCovTerm)){
      // Map the values in PC that have corresponding values in CC
      (ccCov as CCPropertyCoverage).CoverageBasis = mapTheftBasis((pcCovTerm as OptionCovTerm).OptionValue.OptionCode)
    }

  }

  //shouldn't need this, these should be typekeys
  //also need to map over DPDW_TheftBasis_HOE
  //The return values map to typekey codes in CC.  If a typekey does not exist then nothing will be displayed in CC
  override protected function mapValuationMethod(pcValMethod : String) : String {
    switch (pcValMethod) {
      //Valuation basis
      case HOValuationMethod_HOE.TC_HOACTUAL_HOE.Code:  
      case "Actual":         
        return "ACV";
      case HOValuationMethod_HOE.TC_HOREPLACEMENT_HOE.Code:  
      case "Replacement": 
        return "Replacement";
      default:
        // By default, return null if it cannot be mapped to any corresponding CC value
        return null;  
    }
  }

  //The return values map to typekey codes in CC.  If a typekey does not exist then nothing will be displayed in CC  
  protected function mapTheftBasis(pcTheftBasis : String) : String {
    switch(pcTheftBasis){
      //Dwelling Theft basis
      case HODwellingTheftBasis_HOE.TC_DPDW_BROAD_HOE.Code:
      case HODwellingTheftBasis_HOE.TC_DPDW_BROAD_HOE.DisplayName:
        return HODwellingTheftBasis_HOE.TC_DPDW_BROAD_HOE.DisplayName
      case HODwellingTheftBasis_HOE.TC_DPDW_LIMITED_HOE.Code:
      case HODwellingTheftBasis_HOE.TC_DPDW_LIMITED_HOE.DisplayName:
        return HODwellingTheftBasis_HOE.TC_DPDW_LIMITED_HOE.DisplayName
      default:
        // By default, return null if it cannot be mapped to any corresponding CC value
        return null;   
    }
  }

  /**
   * Generates CC CovTerms from a given PC CovTerm.  Some PC CovTerms map to only one
   * CC term, but package terms map to multiple cc terms.  
   */
  override protected function getCCCovTerms( covTerm : CovTerm) : CCCovTerm[] {

    var ccCovTerms: CCCovTerm[]
    
    if(isValuationMethodOptionCovTerm(covTerm) or isTheftBasisOptionCovTerm(covTerm)){
      ccCovTerms = createClassificationTermFromOption(covTerm as OptionCovTerm)
    }else if(isLimitOrDeductiblePercentage(covTerm)){
      ccCovTerms = createDollarAmountFromPercentage(covTerm)
    }else{ //is another covTerm handled by the super class
      ccCovTerms = super.getCCCovTerms(covTerm)
    }
    return ccCovTerms
  }
  
  /* Functions to determine cov term type */    
  private function isValuationMethodOptionCovTerm(pcCovTerm : CovTerm): boolean{
    return (pcCovTerm.PatternCode == "DPDW_PropertyValuation_HOE" or
        pcCovTerm.PatternCode == "HODW_DwellingValuation_HOE" or
        pcCovTerm.PatternCode == "HODW_PropertyValuation_HOE") and pcCovTerm typeis OptionCovTerm
  }
  
  private function isTheftBasisOptionCovTerm(pcCovTerm : CovTerm): boolean{
    return (pcCovTerm.PatternCode == "DPDW_TheftBasis_HOE") and pcCovTerm typeis OptionCovTerm
  }
  
  private function isLimitOrDeductiblePercentage(pcCovTerm : CovTerm): boolean{
    var percentage = false
    if(pcCovTerm.ModelType == CovTermModelType.TC_DEDUCTIBLE or  
      pcCovTerm.ModelType == CovTermModelType.TC_LIMIT ){
      //check whether the Value type is percentage
      if(pcCovTerm typeis DirectCovTerm){
         if(pcCovTerm.ValueType == typekey.CovTermModelVal.TC_PERCENT){
           percentage = true
         }
      } else if (pcCovTerm typeis OptionCovTerm) {
         if (pcCovTerm.Pattern.ValueType == typekey.CovTermModelVal.TC_PERCENT) { 
           percentage = true          
         }
      }
    } 
    return percentage
  }
  
  private function setBasicCovTermFields(ccTerm : CCCovTerm, pcTerm : CovTerm) {
    ccTerm.PolicySystemID = pcTerm.TypeIDString
    ccTerm.CovTermOrder = pcTerm.Pattern.Priority
    ccTerm.CovTermPattern = ProductModelTypelistGenerator.trimTypeCode(pcTerm.Pattern.Code)
  }

  /* Functions to convert from percentage to dollar amount */
  private function choosePercentageBasis(){
    _dwellingBasisForPercentage = _hoLine.Dwelling.DwellingLimit
    _propertyBasisForPercentage = _hoLine.Dwelling.PersonalPropertyLimit
  }

  /* covers the special case where an option cov term is used as classification.
   * option cov terms should not be used as classification, typekeys are used for this
   * elsewhere
   */
  private function createClassificationTermFromOption(optCovTerm: OptionCovTerm): CCCovTerm[]{
    var ccCovTerms: CCCovTerm[]

    var ccCovTermsList = new ArrayList<CCCovTerm>()
    var ccClassifCovTerm = new CCClassificationCovTerm()
    
    setBasicCovTermFields(ccClassifCovTerm, optCovTerm) 
    
    ccClassifCovTerm.ModelAggregation = optCovTerm.AggregationModel.Code
    ccClassifCovTerm.ModelRestriction = optCovTerm.RestrictionModel.Code
    
    ccClassifCovTerm.Code = optCovTerm.OptionValue.Code
    ccClassifCovTerm.Description = optCovTerm.OptionValue.Description

    ccCovTermsList.add(ccClassifCovTerm)
    ccCovTerms = ccCovTermsList.toTypedArray()
    
    return ccCovTerms
  }

  /* Covers the special case where a percentage cov term represents a limit or deductible.
   * In CC the limits and percentages have to be dollar amount.
   * The percentage is converted to a dollar amount.
   */
  private function createDollarAmountFromPercentage(covTerm: CovTerm): CCCovTerm[]{
    var ccCovTerms: CCCovTerm[]

    if ( covTerm typeis OptionCovTerm )  {
      var ccOptCovTerm = new CCFinancialCovTerm()
      setBasicCovTermFields(ccOptCovTerm, covTerm)
      ccOptCovTerm.ModelAggregation = covTerm.AggregationModel.Code
      ccOptCovTerm.ModelRestriction = covTerm.RestrictionModel.Code
      ccOptCovTerm.setFinancialAmount(dollarValueFromPercent(covTerm, covTerm.Value).ofDefaultCurrency())
      ccCovTerms = new CCCovTerm[] { ccOptCovTerm }
    } else if ( covTerm typeis PackageCovTerm ) { //package cov term
      ccCovTerms = new CCCovTerm[covTerm.PackageValue.PackageTerms.size()] 
      for( packageTerm in covTerm.PackageValue.PackageTerms index i) {
          var ccPackCovTerm = new CCFinancialCovTerm()
          setBasicCovTermFields(ccPackCovTerm, covTerm)
          ccPackCovTerm.PolicySystemID = covTerm.TypeIDString + "." + packageTerm.Code
          ccPackCovTerm.ModelAggregation = packageTerm.AggregationModel.Code
          ccPackCovTerm.ModelRestriction = packageTerm.RestrictionModel.Code
          ccPackCovTerm.setFinancialAmount(dollarValueFromPercent(covTerm, packageTerm.Value).ofDefaultCurrency())
          ccCovTerms[i] = ccPackCovTerm
      }
    } else if ( covTerm typeis DirectCovTerm )  { // direct cov term
      var ccDirCovTerm = new CCFinancialCovTerm()
      setBasicCovTermFields(ccDirCovTerm, covTerm)
      ccDirCovTerm.ModelAggregation = covTerm.AggregationModel.Code
      ccDirCovTerm.ModelRestriction = covTerm.RestrictionModel.Code
      ccDirCovTerm.setFinancialAmount(dollarValueFromPercent(covTerm, covTerm.Value).ofDefaultCurrency())
      ccCovTerms = new CCCovTerm[] { ccDirCovTerm }
    }
    
    return ccCovTerms
  }
  
  private function dollarValueFromPercent(covTerm: CovTerm, percent: BigDecimal) : BigDecimal{
    var dollarValue : BigDecimal = 0
    
    if(_dwellingBasisForPercentage == null and _propertyBasisForPercentage == null){
      throw new DisplayableException(displaykey.Web.Homeowners.CCMapping.DwellingPersonalPropertyLimitNotSet)
    }
    else if(_propertyBasisForPercentage == null){
      if(percent != null)
      dollarValue = _dwellingBasisForPercentage * percent / 100
    }
    else if(_dwellingBasisForPercentage == null){
      //should only be for HO4
      if(_hoLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4){
        if(percent != null)
        dollarValue = _propertyBasisForPercentage * percent / 100
      } else {
        throw new DisplayableException(displaykey.Web.Homeowners.CCMapping.DwellingBasisNeededButNotSetForPolicyType(_hoLine.HOPolicyType.DisplayName))
      }
    } else{ //both _propertyBasisForPercentage and _dwellingBasisForPercentage are set
      dollarValue = dollarValueFromPercentChosenFromPropertyOrDwelling(covTerm, percent)
    }
    return dollarValue
  }
  
  private function dollarValueFromPercentChosenFromPropertyOrDwelling(covTerm : CovTerm, percent: BigDecimal) : BigDecimal {
      var dollarValue : BigDecimal  = 0
      //if cov term option is a percentage of the personal property limit then calculate that, 
      //otherwise all other cases are based off of the dwelling limit then multiply by the dwellingBasisForPercentage
    if(percent!=null){
      switch(covTerm.PatternCode){
        //The following limits are based off of the personal property limit
        case "HODW_LossOfUsePropLimit_HOE":
          dollarValue = _propertyBasisForPercentage * percent / 100
          break
        //Coverages that do not have cov terms in the product model but still the personal property basis.  
        //Currently these terms will never make it into this method
        case "HODW_PersonalPropertyOffResidence_HOE":
        case "HODW_ScheduledProperty_HOE":
        case "HODW_SpecialLimitsCovC_HOE":
          dollarValue = _propertyBasisForPercentage * percent / 100
          break
        //The following are based off of the dwelling limit
        default:
          dollarValue = _dwellingBasisForPercentage * percent / 100
          break
      }
      }
      return dollarValue
  }
}
