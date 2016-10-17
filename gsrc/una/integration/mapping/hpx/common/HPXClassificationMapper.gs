package una.integration.mapping.hpx.common

uses gw.xsd.w3c.xmlschema.Any
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/14/16
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
interface HPXClassificationMapper {
  function createClassification(coverable : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.BP7ClassificationType
}