package gw.lob.ho

uses gw.validation.PCValidationContext
uses gw.policy.PolicyLineValidation
uses gw.api.util.JurisdictionMappingUtil

class HomeownersLineValidation_HOE extends PolicyLineValidation<entity.HomeownersLine_HOE> {
  
  property get hoLine() : HomeownersLine_HOE { return Line as HomeownersLine_HOE }

  construct(valContext : PCValidationContext, polLine : HomeownersLine_HOE) {
    super(valContext, polLine)
  }
  
  override function doValidate() {
    validatePolicyType()
    validateBaseStateAndDwellingState()
    new HODwellingValidation_HOE(Context, hoLine.Dwelling).validate()
    new CoveragesValidation_HOE(Context, hoLine).validate()
  }

  function validatePolicyType() : Boolean  {
    
    var policyTypeValid : Boolean = true
    
    Context.addToVisited(this, "validatePolicyType")
    if (hoLine.HOPolicyType != "DP2"and hoLine.Dwelling.DwellingUsage == "rent") {
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingBeingRented(hoLine.HOPolicyType))
    }
    if (not (hoLine.HOPolicyType == "HO3"or hoLine.HOPolicyType == "HO4"or hoLine.HOPolicyType == "HO6")
      and hoLine.Dwelling.DwellingUsage == "seas"){
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingSeasonal(hoLine.HOPolicyType))
    }
    if (not (hoLine.HOPolicyType == "HO3"or hoLine.HOPolicyType == "HO4"or hoLine.HOPolicyType == "HO6")
      and hoLine.Dwelling.DwellingUsage == "sec"){
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingSecondary(hoLine.HOPolicyType))
    }
    if (hoLine.HOPolicyType != "DP2" 
         and hoLine.Dwelling.Occupancy == "vacant" and hoLine.Dwelling.OccupancyVacant ) {
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingIsVacant(hoLine.HOPolicyType))
    }



    if(hoLine.Dwelling.HOUWQuestions.HOHomesharing_Ext)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties made available for home sharing, trading or exchange are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.unoccupied9)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties unoccupied for more than 9 consecutive months are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.propanegas==typekey.HOPropaneNaturalgas_Ext.TC_BELOWGROUND)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties with buried fuel tanks are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.typefuel==typekey.HOTypeFuel_Ext.TC_GASOLINEDIESEL)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties with gasoline or diesel fuel tanks are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.typefuel==typekey.HOTypeFuel_Ext.TC_OTHER)
    {
      policyTypeValid = false
      addErrorOrWarning("Fuel type ‘Other’ requires Underwriting review and approval prior to binding")    //uwissue
    }

    if(hoLine.Dwelling.HOUWQuestions.fuellocalcode==typekey.HOFuelTankLocalBC_Ext.TC_NO)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties with fuel tanks that do not meet local building codes are not eligible for coverage")
    }

    if((hoLine.Dwelling.HOUWQuestions.tankcapacity==typekey.HOCapTankGal_Ext.TC_LT500  && hoLine.Dwelling.HOUWQuestions.closestdisttank==typekey.HOCloseseDistTank_Ext.TC_LT15FT) ||
    (hoLine.Dwelling.HOUWQuestions.tankcapacity==typekey.HOCapTankGal_Ext.TC_GTEQ500  && (hoLine.Dwelling.HOUWQuestions.closestdisttank==typekey.HOCloseseDistTank_Ext.TC_LT15FT
    || hoLine.Dwelling.HOUWQuestions.closestdisttank==typekey.HOCloseseDistTank_Ext.TC_15TO25)))
      {
        policyTypeValid = false
        addErrorOrWarning("Property is not eligible for coverage due to capacity and location of fuel tank")
      }


    if(hoLine.Dwelling.HOUWQuestions.primprot==typekey.HOPrimProtHotTub_Ext.TC_NONE || hoLine.Dwelling.HOUWQuestions.primprot==typekey.HOPrimProtHotTub_Ext.TC_HOTTUBCOVER)
      {
        policyTypeValid=false
        addErrorOrWarning("Properties without appropriate protection in place to prevent unauthorized access to the pool or hot tub are not eligible for coverage")
      }


    if(hoLine.Dwelling.HOUWQuestions.swimdivboardslide)
      {
        policyTypeValid = false
        addErrorOrWarning("Swimming pools with diving boards or slides are not eligible for coverage")
      }
    if(hoLine.Dwelling.HOUWQuestions.floodcovnfip)
      {
        policyTypeValid = false
        addErrorOrWarning("Properties located in a Special Flood Hazard Area are not eligible unless required flood coverage will be in place  within 30 days of effective date.")
      }



    if(hoLine.Dwelling.HOUWQuestions.structincl)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties with any structures built partially or entirely over water are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_ADULTDAYCARE  || hoLine.Dwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_ASSISTEDLIVING)
    {
      policyTypeValid = false
      addErrorOrWarning("Properties with on premises adult daycare or assisted living activities are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_CHILDDAYCARE  && !hoLine.Dwelling.HOLocation.PolicyLocation.State.Code=="FL")
    {
      policyTypeValid = false
      addErrorOrWarning("Properties  with on premises daycare operations are not eligible for coverage")
    }

    if(!hoLine.Dwelling.HOUWQuestions.daycare )
      {
      policyTypeValid = false
    addErrorOrWarning( "Properties with Family Daycare Homes that exceed the maximum number of children allowed in accordance with Florida Statute are not eligible for coverage")
  }



  if(!hoLine.Dwelling.HOUWQuestions.daycareregs )   {
  policyTypeValid = false
  addErrorOrWarning("Properties with Family Child Daycare operations that do not meet licensing/registration requirements are not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.commercialliability )    {
  policyTypeValid = false
  addErrorOrWarning("Properties with on premises Family Home Daycare operations require Underwriting approval prior to binding.   Proof of licensure/registration AND a copy of your current commerial daycare liability policy is required for Underwriting review")
  }

  if(!hoLine.Dwelling.HOUWQuestions.commercialliability )      {
  policyTypeValid = false
  addErrorOrWarning("Applicant is not eligible for coverage without a commercial insurance policy inforce for the Family Home Daycare operation")
  }

  if(!hoLine.Dwelling.HOUWQuestions.businesspol &&  !hoLine.Dwelling.HOLocation.PolicyLocation.State.Code=="TX" && hoLine.Dwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_HOMEOFFICE)     {
  policyTypeValid = false
  addErrorOrWarning("Applicant's home based business activities may qualify for “Permitted Incidental Occupancy– Residence Premises (HO 04 42)")
  }

  if(hoLine.Dwelling.HOUWQuestions.moldd != null )    {
  policyTypeValid = false
  addErrorOrWarning("Properties with on premises business exposure require Underwriting review and approval prior to binding")           //uwissue
  }

  if(hoLine.Dwelling.HOUWQuestions.trampoline )     {
  policyTypeValid = false
  addErrorOrWarning("Properties with trampolines, skateboard/bicycle/stunt ramps, rock climbing walls or other extreme sporting aparatus on the premises are not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.farmanimals )    {
  policyTypeValid = false
  addErrorOrWarning("Property is not eligbible for coverage due to animal exposure")
  }

  if(hoLine.Dwelling.HOUWQuestions.mixbreedofdog )      {
  policyTypeValid = false
  addErrorOrWarning("Property is not eligbible for coverage due to ineligible dog breed")
  }

  if(hoLine.Dwelling.HOUWQuestions.tenmixbreed )    {
  policyTypeValid = false
  addErrorOrWarning("Property is not eligbible for coverage due to ineligible dog breed")
  }

  if(hoLine.Dwelling.HOUWQuestions.windowsquickrelease )   {
  policyTypeValid = false
  addErrorOrWarning("Properties with bars on windows without a quick release mechanism are not eligible for coverage")
  }

  if(!hoLine.Dwelling.HOUWQuestions.moldrem || !hoLine.Dwelling.HOUWQuestions.moldremediated )   {
  policyTypeValid = false
  addErrorOrWarning("Properties  with prior unremediated mold losses are not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.moldrem || hoLine.Dwelling.HOUWQuestions.moldremediated )    {
  policyTypeValid = false
  addErrorOrWarning("Properties  with prior mold damage require Underwriting review and approval prior to binding.   Please provide proof of mold remediation for Underwriting review") //uwissue
  }

  if(hoLine.Dwelling.HOUWQuestions.assistedliving )     {
  policyTypeValid = false
  addErrorOrWarning("Properties used as group homes or assisted living facilities are not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_6  || hoLine.Dwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_7
  || hoLine.Dwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_8 || hoLine.Dwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_9
  || hoLine.Dwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_10 || hoLine.Dwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_GT10)   {
  policyTypeValid = false
  addErrorOrWarning("Applicants owning more than 5 rental units are not eligible for coverage")
  }

  if(!hoLine.Dwelling.HOUWQuestions.exclusiveresi )     {
  policyTypeValid = false
  addErrorOrWarning("Properties that are not used used exclusively for residential purposes  other than eligible incidental office exposures are not eligible for coverage")
  }

  if(!hoLine.Dwelling.HOUWQuestions.recpubutil )   {
  policyTypeValid = false
  addErrorOrWarning("Property without public utility services is not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.hilslide )     {
  policyTypeValid = false
  addErrorOrWarning("Dwellings built on a hillside or directly next to a 30-degree or greater slope are not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.loc1000 )    {
  policyTypeValid = false
  addErrorOrWarning("Property located within 1,000 ft of saltwate are not eligible for coverage")
  }

  if(hoLine.Dwelling.HOUWQuestions.atvs || hoLine.Dwelling.HOUWQuestions.atvallow )     {
  policyTypeValid = false
  addErrorOrWarning("ATVs are not eligible for coverage")
  }

    if(hoLine.Dwelling.HOUWQuestions.underconstr )     {
      policyTypeValid = false
      addErrorOrWarning("Properties that are vacant or not occupied within 30 days of purchase are not eligible for coverage")
    }

    if(hoLine.Dwelling.HOUWQuestions.forsale )     {
      policyTypeValid = false
      addErrorOrWarning("Properties that are for sale or undergoing renovation are not eligible for coverage")
    }


        return policyTypeValid
  }
  
  function validateBaseStateAndDwellingState() {
    Context.addToVisited(this, "validateBaseStateAndDwellingState")
    if (hoLine.BaseState <> JurisdictionMappingUtil.getJurisdiction(hoLine.Dwelling.HOLocation.PolicyLocation)) {
      print("field error msg")
      Result.addFieldError(hoLine.Dwelling.PolicyPeriod, "BaseState", "default", displaykey.Web.Policy.HomeownersLine.Validation.BaseStateDoesNotMatchDwellingState, "PolicyInfo")
    }
  }
  
  private function addErrorOrWarning(message: String){
    if (Context.isAtLeast("quotable")) {
      Result.addError(hoLine, "quotable", message)
    }
    else {
      Result.addWarning(hoLine, "default", message)
    }
  }
  
   static function validateDwellingsStep(hoLine : HomeownersLine_HOE) {
     PCValidationContext.doPageLevelValidation(\ context -> {
      var lineValidation = new HomeownersLineValidation_HOE(context, hoLine)
      lineValidation.validatePolicyType()
      var dwellingValidation = new HODwellingValidation_HOE(context, hoLine.Dwelling)
      dwellingValidation.validateDwellingMainFields()
      dwellingValidation.validateDwellingProtectionFields()
    })
  }

  override function validateLineForAudit() {
  }

}
