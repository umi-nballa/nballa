package gw.webservice.pc.pc800.ccintegration.lob

uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPolicySummaryProperty
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPropertyRU
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPropertyCoverage
uses gw.webservice.pc.pc800.ccintegration.CCBasePolicyLineMapper
uses gw.webservice.pc.pc800.ccintegration.CCPolicyGenerator

uses java.util.ArrayList
uses gw.api.domain.covterm.CovTerm
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCCoverage
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.TypekeyCovTerm
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCClassificationCovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.DirectCovTerm
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCFinancialCovTerm
uses gw.api.domain.covterm.PackageCovTerm
uses gw.api.util.DisplayableException
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCPolicy_RiskUnits
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCRiskUnit_Coverages
uses gw.webservice.pc.pc800.ccintegration.ProductModelTypelistGenerator
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCScheduledItem
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCRiskUnit_ScheduledItems
uses una.logging.UnaLoggerCategory

class CCHOPolicyLineMapper_HOE extends CCBasePolicyLineMapper {
  var _hoLine : HomeownersLine_HOE
  var _RUCount : int
  var _dwellingBasisForPercentage: BigDecimal = 0
  var _propertyBasisForPercentage: BigDecimal = 0

  static final var _logger = UnaLoggerCategory.UNA_CLAIMSMAPPING

  construct(line : PolicyLine, policyGen : CCPolicyGenerator) {
  super(line, policyGen)
  _hoLine = line as HomeownersLine_HOE;
  choosePercentageBasis()
}
  // Returns true if the Coverage should be excluded from what is sent to CC
  override function isCoverageExcluded(cov : Coverage) : Boolean {
    if(isCoverageToExcludeFromMapping(cov)){
      _excludedCoverages.add(cov.PatternCode)
    }
    return _excludedCoverages.contains(cov.PatternCode)
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
      ccBld.AddressLine1 = loc.AddressLine1
      if (loc.AddressLine2 <> "") {
        ccBld.AddressLine2 = loc.AddressLine2
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
    _RUCount = _ccPolicy.RiskUnits == null ? 0 : _ccPolicy.RiskUnits.Count
    var startingCount = _RUCount;
    var skipCount = 0;   // Used to track how many "properties" were filtered out

    var dwelling = _hoLine.Dwelling
    var ccLoc = _policyGen.getOrCreateCCLocation(dwelling.HOLocation.PolicyLocation)
    var dwellingRU = new CCPropertyRU()
    _ccPolicy.RiskUnits.add(new CCPolicy_RiskUnits(dwellingRU))

    _RUCount = _RUCount + 1
    dwellingRU.RUNumber = _RUCount

    dwellingRU.PolicyLocation = ccLoc
    dwellingRU.PolicySystemID = dwelling.TypeIDString
    
    // Create dwelling-level coverages
    for (cov in dwelling.Coverages) {
      if (!isCoverageExcluded(cov)) {
        var ccCov = new CCPropertyCoverage()
        populateCoverage(ccCov, cov)
        dwellingRU.Coverages.add(new CCRiskUnit_Coverages(ccCov))
      }
    }

    for(scheduledCov in dwelling.Coverages.ScheduledItems){
      var ccCov = new CCScheduledItem()
      populateScheduledItems(ccCov, scheduledCov)
      dwellingRU.ScheduledItems.add(new CCRiskUnit_ScheduledItems(ccCov))
    }

    addToPropertiesCount(_RUCount - startingCount + skipCount);
  }

  /*This function populates coverages of type ScheduledItems from PC to CC.
  * Defect fix DE-1597 - Mapping Scheduled Personal Property*/
  protected function populateScheduledItems(ccCov : CCScheduledItem, pcCov : ScheduledItem_HOE) {
    ccCov.Description = pcCov.Description
    ccCov.ItemNumber = pcCov.ItemNumber
    ccCov.ScheduleTypeDescription = pcCov.ScheduleType.Code
    ccCov.EffectiveDate = pcCov.EffectiveDate
    ccCov.ExpirationDate = pcCov.ExpirationDate
    ccCov.PolicySystemID = pcCov.TypeIDString
    ccCov.Type = mapToCCCoverageCode(pcCov.DwellingCov)
  }
  
  override function handleCovTermSpecialCases(pcCov : Coverage, pcCovTerm : CovTerm, ccCov : CCCoverage, ccCovTerms : CCCovTerm[]) {

    super.handleCovTermSpecialCases(pcCov, pcCovTerm, ccCov, ccCovTerms);

    // Handle valuation method (Actual Cash Value vs. Replacement Cost)
    if ((pcCov.PatternCode == "DPDW_Dwelling_Cov_HOE") and (pcCovTerm.PatternCode == "DPDW_ValuationMethod_HOE_Ext"))   {
      // Map the values in PC that have corresponding values in CC
      (ccCov as CCPropertyCoverage).CoverageBasis = mapValuationMethod((pcCovTerm as TypekeyCovTerm))
    }
    if (isValuationMethodCovTerm(pcCovTerm)){
      // Map the values in PC that have corresponding values in CC
      (ccCov as CCPropertyCoverage).CoverageBasis = mapValuationMethod((pcCovTerm as TypekeyCovTerm))
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
  protected function mapValuationMethod(pcValMethod : TypekeyCovTerm) : String {

    if(typekey.ValuationMethod.TF_REPLCOST_TYPE.TypeKeys.contains(pcValMethod.Value)){

      return "Replacement";
    } else if(typekey.ValuationMethod.TF_ACV_TYPE.TypeKeys.contains(pcValMethod.Value)){

      return "ACV";
    }else{

      _logger.info("mapValuationMethod couldn't map ${pcValMethod.Pattern.CodeIdentifier} - ${pcValMethod.Value.Code}")
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
    
    if(isTheftBasisOptionCovTerm(covTerm)){
      ccCovTerms = createClassificationTermFromOption(covTerm as OptionCovTerm)
    }else if(isLimitOrDeductiblePercentage(covTerm)){
      ccCovTerms = createDollarAmountFromPercentage(covTerm)
    }else if (isIdentityTheftPerDayTLIncomeSubLimit(covTerm)){
      //Fix for defect DE1223 # New Coverages added - HO Product Model
      ccCovTerms = createCCClassificationCovTermLessDetails(covTerm as OptionCovTerm)
    } else{ //is another covTerm handled by the super class
      ccCovTerms = super.getCCCovTerms(covTerm)
    }
    return ccCovTerms
  }
  
  /* Functions to determine cov term type */    
  private function isValuationMethodCovTerm(pcCovTerm : CovTerm): boolean{
    return {"DPDW_ValuationMethod_HOE_Ext",
            "DPDW_PropertyValuation_HOE_Ext",
            "HODW_DwellingValuation_HOE_Ext",
            "HODW_PropertyValuation_HOE_Ext",
            "HODW_LossRoofSurfValMethod_HOE_Ext"
           }.contains(pcCovTerm.PatternCode)

  }

  private function isIdentityTheftPerDayTLIncomeSubLimit(pcCovTerm : CovTerm) : boolean{
    return (pcCovTerm.PatternCode == "HODW_PerDayTLIncomeSublimit_HOE") and pcCovTerm typeis OptionCovTerm
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
    ccTerm.PolicySystemID = getCovTermTypeIDString(pcTerm)
    ccTerm.CovTermOrder = pcTerm.Pattern.Priority
    ccTerm.CovTermPattern = ProductModelTypelistGenerator.trimTypeCode(pcTerm.Pattern.CodeIdentifier)
  }

  /* Functions to convert from percentage to dollar amount */
  private function choosePercentageBasis(){
    _dwellingBasisForPercentage = _hoLine.Dwelling.DwellingLimitCovTerm.Value
    _propertyBasisForPercentage = _hoLine.Dwelling.PersonalPropertyLimitCovTerm.Value
  }

  private function createCCClassificationCovTermLessDetails(covTerm: OptionCovTerm): CCCovTerm[]{
    var ccCovTerms: CCCovTerm[]
    var ccCovTermsList = new ArrayList<CCCovTerm>()

    var ccStrCovTerm = new CCClassificationCovTerm()
    setBasicCovTermFields(ccStrCovTerm, covTerm)
    ccStrCovTerm.Description = covTerm.OptionValue.Description
    ccCovTermsList.add(ccStrCovTerm)
    ccCovTerms = ccCovTermsList.toTypedArray()

    return ccCovTerms
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
    
    ccClassifCovTerm.Code = optCovTerm.OptionValue.CodeIdentifier
    ccClassifCovTerm.Description = optCovTerm.OptionValue.Description

    ccCovTermsList.add(ccClassifCovTerm)
    ccCovTerms = ccCovTermsList.toTypedArray()
    
    return ccCovTerms
  }

  override protected function getCovTermTypeIDString(covTerm : CovTerm) : String {
    return "${covTerm.Clause.TypeIDString}.${covTerm.PatternCode}"
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
      ccOptCovTerm.FinancialAmount = dollarValueFromPercent(covTerm, covTerm.Value).ofDefaultCurrency()
      ccCovTerms = new CCCovTerm[] { ccOptCovTerm }
    } else if ( covTerm typeis PackageCovTerm ) { //package cov term
      ccCovTerms = new CCCovTerm[covTerm.PackageValue.PackageTerms.size()] 
      for( packageTerm in covTerm.PackageValue.PackageTerms index i) {
          var ccPackCovTerm = new CCFinancialCovTerm()
          setBasicCovTermFields(ccPackCovTerm, covTerm)
          ccPackCovTerm.PolicySystemID = getCovTermTypeIDString(covTerm) + "." + packageTerm.CodeIdentifier
          ccPackCovTerm.ModelAggregation = packageTerm.AggregationModel.Code
          ccPackCovTerm.ModelRestriction = packageTerm.RestrictionModel.Code
          ccPackCovTerm.FinancialAmount = dollarValueFromPercent(covTerm, packageTerm.Value).ofDefaultCurrency()
          ccCovTerms[i] = ccPackCovTerm
      }
    } else if ( covTerm typeis DirectCovTerm )  { // direct cov term
      var ccDirCovTerm = new CCFinancialCovTerm()
      setBasicCovTermFields(ccDirCovTerm, covTerm)
      ccDirCovTerm.ModelAggregation = covTerm.AggregationModel.Code
      ccDirCovTerm.ModelRestriction = covTerm.RestrictionModel.Code
      ccDirCovTerm.FinancialAmount = dollarValueFromPercent(covTerm, covTerm.Value).ofDefaultCurrency()
      ccCovTerms = new CCCovTerm[] { ccDirCovTerm }
    }
    
    return ccCovTerms
  }
  
  private function dollarValueFromPercent(covTerm: CovTerm, percent: BigDecimal) : BigDecimal{
    var dollarValue : BigDecimal = 0
    if(percent < 100){
      if(_dwellingBasisForPercentage == null and _propertyBasisForPercentage == null){
        throw new DisplayableException(displaykey.Web.Homeowners.CCMapping.DwellingPersonalPropertyLimitNotSet)
      }
      else if(_propertyBasisForPercentage == null){
        if(percent != null)
        dollarValue = _dwellingBasisForPercentage * percent
      }
      else if(_dwellingBasisForPercentage == null){
        //should only be for HO4
        if(_hoLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 or _hoLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT){
          if(percent != null)
          dollarValue = _propertyBasisForPercentage * percent
        } else {
          throw new DisplayableException(displaykey.Web.Homeowners.CCMapping.DwellingBasisNeededButNotSetForPolicyType(_hoLine.HOPolicyType.DisplayName))
        }
      } else{ //both _propertyBasisForPercentage and _dwellingBasisForPercentage are set
        dollarValue = dollarValueFromPercentChosenFromPropertyOrDwelling(covTerm, percent)
      }
     } else {
        dollarValue = percent
     }
    return dollarValue
  }
  
  private function dollarValueFromPercentChosenFromPropertyOrDwelling(covTerm : CovTerm, percent: BigDecimal) : BigDecimal {
      var dollarValue : BigDecimal = 0
      //if cov term option is a percentage of the personal property limit then calculate that, 
      //otherwise all other cases are based off of the dwelling limit then multiply by the dwellingBasisForPercentage
    if(percent!=null){
      switch(covTerm.PatternCode){
        //The following limits are based off of the personal property limit
        case "HODW_LossOfUsePropLimit_HOE":
          dollarValue = _propertyBasisForPercentage * percent
          break
        //Coverages that do not have cov terms in the product model but still the personal property basis.  
        //Currently these terms will never make it into this method
        case "HODW_PersonalPropertyOffResidence_HOE":
        case "HODW_ScheduledProperty_HOE":
        case "HODW_SpecialLimitsCovC_HOE":
        case "HOSL_OutboardMotorsWatercraft_HOE_Ext":
          dollarValue = _propertyBasisForPercentage * percent
          break
        //The following are based off of the dwelling limit
        default:
          dollarValue = _dwellingBasisForPercentage * percent
          break
      }
      }
      return dollarValue
  }

  /**
   * This method will be used to add BP7 Excluded Coverages
   */
  private function isCoverageToExcludeFromMapping(cov : Coverage) : Boolean {
    if((cov.PatternCode == "HODW_FireDepartmentService_HOE_Ext")){
      return true
    }
    return false
  }
}
