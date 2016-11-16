package edge.webservice.pc.pc800.community

uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiPermissions
uses gw.webservice.SOAPUtil
uses gw.api.database.Query
uses gw.webservice.pc.pc800.community.datamodel.ProducerCodeDTO

@WsiWebService("http://guidewire.com/pc/ws/gw/webservice/pc/pc800/community/EdgeProducerAPI")
@Export
class EdgeProducerAPI {


  /**
   * Returns the ProducerCodes with the given userName
   */
  @Param("username","the username the ProducerCodes are needed to return. Required to be non-<code>null</code>.")
  @Returns("The list of producerCodes")
  @WsiPermissions({SystemPermissionType.TC_PRODCODEVIEWBASIC})
  function getProducerCodesByUserName(userName : String) : List<ProducerCodeDTO> {
    SOAPUtil.require(userName, "userName")

    var c = new gw.product.ProducerCodeSearchCriteria()
    c.ProducerUser = findUserByCredential(userName)
    var results = c.performSearch()

    var producerCodes = new List<ProducerCodeDTO>()

    if(results?.HasElements){
      results.each( \ elt -> {

        var producerCodeDTO = new ProducerCodeDTO()
        producerCodeDTO.populateFromProducerCode(elt as ProducerCode)
        producerCodes.add(producerCodeDTO)
      })
    }

    return producerCodes
  }

  protected function findUserByCredential(userName : String) : User {
    var q = Query.make(User)
    q.join("Credential").compare("UserName", Equals, userName)
    var results = q.select()
    return results.AtMostOneRow
  }

}
