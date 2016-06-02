package una.pageprocess
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
  }