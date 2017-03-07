package gw.lob.cp.financials
uses gw.api.util.JurisdictionMappingUtil

@Export
class CPLineCovCostMethodsImpl_Ext extends GenericCPCostMethodsImpl<CPLineCovCost>
{
  construct( owner : CPLineCovCost )
  {
    super( owner )
  }
  
  override property get Coverage() : Coverage
  {
    return Cost.LineCov
  }

  override property get OwningCoverable() : Coverable
  {
    return Cost.CommercialPropertyLine
  }

  override property get State() : Jurisdiction
  {
    return JurisdictionMappingUtil.getJurisdiction(Cost.LineCov.CPLine.CPLocations.first().Location)
  }

  /*override property get Location() : CPLocation
  {
    return Cost.CPBuildingCov.CPBuilding.CPLocation
  }

  override property get Building() : CPBuilding
  {
    return Cost.CPBuildingCov.CPBuilding
  } */

}
