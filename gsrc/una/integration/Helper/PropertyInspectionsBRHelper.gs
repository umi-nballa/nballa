package una.integration.Helper

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.math.BigDecimal
uses java.math.RoundingMode
uses java.lang.Integer

/**
 * This is the helper class for property inspections which will insert the data into integration database
 * Created by : AChandrashekar on Date: 12/8/16
 */
class PropertyInspectionsBRHelper {
  final static var CLASS_CODE_9 = 9
  final static var ONE_FIFTY : BigDecimal = 150
  final static var HUNDRED : BigDecimal = 100
  final static var CreditScore_626 = "626"
  final static var CLASS_CODE_10 = 10
  final static var PROPERTY_AGE_20 = 20
  final static var LAST_INSPECTION_DONE_5 = 5
  final static var NUMPRIORLOSSES_ONE = 1
  final static var EIGHTY_FIVE : BigDecimal = 85
  final static var COVERAGE_LIMIT_900 = 900
  final static var COVERAGE_LIMIT_ONE_POINT_FIVE = 1.5
  final static var HO_PREQUAL_EXT = "HO_PreQual_Ext"
  final static var LAPSE_IN_3_YEARS = "HO_Lapse3yearas_Ext"
  final static var ADJUSTEDHAZARDSCORE_4 = 4
  var currentDateYear = DateUtil.currentDate().YearOfDate
  var zipCode ={75098,75094,75249,78109,78023,78244,78254,78082,75074,75048,
                78250,78230,75023,75002,78240,75093,75075,75010,75044,75056,
                75025,78218,76123,75166,75252 ,78239,78209,76063,75087,78216,
                75040,75035,75089,75024,76140,79022,75248,75022,75052}


  function propertyInsectionsCriteria(policyNumber : String): String{
    var reportOne =""

    var policyPeriod:PolicyPeriod=null;
    if(policyNumber != null && policyNumber.HasContent) {
      policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().AtMostOneRow;
    }
    if(policyPeriod!=null && policyPeriod.TermNumber== 1){
    policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
    var dwelling_hoe = policyPeriod.HomeownersLine_HOE.Dwelling
    var dwelling_State = dwelling_hoe.HOLocation.PolicyLocation.State.Code
    var typekey_state = typekey.State
    var yearBuilt : Integer = null
    var lossdate= policyPeriod.Policy?.PriorLosses?.sortByDescending(\ elt -> elt.OccurrenceDate).first().OccurrenceDate



    // Year Built ::
    if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideYearbuilt_Ext){
      yearBuilt=policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext
    } else{
      yearBuilt=policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt
    }

    // Pending for Claim type
    // BR.09.01 ::
     if(lossdate!=null){
     if(currentDateYear-DateUtil.getYear(lossdate) > 3) // &&  Claim type : loss type{
       reportOne="1|"
     }

    // BR.09.02 :: More than 1 loss of any cause in last 5 years
    if(policyPeriod.Policy.NumPriorLosses> NUMPRIORLOSSES_ONE){
      reportOne += "2|"
    }

    // Pending from Config
    // BR.09.03 :: Risk has a swimming pool
    if(dwelling_hoe.SwimmingPoolExists){
      reportOne+="3|"
    }

    //BR.09.04 :: Construction type is masonry (excluding FL) or with risk with a superior construction (excluding HO6) or has single wall construction in HI
    if(dwelling_hoe.ExteriorWallFinish_Ext.Code?.equalsIgnoreCase(typekey.ExteriorWallFinish_Ext.TC_BRICKSTONEMASONRY.Code)
        && policyPeriod.PolicyLocations.State.first()!= typekey_state.TC_FL.Code){
      reportOne+="4|"
    }

    // BR.09.05 ::  Construction type is masonry (excluding FL) or with risk with a superior construction (excluding HO6) or has single wall construction in HI
     if(dwelling_hoe.ConstructionType.Code?.equalsIgnoreCase(typekey.ConstructionType.TC_LIGHTFRAMESINGLEWALL_EXT.Code) &&
         dwelling_State!= typekey_state.TC_HI.Code ){
       reportOne+="5|"
     }


    //BR.09.06 :: Construction type is masonry (excluding FL) or with risk with a superior construction (excluding HO6) or has single wall construction in HI
     if(dwelling_hoe.ConstructionType.Code?.equalsIgnoreCase(typekey.ConstructionType.TC_SUPERIORNONCOMBUSTIBLE_EXT.Code)
        && policyPeriod.HomeownersLine_HOE.HOPolicyType.Code!= typekey.HOPolicyType_HOE.TC_HO6.Code){
      reportOne+="6|"
    }

    //BR.09.07 :: Risk has incidental business occupancy fom attached (HO 04 42)
    if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("HO0442"))){
      reportOne+="7|"
    }

    //BR.09.08 :: Risk has animal liability endorsement attached
     if(policyPeriod.HomeownersLine_HOE.HOLI_AnimalLiabilityCov_HOE_ExtExists) {
       reportOne += "8|"
     }

    //BR.09.09 ::Risk is built on stilts, piers or pilings
    if(dwelling_hoe.Foundation.Code?.equalsIgnoreCase(typekey.FoundationType_HOE.TC_STILTSPILINGS_EXT.Code)
        || dwelling_hoe.Foundation.Code?.equalsIgnoreCase(typekey.FoundationType_HOE.TC_POSTPIERBEAMOPEN_EXT.Code)){
       reportOne+="9|"
    }

   //BR.09.10 :: Risk is PC9 or PC10 (excluding CA)
    if(( dwelling_hoe.HOLocation.DwellingProtectionClassCode== CLASS_CODE_9 ||
      dwelling_hoe.HOLocation.DwellingProtectionClassCode== CLASS_CODE_10 ) &&
      policyPeriod.PolicyLocations.State.DisplayName!= typekey_state.TC_CA.Code)  {
    reportOne+="10|"
    }

    // BR.09.11 :: Property is over 20 years and has not been inspected in the last 5 years
    if((( currentDateYear - yearBuilt)> PROPERTY_AGE_20 )
         && (currentDateYear-DateUtil.getYear(policyPeriod.DateLastInspection_Ext)> LAST_INSPECTION_DONE_5 )){
        reportOne+="11|"
    }

    // BR.09.12 :: Risk has Coverage A reflecting less than $85 per sq ft (AZ, FL,NC,NV, YX, SC) or Coverage A reflects less than $100 per sq ft (CA) or Coverage A reflects less than $150 per sq
      var coverageLimit = dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      var sqFootage : String = null
      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideTotalSqFtVal_Ext){
        sqFootage=policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValOverridden_Ext
      }else{
        sqFootage=policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext
      }
      if(coverageLimit!= null && sqFootage!=0 && sqFootage!=null){
      if( coverageLimit?.divide(sqFootage,2, RoundingMode.HALF_EVEN) < EIGHTY_FIVE
          && (dwelling_State.equalsIgnoreCase(typekey_state.TC_AZ.Code)
              || dwelling_State.equalsIgnoreCase(typekey_state.TC_FL.Code)
              || dwelling_State.equalsIgnoreCase(typekey_state.TC_NC.Code)
              || dwelling_State.equalsIgnoreCase(typekey_state.TC_NV.Code)
              || dwelling_State.equalsIgnoreCase(typekey_state.TC_TX.Code )
              || dwelling_State.equalsIgnoreCase(typekey_state.TC_SC.COde))){
      reportOne += "12|"
      }

    // BR.09.13 :: Risk has Coverage A reflecting less than $85 per sq ft (AZ, FL,NC,NV, YX, SC) or Coverage A reflects less than $100 per sq ft (CA) or Coverage A reflects less than $150 per sq
      if(( coverageLimit?.divide(sqFootage,2, RoundingMode.HALF_EVEN)) < HUNDRED
        && dwelling_State== typekey_state.TC_CA.Code){
      reportOne+="13|"
    }

    // BR.09.14 :: Risk has Coverage A reflecting less than $85 per sq ft (AZ, FL,NC,NV, YX, SC) or Coverage A reflects less than $100 per sq ft (CA) or Coverage A reflects less than $150 per sq ft (HI)
      if(( coverageLimit?.divide(sqFootage,2, RoundingMode.HALF_EVEN)) < ONE_FIFTY
          && dwelling_State == typekey_state.TC_HI.Code){
        reportOne+="14|"
      }
     }

    // BR.09.15 :: Risk has a wood burner present
     if(policyPeriod.HomeownersLine_HOE.Dwelling.HeatSrcWoodBurningStove){
       reportOne +="15|"
     }

    //BR.09.16 :: PC9 or PC10 (CA only)
    if(( dwelling_hoe.HOLocation.DwellingProtectionClassCode == CLASS_CODE_9 ||
        dwelling_hoe.HOLocation.DwellingProtectionClassCode == CLASS_CODE_10 ) &&
        policyPeriod.PolicyLocations.first()?.State?.Code == typekey_state.TC_CA.Code)  {
      reportOne+="16|"
    }

    //BR.09.17 ::  Risk located in CA with a Fireline score of 4 or higher or located in a SHIA area
      var adjustedHazardScore : String = null
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext){
      adjustedHazardScore =policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext
    } else{
      adjustedHazardScore =policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHaz_Ext
    }

     if(dwelling_State.equalsIgnoreCase(typekey_state.TC_CA.Code)
     && (( adjustedHazardScore >= ADJUSTEDHAZARDSCORE_4 )
     ||(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineSHIA_Ext))){
       reportOne+="17|"
     }

    //BR.09.18 :: Risk located in CA that indicates an overidden Fireline Adjusted Hazard Score
      if(dwelling_State.equalsIgnoreCase(typekey_state.TC_CA.Code) && policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation?.OverrideFirelineAdjHaz_Ext){
        reportOne+="18|"
      }

     // Pending from Config for Wind/Hail Loss
    // BR.09.19 :: Risk in TX with a Wind/Hail loss in the last 2 years
      if(dwelling_State.equalsIgnoreCase(typekey_state.TC_TX.Code)){ //&& wind hail loss  less than 2 years
        reportOne+="19|"
      }

     // Pending from Config for Wind/Hail Loss
    // BR.09.20 :: Wind/Hail loss in the last 2 years (All states except TX
    if(dwelling_State != typekey_state.TC_TX.Code) { // && wind hail loss less than 2 years
      reportOne +="20|"
    }

    //BR.09.21 :: Risk in NC with a roof older than 7 years old or in AZ, NV, CA, SC, HI with composition shingle or wood roof over 15 years old
    if(( dwelling_State == typekey_state.TC_NC.Code && (((currentDateYear- yearBuilt)>7)
      ||((dwelling_hoe.RoofingUpgrade)  && (currentDateYear- dwelling_hoe.RoofingUpgradeDate)>7)))){
      reportOne+="21|"
    }

    // BR.09.22 :: Risk in NC with a roof older than 7 years old or in AZ, NV, CA, SC, HI with composition shingle or wood roof over 15 years old
    if((dwelling_State.equalsIgnoreCase(typekey_state.TC_AZ) ||
       dwelling_State.equalsIgnoreCase(typekey_state.TC_NV) ||
       dwelling_State.equalsIgnoreCase(typekey_state.TC_CA) ||
       dwelling_State.equalsIgnoreCase(typekey_state.TC_SC)||
       dwelling_State == typekey_state.TC_HI )
       && (dwelling_hoe.RoofType.Code.equalsIgnoreCase(typekey.RoofType.TC_WOODSHAKE_EXT.Code) ||
           dwelling_hoe.RoofType.Code.equalsIgnoreCase(typekey.RoofType.TC_WOODSHINGLES_EXT.Code))
       && ((currentDateYear - yearBuilt)>15) ||
          ((dwelling_hoe.RoofingUpgrade) && (currentDateYear - dwelling_hoe.RoofingUpgradeDate)> 15 )){
      reportOne += "22|"
    }

    // BR.09.23 :: Lapse in coverage in the last 3 years. No prior insurance or No need listed as prior carrier and purchase date over 45 days ago
     if(policyPeriod.getAnswer( policyPeriod.Policy?.Product?.getQuestionSetById(HO_PREQUAL_EXT)?.getQuestion(LAPSE_IN_3_YEARS))?.BooleanAnswer){
         reportOne+="23|"
      }

    // BR.09.24 :: Lapse in coverage in the last 3 years. No prior insurance or No need listed as prior carrier and purchase date over 45 days ago
     if(policyPeriod.Policy?.PriorPolicies?.CarrierType?.Code==typekey.CarrierType_Ext.TC_NONEED.Code){
        reportOne+="24|"
     }

     //BR.09.25 :: Lapse in coverage in the last 3 years. No prior insurance or No need listed as prior carrier and purchase date over 45 days ago
     if(policyPeriod.Policy?.PriorPolicies?.length==0){
       reportOne+="25|"
     }

      // Need to recheck the Logic of this
     //BR.09.26 :: Credit score less than 626 in conjunction with an underwriting rule
      if((policyPeriod.CreditInfoExt.CreditReport?.CreditScore== CreditScore_626 )
          &&(( dwelling_State.equalsIgnoreCase(typekey_state.TC_CA.Code)
          || dwelling_State.equalsIgnoreCase(typekey_state.TC_HI.Code)))
          &&(( dwelling_State.equalsIgnoreCase(typekey_state.TC_TX.Code)
          || policyPeriod.HomeownersLine_HOE?.HOPolicyType?.Code != typekey.HOPolicyType_HOE.TC_DP3_EXT.Code))){
        reportOne+="26|"
      }


      // BR.09.27 :: High value inspection, Dwelling Coverage A => $1.5M except CA DF that orders HV inspection at => $900k
      if(dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value >= COVERAGE_LIMIT_ONE_POINT_FIVE
        && dwelling_State != typekey_state.TC_CA.Code
        && policyPeriod.HomeownersLine_HOE?.HOPolicyType?.Code != typekey.HOPolicyType_HOE.TC_DP3_EXT.Code){
        reportOne+="27|"
      }

      // BR.09.28 :: High value inspection, Dwelling Coverage A => $1.5M except CA DF that orders HV inspection at => $900k
      if(dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value >= COVERAGE_LIMIT_900
         && dwelling_State.equalsIgnoreCase(typekey_state.TC_CA.Code)
         && policyPeriod.HomeownersLine_HOE?.HOPolicyType.Code.equalsIgnoreCase(typekey.HOPolicyType_HOE.TC_DP3_EXT.Code)){
        reportOne+="28|"
      }

      //BR.09.29 :: Properties in the zip codes below to supplemental also have a roof top inspection performed, regardless of property age.
      if(zipCode.contains(dwelling_hoe.HOLocation.PolicyLocation.PostalCode)){
        reportOne+="29"
      }


  }
    return reportOne
  }

}