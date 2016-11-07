package una.pageprocess

uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 6/1/16
 * Time: 11:40 PM
 * To change this template use File | Settings | File Templates.
 */
class CPSubmissionWizardHelper {
  /**
   * Function to clone a policy location
   * Used in LocationPanelSet of Building in CP
   * @param polLocation
   * @return boolean
   */
    public static function clonePolicyLocation(polLocation : PolicyLocation) : PolicyLocation {
      var accountLocation =  polLocation.AccountLocation.cloneLocation()
      return  polLocation.Branch.newLocation(accountLocation)
    }

    public static function cloneBuildingsFromLocation(cploc:CPLocation):CPBuilding[]
    {
      var bldglist = new ArrayList<CPBuilding>()
      foreach(building in cploc.Buildings)
        {
          building.clone()
          bldglist.add(building)
        }
      return bldglist.toTypedArray()
    }


  public static function cloneBuildingsFromLocn(cploc:CPLocation, bldg:CPBuilding):boolean
  {
    cploc.addToBuildings(bldg)
    return true
  }

  public static function cloneBuilding(bldg:Building):Building
  {
      return bldg.clone()
  }
  }