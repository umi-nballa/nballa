package una.config

uses gw.api.domain.covterm.CovTerm
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 10/26/16
 * Time: 2:33 PM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingUtil {

  public static function getClassCode(bldg:CPBuilding):String
  {
    var retval:String = ""
    
    if(bldg.PolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_APARTMENT)
      {

        if(bldg.Building.NumUnits>0 && bldg.Building.NumUnits<=10)
          retval="0311"
        else if(bldg.Building.NumUnits>10 && bldg.Building.NumUnits<=30)
          retval="0312"
        else if(bldg.Building.NumUnits>30)
          retval="0313"



      }
    if(bldg.PolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_CONDOMINIUMASSOCIATION)
    {


        if(bldg.Building.NumUnits>0 && bldg.Building.NumUnits<=10)
        retval="0331"
      else if(bldg.Building.NumUnits>10 && bldg.Building.NumUnits<=30)
        retval="0332"
        else if(bldg.Building.NumUnits>30)
        retval="0333"


    }
    if(bldg.PolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_HOMEOWNERSASSOCIATION)
    {

        retval="0300"


    }
    return retval

  }

  public static function isVisible(bldg:CPBuilding):boolean
  {
    if((bldg.windstormexcl==false && bldg.OccupancyType.Code==typekey.CPOccupancyType_Ext.TC_RESIDENTIAL.Code) || (bldg.windmiti5==true))
      {
      return true
      }
    else if(bldg.Building.YearBuilt<2002 && bldg.windmiti5==false)
      {
      return false
      }
    else
      return false
  }

  public static function setRoofDeckDefaults(bldg:CPBuilding):boolean
  {
    if(bldg?.Building?.YearBuilt>=2002)
    {
      if(bldg.RoofTypeCP==typekey.RoofType_CP.TC_REINFORCEDCONCRETE_EXT)
        bldg.roofdk=typekey.CPRoofDeck_Ext.TC_REINCONCDECK//"Reinforced Concrete Deck"
      else
      {
        if(bldg.Building.NumStories>=1 && bldg?.Building?.NumStories<=3)
          bldg.roofdk=typekey.CPRoofDeck_Ext.TC_OTHER//"Other Roof Deck"
        else if(bldg.Building.NumStories>=4 && bldg.Building.NumStories<=6)
          bldg.roofdk=typekey.CPRoofDeck_Ext.TC_WOODDECK//"Wood Deck"
        else if(bldg.Building.NumStories>6)
            bldg.roofdk=typekey.CPRoofDeck_Ext.TC_METALDECK//"Metal Deck"
      }
    }


    if(bldg.RoofTypeCP==typekey.RoofType_CP.TC_REINFORCEDCONCRETE_EXT)
    {
      if(bldg.Building.NumStories>=1 && bldg.Building.NumStories<=3)
        bldg.roofcv=typekey.CPRoofCover_Ext.TC_REINFORCEDCONCRETE//"Reinforced Concrete Deck"
      if(bldg.Building.NumStories>3)
        bldg.roofcv=typekey.CPRoofCover_Ext.TC_FBCEQ//"FBC Equivalent"

      bldg.roofdecat=typekey.CPRoofDeckAttachment_Ext.TC_REINCONC//"Reinforced Concrete Deck"
    }
    else
    {
      bldg.roofcv=null
      bldg.roofdecat = null
     }

    return true
  }

  public static function setStoryBasedDefaults(bldg:CPBuilding):boolean
  {

    if(bldg.Building.NumStories!=null)
      bldg?.BldHt=bldg?.Building?.NumStories*10;
    /*
Gust wind speed of design
When Year Built => 2002
When # of stories is 1 to 3: Default the response to => 120 if county = Miami Dade or Broward.
Default to 100 for all other counties.
When # of stories is 4 to 6: Default the response to => 120 if county = Miami Dade or Broward.
Default to 110 for all other counties.
When # of stories is 7 or more: Default the response to => 120 if county = Miami Dade or Broward.
Default to 100 for all other counties.

When Year Built <2002
No default response applies

 */
   if(bldg?.Building?.YearBuilt>=2002)
   {
    if(bldg.CPLocation.Location.County.equalsIgnoreCase("Miami Dade") || bldg.CPLocation.Location.County.equalsIgnoreCase("Broward"))
      bldg?.guswind=typekey.CPGustWindSpeedDes_Ext.TC_GTEQ120//"120"
    else
    {
      if(bldg?.Building?.NumStories>=4 && bldg?.Building?.NumStories<=6)
        bldg?.guswind=typekey.CPGustWindSpeedDes_Ext.TC_110//"110"
      else
        bldg?.guswind=typekey.CPGustWindSpeedDes_Ext.TC_100//"100"
    }
    }
    else
     bldg?.guswind=null

    /*
    Roof Cover
    If Roof Covering = Reinforced Concrete AND # stories = 1 OR = 2 OR = 3 default response to Reinforced Concrete Deck.
If Roof Covering = Reinforced Concrete AND # stories = 4 OR = 5 OR = 6  OR = >6 default response to FBC Equivalent.
If Roof Covering does not = Reinforced Concrete then no default response.
     */
    if(bldg.RoofTypeCP==typekey.RoofType_CP.TC_REINFORCEDCONCRETE_EXT)
    {
      if(bldg.Building.NumStories>=1 && bldg.Building.NumStories<=3)
        bldg.roofcv=typekey.CPRoofCover_Ext.TC_REINFORCEDCONCRETE//"Reinforced Concrete Deck"
      if(bldg.Building.NumStories>=3)
        bldg.roofcv=typekey.CPRoofCover_Ext.TC_FBCEQ//"FBC Equivalent"

      bldg.roofdecat=typekey.CPRoofDeckAttachment_Ext.TC_REINCONC//"Reinforced Concrete Deck"
    }
    else
    {
      bldg.roofcv=null
      bldg.roofdecat = null
    }

    if(bldg?.Building?.NumStories<=3 && bldg.Building.YearBuilt>=2002)
      bldg.intpredes=typekey.CPInternalPressureDes_Ext.TC_ENCLOSED//intpresdes="Enclosed"

    if(bldg?.Building?.YearBuilt>=2002)
    {
      if(bldg.RoofTypeCP==typekey.RoofType_CP.TC_REINFORCEDCONCRETE_EXT)
        bldg.roofdk=typekey.CPRoofDeck_Ext.TC_REINCONCDECK//"Reinforced Concrete Deck"
      else
      {
        if(bldg.Building.NumStories>=1 && bldg?.Building?.NumStories<=3)
          bldg.roofdk=typekey.CPRoofDeck_Ext.TC_OTHER//"Other Roof Deck"
        else if(bldg.Building.NumStories>=4 && bldg.Building.NumStories<=6)
          bldg.roofdk=typekey.CPRoofDeck_Ext.TC_WOODDECK//"Wood Deck"
        else if(bldg.Building.NumStories>6)
            bldg.roofdk=typekey.CPRoofDeck_Ext.TC_METALDECK//"Metal Deck"
      }
    }

    if(bldg.Building.YearBuilt>=2002 && bldg?.Building?.NumStories<=3 )
      bldg.intpredes = typekey.CPInternalPressureDes_Ext.TC_ENCLOSED//intpresdes="Enclosed"

    return true
  }

    public static function setWindSpeedDefaults(bldg:CPBuilding):boolean
    {

      if(bldg.Building.YearBuilt>=2002 && bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_GTEQ120)
        bldg.wbdr="Yes"
      if(bldg.Building.YearBuilt>=2002 && (bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_100 || bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_110))
        bldg.wbdr="No"
      return true
    }

      public static function setYearBasedDefaults(bldg:CPBuilding):boolean
  {

    if(bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_GTEQ120 && bldg.Building.YearBuilt>=2002)
      bldg.wbdr="Yes"
    if(bldg.Building.YearBuilt>=2002 && (bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_100 || bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_110))
      bldg.wbdr="No"


    if(bldg?.Building?.YearBuilt<2002 && bldg.RoofTypeCP==typekey.RoofType_CP.TC_REINFORCEDCONCRETE_EXT)
    {
      if(bldg.Building.NumStories>=1 && bldg.Building.NumStories<=3)
        bldg.roofcv=typekey.CPRoofCover_Ext.TC_REINFORCEDCONCRETE//"Reinforced Concrete Deck"
      if(bldg.Building.NumStories>=3)
        bldg.roofcv=typekey.CPRoofCover_Ext.TC_FBCEQ//"FBC Equivalent"
    }

    if(bldg?.Building?.YearBuilt>=2002)
    {
      if(bldg.CPLocation.Location.County.equalsIgnoreCase("Miami Dade") || bldg.CPLocation.Location.County.equalsIgnoreCase("Broward"))
        bldg?.guswind=typekey.CPGustWindSpeedDes_Ext.TC_GTEQ120//"120"
      else
      {
        if(bldg?.Building?.NumStories>=4 && bldg?.Building?.NumStories<=6)
          bldg?.guswind=typekey.CPGustWindSpeedDes_Ext.TC_110//"110"
        else
          bldg?.guswind=typekey.CPGustWindSpeedDes_Ext.TC_100//"100"
      }
    }
    else
      bldg?.guswind=null

    /*
  Roof Deck
  "Only display when Windstorm, hurricane & hail exclusion = No.

When Year Built => 2002
If Roof Covering = Reinforced Concrete default response to Reinforced Concrete Deck regardless of stories.

If Roof Covering does not = Reinforced Concrete then:
Default the response to Other Roof Deck if # Stories = 1 OR =2 OR =3
Default the response to Wood Deck if # Stories = 4 OR =5 OR= 6
Default the response to Metal Deck if # Stories >6

If wind mitigation form in last 5 years = No then field should not be editable.
If wind mitigation form in last 5 years = Yes then field should be editable.

When Year Built <2002
No default response applies
Only display when Do you have a wind mitigation form dated within last 5 years = Yes
Make response editable.
"

   */

    if(bldg?.Building?.YearBuilt>=2002)
    {
      if(bldg.RoofTypeCP==typekey.RoofType_CP.TC_REINFORCEDCONCRETE_EXT)
        bldg.roofdk=typekey.CPRoofDeck_Ext.TC_REINCONCDECK//"Reinforced Concrete Deck"
      else
      {
        if(bldg.Building.NumStories>=1 && bldg?.Building?.NumStories<=3)
          bldg.roofdk=typekey.CPRoofDeck_Ext.TC_OTHER//"Other Roof Deck"
        else if(bldg.Building.NumStories>=4 && bldg.Building.NumStories<=6)
          bldg.roofdk=typekey.CPRoofDeck_Ext.TC_WOODDECK//"Wood Deck"
        else if(bldg.Building.NumStories>6)
            bldg.roofdk=typekey.CPRoofDeck_Ext.TC_METALDECK//"Metal Deck"
      }
    }
    else
      bldg.roofdk = null;


    if(bldg.Building.YearBuilt>=2002)
    {
      bldg.swrr=typekey.CPSwr_Ext.TC_NOSWR//"No SWR"
      bldg.openprt=typekey.CPOpenProt_Ext.TC_NOOPENINGPROT//"No Opening Protection"
    }
    else
      {
      bldg.swrr=null
      bldg.openprt=null
       }
    /*
    Terrain exposure
    When Year Built => 2002
If Do you have a wind mitigation form dated with last 5 years = Yes or No
default response to HVHZ if Building Address county = Miami-Dade or Broward
Default response to B if Building Address county = All Other Counties

When Year Built <2002
If Do you have a wind mitigation form dated with last 5 years = Yes
Default response to HVHZ if Building Address county = Miami-Dade or Broward
Default response to B if Building Address county = All Other Counties
     */

    if(bldg?.windmiti5!=null && bldg.CPLocation.Location.County.equalsIgnoreCase("Miami Dade") || bldg.CPLocation.Location.County.equalsIgnoreCase("Broward"))
    {
      if(bldg.Building.YearBuilt>=2002 || (bldg.Building.YearBuilt<2002 && bldg.windmiti5==true))
        bldg.terexp=typekey.CPTerrainExp_Ext.TC_HVHZ//"HVHZ"
    }
    else
    {
      bldg.terexp=typekey.CPTerrainExp_Ext.TC_TERRAINB//"B"
    }


    /*Only display when Windstorm, when # stories = 1  OR = 2 OR = 3
    Only display when Year Built =>2002.*/

    if(bldg.Building.YearBuilt>=2002 && bldg?.Building?.NumStories<=3 )
      bldg.intpredes = typekey.CPInternalPressureDes_Ext.TC_ENCLOSED//intpresdes="Enclosed"

    return true
  }



  public static function setResDefaults(bldg:CPBuilding):boolean
  {
    /*
    Gust wind speed of location
       When # stories = 1 to 3: Default the response to => 120 if county = Miami Dade or Broward.
      Default to 100 for all other counties.
      When # stories = 4 to 6: Default the response to => 120 if county = Miami Dade or Broward.
      Default to 110 for all other counties.
       When # stories = 7 or more: Default the response to => 120 if county = Miami Dade or Broward.
      Default to 100 for all other counties.
      "Only display when Windstorm, hurricane & hail exclusion = No.

"



     */
    if(bldg.CPLocation.Location.County.equalsIgnoreCase("Miami Dade") || bldg.CPLocation.Location.County.equalsIgnoreCase("Broward"))
      bldg?.guswindloc=typekey.CPGustWindSpeedLoc_Ext.TC_120GREATER//"120"
    else
      {
        if(bldg?.Building?.NumStories>=4 && bldg?.Building?.NumStories<=6)
          bldg?.guswindloc=typekey.CPGustWindSpeedLoc_Ext.TC_110//"110"
        else
          bldg?.guswindloc=typekey.CPGustWindSpeedLoc_Ext.TC_100//"100"
      }

      /*
      Internal pressure design
      Default the response to Enclosed.
       */
    if(bldg.Building.YearBuilt>=2002 && bldg?.Building?.NumStories<=3 )
      bldg.intpredes = typekey.CPInternalPressureDes_Ext.TC_ENCLOSED//intpresdes="Enclosed"
   // bldg.intpredes=typekey.CPInternalPressureDes_Ext.TC_ENCLOSED//intpresdes="Enclosed"



    /*
    WDBR
Default the response to Yes if Gust Wind Speed of Design =>120
Default response to No if Gust Wind Speed of Design = 100 OR = 110
     */
    if(bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_GTEQ120 && bldg.Building.YearBuilt>=2002)
      bldg.wbdr="Yes"
    if(bldg.Building.YearBuilt>=2002 && (bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_100 || bldg.guswind==typekey.CPGustWindSpeedDes_Ext.TC_110))//110))
      bldg.wbdr="No"






    return false
  }

  public static function getCovTermsForSchedule(coverable:Coverable,coveragePattern : gw.api.productmodel.ClausePattern):CovTerm[]
  {
    return coverable.getCoverageConditionOrExclusion(coveragePattern).CovTerms.sortBy( \ term -> term.Pattern.Priority ).where( \ elt -> elt.PatternCode!="CPOptionalOutdoorProperty_EXT")
  }

  public static function addRequiredCoverages(building:CPBuilding,cpline:CommercialPropertyLine)
  {

    if(cpline.CPFloridaChangesCondoCondition_EXT.Pattern.getExistence(cpline)==typekey.ExistenceType.TC_REQUIRED && !cpline.CPFloridaChangesCondoCondition_EXTExists )
      cpline.addToCPLineConditions(cpline.CPFloridaChangesCondoCondition_EXT)
  }

}