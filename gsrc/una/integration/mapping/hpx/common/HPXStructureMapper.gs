package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/14/16
 * Time: 8:09 AM
 * To change this template use File | Settings | File Templates.
 */
interface HPXStructureMapper {

  function createStructure(coverable : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType

  function createCoverableInfo(coverable : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType
}