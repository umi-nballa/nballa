package gw.lob.ho
uses java.util.ArrayList
uses gw.plugin.protectionclass.impl.ProtectionClassPlugin_HOE
uses java.math.BigDecimal

enhancement DwellingEnhancement_HOE : entity.Dwelling_HOE {
  
  function createAndAddDwellingAnimal () : DwellingAnimal_HOE {
    var animal = new DwellingAnimal_HOE(this.PolicyPeriod)
    this.addToDwellingAnimals(animal)
    return animal
  }

  /**
   * The createAndAddScheduledItem adds a scheduled item entity and associates it to the owning coverage that covers
   * scheduled items.    The function has been designed with the coverage pattern as an input so that
   * the function can be resused for any other coverage at dwelling level that also have an array of scheduled items 
   */
  function createAndAddScheduledItem(covPattern : String) : ScheduledItem_HOE {
    
    var schedItem = new ScheduledItem_HOE(this.PolicyPeriod)
   
    if (covPattern.equals("HODW_ScheduledProperty_HOE") and this.HODW_ScheduledProperty_HOEExists) {
      this.HODW_ScheduledProperty_HOE.addScheduledItem(schedItem)
    } else if (covPattern.equals("HODW_OtherStructuresOnPremise_HOE") and this.HODW_OtherStructuresOnPremise_HOEExists) {
      this.HODW_OtherStructuresOnPremise_HOE.addScheduledItem(schedItem)
    } else if (covPattern.equals("HODW_SpecialLimitsCovC_HOE") and this.HODW_SpecialLimitsCovC_HOEExists) {
      this.HODW_SpecialLimitsCovC_HOE.addScheduledItem(schedItem)
    } else if (covPattern.equals("HODW_SpecificStructuresOffPremise_HOE") and this.HODW_SpecificStructuresOffPremise_HOEExists) {
      this.HODW_SpecificStructuresOffPremise_HOE.addScheduledItem(schedItem)
    } else if (covPattern.equals("HODW_PersonalPropertyOffResidence_HOE") and this.HODW_PersonalPropertyOffResidence_HOEExists) {
      this.HODW_PersonalPropertyOffResidence_HOE.addScheduledItem(schedItem)
    } else {
      throw "Unsupported cov pattern in DwellingEnhancement_HOE.gsx"
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
     
    for (pl in this.PolicyPeriod.PolicyLocations.where(\ pl1 -> pl1.FixedId != this.HOLocation.PolicyLocation.FixedId)) {
      if (locFilter == true) { // If there are locations already on the coverage filter out those locations
        var schedItems : ScheduledItem_HOE[]
        switch(covPattern){
          case "HODW_SpecificStructuresOffPremise_HOE": {
            schedItems = this.HODW_SpecificStructuresOffPremise_HOE.ScheduledItems
            break
          }
          case "HODW_PersonalPropertyOffResidence_HOE": {
            schedItems = this.HODW_PersonalPropertyOffResidence_HOE.ScheduledItems
            break
          }
          default: {
            throw "Unsupported cov pattern in getAllPolLocationsExceptDwellingPolLoc - DwellingEnhancement_HOE.gsx"
          }
        }
      
        //The if statement checks that Policy Location is not already on one of the scheduled items and
        // also ensures that we are not adding duplicate entries to the return list
        if (not schedItems.hasMatch(\ si -> si.PolicyLocation.FixedId == pl.FixedId)) {
          polLocs.add(pl)
        }
      }
      else {    // if locFilter is false, include location even it is already on the coverage                          
        polLocs.add(pl)
      }
    }
    return polLocs as entity.PolicyLocation[]
  }
  
  
  /** 
   * This function sets homeowner policy type on the dwelling to be the same as that of the HomeownersLine in order to 
   * enable filtering of available residence type based on homeowners type 
   * The function also sets default values based on the homeowner policy type and if there was a previously selected
   * residence type that is valid for new policy type then the value is left as is ; if not defalut residence type applicable
   * for the policy type is set
   */  
  function setPolicyTypeAndDefaults() {

    this.HOPolicyType = this.HOLine.HOPolicyType
    //Set the default for Garage to No Garage
    if (this.Garage == null) {
      this.Garage = "None"
    }
    //Commenting the default logic as not needed after 12.02.03
    /*
    var validType = false
    if(this.ResidenceType != null)
    {
      validType =this.ResidenceType.Categories.hasMatch(\ cat -> cat.Code == this.HOPolicyType.Code)
    }
    
    //Set the default for Residence Type only if there was no value was chosen or the previous choses value 
    //is not applicable for the policy type
    if (!validType) {
      switch(this.HOPolicyType){
        case "HO3": {
          this.ResidenceType = ResidenceType_HOE.TC_FAM1
          break
        }
        case "HO4": {
          this.ResidenceType =  ResidenceType_HOE.TC_APT
          break
        }
        case "HO6": {
          this.ResidenceType =  ResidenceType_HOE.TC_CONDO
          break
        }
        case "DP2": {
          this.ResidenceType =  ResidenceType_HOE.TC_FAM1
          break
        } 
        default: {
          this.ResidenceType = null
        }
      }

      // TODO: UNDO THIS ONCE RESIDENCE REQUIREMENTS ARE IN!!!!!!!!!!!!!!!!!!!
      // UNA temporary fix for continuting testing only
      if (this.ResidenceType == null) this.ResidenceType = ResidenceType_HOE.TC_FAM1
    }
    
    //Set the default for Dwelling Occupancy to Non Owner for HO4 and Owner for others only if there is not a
    //value already chosen
    if (this.Occupancy == null) {
      if (this.HOPolicyType != HOPolicyType_HOE.TC_HO4) {
        this.Occupancy = DwellingOccupancyType_HOE.TC_OWNER
      }
      else {
        this.Occupancy = DwellingOccupancyType_HOE.TC_NONOWN
      }
    }
   */
  }

  /**
   * This function sets homeowner protection class code based on territory code, distance from fire hydrant and
   * distance from fire station.
   * 
   * It calls a method that will be used to call an external system
   */
  function setProtectionClassCode() {
    
    ProtectionClassPlugin_HOE.setProtectionClassCode(this)
    
  }
  // uim-svallabhapurapu : set Terrain on dwelling based on county change
  function setTerrain() {
    var flWindMitigationQuery = gw.api.database.Query.make(FLWMitigationDefaults_Ext)
    var result =   flWindMitigationQuery.compare(FLWMitigationDefaults_Ext#County, Equals, this.HOLocation.PolicyLocation.County ).select().first()
    if(result != null and this.Branch.BaseState.Code == typekey.State.TC_FL){
      this.Terrain_Ext = typekey.Terrain_Ext.getTypeKeys().firstWhere( \ elt -> elt.Code == result.Terrain.toString().toLowerCase())
    }
  }

  /**
   * This function is called before the dwelling page is saved to the database
   * 
   * It sets the protection class code, calls a validation method and does some cleaning
   */
  function beforeSavingDwellingPage(){
    // uim-svallabhapurapu, set Terrain as per county
    setTerrain()
    setProtectionClassCode()
    HomeownersLineValidation_HOE.validateDwellingsStep(this.PolicyPeriod.HomeownersLine_HOE)
    
    // remove values for dependant fields  for some parent field values
    if(this.Occupancy == null or this.Occupancy != DwellingOccupancyType_HOE.TC_VACANT)
    {
      this.OccupancyVacant = null
    }
    if(this.Occupancy == null or this.Occupancy != DwellingOccupancyType_HOE.TC_INCONST)
    {
      this.OccupancyApprovedBuilder = null
      this.OccupancyProjectedDate = null
    }
    if(this.RoomerBoarders == null or not this.RoomerBoarders)
    {
      this.RoomerBoardersNumber = null
    }
    if(this.FireplaceOrWoodStoveExists == null or not this.FireplaceOrWoodStoveExists)
    {
      this.FireplaceOrWoodStovesNumber = null
    }
    if(this.SwimmingPoolExists == null or not this.SwimmingPoolExists)
    {
      this.SwimmingPoolFencing = null
      this.SwimmingPoolDivingBoard = null
    }
    if(this.TrampolineExists == null or not this.TrampolineExists)
    {
      this.TrampolineSafetyNet = null
    }
    if(this.KnownWaterLeakage == null or not this.KnownWaterLeakage)
    {
      this.KnownWaterLeakageDescription = null
    }
    
    // for protection details
    if(this.DwellingLocation == null or this.DwellingLocation != DwellingLocationType_HOE.TC_OTHER)
    {
      this.DwellingProtectionDetails.DwellingLocationDescription = null
    }
    if(this.DwellingProtectionDetails.BurglarAlarm == null or not this.DwellingProtectionDetails.BurglarAlarm)
    {
      this.DwellingProtectionDetails.BurglarAlarmType = null
    }
    if(this.DwellingProtectionDetails.SmokeAlarm == null or not this.DwellingProtectionDetails.SmokeAlarm)
    {
      this.DwellingProtectionDetails.SmokeAlarmOnAllFloors = null
    }
    if(this.DwellingProtectionDetails.Deadbolts == null or not this.DwellingProtectionDetails.Deadbolts)
    {
      this.DwellingProtectionDetails.DeadboltsNumber = null
    }
  }
  
  /**
   * This function is called before the dwelling construction page is saved to the database
   * 
   * It calls a validation method and does some cleaning
   */
  function beforeSavingDwellingConstructionPage() {
    HODwellingValidation_HOE.validateDwellingConstructionStep(this)
    
    // remove values for dependant fields for some parent field values
    if(this.ConstructionType == null or this.ConstructionType != ConstructionType_HOE.TC_OTHER)
    {
      this.ConstructionTypeDescription = null
    }
    if(this.Garage == GarageType_HOE.TC_NONE)
    {
      this.GarageArea = null
    }
    if(this.CoveredPorch == null or not this.CoveredPorch)
    {
      this.CoveredPorchArea = null
    }
    if(this.Foundation == null or this.Foundation != FoundationType_HOE.TC_FULLBASEMENT)
    {
      this.BasementFinishedArea = null
      this.BasementUnfinishedArea = null
    }
    if(this.RoofType == null or this.RoofType != RoofType.TC_OTHER)
    {
      this.RoofTypeDescription = null
    }
    if(this.PrimaryHeating == null or this.PrimaryHeating != HeatingType_HOE.TC_HEATINGOIL)
    {
      this.PrimaryHeatingFuelTankLocation = null
      this.PrimaryHeatingFuelLineLocation = null
    }
    if(this.PrimaryHeating == null or this.PrimaryHeating != HeatingType_HOE.TC_OTHER)
    {
      this.PrimaryHeatingDescription = null
    }
    if(this.PlumbingType == null or this.PlumbingType != PlumbingType_HOE.TC_OTHER)
    {
      this.PlumbingTypeDescription = null
    }
    if(this.WiringType == null or this.WiringType != WiringType_HOE.TC_OTHER)
    {
      this.WiringTypeDescription = null
    }
    if(this.ElectricalType == null or this.ElectricalType != BreakerType_HOE.TC_OTHER)
    {
      this.ElectricalTypeDescription = null
    }
    if(this.WindClass == null or this.WindClass != WindRating.TC_OTHER)
    {
      this.WindClassDescription = null
    }
    if(this.HeatingUpgrade == null or not this.HeatingUpgrade)
    {
      this.HeatingUpgradeDate = null
    }
    if(this.PlumbingUpgrade == null or not this.PlumbingUpgrade)
    {
      this.PlumbingUpgradeDate = null
    }
    if(this.RoofingUpgrade == null or not this.RoofingUpgrade)
    {
      this.RoofingUpgradeDate = null
    }
    if(this.ElectricalSystemUpgrade == null or not this.ElectricalSystemUpgrade)
    {
      this.ElectricalSystemUpgradeDate = null
    }
  }

}
