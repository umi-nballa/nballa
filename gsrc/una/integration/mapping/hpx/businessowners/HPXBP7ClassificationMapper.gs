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
    var classificationMapper = new HPXBP7ClassificationMapper()

    if(bp7Classification.Building != null) {
      classification.addChild(classificationMapper.createClassPredOccupancyType(bp7Classification.Building))
    }
    var classPropertyType = new wsi.schema.una.hpx.hpx_application_request.ClassPropertyType()
    if(bp7Classification.ClassPropertyType != null) {
      classPropertyType.setText(bp7Classification.ClassPropertyType)
      classification.addChild(classPropertyType)
    }

    var classDesc = new wsi.schema.una.hpx.hpx_application_request.Classification()
    var classCode = new wsi.schema.una.hpx.hpx_application_request.ClassCode()
    if(bp7Classification.ClassDescription != null) {
      classDesc.setText(bp7Classification.ClassDescription.Description)
      classification.addChild(classDesc)
      classCode.setText(bp7Classification.ClassCode_Ext)
      classification.addChild(classCode)
    }  else {

      classCode.setText("")
      classification.addChild(classCode)
    }

    var vacantSquareFootage = new wsi.schema.una.hpx.hpx_application_request.VacantArea()
    if(bp7Classification.Area != null) {

      vacantSquareFootage.setText(bp7Classification.Area)
      classification.addChild(vacantSquareFootage)
    }

    return classification
  }

  function createClassPredOccupancyType(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.PredominantOccupancyType {
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var classPredOccupancyType = new wsi.schema.una.hpx.hpx_application_request.PredominantOccupancyType()

    if(bldg.PredominentOccType_Ext != null) {
      classPredOccupancyType.setText(typecodeMapper.getAliasByInternalCode("BP7PredominentOccType_Ext", "hpx", bldg.PredominentOccType_Ext.Code))
    }

    return classPredOccupancyType
  }

}