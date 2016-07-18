package una.integration.service.gateway.hpx
/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 7/12/16
 * Time: 10:47 AM
 */

interface HPXInterface {

  public function generateDocuments(ewsRequestXML : wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest): wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeResponse

}