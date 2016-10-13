package gw.lob.ho.rating

uses gw.rating.AbstractRatingEngine
uses java.lang.Iterable
uses java.util.Date
uses gw.api.domain.financials.PCFinancialsLogger
uses java.math.RoundingMode
uses java.math.BigDecimal
uses gw.plugin.policyperiod.impl.PCRatingPlugin

@Export
class HORatingEngine_HOE extends AbstractRatingEngine<productmodel.HomeownersLine_HOE> {

  var _baseRatingDate : Date
  //  the following two values will be set once at the start of rating
  // and then shared by various specific rating functions
  var _homeownersBaseRate : BigDecimal
  var _homeownersDeductfactor : BigDecimal
  
  construct(hoLineArg : HomeownersLine_HOE) {
    super(hoLineArg)
    // set the base Rating using the first policyperiod in the term.
    // this will be used for U/W lookup and other basic items
    // rating date by object will be set separately
    _baseRatingDate = hoLineArg.Branch.FirstPeriodInTerm.getReferenceDateForCurrentJob( hoLineArg.BaseState )
  }

  // Homeowners is rated on a 365-day term for demo-rating purposes
  override protected property get NumDaysInCoverageRatedTerm() : int {
    return 365
  }

  override protected function existingSliceModeCosts() : Iterable<Cost> {
     return PolicyLine.Costs.where(\ c -> c typeis HomeownersCovCost_HOE or
                                     c typeis DwellingCovCost_HOE)
  }
  
  override protected function shouldRateThisSliceForward() : boolean {
    return false  
  }

  /*
  //  TODO 
  //  The way this is written, each slice will be re-rated.  To make it only rate the new slice:
  //    remove above shouldRateThisSliceForward
  //    add the proper constructors to the cost data classes to match the stuff below.
  override protected function createCostDataForCost (c : Cost) : CostData {
    switch( typeof c ) {
      case HomeownersCovCost: return new HomeownersCovCostData(c)
      case DwellingCovCost:   return new DwellingCovCostData(c)
      default: throw "Unepxected cost type ${c.DisplayName}"
    }
  }
  */
  
  override protected function rateSlice(lineVersion : HomeownersLine_HOE) {
    assertSliceMode(lineVersion)
    var logMsg = "Rating ${lineVersion} ${lineVersion.SliceDate} version..."
    PCFinancialsLogger.logInfo( logMsg  )
    if (lineVersion.Branch.isCanceledSlice()) {
      // Do nothing if this is a canceled slice  
    } else {
      setTheBaseRateAndDeductfactor(lineVersion)
      // rate the base premium
      rateBasePremium(lineVersion)
      
      // rate line level coverages
      for (cov in lineVersion.HOLineCoverages) {
        rateLineCoverages(cov)
      }
      //rate dwelling coverages
      for (cov in lineVersion.Dwelling.Coverages) {
        rateDwellingCoverages(cov, lineVersion.Dwelling)
      }
    }
    PCFinancialsLogger.logInfo( logMsg + "done" )  
  }
  
  private function setTheBaseRateAndDeductfactor(theLine : entity.HomeownersLine_HOE) {
    _homeownersBaseRate = 1
    switch (theLine.HOPolicyType) {
      case HOPolicyType_HOE.TC_HO3 :
        _homeownersBaseRate = 100000
        break
      case HOPolicyType_HOE.TC_HO4 :
        _homeownersBaseRate = 100000
        break
      case HOPolicyType_HOE.TC_HO6 :
        _homeownersBaseRate = 100000
        break
      case HOPolicyType_HOE.TC_DP3_EXT :
        _homeownersBaseRate = 100000
        break
      case HOPolicyType_HOE.TC_LPP_EXT :
          _homeownersBaseRate = 100000
          break
      default :
        PCFinancialsLogger.logDebug( "Unkown base premium for  ${(theLine.HOPolicyType)}")
    }
    
    _homeownersDeductfactor = 1.00
    if ( theLine.Dwelling.HODW_SectionI_Ded_HOEExists ) {
      switch (theLine.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.OptionValue) {
        case "100" :
          _homeownersDeductfactor = 1.05
          break
        case "250" :
          _homeownersDeductfactor = 1.00
          break
        case "500" :
          _homeownersDeductfactor = 0.96
          break
        case "1000" :
          _homeownersDeductfactor = 0.89
          break
        case "1500" :
          _homeownersDeductfactor = 0.84
          break
        case "2500" :
          _homeownersDeductfactor = 0.75
          break
      }
    }
  }
  
  private function rateBasePremium(lineVersion : HomeownersLine_HOE) {
    var start = lineVersion.SliceDate
    var end = getNextSliceDateAfter(start)
    var cost = new HomeownersBaseCostData_HOE(start, end, lineVersion.Branch.PreferredCoverageCurrency, RateCache, null)
    cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    
    var limit : BigDecimal = 1
    cost.StandardBaseRate = _homeownersBaseRate
    switch (lineVersion.HOPolicyType) {
      case HOPolicyType_HOE.TC_HO3 :
        limit = lineVersion.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
        break
      case HOPolicyType_HOE.TC_HO4 :
        limit = lineVersion.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
        break
      case HOPolicyType_HOE.TC_HO6 :
        limit = 100000/*(lineVersion.Dwelling.HODW_Personal_Property_HOE.HODW_PropertyHO4_6Limit_HOETerm.Value
              + lineVersion.Dwelling.HODW_Dwelling_Cov_HOE.Limit_HO6_HOETerm.Value) */
        break
      case HOPolicyType_HOE.TC_DP2 :
        limit = lineVersion.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value
        break
      case HOPolicyType_HOE.TC_DP3_EXT :
          limit = 100000
          break
      case HOPolicyType_HOE.TC_LPP_EXT :
          limit = 100000
          break
      default :
        PCFinancialsLogger.logDebug( "Unkown limt for  ${(lineVersion.HOPolicyType)}")
    }
    if(limit != null){
      var increasedlimitfactor = (1 + ((limit - 75000) * .007bd / 1000)) * cost.StandardBaseRate
      cost.StandardAdjRate = increasedlimitfactor * _homeownersDeductfactor  * getUWCompanyRateFactor(lineVersion)
      cost.StandardTermAmount = (cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateLineCoverages( cov : HomeownersLineCov_HOE ) {
    switch (typeof cov) {
      case HOLI_Personal_Liability_HOE :
        ratePersonalLiability(cov, cov.HOLI_Liability_Limit_HOETerm.OptionValue,
                  theDefaultValue(cov.HOLI_Liability_Limit_HOETerm.Pattern))
        break
      case DPLI_Personal_Liability_HOE : 
        ratePersonalLiabilityDP2(cov, cov.DPLI_LiabilityLimit_HOETerm.OptionValue,
                  theDefaultValue(cov.DPLI_LiabilityLimit_HOETerm.Pattern))
        break
      case HOLI_Med_Pay_HOE : 
        rateMedPay(cov, cov.HOLI_MedPay_Limit_HOETerm.OptionValue,
                  theDefaultValue(cov.HOLI_MedPay_Limit_HOETerm.Pattern))
        break
      case HOLI_OtherInsuredResidence_HOE :
        rateOtherResidence(cov)
        break
      case DPLI_Med_Pay_HOE : 
        rateMedPayDP2(cov, cov.DPLI_MedPay_Limit_HOETerm.OptionValue,
                  theDefaultValue(cov.DPLI_MedPay_Limit_HOETerm.Pattern))
        break
//      case HOLI_WaterCraft_Liability_HOE : 
//        rateWatercraftLiability(cov)
//        break
      default : 
        PCFinancialsLogger.logDebug( "Not rating ${(typeof cov)}")
    }
  }
  
  private function ratePersonalLiability(cov : HomeownersLineCov_HOE, value : productmodel.OptionHOLI_Liability_Limit_HOETypeValue, defaultValue : BigDecimal) {
    if (value.Value > defaultValue or cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new HomeownersCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis               = value.Value
      cost.StandardBaseRate    = 0
      if (cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
        cost.StandardBaseRate = 20
      }
      var increasedLimFac  = 5
      switch (value) {
        case "200k" :
          increasedLimFac = 5
          break
        case "300k" :
          increasedLimFac = 8
          break
        case "400k" :
          increasedLimFac = 10
          break
        case "500k" :
          increasedLimFac = 12
      }
      cost.StandardAdjRate     = (cost.StandardBaseRate + increasedLimFac) * getUWCompanyRateFactor(cov.HOLine)
      cost.StandardTermAmount  = (cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }

  private function ratePersonalLiabilityDP2(cov : HomeownersLineCov_HOE, value : productmodel.OptionDPLI_LiabilityLimit_HOETypeValue, defaultValue : BigDecimal) {
    if (value.Value > defaultValue or cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new HomeownersCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)

      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis               = value.Value
      cost.StandardBaseRate    = 0
      if (cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
        cost.StandardBaseRate = 20
      }
      var increasedLimFac  = 5
      switch (value) {
        case "200K" :
            increasedLimFac = 5
            break
        case "300k" :
            increasedLimFac = 8
            break
        case "400k" :
            increasedLimFac = 10
            break
        case "500k" :
            increasedLimFac = 12
      }
      cost.StandardAdjRate     = (cost.StandardBaseRate + increasedLimFac) * getUWCompanyRateFactor(cov.HOLine)
      cost.StandardTermAmount  = (cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP )
      cost.copyStandardColumnsToActualColumns()
      addCost(cost)
    }
  }
  
  private function rateMedPay(cov : HomeownersLineCov_HOE, value : productmodel.OptionHOLI_MedPay_Limit_HOETypeValue, defaultValue : BigDecimal) {
    if (value.Value > defaultValue or cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new HomeownersCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis               = value.Value
      cost.StandardBaseRate    = 0
      if (cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
        cost.StandardBaseRate = 5
      }
      var increasedLimFac  = 5
      switch (value) {
        case "2000" :
          increasedLimFac = 5
          break
        case "2500" :
          increasedLimFac = 4
          break
        case "3000" :
          increasedLimFac = 6
          break
        case "5000" :
          increasedLimFac = 12
          break
        case "10000" :
          increasedLimFac = 18
      }
      cost.StandardAdjRate     = (cost.StandardBaseRate + increasedLimFac) * getUWCompanyRateFactor(cov.HOLine)
      cost.StandardTermAmount  = (cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }

  private function rateMedPayDP2(cov : HomeownersLineCov_HOE, value : productmodel.OptionDPLI_MedPay_Limit_HOETypeValue, defaultValue : BigDecimal) {
    if (value.Value > defaultValue or cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new HomeownersCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)

      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis               = value.Value
      cost.StandardBaseRate    = 0
      if (cov.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
        cost.StandardBaseRate = 5
      }
      var increasedLimFac  = 5
      switch (value) {
        case "2000" :
            increasedLimFac = 5
            break
        case "2500" :
            increasedLimFac = 4
            break
        case "3000" :
            increasedLimFac = 6
            break
        case "5000" :
            increasedLimFac = 12
            break
        case "10000" :
            increasedLimFac = 18
      }
      cost.StandardAdjRate     = (cost.StandardBaseRate + increasedLimFac) * getUWCompanyRateFactor(cov.HOLine)
      cost.StandardTermAmount  = (cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP )
      cost.copyStandardColumnsToActualColumns()
      addCost(cost)
    }
  }

  private function rateOtherResidence(cov : HOLI_OtherInsuredResidence_HOE) {
    // retrieve scheduled items in seq by policy location
    var ratedportion : BigDecimal = 0
    var currentloc : entity.PolicyLocation
    for (loc in cov.CoveredLocations.sortBy(\ c -> c.PolicyLocation)) {
      if (currentloc != null and currentloc <> loc.PolicyLocation) {
        //rate that location and reset the value
        rateSingleOtherResidence(cov, currentloc, ratedportion)
        ratedportion = 0
      }
      currentloc = loc.PolicyLocation
      ratedportion = ratedportion + loc.LocationLimit.Code as BigDecimal
    }
    rateSingleOtherResidence(cov, currentloc, ratedportion)
  }
  
  private function rateSingleOtherResidence( cov : HOLI_OtherInsuredResidence_HOE, loc : PolicyLocation, ratedportion : BigDecimal) {
    var dwellingValue = getDwellingValue(cov.HOLine.Dwelling)
    if(dwellingValue != null and ratedportion > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new HOLocationCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId, loc.FixedId)
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      
      cost.Basis = ratedportion
      var increasedLimFac : BigDecimal = 7
      switch (ratedportion) {
        case 50000 :
          increasedLimFac = 7
          break
        case 75000 :
          increasedLimFac = 8
          break
        case 100000 :
          increasedLimFac = 11
          break
        case 200000 :
          increasedLimFac = 15
          break
        case 10000 :
          increasedLimFac = 18
      }
      cost.StandardBaseRate    = increasedLimFac
      cost.StandardAdjRate     = increasedLimFac * getUWCompanyRateFactor(cov.HOLine)
      cost.StandardTermAmount  = (cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
/*  
  private function rateWatercraftLiability(cov : HOLI_WaterCraft_Liability_HOE) {
    var start = cov.SliceDate
    var end = getNextSliceDateAfter(start)
    var cost = new HomeownersCovCostData_HOE(start, end, cov.FixedId)
    
    cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    cost.Basis               = cov.HOLI_WatercraftLimit_HOETerm.Value
    cost.StandardBaseRate    = 3
    var increasedLimFac      = Math.pow(.0002 * cost.Basis as double, -.5)
    cost.StandardAdjRate     = cost.StandardBaseRate * increasedLimFac * getUWCompanyRateFactor(lineVersion)
    cost.StandardTermAmount  = (cost.Basis * .001 * cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
    cost.copyStandardColumnsToActualColumns()  
    addCost(cost)
  }
  */

  private function rateDwellingCoverages( cov : DwellingCov_HOE, dwell : Dwelling_HOE ) {
    switch (typeof cov) {
      case HODW_Dwelling_Cov_HOE : 
        //  part of the base premium
        //rateDW_Dwelling_Cov(cov, cov.HODW_Dwelling_Limit_HOETerm.Value, dwell)
        break
      case DPDW_Dwelling_Cov_HOE : 
        // part of the base premium
        //rateDW_Dwelling_Cov(cov, cov.DPDW_Dwelling_Limit_HOETerm.Value, dwell)
        break
      case HODW_Other_Structures_HOE : 
        if ( dwell.HOPolicyType == HOPolicyType_HOE.TC_HO3 ) {
          rateOtherStructures(cov, cov.HODW_OtherStructures_Limit_HOETerm.Value, dwell,
              cov.HODW_OtherStructures_Limit_HOETerm.Value)
          // Change log: Sen Pitchaimuthu
          // Modified the last parameter to use the value propoerty instead of calling theDefaultvalue function
                //theDefaultValue(cov.HODW_OtherStructures_Limit_HOETerm.Pattern))
        }
        break
      case DPDW_Other_Structures_HOE :
        if ( dwell.HOPolicyType == HOPolicyType_HOE.TC_DP2 ) {
        rateOtherStructures(cov, cov.DPDW_OtherStructuresLimit_HOETerm.Value, dwell,
            // Change log: Sen Pitchaimuthu
            // Modified the last parameter to use the value propoerty instead of calling theDefaultvalue function
               cov.DPDW_OtherStructuresLimit_HOETerm.Value)
        }
        break
      case HODW_Personal_Property_HOE : 
        // only rate for HO3 - otherwise it is part of base premium
        if ( dwell.HOPolicyType == HOPolicyType_HOE.TC_HO3 ) {
          // Change log: Sen Pitchaimuthu
          // Modified the last parameter to use the value propoerty instead of calling theDefaultvalue function
          ratePersonalProperty(cov, cov.HODW_PersonalPropertyLimit_HOETerm.Value,
          cov.HODW_TheftDed_HOETerm.Value, dwell,cov.HODW_PersonalPropertyLimit_HOETerm.Value)
            //theDefaultValue(cov.HODW_PersonalPropertyLimit_HOETerm.Pattern))
        }
        break
      case DPDW_Personal_Property_HOE :
          // Change log: Sen Pitchaimuthu
          // Modified the last parameter to use the value propoerty instead of calling theDefaultvalue function

          ratePersonalProperty(cov, cov.DPDW_PersonalPropertyLimit_HOETerm.Value, 0, dwell,
            cov.DPDW_PersonalPropertyLimit_HOETerm.Value)
                //theDefaultValue(cov.DPDW_PersonalPropertyLimit_HOETerm.Pattern))
        break
      case HODW_Loss_Of_Use_HOE :
        //if HO3 use one covterm, else the other for HO4 and HO6
        if ( dwell.HOPolicyType == HOPolicyType_HOE.TC_HO3 ) {
          // Change log: Sen Pitchaimuthu
          // Modified the last parameter to use the value propoerty instead of calling theDefaultvalue function
          rateLossOfUse(cov, cov.HODW_LossOfUseDwelLimit_HOETerm.Value, dwell,
            cov.HODW_LossOfUseDwelLimit_HOETerm.Value)
        //        theDefaultValue(cov.HODW_LossOfUseDwelLimit_HOETerm.Pattern))
        } else {
          //TEMP premiumvalue
          var start = cov.SliceDate
          var end = getNextSliceDateAfter(start)
          var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
          cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

          cost.Basis = 100//dwellingValue * ratedportion * .01
          cost.StandardBaseRate    = _homeownersBaseRate
          var increasedlimitfactor = (1 + ((cost.Basis - 75000) * .007bd / 1000)) * 0.5 * cost.StandardBaseRate
          cost.StandardAdjRate = increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
          cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP )
          cost.copyStandardColumnsToActualColumns()
          addCost(cost)
        //rateLossOfUse(cov, cov.HODW_LossOfUsePropLimit_HOETerm.Value, dwell,
            //cov.HODW_LossOfUseDwelLimit_HOETerm.Value)
                //theDefaultValue(cov.HODW_LossOfUsePropLimit_HOETerm.Pattern))
        }
        break
      case DPDW_FairRentalValue_Ext :
          // Change log: Sen Pitchaimuthu
          rateLossOfUse(cov, cov.DPDW_FairRentalValue_ExtTerm.Value, dwell,
            cov.DPDW_FairRentalValue_ExtTerm.Value)
        break
      case HODW_OrdinanceCov_HOE : 
        rateOrdinanceOrLaw(cov, cov.HODW_OrdinanceLimit_HOETerm.Value, dwell)
        break
      case DPDW_OrdinanceCov_HOE : 
        rateOrdinanceOrLaw(cov, cov.DPDW_OrdinanceLimit_HOETerm.Value, dwell)
        break
      case HODW_Earthquake_HOE : 
        rateEarthquakeCov(cov, dwell)
        break
      case HODW_PersonalPropertyOffResidence_HOE :
        ratePersonalPropOffResidence(cov, dwell)
        break
      case  HODW_SpecificStructuresOffPremise_HOE :
        rateSpecificStructureOffPremises(cov, dwell)
        break
      case  HODW_ScheduledProperty_HOE :
        //rateScheduledPersonalProperty(cov, dwell)
        break
      case  HODW_SpecialLimitsCovC_HOE :
        rateScheduledSpecialPersonalProperty(cov, dwell)
        break
      case  HODW_OtherStructuresOnPremise_HOE :
        rateOtherStructuresOnPremises(cov, dwell)
        break
      default : 
        PCFinancialsLogger.logDebug( "Not rating ${(typeof cov)}")  
    }
  }

  private function theDefaultValue(pattern : gw.api.productmodel.OptionCovTermPattern ) : BigDecimal {
    var code = pattern.getDefaultValue(null)
    if (code != null) {
      return pattern.getCovTermOpt(code).Value
    }
    return null
  }
  
  private function rateOtherStructures(cov : DwellingCov_HOE, percentage : BigDecimal, 
          dwell : Dwelling_HOE, thedefaultValue : BigDecimal) {

    var ratedportion = percentage - thedefaultValue
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null and ratedportion > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis = dwellingValue * ratedportion * .01
      cost.StandardBaseRate    = _homeownersBaseRate
      var increasedlimitfactor = (1 + ((cost.Basis - 75000) * .007bd / 1000)) * 0.5 * cost.StandardBaseRate
      cost.StandardAdjRate = increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function ratePersonalProperty(cov: DwellingCov_HOE,
    percentage: BigDecimal, deduct: BigDecimal, dwell: Dwelling_HOE, thedefaultValue : BigDecimal) {

    var ratedportion = new BigDecimal(100)//percentage - thedefaultValue
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null and ratedportion > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis = dwellingValue * ratedportion * .01
      cost.StandardBaseRate    = _homeownersBaseRate
      var deductibleFactor     = _homeownersDeductfactor
      if (deduct != null and deduct > 0 and _homeownersDeductfactor == 1.05 ) {
        switch (deduct) {
          case 1000 :
            deductibleFactor = .9
            break
          case 2500 :
            deductibleFactor = .8
            break
          default :
            deductibleFactor = 1.0
        }
      }
      var increasedlimitfactor = (1 + ((cost.Basis - 75000) * .012 / 1000)) * cost.StandardBaseRate
      cost.StandardAdjRate     = increasedlimitfactor  * getUWCompanyRateFactor(dwell.HOLine) * deductibleFactor
      cost.StandardTermAmount  = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateLossOfUse(cov : DwellingCov_HOE, percentage : BigDecimal, 
                          dwell : Dwelling_HOE, thedefaultValue : BigDecimal) {

    var ratedportion = percentage - thedefaultValue
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null and ratedportion > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

      cost.Basis = dwellingValue * ratedportion * .01
      cost.StandardBaseRate    = _homeownersBaseRate
      var increasedlimitfactor = (1 + ((cost.Basis - 75000) * .007bd / 1000)) * 0.5 * cost.StandardBaseRate
      cost.StandardAdjRate = increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateOrdinanceOrLaw(cov : DwellingCov_HOE, percentage : BigDecimal, dwell : Dwelling_HOE) {
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis = dwellingValue * percentage * .01
      cost.StandardBaseRate    = .1
      cost.StandardAdjRate     = cost.StandardBaseRate * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount  = (cost.Basis * .01 * cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateEarthquakeCov( cov : HODW_Earthquake_HOE, dwell : Dwelling_HOE) {
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      cost.Basis = dwellingValue
      cost.StandardBaseRate    = .1
      var deductibleFactor     = 1.05 - .01 * cov.HODW_EarthquakeDed_HOETerm.Value
      cost.StandardAdjRate     = cost.StandardBaseRate * getUWCompanyRateFactor(dwell.HOLine) * deductibleFactor
      cost.StandardTermAmount  = (cost.Basis * .01 * cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function ratePersonalPropOffResidence(cov : HODW_PersonalPropertyOffResidence_HOE, dwell : Dwelling_HOE) {
    var percentage : BigDecimal = 0
    percentage = cov.ScheduledItems.sum(\ item -> (item.AdditionalLimit.Code as BigDecimal) )
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null and percentage > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      // this is a dwelling cost, since we are rating the whole schedule to just one cost row
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

      cost.Basis = dwellingValue * percentage * .01
      // do not use _homeownersBaseRate; always use the Personal Prop base rate
      cost.StandardBaseRate    = 33
      var increasedlimitfactor =  .074 * ( cost.Basis / 1000 )
      cost.StandardAdjRate = cost.StandardBaseRate * increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateSpecificStructureOffPremises(cov : HODW_SpecificStructuresOffPremise_HOE, dwell : Dwelling_HOE) {
    var itemsByLocation = cov.ScheduledItems.partition(\ item -> item.PolicyLocation)
    for (scheduleLocation in itemsByLocation.Keys) {
      var items = itemsByLocation[scheduleLocation]
      var percentage = items.sum(\ i -> (i.AdditionalLimit.Code as BigDecimal))
      rateSingleLocationsStructures(cov , dwell, scheduleLocation, percentage)
    }
  }
    
  private function rateSingleLocationsStructures(cov : HODW_SpecificStructuresOffPremise_HOE, dwell : Dwelling_HOE,
                        location : PolicyLocation, percentage : BigDecimal) {    
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null and percentage > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new ScheduleByLocCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId, location.FixedId)
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

      cost.Basis = dwellingValue * percentage * .01
      cost.StandardBaseRate    = _homeownersBaseRate 
      var increasedlimitfactor = (1 + ((cost.Basis - 75000) * .012 / 1000)) * 0.5 * cost.StandardBaseRate
      cost.StandardAdjRate = increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateScheduledPersonalProperty(cov : HODW_ScheduledProperty_HOE, dwell : Dwelling_HOE) {
    var itemsByScheduleType = cov.ScheduledItems.partition(\ item -> item.ScheduleType)
    for (scheduleType in itemsByScheduleType.Keys) {
      var items = itemsByScheduleType[scheduleType]
      var value = items.sum(\ i -> (i.ExposureValue as BigDecimal))
      rateSinglePersonalPropType(cov , dwell, scheduleType, value)
    }
  }
  
  private function rateSinglePersonalPropType(cov : HODW_ScheduledProperty_HOE, dwell : Dwelling_HOE,
                        currenttype : typekey.ScheduleType_HOE, value : BigDecimal) {    
    if(value != null and value > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      var cost = new ScheduleByTypeCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId, currenttype)
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

      cost.Basis = value
      cost.StandardBaseRate    = 33
      var increasedlimitfactor =  .074 * ( cost.Basis / 1000 )
      cost.StandardAdjRate = cost.StandardBaseRate * increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function rateScheduledSpecialPersonalProperty (cov : HODW_SpecialLimitsCovC_HOE, dwell : Dwelling_HOE) {
    for (item in cov.ScheduledItems) {
      if (item.ExposureValue != null and item.ExposureValue > 0 ) {
        var start = cov.SliceDate
        var end = getNextSliceDateAfter(start)
        var cost = new ScheduleCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId, item.FixedId)
        cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

        cost.Basis = item.ExposureValue
        cost.StandardBaseRate    = 33
        var increasedlimitfactor =  .074 * ( cost.Basis / 1000 )
        cost.StandardAdjRate = cost.StandardBaseRate * increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
        cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
        cost.copyStandardColumnsToActualColumns()  
        addCost(cost)
      }
    }
  }
  
  private function rateOtherStructuresOnPremises(cov : HODW_OtherStructuresOnPremise_HOE, dwell : Dwelling_HOE) {
    var percentage : BigDecimal = 0
    percentage = cov.ScheduledItems.sum(\ item -> (item.AdditionalLimit.Code as BigDecimal))
    var dwellingValue = getDwellingValue(dwell)
    if(dwellingValue != null and percentage > 0 ){
      var start = cov.SliceDate
      var end = getNextSliceDateAfter(start)
      // this is a dwelling cost, since we are rating the whole schedule to just one cost row
      var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
      cost.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm

      cost.Basis = dwellingValue * percentage * .01
      cost.StandardBaseRate    = _homeownersBaseRate
      var increasedlimitfactor = (1 + ((cost.Basis - 75000) * .007bd / 1000)) * cost.StandardBaseRate
      cost.StandardAdjRate = increasedlimitfactor * _homeownersDeductfactor * getUWCompanyRateFactor(dwell.HOLine)
      cost.StandardTermAmount = cost.StandardAdjRate.setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
      cost.copyStandardColumnsToActualColumns()  
      addCost(cost)
    }
  }
  
  private function getDwellingValue(dwell: Dwelling_HOE): BigDecimal{
    var basis: BigDecimal
    if (dwell.HOLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 or dwell.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2 ) {
      var dwellingCov = dwell.Coverages.firstWhere(\ d -> d typeis HODW_Dwelling_Cov_HOE or d typeis DPDW_Dwelling_Cov_HOE)
      if(dwellingCov != null){
        switch(typeof dwellingCov) {
        case HODW_Dwelling_Cov_HOE : 
          basis = dwellingCov.HODW_Dwelling_Limit_HOETerm.Value
          break
        case DPDW_Dwelling_Cov_HOE :
          basis = dwellingCov.DPDW_Dwelling_Limit_HOETerm.Value
          break
        }
      }
    } else {
      var dwellingCov = dwell.Coverages.firstWhere(\ d -> d typeis HODW_Personal_Property_HOE)
      basis = (dwellingCov as HODW_Personal_Property_HOE).HODW_PersonalPropertyLimit_HOETerm.Value
    }
    return basis
  }
  
  private function getUWCompanyRateFactor(line : entity.HomeownersLine_HOE) : BigDecimal {
    return line.Branch.getUWCompanyRateFactor(_baseRatingDate, line.BaseState.Code)
  }
  
  private property get RoundingLevel() : int {
    return PolicyLine.Branch.Policy.Product.QuoteRoundingLevel
  }
  
  protected override function rateWindow(line : HomeownersLine_HOE) {
    var logMsg = "Rating across policy term..."
    PCFinancialsLogger.logInfo(logMsg)
    assertSliceMode(line) // we need to be in slice mode to create costs, but we're creating costs for the whole window
     if ( line.Branch.RefundCalcMethod != "flat" )
    rateFlatRateCovs(line)
    //TODO
    //rateMultiPolicyDiscount(line)
    //rateCancellationShortRatePenalty(line)
    rateTaxes(line)
    PCFinancialsLogger.logInfo(logMsg + "done")
  }
  
  private function rateFlatRateCovs(line : HomeownersLine_HOE) {
    var dwellingTheftCov = line.Dwelling.VersionList.Coverages.map(\ covVL -> covVL.AllVersions.first() )
        .whereTypeIs(DPDW_Theft_HOE).first()
    if(dwellingTheftCov != null){
      rateDwellingTheft(line, dwellingTheftCov)
    }
    var otherStructuresOffPremisesCov = line.Dwelling.VersionList.Coverages.map(\ covVL -> covVL.AllVersions.first() )
          .whereTypeIs(HODW_OtherStructuresOffPremise_HOE).first()
    if (otherStructuresOffPremisesCov != null) {
      rateOtherStucturesOffPremises(line, otherStructuresOffPremisesCov)
    } 
  }
  
  private function rateDwellingTheft(line : HomeownersLine_HOE, cov : DPDW_Theft_HOE) {
    var start = line.Branch.PeriodStart
    var end = line.Branch.PeriodEnd
    var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
    cost.NumDaysInRatedTerm = line.Branch.NumDaysInPeriod
    cost.Basis              = 1
    cost.StandardBaseRate   = 100
    cost.StandardAdjRate    = cost.StandardBaseRate
    cost.StandardTermAmount = (cost.Basis * cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
    cost.StandardAmount     = cost.StandardTermAmount
    cost.copyStandardColumnsToActualColumns()  
    addCost(cost)
  }

  private function rateOtherStucturesOffPremises(line : HomeownersLine_HOE, cov : HODW_OtherStructuresOffPremise_HOE) {
    var start = line.Branch.PeriodStart
    var end = line.Branch.PeriodEnd
    var cost = new DwellingCovCostData_HOE(start, end, cov.Currency, RateCache, cov.FixedId)
    
    cost.NumDaysInRatedTerm = line.Branch.NumDaysInPeriod
    cost.Basis              = 1
    cost.StandardBaseRate   = 100
    cost.StandardAdjRate    = cost.StandardBaseRate
    cost.StandardTermAmount = (cost.Basis * cost.StandardAdjRate).setScale( this.RoundingLevel, java.math.RoundingMode.HALF_UP ) 
    cost.StandardAmount     = cost.StandardTermAmount
    cost.copyStandardColumnsToActualColumns()  
    addCost(cost)
  }

  private function rateTaxes(line : HomeownersLine_HOE) {
    var subtotal = CostDatas.map(\ c -> c.ActualAmount).sum()
    if (subtotal != 0) {
      var cost = new HOTaxCostData_HOE(line.Branch.PeriodStart, line.Branch.PeriodEnd, line.Branch.PreferredCoverageCurrency, RateCache)
      cost.NumDaysInRatedTerm = line.Branch.NumDaysInPeriod
      cost.Basis              = subtotal
      cost.StandardBaseRate     = getStateTaxRate(line.BaseState)
      cost.StandardAdjRate      = cost.StandardBaseRate
      cost.StandardTermAmount   = (cost.Basis * cost.StandardAdjRate).setScale(RoundingLevel, java.math.RoundingMode.HALF_UP)
      cost.copyStandardColumnsToActualColumns()
      cost.updateAmountFields(RoundingLevel, this.RoundingMode, line.Branch.PeriodStart)
      addCost(cost)
    }
  }
    
  private property get RoundingMode() : RoundingMode {
    return PolicyLine.Branch.Policy.Product.QuoteRoundingMode
  }
  
}
