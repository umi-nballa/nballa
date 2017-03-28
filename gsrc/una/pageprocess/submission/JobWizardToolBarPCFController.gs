package una.pageprocess.submission

uses gw.api.web.job.JobWizardHelper
/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 3/22/17
 * Time: 10:49 AM
 */
class JobWizardToolBarPCFController {


    function checkOfac(period : PolicyPeriod, jobWizardHelper : JobWizardHelper){
      if(!period.ofacdetails.isOFACOrdered){
      var ofacInterface=una.integration.service.gateway.plugin.GatewayPlugin.makeOfacGateway()
      ofacInterface.validateOFACEntity(period.AllContacts,period)
      period.ofacdetails.isOFACOrdered = true

      }

   }

 }