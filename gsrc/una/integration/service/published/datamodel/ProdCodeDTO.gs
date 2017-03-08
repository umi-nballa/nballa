package una.integration.service.published.datamodel

uses gw.webservice.pc.pc800.community.datamodel.AddressDTO
uses gw.webservice.pc.pc800.community.datamodel.CommissionPlanDTO
uses java.util.Date
uses gw.xml.ws.annotation.WsiExportable

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 2/28/17
 * Time: 11:54 AM
 */


@Export
@WsiExportable("http://guidewire.com/pc/ws/una/integration/service/published/datamodel/ProdCodeDTO")
class ProdCodeDTO {

  var _address : AddressDTO as Address
  var _appointmentDate : Date as AppointmentDate
  var _branchPublicID : String as BranchPublicID
  var _code : String as Code
  var _commissionPlanIDs : CommissionPlanDTO[] as CommissionPlans = {}
  var _description : String as Description
  var _parentPublicID : String as ParentPublicID
  var _preferredUnderwriterPublicID : String as PreferredUnderwriterPublicID
  var _publicID : String as PublicID
  var _terminationDate : Date as TerminationDate

  var _producerStatus : ProducerStatus as ProducerStatus

}