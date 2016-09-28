package gw.lob.ho

uses java.lang.Integer
/**
 * Created with IntelliJ IDEA.
 * User: svallabhapurapu
 * Date: 8/19/16
 * Time: 6:24 AM
 * To change this template use File | Settings | File Templates.
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
  private static final var WIND_SPEED_100 : int = 100
  private static final var WIND_SPEED_110 : int = 110
  private static final var WIND_SPEED_120 : int = 120


  static function isAllHoDp(policyType : typekey.HOPolicyType_HOE) : boolean {
     if(policyType == null){
       return false
     }
    if(typekey.HOPolicyType_HOE.TF_MEDICALPAYMENTSLIMITELIGIBLE.TypeKeys.contains(policyType) or typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(policyType)){
      return true
    }
    return false
  }
  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function for Construction TypeList value range based on state
*  HO Line of business
*/
  static function getConstructionTypeStateSpecific(dwelling : Dwelling_HOE) : List<typekey.ConstructionType_HOE> {
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
    if(dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 or
        dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6 or
        dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT or
        (dwelling.Branch.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT and dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO)) {
          if(dwelling.StoriesNumber != null and dwelling.StoriesNumber != typekey.NumberOfStories_HOE.TC_ONESTORY_EXT ) {
        return true
      }
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
      if(dwelling.StoriesNumber != typekey.NumberOfStories_HOE.TC_ONESTORY_EXT)  {
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
      var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, dwelling?.YearBuilt)

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
    var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, dwelling?.YearBuilt)
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

    var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, dwelling.YearBuilt)
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
    var  diffYears = diffInYears(dwelling.Branch?.PeriodStart?.YearOfDate, dwelling.YearBuilt)
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
         if(dwelling.RoofType == typekey.RoofType.TC_REINFORCEDCONCRETE_EXT){
           dwelling.SecondaryWaterResis_Ext = typekey.SecondaryWaterResis_Ext.TC_NOSWR
         } else {
           dwelling.SecondaryWaterResis_Ext = typekey.SecondaryWaterResis_Ext.TC_UNKNOWN
         }
       }

       // Set default value based on county
       if(result != null){
         if(dwelling.FBCWindSpeed_Ext == null){dwelling.FBCWindSpeed_Ext = getAssociatedFBCWindSpeed(result.FBCWindSpeed.intValue())}//typekey.FBCWindSpeed_Ext.getTypeKeys().firstWhere( \ elt -> elt.Code == result.FBCWindSpeed.toString())}
         if(dwelling.WindSpeedOfDesign_Ext == null){dwelling.WindSpeedOfDesign_Ext = getAssociatedWindSpeedOfDesign(result.WindSpeedOfDesign.intValue())}
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
      dwelling.FBCWindSpeed_Ext = null
      dwelling.WindSpeedOfDesign_Ext = null
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

    if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and  dwelling.YearBuilt < YEAR_2002){
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

    else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and  dwelling.YearBuilt < YEAR_2002){
      if(dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext){
          resetDefaults(dwelling)
      }
    }
   else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and dwelling.YearBuilt >= YEAR_2002){
      if(dwelling.WindMitigation_Ext != null and (dwelling.WindMitigation_Ext or !dwelling.WindMitigation_Ext)){
        resetDefaults(dwelling)
        applyDefaults(dwelling)
      }
    }
    else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and dwelling.YearBuilt < YEAR_2003) {
      if(dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext){
            resetDefaults(dwelling)
      }
    }

    else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and dwelling.YearBuilt >= YEAR_2003) {
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
        if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and dwelling.YearBuilt < YEAR_2002 and (dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext) ){
          return true
        } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and dwelling.YearBuilt < YEAR_2002 and (!dwelling.WindMitigation_Ext or dwelling.WindMitigation_Ext == null)) {
           return false
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and dwelling.YearBuilt < YEAR_2003 and (dwelling.WindMitigation_Ext != null and dwelling.WindMitigation_Ext) ){
          return true
        } else if (dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and dwelling.YearBuilt < YEAR_2003 and (!dwelling.WindMitigation_Ext or dwelling.WindMitigation_Ext == null)){
          return false
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and dwelling.YearBuilt >=  YEAR_2002 and ( dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext) ) {
          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and dwelling.YearBuilt >=  YEAR_2002 and (dwelling.WindMitigation_Ext)){
          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and dwelling.YearBuilt >= YEAR_2003 and (dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext  )){

          return true
        } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code  and dwelling.YearBuilt >= YEAR_2003 and dwelling.WindMitigation_Ext){

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
       if(dwelling.Branch.BaseState.Code == typekey.State.TC_FL.Code and dwelling.YearBuilt >=  YEAR_2002 and ( dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext)){
         return false
       } else if(dwelling.Branch.BaseState.Code == typekey.State.TC_SC.Code and dwelling.YearBuilt >= YEAR_2003 and (dwelling.WindMitigation_Ext != null and !dwelling.WindMitigation_Ext)){
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
    if(dwelling.RoofType == null){
      dwelling.RoofType = typekey.RoofType.TC_ALUMINUM_EXT
    }
    //Assuming Property Coverage by state windstorm field has been returned false from ISO360, making Wind Hurricane Hail Exclusion as false
    // As discussed with Chethan, fields will be mapped will response before entering the screen - ISO360 is under construction from Integ team so will be revisited after service is up
    dwelling.PropertyCovByStateWndstorm_Ext = false
    dwelling.WHurricaneHailExclusion_Ext = false
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
    if(dwelling.YearBuilt >= yearBuilt ) {
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

    if(dwelling.YearBuilt >= yearBuilt_1975 and dwelling.YearBuilt < yearBuilt_1990) {
       return typekey.PlumbingType_HOE.TF_YEARGRP1_EXT.TypeKeys
    } else if (dwelling.YearBuilt >= yearBuilt_1990 and dwelling.YearBuilt < yearBuilt_1995 ) {
        return typekey.PlumbingType_HOE.TF_YEARGRP2_EXT.TypeKeys
      } else if(dwelling.YearBuilt >= yearBuilt_1995) {
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

   if(dwelling.YearBuilt >= yearBuilt_1960 and dwelling.YearBuilt < yearBuilt_1980) {
          return  typekey.WiringType_HOE.TF_YEARGRP1_EXT.TypeKeys
   } else if(dwelling.YearBuilt >=  yearBuilt_1980) {
          return typekey.WiringType_HOE.TF_YEARGRP2_EXT.TypeKeys
     }
   return typekey.WiringType_HOE.TF_ALLOTHERYEARS_EXT.TypeKeys
 }

}// End of class