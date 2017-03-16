package una.integration.Helper

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.math.BigDecimal
uses java.math.RoundingMode
uses java.lang.Integer
uses java.util.Calendar
uses java.util.HashMap
uses una.utils.PropertiesHolder

/**
 * This is the helper class for property inspections which will insert the data into integration database
 * Created by : AChandrashekar on Date: 12/8/16
 */
class PropertyInspectionsBRHelper {
  final static var ONE_FIFTY : BigDecimal = 150
  final static var HUNDRED : BigDecimal = 100
  final static var CreditScore_626 = "626"
  final static var PROPERTY_AGE_20 = 20
  final static var LAST_INSPECTION_DONE_5 = 5
  final static var NUMPRIORLOSSES_ONE = 1
  final static var EIGHTY_FIVE : BigDecimal = 85
  final static var COVERAGE_LIMIT_900 = 900000
  final static var COVERAGE_LIMIT_ONE_POINT_FIVE = 1500000
  final static var HO_PREQUAL_EXT = "HO_PreQual_Ext"
  final static var LAPSE_IN_3_YEARS = "HO_Lapse3yearas_Ext"
  final static var ADJUSTEDHAZARDSCORE_4 = 4 as String
  final static var ONE = "1|"
  final static var TWO = "2|"
  final static var SIX = "6|"
  final static var EIGHT = "8|"
  final static var NINE = "9|"
  final static var TEN = "10|"
  final static var ELEVEN = "11|"
  final static var TWELVE = "12|"
  final static var THIRTEEN = "13|"
  final static var FOURTEEN = "14|"
  final static var FIFTEEN = "15|"
  final static var FIFTEENA = "15a|"
  final static var SIXTEEN = "16|"
  final static var SIXTEENA = "16a|"
  final static var TWENTYONE = "21|"
  final static var TWENTYTWO = "22|"
  final static var TWENTYTWOA = "22a|"
  final static var TWENTYTHREE = "23|"
  final static var TWENTYFOUR = "24|"
  final static var TWENTYFOURA = "24a|"
  final static var TWENTYSIX = "26|"
  final static var TWENTYSIXA = "26a|"
  final static var TWENTYSEVEN = "27|"
  final static var THIRTY = "30|"
  final static var THIRTYONE = "31|"
  final static var THIRTYTWO = "32|"
  final static var HYPHEN = "-"
  var currentDateYear = DateUtil.currentDate().YearOfDate
  var zipCodeList =PropertiesHolder.getProperty("ZipCode")
  var weatherRelatedLosses ={"FLOOD","FREEZ","HAIL","LIGHT","WEATH","WIND"}
  var report = new HashMap<String, String>()
  var windOrHailLosses = {"WIND", "HAIL"}
  var reportOne = ""
  var reportTwo = ""
  var reportThree = ""
  var reportFour = ""
  var reportFive = ""

  /**
   * Get the data related to report which says about the rules which are satisfied and gets the business rule number
   * @param policyNumber policy Number
   * @return report :: map which contains the report data
   */
  //TODO :: need to work on code refactoring for this method
  function getReportData(policyNumber: String): HashMap<String, String>{

    var policyPeriod:PolicyPeriod=null;
    if(policyNumber != null && policyNumber.HasContent) {
      policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().last()
    }
    if(policyPeriod!=null){
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      var dwelling_hoe = policyPeriod.HomeownersLine_HOE.Dwelling
      var dwelling_State = dwelling_hoe.HOLocation.PolicyLocation.State
      var calendar = Calendar.getInstance()

      // TODO :: Need to Check on the Claim Payment part
      calendar.add(Calendar.YEAR, -3)
      var priorLosses = Query.make(HOPriorLoss_Ext).compare(HOPriorLoss_Ext#HomeownersLineID, Equals ,policyPeriod.PublicID).select().toList()
      var weatherRelatedLossBROne = priorLosses?.hasMatch( \ priorLoss ->{
       return priorLoss.ClaimPayment.hasMatch( \ claimPayment ->{
           return (priorLoss.ReportedDate > calendar.getTime() && !weatherRelatedLosses.contains(claimPayment.LossCause_Ext.Code))
       } )
      } )

      calendar = Calendar.getInstance()
      calendar.add(Calendar.YEAR, -2)
      var windOrHailLossBR19n20 = priorLosses?.hasMatch( \ priorLoss ->{
        return priorLoss.ClaimPayment?.hasMatch( \ claimPayment ->{
            return (priorLoss.ReportedDate > calendar.getTime() && windOrHailLosses.contains(claimPayment.LossCause_Ext.Code))
        } )
      } )

      calendar = Calendar.getInstance()
      calendar.add(Calendar.YEAR, -5)
      var noOfLossesInThePastFiveYears =priorLosses.countWhere( \ priorLoss -> priorLoss.ReportedDate > calendar.getTime())

      // Year Built ::
      var yearBuilt  = policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideYearbuilt_Ext ?
                       policyPeriod.HomeownersLine_HOE.Dwelling?.YearBuiltOverridden_Ext :
                       policyPeriod.HomeownersLine_HOE.Dwelling?.YearBuilt

      // BR.09.01 ::
      if(weatherRelatedLossBROne){
         reportOne= ONE
      }

      // BR.09.02 :: More than 1 loss of any cause in last 5 years
      if(noOfLossesInThePastFiveYears > NUMPRIORLOSSES_ONE){
        reportOne += TWO
      }

      // BR.09.03 :: Risk has a swimming pool
      if(dwelling_hoe.HOUWQuestions.swimmingpool){
        reportOne+= SIX
      }

      //BR 8 ::
      getBREightData(policyPeriod)

      //BR.09.07 :: Risk has incidental business occupancy fom attached (HO 04 42)
      if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_PermittedIncOcp_HOE_ExtExists){
        reportOne += NINE
      }

      //BR.09.08 :: Risk has animal liability endorsement attached
       if(policyPeriod.HomeownersLine_HOE?.HOLI_AnimalLiabilityCov_HOE_ExtExists) {
         reportOne += TEN
       }

      //BR.09.09 ::Risk is built on stilts, piers or pilings
      if(dwelling_hoe.Foundation==(FoundationType_HOE.TC_STILTSPILINGS_EXT)
          || dwelling_hoe.Foundation==(FoundationType_HOE.TC_POSTPIERBEAMOPEN_EXT)
          || dwelling_hoe.Foundation==(FoundationType_HOE.TC_POSTPIERBEAMENCLOSED_EXT)){
         reportOne += ELEVEN
      }

     //BR.09.10 :: Risk is PC9 or PC10 (excluding CA)
      var pcCode = dwelling_hoe.HOLocation.OverrideDwellingPCCode_Ext ? dwelling_hoe.HOLocation.DwellingPCCodeOverridden_Ext?.Code : dwelling_hoe.HOLocation.DwellingProtectionClasscode
      if(( pcCode == ProtectionClassCode_Ext.TC_9.Code ||
           pcCode == ProtectionClassCode_Ext.TC_10.Code ) &&
           dwelling_State!=(State.TC_CA))  {
      reportOne += TWELVE
      }

      // BR.09.11 :: Property is over 20 years and has not been inspected in the last 5 years
      if(((currentDateYear - yearBuilt) > PROPERTY_AGE_20 && policyPeriod.DateLastInspection_Ext==null)
          || ((currentDateYear - yearBuilt) > PROPERTY_AGE_20 &&
              policyPeriod.DateLastInspection_Ext!=null &&
              (currentDateYear-DateUtil.getYear(policyPeriod.DateLastInspection_Ext)> LAST_INSPECTION_DONE_5 ))){
        reportOne += THIRTEEN
      }

      // BR 12 : 13 : 14
      var coverageLimit : BigDecimal = 0.00
      if(dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value!=null){
         coverageLimit=dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value
      }else{
         coverageLimit = dwelling_hoe.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value
      }
      var sqFootage  = policyPeriod.HomeownersLine_HOE.Dwelling.OverrideTotalSqFtVal_Ext ?
                       policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValOverridden_Ext as BigDecimal :
                       policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext as BigDecimal

      if(coverageLimit!= null && sqFootage!=0 && sqFootage!=null){
        // BR.09.12 :: Risk has Coverage A reflecting less than $85 per sq ft (AZ, FL,NC,NV, YX, SC) or Coverage A reflects less than $100 per sq ft (CA) or Coverage A reflects less than $150 per sq
        if( coverageLimit?.divide(sqFootage,4, RoundingMode.HALF_EVEN) < EIGHTY_FIVE
            && (dwelling_State==(State.TC_AZ)
                || dwelling_State==(State.TC_FL)
                || dwelling_State==(State.TC_NC)
                || dwelling_State==(State.TC_NV)
                || dwelling_State==(State.TC_TX)
                || dwelling_State==(State.TC_SC))){
        reportOne += FOURTEEN
        }

       // BR.09.13 :: Risk has Coverage A reflecting less than $85 per sq ft (AZ, FL,NC,NV, YX, SC) or Coverage A reflects less than $100 per sq ft (CA) or Coverage A reflects less than $150 per sq
        if(( coverageLimit?.divide(sqFootage,4, RoundingMode.HALF_EVEN)) < HUNDRED
          && dwelling_State==State.TC_CA){
        reportOne+= FOURTEEN
        }

        // BR.09.14 :: Risk has Coverage A reflecting less than $85 per sq ft (AZ, FL,NC,NV, YX, SC) or Coverage A reflects less than $100 per sq ft (CA) or Coverage A reflects less than $150 per sq ft (HI)
        if(( coverageLimit?.divide(sqFootage,4, RoundingMode.HALF_EVEN)) < ONE_FIFTY
            && dwelling_State==State.TC_HI){
          reportOne+= FOURTEEN
        }
      }

      // BR.09.15 :: Risk has a wood burner present
        if(policyPeriod.HomeownersLine_HOE.Dwelling.HeatSrcWoodBurningStove){
         reportOne += FIFTEEN
         reportFive = FIFTEENA
        }

      //BR.09.16 :: PC9 or PC10 (CA only)
      if(( pcCode == ProtectionClassCode_Ext.TC_9.Code ||
          pcCode == ProtectionClassCode_Ext.TC_10.Code ) &&
          dwelling_State == State.TC_CA)  {
        reportOne += SIXTEEN
        reportFour += SIXTEENA
      }

      //BR.09.17 ::  Risk located in CA with a Fireline score of 4 or higher or located in a SHIA area
      var adjustedHazardScore = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext ?
                                policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext :
                                policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHaz_Ext

       if(dwelling_State==State.TC_CA
       && (( adjustedHazardScore >= ADJUSTEDHAZARDSCORE_4 )
       ||(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineSHIA_Ext))){
         reportOne += TWENTYONE
       }

      //BR.09.18 :: Risk located in CA that indicates an overidden Fireline Adjusted Hazard Score
        if(dwelling_State==State.TC_CA && policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation?.OverrideFirelineAdjHaz_Ext){
          reportOne += TWENTYTWO
          reportFour += TWENTYTWOA
        }

      // BR.09.19 :: Risk in TX with a Wind/Hail loss in the last 2 years
        if(dwelling_State==State.TC_TX && windOrHailLossBR19n20){
          reportOne+= TWENTYTHREE
        }

      // BR.09.20 :: Wind/Hail loss in the last 2 years (All states except TX
      if(dwelling_State != State.TC_TX && windOrHailLossBR19n20) { // && wind hail loss less than 2 years
        reportOne += TWENTYFOUR
        reportThree += TWENTYFOURA
      }

      //BR.09.21 :: Risk in NC with a roof older than 7 years old or in AZ, NV, CA, SC, HI with composition shingle or wood roof over 15 years old
      if(( dwelling_State == State.TC_NC && (((currentDateYear - yearBuilt)>7)
        ||((dwelling_hoe.RoofingUpgrade)  && (currentDateYear - dwelling_hoe?.RoofingUpgradeDate)>7)))){
        reportOne += TWENTYSIX
        reportThree += TWENTYSIXA
      }

      // BR.09.22 :: Risk in NC with a roof older than 7 years old or in AZ, NV, CA, SC, HI with composition shingle or wood roof over 15 years old
      var roofType = policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideRoofType_Ext ?
                     policyPeriod.HomeownersLine_HOE.Dwelling?.RoofingMaterialOverridden_Ext?.Code :
                     policyPeriod.HomeownersLine_HOE.Dwelling?.RoofType?.Code
      if((dwelling_State==(State.TC_AZ) ||
         dwelling_State==(State.TC_NV) ||
         dwelling_State==(State.TC_CA) ||
         dwelling_State==(State.TC_SC)||
         dwelling_State==(State.TC_HI))
         && (roofType==(RoofType.TC_WOODSHAKE_EXT.Code) ||
             roofType==(RoofType.TC_WOODSHINGLES_EXT.Code))
         && (((currentDateYear - yearBuilt)>15) ||
            ((dwelling_hoe.RoofingUpgrade) && (currentDateYear - dwelling_hoe.RoofingUpgradeDate)> 15 ))){
        reportOne += TWENTYSIX
        reportThree += TWENTYSIXA
      }

      // BR.09.23 :: Lapse in coverage in the last 3 years. No prior insurance or No need listed as prior carrier and purchase date over 45 days ago
       if(policyPeriod.getAnswer( policyPeriod.Policy?.Product?.getQuestionSetById(HO_PREQUAL_EXT)?.getQuestion(LAPSE_IN_3_YEARS))?.BooleanAnswer){
           reportOne += TWENTYSEVEN
       }

      // BR.09.24 :: Lapse in coverage in the last 3 years. No prior insurance or No need listed as prior carrier and purchase date over 45 days ago
       if(policyPeriod.Policy?.PriorPolicies*.CarrierType*.Code.contains(CarrierType_Ext.TC_NOPRIORINS.Code)){
          reportOne += TWENTYSEVEN
       }

       //BR.09.25 :: Lapse in coverage in the last 3 years. No prior insurance or No need listed as prior carrier and purchase date over 45 days ago
       if(policyPeriod.Policy?.PriorPolicies?.length==0){
         reportOne += TWENTYSEVEN
       }

     //BR.09.26 :: Credit score less than 626 in conjunction with an underwriting rule
      if((policyPeriod.CreditInfoExt.CreditReport.CreditScore < CreditScore_626 )
          &&(( dwelling_State!=State.TC_CA
          || dwelling_State!=State.TC_HI)
          ||( dwelling_State==State.TC_TX
            &&( policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_TDP1_EXT)
              && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_TDP2_EXT
              && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_TDP3_EXT))){
        reportOne += THIRTY
      }

      // BR.09.27 :: High value inspection, Dwelling Coverage A => $1.5M except CA DF that orders HV inspection at => $900k
      if(coverageLimit >= COVERAGE_LIMIT_ONE_POINT_FIVE
        && dwelling_State != State.TC_CA
        && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_DP3_EXT
        && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_LPP_EXT
        && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_TDP1_EXT
        && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_TDP2_EXT
        && policyPeriod.HomeownersLine_HOE.HOPolicyType != HOPolicyType_HOE.TC_TDP3_EXT){
        reportTwo = THIRTYONE
      }

      // BR.09.28 :: High value inspection, Dwelling Coverage A => $1.5M except CA DF that orders HV inspection at => $900k
      if(coverageLimit >= COVERAGE_LIMIT_900
         && dwelling_State ==(State.TC_CA)
         && policyPeriod.HomeownersLine_HOE.HOPolicyType == (HOPolicyType_HOE.TC_DP3_EXT)){
        reportTwo += THIRTYONE
      }

      //BR.09.29 :: Properties in the zip codes below to supplemental also have a roof top inspection performed, regardless of property age.
      var zipCode = dwelling_hoe.HOLocation.PolicyLocation.PostalCode
      if(zipCode.contains(HYPHEN)){
        zipCode = zipCode.split(HYPHEN).last()
      }
      if(zipCodeList.contains(zipCode)){
        reportOne += THIRTYTWO
      }
      report.put("reportOne",reportOne)
      report.put("reportTwo",reportTwo)
      report.put("reportThree",reportThree)
      report.put("reportFour",reportFour)
      report.put("reportFive",reportFive)
    }
    return report
  }

  /**
   * Function checks for the BR number Eight and if any br is satisfied then data will be appended to reportOne Variable
   * @param policyPeriod PolicyPeriod
   */
  private function getBREightData(policyPeriod : PolicyPeriod){
    policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
    var dwelling_State = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State
    var noOfStories = policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideStoriesNumber_Ext ?
        policyPeriod.HomeownersLine_HOE.Dwelling?.NoofStoriesOverridden_Ext :
        policyPeriod.HomeownersLine_HOE.Dwelling?.StoriesNumber
    var exteriorWallFinishType = ""
    var constructionType = ""

    if(noOfStories==NumberOfStories_HOE.TC_ONEANDHALFSTORIES_EXT || noOfStories==NumberOfStories_HOE.TC_TWOSTORIES_EXT){
      exteriorWallFinishType = (policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideExteriorWFvalL1_Ext) ?
          policyPeriod.HomeownersLine_HOE.Dwelling?.ExteriorWFvalueOverridL1_Ext.Code :
          policyPeriod.HomeownersLine_HOE.Dwelling?.ExteriorWallFinishL1_Ext.Code

      constructionType = (policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideConstructionType_Ext) ?
          policyPeriod.HomeownersLine_HOE.Dwelling?.ConstTypeOverridden_Ext?.Code :
          policyPeriod.HomeownersLine_HOE.Dwelling?.ConstructionType?.Code
    }else{
      exteriorWallFinishType = (policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideExteriorWFval_Ext) ?
          policyPeriod.HomeownersLine_HOE.Dwelling?.ExteriorWallFinishOrOverride.Code :
          policyPeriod.HomeownersLine_HOE.Dwelling?.ExteriorWallFinish_Ext.Code

      constructionType = (policyPeriod.HomeownersLine_HOE.Dwelling?.OverrideConstructionType_Ext) ?
          policyPeriod.HomeownersLine_HOE.Dwelling?.ConstTypeOverridden_Ext?.Code :
          policyPeriod.HomeownersLine_HOE.Dwelling?.ConstructionType?.Code
    }
    //BR.09.04 :: Construction type is masonry (excluding FL) or with risk with a superior construction (excluding HO6) or has single wall construction in HI
    if(exteriorWallFinishType==(ExteriorWallFinish_Ext.TC_BRICKSTONEMASONRY.Code)
        && dwelling_State!= State.TC_FL){
      reportOne += EIGHT
    }

    // BR.09.05 ::  Construction type is masonry (excluding FL) or with risk with a superior construction (excluding HO6) or has single wall construction in HI
    // Construction ::
    if(constructionType==(ConstructionType.TC_LIGHTFRAMESINGLEWALL_EXT.Code) &&
        dwelling_State== State.TC_HI ){
      reportOne += EIGHT
    }
    //BR.09.06 :: Construction type is masonry (excluding FL) or with risk with a superior construction (excluding HO6) or has single wall construction in HI
    if(constructionType==(ConstructionType.TC_SUPERIORNONCOMBUSTIBLE_EXT.Code)
        && policyPeriod.HomeownersLine_HOE.HOPolicyType!= HOPolicyType_HOE.TC_HO6){
      reportOne += EIGHT
    }
  }
}