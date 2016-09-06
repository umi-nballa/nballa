package una.integration.mapping.hpx.businessowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/30/16
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7ClassificationMapper {

  function createClassification(bp7Classification : BP7Classification) : wsi.schema.una.hpx.hpx_application_request.BP7Classification {
    var classification = new wsi.schema.una.hpx.hpx_application_request.BP7Classification()
    // TODO map classification
    return classification
  }
}