package gw.lob.ho

uses java.lang.Integer
uses java.util.ArrayList
uses java.util.Calendar
uses una.model.PropertyDataModel
uses gw.api.util.DisplayableException
uses gw.api.util.LocationUtil
uses java.util.ArrayList
uses una.integration.mapping.tuna.TunaAppResponse
uses java.text.SimpleDateFormat
uses java.util.Date
uses config.locale.en_US.typelist

/**
 * Created with IntelliJ IDEA.
 * User: svallabhapurapu
 * Date: 8/19/16
 *
 */
class HODwellingUtil_HOE {
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for to check if policyTypes are with in allowed range
*  HO Line of business
*/
  private static final var DIFF_YEAR_50 : int = 50
  private static final var DIFF_YEAR_60 : int = 60
  private static final var DIFF_YEAR_20 : int = 20
  private static final var DIFF_YEAR_15 : int = 15
  private static final var DIFF_YEAR_25 : int = 25
  private static final var YEAR_2002 : int = 2002
  private static final var YEAR_2003 : int = 2003
  private static final var YEAR_1975 : int = 1975
  private static final var WIND_SPEED_100 : int = 100
  private static final var WIND_SPEED_110 : int = 110
  private static final var WIND_SPEED_120 : int = 120
  private static final var PROTECTION_CLASSCODE_4 = typekey.ProtectionClassCode_Ext.TC_4.Code
  private static final var PROTECTION_CLASSCODE_2 = typekey.ProtectionClassCode_Ext.TC_2.Code
  private static final var PROTECTION_CLASSCODE_3 = typekey.ProtectionClassCode_Ext.TC_3.Code
  private static final var PROTECTION_CLASSCODE_5 = typekey.ProtectionClassCode_Ext.TC_5.Code
  static var sdfMetricFormat = new SimpleDateFormat("MM/dd/yyyy")
  static var metricDate: Date

  static function setProtectionClass(dwelling:Dwelling_HOE):boolean
  {
    if(dwelling.HOLocation.DwellingProtectionClasscode!= null){
    if(dwelling.HOLocation.DistanceToFireHydrant>1000 && dwelling.HOLocation.DwellingProtectionClasscode.indexOf("/")!=-1)
      {
        dwelling.HOLocation.OverrideDwellingPCCode_Ext=true
        dwelling.HOLocation.DwellingPCCodeOverridden_Ext= dwelling.HOLocation.DwellingProtectionClasscode.substring(2)
      }

    if(dwelling.HOLocation.DistanceToFireHydrant<1000 && dwelling.HOLocation.DwellingProtectionClasscode.indexOf("/")!=-1)
    {
      dwelling.HOLocation.OverrideDwellingPCCode_Ext=true
      dwelling.HOLocation.DwellingPCCodeOverridden_Ext= dwelling.HOLocation.DwellingProtectionClasscode.substring(0,1)
    }

    if(dwelling.HOLocation.DistanceToFireHydrant<1000 && dwelling.HOLocation.DistanceToFireStation<5 && dwelling.HOLocation.DwellingProtectionClasscode.indexOf("/")!=-1)
    {
      dwelling.HOLocation.OverrideDwellingPCCode_Ext=true
      dwelling.HOLocation.DwellingPCCodeOverridden_Ext= dwelling.HOLocation.DwellingProtectionClasscode.substring(0,1)
    }

    if(dwelling.HOLocation.DistanceToFireStation>5 && dwelling.HOLocation.DwellingProtectionClasscode.indexOf("/")!=-1)
    {
      dwelling.HOLocation.OverrideDwellingPCCode_Ext=true
      dwelling.HOLocation.DwellingPCCodeOverridden_Ext= typekey.ProtectionClassCode_Ext.TC_10
    }
    }
    return true
  }

  static function isFHFSvisible(tunaresponse:List<String>):boolean
  {
    var retval = false
    tunaresponse.each( \ elt ->
    {
      if(elt.indexOf("/")!=-1)
        {
          retval = true
        }
    }
    )

    return retval
  }

  static function isAllHoDp(policyType : typekey.HOPolicyType_HOE) : boolean {
     if(policyType == null){
       return false
     }
    if(typekey.HOPolicyType_HOE.TF_MEDICALPAYMENTSLIMITELIGIBLE.TypeKeys.contains(policyType)
        or typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(policyType)){
      return true
    }
    return false
  }

  static function initializeSingleReturnTypelists(dwelling:Dwelling_HOE, tunaAppResponse:una.integration.mapping.tuna.TunaAppResponse):boolean
  {
    if (tunaAppResponse != null ){
    if(dwelling.HOLocation.BCEGMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
      {
         dwelling.HOLocation.BCEG_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade) as typekey.BCEGGrade_Ext[]).first()
      }

    if(dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.DwellingProtectionClasscode = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.ProtectionClass).first());// as typekey.ProtectionClassCode_Ext[]).first()
    }

    if(dwelling.HOLocation.FirelinemthlvlMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.Firelinemthlvl_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLineMatchLevel)).first()
    }
    if(dwelling.HOLocation.WindPoolMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.WindPoolAsYESNO_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.WindPool) ).first()
    }
    if(dwelling.HOLocation.DistBOWMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.DistBOW_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.DistanceToMajorBOW) as typekey.DistBOWOverridden_Ext[] ).first()
    }
    if(dwelling.HOLocation.DistBOWNVMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {
      dwelling.HOLocation.DistBOWNamedValue_Ext =gw.lob.ho.HODwellingUtil_HOE.getDependentCodes(tunaAppResponse.DistanceToMajorBOW).first()

    }
    if(dwelling.HOLocation.DistToCoastMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.DistToCoast_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.DistanceToCoast) as typekey.DistToCoastOverridden_Ext[]).first()
    }
    if(dwelling.HOLocation.TerritoryCodeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.TerritoryCodeTunaReturned_Ext = gw.lob.ho.HODwellingUtil_HOE.getTerritoryCodes(tunaAppResponse, dwelling.HOPolicyType).first()
    }
    if(dwelling.HOLocation.LatitudeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {
      dwelling.HOLocation.PolicyLocation.Latitude_Ext = tunaAppResponse.Latitude
    }
    if(dwelling.HOLocation.LongitudeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.PolicyLocation.Longitude_Ext = tunaAppResponse.Longitude
    }

    if(dwelling.HOLocation.ISO360MatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.ISO360ValueID_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.ISO360Value)).first()
    }





    if(dwelling.HOLocation.ACVValueMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.ACVValue_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.ACV)).first()
    }
    if(dwelling.HOLocation.FirelineSHIAMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.FirelineSHIA_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLineSHIA) ).first()
    }
    if(dwelling.HOLocation.FirelineFuelMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.FirelineFuel_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLineFuel) ).first()
    }

    if(dwelling.HOLocation.FirelinePropHazMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.FirelinePrHaz_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLinePropertyHazard)).first()
    }

        //not yet complete
    if(dwelling.HOLocation.FirelineAdjHazMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.FirelineAdjHaz_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLinePropertyHazard) as typekey.HOAdjustedHazardScore_Ext[]).first()
    }


    if(dwelling.HOLocation.FireaccessMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.Fireaccess_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLineAccess) ).first()
    }
    if(dwelling.HOLocation.FireslopeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.HOLocation.Fireslope_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.FireLineSlope) ).first()
    }
    //dwelling.HOLocation.WindpoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)
    /************ dwelling entity *****/

    if(dwelling.StoriesNumberMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.StoriesNumber = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.StoryNumber) as typekey.NumberOfStories_HOE[]).first()
    }
    if(dwelling.RoofTypeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.RoofType = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.RoofCover) as typekey.RoofType[]).first()
    }


    //8888888888888888
    if(dwelling.RoofShapeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.RoofShape_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.RoofType) as typekey.RoofShape_Ext[]).first()
    }
    if(dwelling.ConstructionTypeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.ConstructionType = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.ConstructionType) as typekey.ConstructionType_HOE[]).first()
    }
    if(dwelling.ConstructionTypeMatchLvlL2_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.ConstructionTypeL2_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.ConstructionType) as typekey.ConstructionType_HOE[]).first()
    }
    if(dwelling.ConstructionTypeMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.ConstructionType = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.ConstructionType) as typekey.ConstructionType_HOE[]).first()
    }



    if(dwelling.YearBuiltMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.YearBuilt = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.YearBuilt) ).first()
    }
    if(dwelling.BaseFloodElValMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.BaseFloodElVal_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BaseFloodElevation)).first()
    }
    if(dwelling.PropFloodValMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.PropFloodVal_Ext = gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.PropertyFlood).first() as typekey.FloodZoneOverridden_Ext
    }
    if(dwelling.EarthquakeTerMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.EarthquakeTer_Ext = gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.EarthQuakeTerritory).first()
    }


    //complete till here

    if(dwelling.ExteriorWFvalMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.ExteriorWallFinish_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.WallFinish) as typekey.ExteriorWallFinish_Ext[]).first()
    }

    if(dwelling.ExteriorWFvalMatchLevelL1_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.ExteriorWallFinishL1_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.WallFinish) as typekey.ExteriorWallFinish_Ext[]).first()
    }
    if(dwelling.ExteriorWFvalMatchLevelL2_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {

      dwelling.ExteriorWallFinishL2_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.WallFinish) as typekey.ExteriorWallFinish_Ext[]).first()
    }

    if(dwelling.TotalSqFtValMatchLevel_Ext ==typekey.TUNAMatchLevel_Ext.TC_EXACT)
    {
      dwelling.SquareFootage_Ext = (gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.SquareFootage)).first()
    }

    if(dwelling.HOLocation.ResFireDeptMatchLevel_Ext == tc_exact){

      dwelling.HOLocation.ResFireDept_Ext = gw.lob.ho.HODwellingUtil_HOE.getDependentCodes(tunaAppResponse.ProtectionClass).first()
    }


    }//Mapping Metrics version date
    if(tunaAppResponse != null && tunaAppResponse.MetricsVersion.first().NamedValue != null){
      metricDate = new Date(tunaAppResponse.MetricsVersion.first().NamedValue)
      dwelling.MetricsVersionDate_Ext = sdfMetricFormat.format(metricDate)
    }

    return false
  }

  /*static function getConstructionTypeStateSpecific(dwelling : Dwelling_HOE) : List<typekey.ConstructionType_HOE> {
    if(dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code){
       return typekey.ConstructionType_HOE.TF_HI_EXT.TypeKeys
    }
     return typekey.ConstructionType_HOE.TF_ALLHODP_EXT.TypeKeys
  }*/

  static function getConstructionTypeStateSpecific(dwelling : Dwelling_HOE) : List<typekey.ConstructionType_HOE> {
    var tempList = new ArrayList<typekey.ConstructionType_HOE>()
    if(dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code){
      tempList.addAll(typekey.ConstructionType_HOE.TF_HI_EXT.TypeKeys)
      return tempList.sortBy(\typeCodeName -> typeCodeName.DisplayName)
    }
    tempList.addAll(typekey.ConstructionType_HOE.TF_ALLHODP_EXT.TypeKeys)
    return tempList.sortBy(\typeCodeName -> typeCodeName.DisplayName)
  }

  static function filterTunaConstructionTypeStateSpecific(dwelling : Dwelling_HOE, constype:typekey.ConstructionType_HOE[]) : List<typekey.ConstructionType_HOE> {
    if(dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code){
      return typekey.ConstructionType_HOE.TF_HI_EXT.TypeKeys
    }
    return typekey.ConstructionType_HOE.TF_ALLHODP_EXT.TypeKeys
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for Roof Deck TypeList value range based on state
*  HO Line of business
*/
  static function getRoofDeckAttachementStateRange(dwelling : Dwelling_HOE) : List<typekey.RoofDeckAttachment_Ext>{
    if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code){
      return  typekey.RoofDeckAttachment_Ext.TF_FLONLY.TypeKeys
      } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code){
        return typekey.RoofDeckAttachment_Ext.TF_SCONLY.TypeKeys
    }
     return null
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for Roof Wall connectionTypeList value range based on state
*  HO Line of business
*/
  static function getRoofWallConnectionRange(dwelling : Dwelling_HOE) : List<typekey.RoofWallConnection_Ext>{
    if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code) {
      return typekey.RoofWallConnection_Ext.TF_FLONLY.TypeKeys
    } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code) {
      return typekey.RoofWallConnection_Ext.TF_SCONLY.TypeKeys
    }
      return null
  }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for visibility of FloorLocation
*  HO Line of business
*/
  static function isFloorLocationVisible(dwelling : Dwelling_HOE) : boolean{

      if((dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 or
                  dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6 or
            dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT or
        (dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT
            and dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO) )&&
          dwelling.NumberStoriesOrOverride != null
          and dwelling.NumberStoriesOrOverride != typekey.NumberOfStories_HOE.TC_ONESTORY_EXT )
      {
        return true
      }

    return false
  }

  /*
  *  Author: uim-svallabhapurapu
  *  Change Log: New function for visibility of UpstairsLaundrySurcharge
  *  HO Line of business
  */
  static function isUpstairsLaundrySurchargeVisible(dwelling : Dwelling_HOE) : boolean {
    if(dwelling.Branch.BaseState.Code == typekey.State.TC_CA.Code and dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ){
      if(dwelling.StoriesNumber != typekey.NumberOfStories_HOE.TC_ONESTORY_EXT)
      {
        return true
      }
    }
    return  false
  }

  /*
  *  Author: uim-svallabhapurapu
  *  Change Log: New function to calculate difference in years
  *  HO Line of business
  */
  static function diffInYears(policyYear : Integer, builtYear : Integer) : int {
    var diffYears : int = null
    if(policyYear != null and  builtYear != null){
       if(policyYear.intValue() > builtYear.intValue()){
         diffYears = (policyYear.intValue() - builtYear.intValue())
       } else  {
         diffYears = (builtYear.intValue() - policyYear.intValue())
       }
     }
   return diffYears
  }

  /*
   *  Author: uim-svallabhapurapu
   *  Change Log: New function for visibility of Heating Replaced
   *  HO Line of business
   */
  static function isHeatingReplacedVisible(dwelling : Dwelling_HOE) : boolean{

    var baseState = {"AZ","FL","NV","NC","SC","TX"}
      var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, getYearBuilt(dwelling))

    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
            if(baseState.contains(dwelling.Branch.BaseState.Code) and (diffYears != null and diffYears > DIFF_YEAR_50) ){
              return true
            } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code and (diffYears != null and diffYears > DIFF_YEAR_60)){
               return true
            }
     }
    return false
  }
  /*
  *  Author: uim-svallabhapurapu
  *  Change Log: New function for visibility of PlumbingReplaced Replaced
  *  HO Line of business
  */
  static function isPlumbingReplacedVisible(dwelling : Dwelling_HOE) : boolean {
    var baseState = {"AZ","FL","NV","NC","SC","TX"}
    var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, getYearBuilt(dwelling))
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
      if(baseState.contains(dwelling.Branch.BaseState.Code) and (diffYears != null and diffYears > DIFF_YEAR_50)){
        return true
      } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code and (diffYears != null and diffYears > DIFF_YEAR_60)){
        return true
      }
    }
    return false
  }
  /*
 *  Author: uim-svallabhapurapu
 *  Change Log: New function for visibility of Roofing Replaced
 *  HO Line of business
 */
  static function isRoofingReplacedVisible(dwelling : Dwelling_HOE) : boolean {
    var baseState = {"AZ","FL","NV","NC","SC"}

    var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, getYearBuilt(dwelling))
    // SC#1
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
        if(baseState.contains(dwelling.Branch.BaseState.Code) and (diffYears != null and diffYears > DIFF_YEAR_20)){
          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_TX.Code and (diffYears != null and diffYears > DIFF_YEAR_15)){
          return true
        } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code and  (diffYears != null and diffYears > DIFF_YEAR_25)) {
           return true
        }
    } if(dwelling.Branch.BaseState.Code == typekey.State.TC_CA.Code){
         if(dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 or
             dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 or
             dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6){
               if(diffYears != null and diffYears  > DIFF_YEAR_25){
                 return true
               }
         } else if (dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT and (diffYears != null and diffYears > DIFF_YEAR_20)) {
              return true
           }
       }
    return false
  }
  /*
 *  Author: uim-svallabhapurapu
 *  Change Log: New function for visibility of WiringReplaced
 *  HO Line of business
 */
  static function isWiringReplacedVisible(dwelling : Dwelling_HOE) : boolean{
    var baseState = {"AZ","FL","NV","NC","SC","TX"}
    var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, getYearBuilt(dwelling))
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
      if(baseState.contains(dwelling.Branch.BaseState.Code) and (diffYears != null and  diffYears > DIFF_YEAR_50)){
        return true
      } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_HI.Code and (diffYears != null and diffYears > DIFF_YEAR_60)){
        return true
      }
    }
    return false
  }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for visibility of WindstormAssociation
*  HO Line of business
*/
  static function isWindstormAssociationVisible(dwelling : Dwelling_HOE) : boolean{
     var baseState = {"FL","NC","SC","TX"}
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
      if(baseState.contains(dwelling.Branch.BaseState.Code)){
        return true
      }
    }
    return false
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for visibility of WinstrormHurricane And Hail Exclusion
*  HO Line of business
*/
  static function isWindstormHurricaneAndHailExclusionVisible(dwelling : Dwelling_HOE) : boolean {
    var baseState = {"FL","NC","SC","TX"}
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
      if(baseState.contains(dwelling.Branch.BaseState.Code)){
        return true
      }
    }
    return false
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for visibility of Mitigation Form Dated Last 5 years
*  HO Line of business
*/
  static function isMitigationFormDatedWithinLast5YearsVisible(dwelling : Dwelling_HOE) : boolean {
    var baseState = {"FL","SC"}
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
      if(baseState.contains(dwelling.Branch.BaseState.Code) and (dwelling.WHurricaneHailExclusion_Ext != null and !dwelling.WHurricaneHailExclusion_Ext)){
        return true
      }
    }
    //Making default values of wind mitigation  to null if yes is returned from service
    if(baseState.contains(dwelling.Branch.BaseState.Code)){
       if(dwelling.WHurricaneHailExclusion_Ext != null and dwelling.WHurricaneHailExclusion_Ext){
         dwelling.WindMitigation_Ext = null
         gw.lob.ho.HODwellingUtil_HOE.resetDefaults(dwelling)
       }
    }

    return false
  }

  // Get typeList value based on system table
  static function getAssociatedWindSpeedOfDesign(windSpeed : int) : typekey.WindSpeedOfDesign_Ext{
     if(windSpeed == WIND_SPEED_100){
       return typekey.WindSpeedOfDesign_Ext.TC_GREATERTHANOREQUAL100
     } else if(windSpeed == WIND_SPEED_110){
        return typekey.WindSpeedOfDesign_Ext.TC_GREATERTHANOREQUAL110
     } else if(windSpeed == WIND_SPEED_120){
          return typekey.WindSpeedOfDesign_Ext.TC_GREATERTHANOREQUAL120
     }
    return  null
  }

 // Get typeList value based on system table
  static function getAssociatedFBCWindSpeed(fbcWindSpeed : int) : typekey.FBCWindSpeed_Ext {
     if(fbcWindSpeed == WIND_SPEED_100){
       return typekey.FBCWindSpeed_Ext.TC_100
     } else if (fbcWindSpeed == WIND_SPEED_110 ){
       return typekey.FBCWindSpeed_Ext.TC_110
     }  else if (fbcWindSpeed == WIND_SPEED_120){
       return typekey.FBCWindSpeed_Ext.TC_GREATERTHANEQUALTO120
     }
    return null
  }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function to default values wind mitigation questions, applicable for FL/SC
*  HO Line of business
*/
   static function applyDefaults(dwelling : Dwelling_HOE){

     var county = dwelling.HOLocation.PolicyLocation.County

     var flWindMitigationQuery = gw.api.database.Query.make(FLWMitigationDefaults_Ext)
       var result =   flWindMitigationQuery.compare(FLWMitigationDefaults_Ext#County, Equals, county ).select().first()

     if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code) {

       if(dwelling.RoofDecking_Ext == null){dwelling.RoofDecking_Ext = typekey.RoofDecking_Ext.TC_OTHERROOFDECK}
       if(dwelling.OpeningProtection_Ext == null){ dwelling.OpeningProtection_Ext = typekey.OpeningProtection_Ext.TC_UNKNOWN}
       if(dwelling.InternalPressureDsgn_Ext == null){dwelling.InternalPressureDsgn_Ext = typekey.InternalPressureDsgn_Ext.TC_ENCLOSED}
       //Defect De372 : set value based roof type
       if(dwelling.SecondaryWaterResis_Ext == null){
         if(dwelling.RoofType == typekey.RoofType.TC_REINFORCEDCONCRETE_EXT || (dwelling.OverrideRoofType_Ext && dwelling.RoofingMaterialOverridden_Ext == typekey.RoofType.TC_REINFORCEDCONCRETE_EXT)){
           dwelling.SecondaryWaterResis_Ext = typekey.SecondaryWaterResis_Ext.TC_NOSWR
         } else {
           dwelling.SecondaryWaterResis_Ext = typekey.SecondaryWaterResis_Ext.TC_UNKNOWN
         }
       }

       // Set default value based on county
       if(result != null){
         if(dwelling.FBCWindSpeed_Ext == null)
         {
           dwelling.FBCWindSpeed_Ext = getAssociatedFBCWindSpeed(result.FBCWindSpeed.intValue())
         }//typekey.FBCWindSpeed_Ext.getTypeKeys().firstWhere( \ elt -> elt.Code == result.FBCWindSpeed.toString())}
         if(dwelling.WindSpeedOfDesign_Ext == null)
         {
           dwelling.WindSpeedOfDesign_Ext = getAssociatedWindSpeedOfDesign(result.WindSpeedOfDesign.intValue())
         }
         if(dwelling.WindBorneDebrisRegion_Ext == null){dwelling.WindBorneDebrisRegion_Ext = typekey.WindBorneDebrisRegion_Ext.get(result.WindBorneDebrisRegion.toLowerCase())}
       }
     }
     if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code) {
       if(dwelling.OpeningProtection_Ext == null){dwelling.OpeningProtection_Ext = typekey.OpeningProtection_Ext.TC_UNKNOWN}
       if(dwelling.RoofWallConnection_Ext == null){dwelling.RoofWallConnection_Ext = typekey.RoofWallConnection_Ext.TC_SINGLEWRAPS}
       if(dwelling.RoofCover_Ext == null){dwelling.RoofCover_Ext = typekey.RoofCover_Ext.TC_SCBC}
        if(dwelling.RoofDeckAttachment_Ext == null){dwelling.RoofDeckAttachment_Ext = typekey.RoofDeckAttachment_Ext.TC_LEVELB}
        if(dwelling.DoorStrength_Ext == null){dwelling.DoorStrength_Ext = typekey.DoorStrength_Ext.TC_REINFORCEDSINGLEWIDTHDOORS}
       if(dwelling.SecondaryWaterResis_Ext == null){dwelling.SecondaryWaterResis_Ext = typekey.SecondaryWaterResis_Ext.TC_SWR}
      }
   }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for reset default values based on condition, applicable for FL/SC
*  HO Line of business
*/
  static function resetDefaults(dwelling : Dwelling_HOE) {

      dwelling.RoofDecking_Ext = null
      dwelling.OpeningProtection_Ext = null
     // dwelling.FBCWindSpeed_Ext = null
     // dwelling.WindSpeedOfDesign_Ext = null
      dwelling.WindBorneDebrisRegion_Ext = null
      dwelling.InternalPressureDsgn_Ext = null
      dwelling.SecondaryWaterResis_Ext = null
      dwelling.RoofWallConnection_Ext = null
      dwelling.RoofCover_Ext = null
      dwelling.RoofDeckAttachment_Ext = null
      dwelling.DoorStrength_Ext = null

  }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for condition based reset or apply default, applicable for FL/SC
*  HO Line of business
*/
  static function applyReset(dwelling : Dwelling_HOE){

    if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) < YEAR_2002){
      if(dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext){
        resetDefaults(dwelling)
        // Apply Default only for FL mitigation questions
        var flWindMitigationQuery = gw.api.database.Query.make(FLWMitigationDefaults_Ext)
        var result =   flWindMitigationQuery.compare(FLWMitigationDefaults_Ext#County, Equals, dwelling.HOLocation.PolicyLocation.County ).select().first()
        if(result != null){
          if(dwelling.FBCWindSpeed_Ext == null){dwelling.FBCWindSpeed_Ext = getAssociatedFBCWindSpeed(result.FBCWindSpeed.intValue())}
          if(dwelling.WindSpeedOfDesign_Ext == null){dwelling.WindSpeedOfDesign_Ext = getAssociatedWindSpeedOfDesign(result.WindSpeedOfDesign.intValue())}
          if(dwelling.WindBorneDebrisRegion_Ext == null){dwelling.WindBorneDebrisRegion_Ext = typekey.WindBorneDebrisRegion_Ext.get(result.WindBorneDebrisRegion.toLowerCase())}
        }
      }
    }

    else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and  getYearBuilt(dwelling) < YEAR_2002){
      if(dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext){
          resetDefaults(dwelling)
      }
    }
   else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) >= YEAR_2002){
      if(dwelling.WindMitigation_Ext != null and (dwelling.WindMitigation_Ext or !dwelling.WindMitigation_Ext)){
        resetDefaults(dwelling)
        applyDefaults(dwelling)
      }
    }
    else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and getYearBuilt(dwelling) < YEAR_2003) {
      if(dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext){
            resetDefaults(dwelling)
      }
    }

    else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and getYearBuilt(dwelling) >= YEAR_2003) {
      if(dwelling.WindMitigation_Ext != null and (!dwelling.WindMitigation_Ext or dwelling.WindMitigation_Ext)){
         resetDefaults(dwelling)
         applyDefaults(dwelling)
       }
    }
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for visibility of Mitigation questions for state FL/SC
*  HO Line of business
*/
  static function isMitigationQuestionsVisible(dwelling : Dwelling_HOE) : boolean{

    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
        if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) < YEAR_2002 and (dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext) ){
          return true
        } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) < YEAR_2002 and (!dwelling.WindMitigation_Ext or dwelling.WindMitigation_Ext == null)) {
           return false
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and getYearBuilt(dwelling) < YEAR_2003 and (dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext) ){
          return true
        } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and getYearBuilt(dwelling) < YEAR_2003 and (!dwelling.WindMitigation_Ext or dwelling.WindMitigation_Ext == null)){
          return false
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) >=  YEAR_2002 and ( dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext) ) {
          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) >=  YEAR_2002 and (dwelling.WindMitigation_Ext)){
          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and getYearBuilt(dwelling) >= YEAR_2003 and (dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext  )){

          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code  and getYearBuilt(dwelling) >= YEAR_2003 and dwelling.WindMitigation_Ext){

          return true
        }

    }
    return false
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for Editability of Mitigation questions for state FL/SC
*  HO Line of business
 */
  static function isMitigationQuestionsEditable(dwelling : Dwelling_HOE) : boolean{
       if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and getYearBuilt(dwelling) >=  YEAR_2002 and ( dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext)){
         return false
       } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and getYearBuilt(dwelling) >= YEAR_2003 and (dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext)){
         return false
       }

    return true
  }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for Visibility of Does roof qualify for the hail resistive roof credit?
*  HO Line of business
 */
  static function isHailResistantRoofCreditVisible(dwelling : Dwelling_HOE) : boolean{
    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType) and dwelling.Branch.BaseState.Code == typekey.State.TC_TX.Code){
        return true
    }
    return false
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for FoundationProtected for visibility
*  HO Line of business
 */
  static function isFoundationProtectedVisible(dwelling : Dwelling_HOE) : boolean {

    if(isAllHoDp(dwelling.Branch.HomeownersLine_HOE.HOPolicyType)){
      if(dwelling.Foundation == typekey.FoundationType_HOE.TC_POSTPIERBEAMOPEN_EXT or dwelling.Foundation == typekey.FoundationType_HOE.TC_POSTPIERBEAMENCLOSED_EXT ){
        return true
      }
    }
    return false
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for Supplimental Surchage for visibility
*  HO Line of business
 */
  static function isSupplimentalSurchargeVisible(dwelling : Dwelling_HOE): boolean{
      if(dwelling.Branch.BaseState.Code == typekey.State.TC_CA.Code and dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT){
        return true
      }
    return false
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: Added the new function to mock values that are used for Dwelling construction screen - for Rating and service depandant (ISO 360)
*  HO Line of business
 */
  static function setDefault(dwelling : Dwelling_HOE){
    // These are mandatory for rating and these are not being shown in screen
    dwelling.WindClass = typekey.WindRating.TC_RESISTIVE
    dwelling.ConstructionCode = "other"
    //apply changes for windpool eligible policies  - applied during exit from dwelling screen
    //applyChangesIfWindPoolEligible(dwelling)
  }

  /*
 *  Author: uim-svallabhapurapu
 *  Change Log: Opening protection value range based on state
 *  HO Line of business
  */

  static function getOpeningProtectionRange(dwelling : Dwelling_HOE) :  List<typekey.OpeningProtection_Ext> {
   if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code) {
      return typekey.OpeningProtection_Ext.TF_FLONLY.TypeKeys
  } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code) {
      return typekey.OpeningProtection_Ext.TF_SCONLY.TypeKeys
  }
  return typekey.OpeningProtection_Ext.TF_ALLOTHERSTATES.TypeKeys
  }

  /*
 *  Author: uim-svallabhapurapu
 *  Change Log: Panel manufacturing value range based on YOC
 *  HO Line of business
  */

  static function getPanelManufacturingRange(dwelling : Dwelling_HOE) : List<typekey.PanelManufacturer_Ext>{
    var yearBuilt : int = 1990
    if(getYearBuilt(dwelling) >= yearBuilt ) {
      return typekey.PanelManufacturer_Ext.TF_YEARGROUP1.TypeKeys
    }
    return typekey.PanelManufacturer_Ext.TF_ALLOTHERYEARS.TypeKeys
  }

  /*
 *  Author: uim-svallabhapurapu
 *  Change Log: Plumbing value range based on YOC
 *  HO Line of business
  */

  static function getPlumbingRange(dwelling : Dwelling_HOE) : List<typekey.PlumbingType_HOE> {
     var yearBuilt_1975 : int = 1975
     var yearBuilt_1990 : int = 1990
     var yearBuilt_1995 : int = 1995

    if(getYearBuilt(dwelling) >= yearBuilt_1975 and getYearBuilt(dwelling) < yearBuilt_1990) {
       return typekey.PlumbingType_HOE.TF_YEARGRP1_EXT.TypeKeys
    } else if (getYearBuilt(dwelling) >= yearBuilt_1990 and getYearBuilt(dwelling) < yearBuilt_1995 ) {
        return typekey.PlumbingType_HOE.TF_YEARGRP2_EXT.TypeKeys
      } else if(getYearBuilt(dwelling) >= yearBuilt_1995) {
         return typekey.PlumbingType_HOE.TF_YEARGRP3_EXT.TypeKeys
        }
      return typekey.PlumbingType_HOE.TF_ALLOTHERYEARS_EXT.TypeKeys
  }

  /*
 *  Author: uim-svallabhapurapu
 *  Change Log: Wiring value range based on YOC
 *  HO Line of business
  */
  static function getWiringRange(dwelling : Dwelling_HOE) : List<typekey.WiringType_HOE> {
    var yearBuilt_1960 : int = 1960
    var yearBuilt_1980 : int = 1980

   if(getYearBuilt(dwelling) >= yearBuilt_1960 and getYearBuilt(dwelling) < yearBuilt_1980) {
          return  typekey.WiringType_HOE.TF_YEARGRP1_EXT.TypeKeys
   } else if(getYearBuilt(dwelling) >=  yearBuilt_1980) {
          return typekey.WiringType_HOE.TF_YEARGRP2_EXT.TypeKeys
     }
   return typekey.WiringType_HOE.TF_ALLOTHERYEARS_EXT.TypeKeys
 }

  // De728, Req update to exclude Fuse box
  static function getElectricalSystemRange(dwelling : Dwelling_HOE) : List<typekey.BreakerType_HOE>{
    var yearBuilt : int = 1990
     if(getYearBuilt(dwelling) >= yearBuilt) {
       return typekey.BreakerType_HOE.TF_YEARGRP1_EXT.TypeKeys
     }
   return  typekey.BreakerType_HOE.getTypeKeys(false)
  }

  /**
  * Method to get the SubdivisionNames based on the Jurisdiction
   */
  static function getSubdivisionNames(jurisdiction : Jurisdiction) : List<typekey.SubdivisionName_Ext> {
    var subDivNames : List<typekey.SubdivisionName_Ext>
    switch(jurisdiction){
      case Jurisdiction.TC_CA :
          subDivNames = SubdivisionName_Ext.TF_CA.TypeKeys
          break
      case Jurisdiction.TC_FL :
          subDivNames = SubdivisionName_Ext.TF_FL.TypeKeys
          break
      case Jurisdiction.TC_SC :
          subDivNames = SubdivisionName_Ext.TF_SC.TypeKeys
          break
      case Jurisdiction.TC_TX :
          subDivNames = SubdivisionName_Ext.TF_TX.TypeKeys
          break
        default :
    }
    return subDivNames
  }

  /**
  * Method to reset Protection Class Codes based on the Jurisdiction
   */
  static function resetProtectionClassCode(jurisdiction : Jurisdiction, dwellingHOLocation : HOLocation_HOE) {
    switch(jurisdiction){
      case Jurisdiction.TC_CA :
          if(SubdivisionName_Ext.TC_VERONA == dwellingHOLocation.SubdivisionName_Ext) {
            dwellingHOLocation.DwellingProtectionClassCode = PROTECTION_CLASSCODE_4
          }
          break
      case Jurisdiction.TC_FL :
          if(SubdivisionName_Ext.TC_FISHHAWKRANCH == dwellingHOLocation.SubdivisionName_Ext) {
            dwellingHOLocation.DwellingProtectionClassCode = PROTECTION_CLASSCODE_3
          } else if(dwellingHOLocation.SubdivisionName_Ext != null) {
            dwellingHOLocation.DwellingProtectionClassCode = PROTECTION_CLASSCODE_5
          }
          break
      case Jurisdiction.TC_SC :
          if(SubdivisionName_Ext.TC_CAROLINAPARK == dwellingHOLocation.SubdivisionName_Ext) {
            dwellingHOLocation.DwellingProtectionClassCode = PROTECTION_CLASSCODE_3
          } else if(dwellingHOLocation.SubdivisionName_Ext != null) {
            dwellingHOLocation.DwellingProtectionClassCode = PROTECTION_CLASSCODE_5
          }
          break
      case Jurisdiction.TC_TX :
          if(dwellingHOLocation.SubdivisionName_Ext != null) {
            dwellingHOLocation.DwellingProtectionClassCode = PROTECTION_CLASSCODE_2
          }
          break
        default :
    }
  }

  /**
  * Method to determine Protection Sub Division Availability
   */
  static function isProtectedSubDivisionVisible(polPeriod : PolicyPeriod, dwelling : Dwelling_HOE) : boolean {
    var protectedSubDivAvailable = false
    switch(polPeriod.BaseState){
      case Jurisdiction.TC_CA :
          protectedSubDivAvailable = dwelling.isPolicyHOTypes ? true : false
          break
      case Jurisdiction.TC_FL :
          protectedSubDivAvailable = (dwelling.isPolicyHOTypes or dwelling.isPolicyDPTypes) ? true : false
          break
      case Jurisdiction.TC_SC :
          protectedSubDivAvailable = true
          break
      case Jurisdiction.TC_TX :
          protectedSubDivAvailable = (dwelling.isPolicyHOTypes or dwelling.isPolicyTDPTypes) ? true : false
          break
        default :
    }
    return protectedSubDivAvailable
  }

  /**
  * Method to determine First Time Deeded visibility
   */
  static function isFirstTimeDeededVisible(dwelling : Dwelling_HOE) : boolean {


    var yearBuilt = getYearBuilt(dwelling)
    var currentYear = Calendar.getInstance().get(Calendar.YEAR);
    var validYearOfPurchase = (yearBuilt!=null && (yearBuilt == currentYear or
        yearBuilt == currentYear+1 or yearBuilt == currentYear-1)) ? true : false

    if(HOPolicyType_HOE.TF_HOTYPES.TypeKeys.contains(dwelling.HOPolicyType)
        && Jurisdiction.TF_FIRSTTIMEDEEDEDHOMETYPES.TypeKeys.contains(dwelling.PolicyPeriod.BaseState)
        && validYearOfPurchase) {
      return true
    }
    return false
  }


  static function getWindpoolCodes(tunaValues : List<PropertyDataModel>, dwelling:Dwelling_HOE) : List<String>
  {
    if(dwelling.PolicyPeriod.BaseState.Code!="NC")
      return getTunaCodes(tunaValues)
    else
    {
      return null//{"Yes","No"}.toList()
    }
  }

  static function isNCWindpool(dwelling:Dwelling_HOE):boolean
  {
    var countylist = {"Beaufort", "Brunswick", "Camden", "Carteret", "Chowan", "Craven", "Currituck", "Dare", "Hyde", "Jones", "New Hanover", "Onslow"
    ,"Pamlico",  "Pasquotank", "Pender", "Perquimans", "Tyrrell", "Washington" }
    if(dwelling.PolicyPeriod.BaseState.Code=="NC" && countylist.contains(dwelling.PolicyPeriod.PrimaryLocation.County))
      return true
    else
      return false
  }

  static function setNCWindpool(dwelling:Dwelling_HOE) : boolean
  {
    if(isNCWindpool(dwelling))
      dwelling.HOLocation.WindPool_Ext=true
// else
//      dwelling.HOLocation.WindPool_Ext=false

      return true
  }


  static function getTunaCodes(tunaValues : List<PropertyDataModel>) : List<String> {
    var tunaCodeAndPercent = new ArrayList<String>()

    if(tunaValues != null) {
      tunaValues.each( \ elt ->
          {
            if(elt.Value!=null && elt.Value!="0")
            tunaCodeAndPercent.add(elt.Value)
          })// + " - " +elt.Percent+" %"))
    }

    return tunaCodeAndPercent.order().toSet().toList()
  }

  static function getProtectionCodes(theProtectionClassValues: List<PropertyDataModel>) : List<String> {
    var tunaCodeAndPercent = new ArrayList<String>()
    if(theProtectionClassValues != null) {
      theProtectionClassValues.each( \ elt ->
      {
        if(elt.Value.contains("/")){
          tunaCodeAndPercent.add(elt.Value.split("/").first())
          tunaCodeAndPercent.add(elt.Value.split("/").last())
        }else{
          tunaCodeAndPercent.add(elt.Value)
        }
      })
    }
    return tunaCodeAndPercent.order()
  }

  static function getTerritoryCodes(tunaResponse : TunaAppResponse, pType :HOPolicyType_HOE ) : List<String>{
     // bunch of if clauses
     if(typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(pType) && tunaResponse.HOTerritoryCode!=null)
       return getTunaCodes(tunaResponse.HOTerritoryCode)
    else if(typekey.HOPolicyType_HOE.TF_ALLDPTDPLPP.TypeKeys.contains(pType) && tunaResponse.DFTerritoryCode!=null)
      return getTunaCodes(tunaResponse.DFTerritoryCode)
    else
      return getTunaCodes(tunaResponse.TerritoryCode)
  }

  static function getDependentCodes(tunaValues : List<PropertyDataModel>) : List<String> {
    var tunaCodeAndPercent = new ArrayList<String>()
    if(tunaValues != null) {
      tunaValues.each( \ elt -> tunaCodeAndPercent.add(elt.NamedValue))// + " - " +elt.Percent+" %"))
    }
    return tunaCodeAndPercent
  }

  static function getDependentCode(value:String,tunaValues : List<PropertyDataModel> ):String
  {
    return tunaValues.where( \ elt -> elt.Value.equalsIgnoreCase(value))?.first()?.NamedValue


  }


  static function searchTaxLocation(code: String, polLocation:PolicyLocation): TaxLocation {
    try{
      var taxLoc = getTaxLocation(code, polLocation)
      // TaxLocationSearchCriteria
      return taxLoc
    }catch(ex: DisplayableException){
      LocationUtil.addRequestScopedErrorMessage(ex.Message)
      return null
    }
  }

  static function getTaxLocation(code : String, policyLocation : PolicyLocation) : TaxLocation {
    if (code == null) {
      return null
    } else {
      var state = gw.api.util.JurisdictionMappingUtil.getJurisdiction(policyLocation)
      var locs = new gw.lob.common.TaxLocationQueryBuilder()
          .withCodeStarting(code)
          .withState(state)
          .withEffectiveOnDate(policyLocation.Branch.PeriodStart)
          .build().select() as gw.api.database.IQueryBeanResult<TaxLocation>
      if (locs.Count == 1) {
        return locs.FirstResult
      } else {
        throw new DisplayableException(displaykey.TaxLocation.Search.Error.InvalidCode(code, state.Description))
      }
    }
  }

  static function getResidenceType(dwelling:Dwelling_HOE) : List<ResidenceType_HOE>{
    var residenceType = new ArrayList<ResidenceType_HOE>()
    var values = ResidenceType_HOE.getTypeKeys(false)
    values.each( \ elt -> {
      if(elt.Categories.contains(dwelling.HOPolicyType)) {
        //'Condo' should be available in the ResidenceType_HOE typelist if is HO4 or HO6 or For DP/LPP: Allow in FL OR NC ONLY
        if(elt.Code == ResidenceType_HOE.TC_CONDO){
         if(dwelling.HOPolicyType == TC_HO4 || dwelling.HOPolicyType == TC_HO6 ||
             ((dwelling.HOPolicyType == TC_DP3_Ext || dwelling.HOPolicyType == TC_LPP_Ext) && (dwelling.PolicyPeriod.BaseState==TC_NC || dwelling.PolicyPeriod.BaseState==TC_FL))){
            residenceType.add(elt)
          }
        }else if(elt.Code != ResidenceType_HOE.TC_CONDO){
          residenceType.add(elt)
        }
      }
    })
    residenceType.add(ResidenceType_HOE.TC_DIYCONSTRUCTION_EXT)
    return residenceType.orderBy( \ rt -> rt.DisplayName)
  }

  /*
   * FLOOD should be available - CA HO, AZ HO, TX HO, SC HO, HI HO, NV HO, HI DP
   *                             CA HO, AZ HO, TX HO, SC HO, HI HO, NV HO, HI DP
   * Homeowners should be available - SC HO, NV HO, HI DP
   * Dwelling Fire should be available -  TX HO, CA HO, SC HO, HI HO, NV HO, HI DP
   */
  static function getTypeOfPolicy(dwelling:Dwelling_HOE) : List<TypeofPolicy_Ext>{
    var typeOfPolicy = new ArrayList<TypeofPolicy_Ext>()
    var typeOfPolicyValues = TypeofPolicy_Ext.getTypeKeys(false)
    typeOfPolicyValues.each( \ elt -> {
      if(elt.Categories.contains(dwelling.PolicyPeriod.BaseState)) {
        if(elt.Code == TypeofPolicy_Ext.TC_FLOOD && ((typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) &&
            (dwelling.PolicyPeriod.BaseState==TC_AZ || dwelling.PolicyPeriod.BaseState==TC_CA || dwelling.PolicyPeriod.BaseState==TC_TX || dwelling.PolicyPeriod.BaseState==TC_SC
                || dwelling.PolicyPeriod.BaseState==TC_HI || dwelling.PolicyPeriod.BaseState==TC_NV)) || (dwelling.HOPolicyType == TC_DP3_Ext && dwelling.PolicyPeriod.BaseState==TC_HI))){
          typeOfPolicy.add(elt)
        }else if(elt.Code == TypeofPolicy_Ext.TC_HOMEOWNER && ((typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) &&
            (dwelling.PolicyPeriod.BaseState==TC_SC || dwelling.PolicyPeriod.BaseState==TC_NV)) || (dwelling.HOPolicyType == TC_DP3_Ext && dwelling.PolicyPeriod.BaseState==TC_HI))){
            typeOfPolicy.add(elt)
        }else if(elt.Code == TypeofPolicy_Ext.TC_DWELLINGFIRE && ((typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) &&
            (dwelling.PolicyPeriod.BaseState==TC_CA || dwelling.PolicyPeriod.BaseState==TC_TX || dwelling.PolicyPeriod.BaseState==TC_SC || dwelling.PolicyPeriod.BaseState==TC_HI
                || dwelling.PolicyPeriod.BaseState==TC_NV)) || (dwelling.HOPolicyType == TC_DP3_Ext && dwelling.PolicyPeriod.BaseState==TC_HI))){
            typeOfPolicy.add(elt)
        }else if(elt.Code == TypeofPolicy_Ext.TC_AUTO && ((typekey.HOPolicyType_Hoe.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) &&
             (dwelling.PolicyPeriod.BaseState==TC_AZ)))){
            typeOfPolicy.add(elt)
        }
      }
    })
    return typeOfPolicy
  }

  static function isMultiPolicyDiscountAvailable(policyPeriod:PolicyPeriod):boolean{
    if( (policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HCONB_EXT||
        policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3||
        policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4||
        policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6||
        policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HOA_EXT||
        policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HOB_EXT) &&
        (policyPeriod.BaseState==TC_AZ || policyPeriod.BaseState==TC_CA || policyPeriod.BaseState==TC_TX || policyPeriod.BaseState==TC_SC || policyPeriod.BaseState==TC_HI || policyPeriod.BaseState==TC_NV) ){
          return true
    }else if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_DP3_EXT && policyPeriod.BaseState==typekey.Jurisdiction.TC_HI){
      return true
    }
    return false
  }


  static function getMatchLevel(thePropertyDataModelList : List<PropertyDataModel>) : typekey.TUNAMatchLevel_Ext {
    var res = typekey.TUNAMatchLevel_Ext.TC_USERSELECTED
    if(thePropertyDataModelList.HasElements == false ||
        (thePropertyDataModelList.Count == 1 && org.apache.commons.lang3.StringUtils.isEmpty(thePropertyDataModelList[0].Value))){
      res = typekey.TUNAMatchLevel_Ext.TC_NONE
    }else if(thePropertyDataModelList.Count == 1){
      res = typekey.TUNAMatchLevel_Ext.TC_EXACT
    }
    return res
  }

  static function getMatchLevelString(thePropertyDataModelList : List<String>) : typekey.TUNAMatchLevel_Ext {
    var res = typekey.TUNAMatchLevel_Ext.TC_USERSELECTED
    if(thePropertyDataModelList ==null || thePropertyDataModelList.Count < 1){
      res = typekey.TUNAMatchLevel_Ext.TC_NONE
    }else if(thePropertyDataModelList.Count == 1){
      res = typekey.TUNAMatchLevel_Ext.TC_EXACT
    }
    return res
  }

  static function setTunaFieldsMatchLevel(tunaAppResponse:una.integration.mapping.tuna.TunaAppResponse, dwelling:Dwelling_HOE) : boolean {
    /************ dwelling.HOLocation entity *****/
    if(tunaAppResponse != null){
    dwelling.HOLocation.BCEGMatchLevel_Ext = getMatchLevel(tunaAppResponse.BCEGGrade)
    dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext = getMatchLevel(tunaAppResponse.ProtectionClass)
    dwelling.HOLocation.FirelinemthlvlMatchLevel_Ext = dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext // named value of protection class
    dwelling.HOLocation.WindPoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)
    dwelling.HOLocation.DistBOWMatchLevel_Ext = getMatchLevel(tunaAppResponse.DistanceToMajorBOW)
    dwelling.HOLocation.DistBOWNVMatchLevel_Ext = dwelling.HOLocation.DistBOWMatchLevel_Ext // named value of distance to coast
    dwelling.HOLocation.DistToCoastMatchLevel_Ext = getMatchLevel(tunaAppResponse.DistanceToCoast)
    dwelling.HOLocation.TerritoryCodeMatchLevel_Ext = getMatchLevelString(tunaAppResponse.TerritoryCodes)
    dwelling.HOLocation.LatitudeMatchLevel_Ext = (tunaAppResponse.Latitude != null) ? typekey.TUNAMatchLevel_Ext.TC_EXACT : typekey.TUNAMatchLevel_Ext.TC_NONE
    dwelling.HOLocation.LongitudeMatchLevel_Ext = (tunaAppResponse.Longitude != null) ? typekey.TUNAMatchLevel_Ext.TC_EXACT : typekey.TUNAMatchLevel_Ext.TC_NONE
    dwelling.HOLocation.ISO360MatchLevel_Ext = getMatchLevel(tunaAppResponse.ISO360Value)
    //dwelling.HOLocation.WindpoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)
    dwelling.HOLocation.ACVValueMatchLevel_Ext = getMatchLevel(tunaAppResponse.ACV)
    dwelling.HOLocation.FirelineSHIAMatchLevel_Ext = getMatchLevel(tunaAppResponse.FireLineSHIA)
    dwelling.HOLocation.FirelineFuelMatchLevel_Ext = getMatchLevel(tunaAppResponse.FireLineFuel)
    dwelling.HOLocation.FirelinePropHazMatchLevel_Ext = getMatchLevel(tunaAppResponse.FireLinePropertyHazard)
    dwelling.HOLocation.FirelineAdjHazMatchLevel_Ext = getMatchLevel(tunaAppResponse.AdjustedHazard)
    dwelling.HOLocation.FireaccessMatchLevel_Ext = getMatchLevel(tunaAppResponse.FireLineAccess)
    dwelling.HOLocation.FireslopeMatchLevel_Ext = getMatchLevel(tunaAppResponse.FireLineSlope)
    /************ dwelling entity *****/
    dwelling.StoriesNumberMatchLevel_Ext = getMatchLevel(tunaAppResponse.StoryNumber)
    dwelling.RoofTypeMatchLevel_Ext = getMatchLevel(tunaAppResponse.RoofType)
    dwelling.RoofShapeMatchLevel_Ext = getMatchLevel(tunaAppResponse.RoofCover)
    dwelling.ConstructionTypeMatchLevel_Ext = getMatchLevel(tunaAppResponse.ConstructionType)

    dwelling.ConstructionTypeMatchLevel_Ext = getMatchLevel(tunaAppResponse.ConstructionType)
    dwelling.ConstructionTypeMatchLvlL2_Ext = getMatchLevel(tunaAppResponse.ConstructionType)

      dwelling.HOLocation.ResFireDeptMatchLevel_Ext = getMatchLevel(tunaAppResponse.ProtectionClass)



    dwelling.YearBuiltMatchLevel_Ext = getMatchLevel(tunaAppResponse.YearBuilt)
    dwelling.BaseFloodElValMatchLevel_Ext = getMatchLevel(tunaAppResponse.BaseFloodElevation)
    dwelling.PropFloodValMatchLevel_Ext = getMatchLevel(tunaAppResponse.PropertyFlood)
    dwelling.EarthquakeTerMatchLevel_Ext = getMatchLevel(tunaAppResponse.EarthQuakeTerritory)
    dwelling.ExteriorWFvalMatchLevel_Ext = getMatchLevel(tunaAppResponse.WallFinish)

    dwelling.ExteriorWFvalMatchLevelL1_Ext = getMatchLevel(tunaAppResponse.WallFinish)
    dwelling.ExteriorWFvalMatchLevelL2_Ext = getMatchLevel(tunaAppResponse.WallFinish)

    dwelling.HOLocation.PolicyLocation.AccountLocation.addressScrub_Ext = (tunaAppResponse.Status == 0 && tunaAppResponse.ScrubStatus == 1)
    dwelling.TotalSqFtValMatchLevel_Ext = getMatchLevel(tunaAppResponse.SquareFootage)
    }

    return true
  }
  
   static function setPostFIRMValue(dwelling : Dwelling_HOE){
    if(getYearBuilt(dwelling) >= YEAR_1975){
      dwelling.PostFIRM_Ext = true
    }
    else{
      dwelling.PostFIRM_Ext = false
    }
  }

  // get YearBuild
  static function getYearBuilt(dwelling : Dwelling_HOE) : int {

    return dwelling?.OverrideYearbuilt_Ext ? dwelling?.YearBuiltOverridden_Ext?.intValue() : dwelling.YearBuilt?.intValue()
  }

  // get YearBuild
  static function getNumStories(dwelling : Dwelling_HOE) : String {

    return dwelling?.OverrideStoriesNumber_Ext ? dwelling.NoofStoriesOverridden_Ext : dwelling.StoriesNumber
  }


  public static function isWindPoolEligible(theDwelling: Dwelling_HOE) : boolean{
    var resultEligible : boolean = false
    if(theDwelling.HOLocation.OverrideWindPool_Ext && (theDwelling.HOLocation.WindPoolOverridden_Ext)){// || theDwelling.HOLocation.WindPoolOverridden_Ext?.equalsIgnoreCase("TRUE"))){
       resultEligible = true
    }else if(theDwelling?.HOLocation?.WindPool_Ext==true ){//|| theDwelling.HOLocation.WindPool_Ext?.equalsIgnoreCase("TRUE")){
      resultEligible = true
    }
    return resultEligible
  }

  public static function applyChangesIfWindPoolEligible(dwelling: Dwelling_HOE){
    if(isWindPoolEligible(dwelling)){
      dwelling.PropertyCovByStateWndstorm_Ext = true
      dwelling.WHurricaneHailExclusion_Ext = true
    } else {
      dwelling.PropertyCovByStateWndstorm_Ext = false
      dwelling.WHurricaneHailExclusion_Ext = false
    }
    setWindStormAssociation(dwelling)
  }


  public static function setWindStormAssociation(dwelling: Dwelling_HOE){

    var TerritoryCode = dwelling.HOLocation.OverrideTerritoryCode_Ext ? dwelling.HOLocation.TerritoryCodeOverridden_Ext : dwelling.HOLocation.TerritoryCodeTunaReturned_Ext
    if (TerritoryCode != null && dwelling.Branch.BaseState == typekey.Jurisdiction.TC_NC ) {
      if (typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.Branch.HomeownersLine_HOE?.HOPolicyType) &&
          (TerritoryCode == "110" ||
           TerritoryCode == "120" ||
           TerritoryCode == "130" ||
           TerritoryCode == "140"  ||
           TerritoryCode == "150"  ||
           TerritoryCode == "160" )){
              dwelling.PropertyCovByStateWndstorm_Ext = true
      }
      else if (dwelling.Branch.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT &&
          (TerritoryCode == "07" ||
           TerritoryCode == "08" ||
           TerritoryCode == "48" ||
           TerritoryCode == "49"  ||
           TerritoryCode == "52")){
                dwelling.PropertyCovByStateWndstorm_Ext = true
      }
      else  {
          dwelling.PropertyCovByStateWndstorm_Ext = false

      }

    }

  }


  //Availability business rule for the Base Flood Elevation fields in the Dwelling screen
  static function isElevnAvailable(dwelling:Dwelling_HOE):boolean{
    var floodZoneOverideTypes : List<FloodZoneOverridden_Ext> = {TC_X, TC_B, TC_C, TC_D}
    return (dwelling.FloodCoverage_Ext != null and dwelling.FloodCoverage_Ext) or !floodZoneOverideTypes.contains(dwelling.FloodZoneOrOverride) or (dwelling.PostFIRM_Ext != null and dwelling.PostFIRM_Ext)
  }

  static function earthquakezoneValue(dwelling:Dwelling_HOE):ArrayList<typekey.EQTerritoryZone_Ext>
  {
    var retarray:ArrayList<typekey.EQTerritoryZone_Ext>= new ArrayList<typekey.EQTerritoryZone_Ext>()
     /*
     NC HO, NC LPP
NC HO, NC LPP
NC HO, NC LPP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
CA HO, CA DP
NV HO
NV HO
NV HO
NV HO
SC HO
SC HO
SC HO
SC HO
AZ HO
AZ HO

      */
    if(dwelling.PolicyPeriod.BaseState.Code=="CA")
      {
        if(typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) ||
            typekey.HOPolicyType_HOE.TF_ALLDPTDPLPP.TypeKeys.contains(dwelling.HOPolicyType))
        {
          retarray.add(typekey.EQTerritoryZone_Ext.TC_A)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_B)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_C)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_D)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_E)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_F)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_G)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_H)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_I)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_J)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_K)
        }
      }

      if(dwelling.PolicyPeriod.BaseState.Code=="NC")
      {
        if(typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) ||
            typekey.HOPolicyType_HOE.TC_LPP_EXT==dwelling.HOPolicyType)
        {
          retarray.add(typekey.EQTerritoryZone_Ext.TC_3)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_4)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_5)
          }


  }

    if(dwelling.PolicyPeriod.BaseState.Code=="NV" ||dwelling.PolicyPeriod.BaseState.Code=="SC")
    {
      if(typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType))
      {
        retarray.add(typekey.EQTerritoryZone_Ext.TC_1)
        retarray.add(typekey.EQTerritoryZone_Ext.TC_3)
        retarray.add(typekey.EQTerritoryZone_Ext.TC_4)
        retarray.add(typekey.EQTerritoryZone_Ext.TC_2)
      }


    }

      if(dwelling.PolicyPeriod.BaseState.Code=="AZ" )
      {
        if(typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType))
        {
          retarray.add(typekey.EQTerritoryZone_Ext.TC_1)
          retarray.add(typekey.EQTerritoryZone_Ext.TC_2)
          }
      }

    return retarray


  }

  public static function validateUWQuestions(policyPeriod : PolicyPeriod){
    gw.question.IncorrectAnswerProcessor.processIncorrectAnswers(policyPeriod, new java.util.HashMap<gw.api.productmodel.Question, String>())
    gw.validation.PCValidationContext.doPageLevelValidation(\ context -> new gw.policy.PolicyPeriodValidation(context, policyPeriod).validateDwellingUWQuestions())
  }

}// End of class