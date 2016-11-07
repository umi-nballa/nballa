package gw.lob.cp.location

uses gw.api.web.job.JobWizardHelper
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 10/20/16
 * Time: 10:23 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement CPLocationEnhancement : entity.CPLocation {

  function createAndAddBuilding(helper : JobWizardHelper = null) : CPBuilding {
    var building = this.addNewLineSpecificBuilding() as CPBuilding

    //building.createCoveragesConditionsAndExclusions()
    //building.initializeAutoNumberSequences()
    //building.defaultPropertyType()

    //building.updateDependentFields(null, helper)
    building.bp7sync(helper)
    return building
  }

}
