package gw.lob.ho

uses java.util.ArrayList
uses gw.api.util.JurisdictionMappingUtil
uses java.lang.UnsupportedOperationException

enhancement HomeownersLineEnhancement_HOE : entity.HomeownersLine_HOE {

  function createAndAddDwelling(loc : PolicyLocation) : Dwelling_HOE {
    var newdwelling = new Dwelling_HOE(this.Branch)
    var newLocation = new HOLocation_HOE(this.Branch)

    //this.addToDwellings( dwelling )
    newdwelling.HOLine = this
    newdwelling.PreferredCoverageCurrency = this.PreferredCoverageCurrency
    newLocation.PolicyLocation = loc
    newLocation.HOLine = this
    newdwelling.HOLocation = newLocation
    updateBaseStateAndPrimaryLocation(null)
    
    //Set the necessary defaults for Dwelling Construction
    
    //Set the necessary defaults for Dwelling Details
    //Commenting the below as not needed after 12.02.03 Dwelling Information
    //newdwelling.DwellingUsage = DwellingUsage_HOE.TC_PRIM
   
    
    //dwelling.createCoverages()
    //this.updateModifiers()
    //house.updateModifiers()
    return newdwelling
  }

  //The createAndAddCoveredLocation adds a covered location entiti and associates it to the owning coverage that covers
  //the other named insureed locations.    The function has been designed with the coverage pattenn as an input so that
  //the function cab be resused for any other coverage at line level that also have an array of covered locations
  
  function createAndAddCoveredLocation(patternCode : String) : CoveredLocation_HOE {

    var coverage = this.getCoverage(patternCode)

    if(coverage != null){
      var coveredLocation = new CoveredLocation_HOE(this.Branch)
      (coverage as HomeownersLineCov_HOE).addCoveredLocation(coveredLocation)
      return coveredLocation
    }else{
      throw new UnsupportedOperationException("Unsupported cov pattern in HomeownersLineEnhancement_HOE.gsx")
    }
  }

  /**
   * The createAndAddScheduledItem adds a scheduled item entity and associates it to the owning coverage that covers
   * scheduled items.    The function has been designed with the coverage pattern as an input so that
   * the function can be resused for any other coverage at homeownersline level that also have an array of scheduled items
   */
  function createAndAddHOScheduledItem(covPattern : String) : HOscheduleItem_HOE_Ext {

    var schedItem = new HOscheduleItem_HOE_Ext(this.Branch)

    if (covPattern.matches("HOSL_OutboardMotorsWatercraft_HOE_Ext") and this.HOSL_OutboardMotorsWatercraft_HOE_ExtExists) {
      schedItem.fromDate = this.Branch.PeriodStart
      schedItem.toDate = this.Branch.PeriodEnd
      this.HOSL_OutboardMotorsWatercraft_HOE_Ext.addScheduledItem(schedItem)
    } else if (covPattern.matches("HOSL_WatercraftLiabilityCov_HOE_Ext") and this.HOSL_WatercraftLiabilityCov_HOE_ExtExists) {
      this.HOSL_WatercraftLiabilityCov_HOE_Ext.addScheduledItem(schedItem)
    } else if (covPattern.matches("HOLI_AddResidenceRentedtoOthers_HOE") and this.HOLI_AddResidenceRentedtoOthers_HOEExists) {
      this.HOLI_AddResidenceRentedtoOthers_HOE.addScheduledItem(schedItem)
    }else {
      throw "Unsupported cov pattern in HomeownersLineEnhancement_HOE.gsx"
    }

    return schedItem
  }
  
  /** 
   * This function returns all the policy locations on the policy except the one that is currently 
   * defined as the location for dwelling.   This function will be used for selecting locations other than
   * main dwelling policy location
   */
  function getAllPolLocationsExceptDwellingPolLoc(locFilter : boolean, covPattern : String) : PolicyLocation[] {
    var polLocs = new ArrayList<PolicyLocation>()
    for (pl in this.Branch.PolicyLocations) {
      if (pl.FixedId != this.Dwelling.HOLocation.PolicyLocation.FixedId) {
        if (locFilter == true) { // If the locations already on the coverage filter out those locations
          if (covPattern.matches("HOLI_AddResidenceRentedtoOthers_HOE")) {
            for (covLoc in this.HOLI_AddResidenceRentedtoOthers_HOE.CoveredLocations)
              //The if statement checks that Policy Location is not already on one of the scheduled items and
                // also ensures that we are not adding duplicate entries to the return list
                if (this.HOLI_AddResidenceRentedtoOthers_HOE.CoveredLocations.
                    where(\ cl -> cl.PolicyLocation.FixedId == pl.FixedId ).length == 0 and
                    polLocs.where(\ p -> p.FixedId == pl.FixedId ).Count == 0) {
                  polLocs.add(pl)
                }
          }
        }
        else { // if locFilter is false, include location even it is already on the coverage                
          polLocs.add(pl)
        }
      }
    }
    return polLocs as entity.PolicyLocation[]
  }
  
 /**
  * Sets Base State to the state of the dwelling location.
  */
  function updateBaseStateAndPrimaryLocation(jobWizardHelper : gw.api.web.job.JobWizardHelper) {
    var baseState = this.BaseState
    if (this.Dwelling.HOLocation != null) {
      this.Branch.PrimaryLocation = this.Dwelling.HOLocation.PolicyLocation
      if (baseState <> JurisdictionMappingUtil.getJurisdiction(this.Dwelling.HOLocation.PolicyLocation)) {
        this.Branch.BaseState = JurisdictionMappingUtil.getJurisdiction(this.Dwelling.HOLocation.PolicyLocation)
        gw.web.productmodel.ProductModelSyncIssuesHandler.sync({this, this.Dwelling}, {this}, null, this.Branch, jobWizardHelper )
      }
    }
  }

  
  property get HOTransactions() : HOTransaction_HOE[] {
    var branch = this.Branch
    return branch.getSlice(branch.PeriodStart).HOTransactions
  }

  //Property to get Chargeable Claims Count
  property get chargeableClaimsCount():int{
    var chargeableClaimCount = 0
    if(this.ClueHit_Ext){
      for(loss in this.HOPriorLosses_Ext){
        if(loss.ChargeableClaim == TC_YES){
          chargeableClaimCount = chargeableClaimCount + 1
        }
      }
    }else{//No CLUE Hit
      //For TX TDPs UW Tier determination, we'll use PaidNonWeatherClaims_Ext field on the dwelling screen
      chargeableClaimCount = this.Dwelling.PaidNonWeatherClaims_Ext
    }
    return chargeableClaimCount
  }

}
