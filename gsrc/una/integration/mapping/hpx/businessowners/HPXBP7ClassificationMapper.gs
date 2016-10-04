package una.integration.mapping.hpx.businessowners

uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/30/16
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7ClassificationMapper {

  function createClassification(bp7Classification : BP7Classification) : wsi.schema.una.hpx.hpx_application_request.types.complex.BP7ClassificationType {

    var classification = new wsi.schema.una.hpx.hpx_application_request.types.complex.BP7ClassificationType()
    var classificationMapper = new HPXBP7ClassificationMapper()
    if(bp7Classification.Building != null) {
      classification.addChild(new XmlElement("OccupancyType", classificationMapper.createClassPredOccupancyType(bp7Classification.Building)))
    }
    classification.ClassPropertyType = bp7Classification.ClassPropertyType != null ? bp7Classification.ClassPropertyType : ""
    classification.Classification = bp7Classification.ClassDescription != null ? bp7Classification.ClassDescription.Description : ""
    classification.ClassCode = bp7Classification.ClassCode_Ext != null ? bp7Classification.ClassCode_Ext : ""
    classification.VacantArea = bp7Classification.Area != null ? bp7Classification.Area : 0
    return classification
  }

  function createClassPredOccupancyType(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.OccupancyTypeType {
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var classPredOccupancyType = new wsi.schema.una.hpx.hpx_application_request.types.complex.OccupancyTypeType()
    if(bldg.PredominentOccType_Ext != null) {
      classPredOccupancyType.setText(typecodeMapper.getAliasByInternalCode("BP7PredominentOccType_Ext", "hpx", bldg.PredominentOccType_Ext.Code))
    }
    return classPredOccupancyType
  }

}