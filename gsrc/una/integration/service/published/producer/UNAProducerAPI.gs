package una.integration.service.published.producer

uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiPermissions
uses gw.api.webservice.exception.BadIdentifierException
uses gw.webservice.SOAPUtil
uses gw.xml.ws.annotation.WsiExposeEnumAsString
uses gw.api.database.PCBeanFinder
uses una.integration.service.published.producer.datamodel.OrgDTO

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 2/28/17
 * Time: 11:00 AM
 */

@WsiWebService("http://guidewire.com/pc/ws/una/integration/service/published/UNAProducerAPI")
@WsiExposeEnumAsString(typekey.State)
@WsiExposeEnumAsString(typekey.Country)
@WsiExposeEnumAsString(typekey.AddressType)
@WsiExposeEnumAsString(typekey.ProducerStatus)
@WsiExposeEnumAsString(typekey.BusinessType)
@WsiExposeEnumAsString(typekey.Tier)
@Export
class UNAProducerAPI {

  @Param("orgModel", "an XML representation of the Organization to create.")
  @Returns("The PublicID of the newly created Organization")
  @WsiPermissions({})
  function createUNAOrganization(orgModel : OrgDTO) : String {
    SOAPUtil.require(orgModel, "orgModel")
    var foundOrg = loadOrgByPublicID(orgModel.PublicID)
    if (foundOrg != null) {
      throw new BadIdentifierException(displaykey.ProducerAPI.Error.CreateOrganization.OrgWithPublicIDAlreadyExists(orgModel.PublicID))
    }

    var createdPublicID : String
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
    //  var newOrg = orgModel.createOrganization(bundle)
    //  createdPublicID = newOrg.PublicID
    })

    return createdPublicID
  }


  // private helpers

  private function loadOrgByPublicID(publicID : String) : entity.Organization {
    return publicID == null ? null : PCBeanFinder.loadBeanByPublicID<entity.Organization>(publicID, entity.Organization)
  }

  private function loadGroupByPublicID(publicID : String) : entity.Group {
    return publicID == null ? null : PCBeanFinder.loadBeanByPublicID<entity.Group>(publicID, entity.Group)
  }

  private function loadProducerCodeByPublicID(publicID : String) : entity.ProducerCode {
    return publicID == null ? null : PCBeanFinder.loadBeanByPublicID<entity.ProducerCode>(publicID, entity.ProducerCode)
  }

}