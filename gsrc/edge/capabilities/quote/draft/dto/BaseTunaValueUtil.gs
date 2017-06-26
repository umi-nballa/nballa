package edge.capabilities.quote.draft.dto

uses gw.lang.reflect.IPropertyInfo
uses gw.lang.reflect.IType

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 6/22/17
 * Time: 3:36 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class BaseTunaValueUtil {

  protected static function mapTunaFields(data : KeyableBean, dtoInstance: Object, dtoType: IType, direction: MapDTODirection) {

     dtoType.TypeInfo.Properties.where( \ pInfo -> pInfo.FeatureType == TunaValueDTO.Type).each( \ propInfo -> mapTunaValue(data, dtoInstance, propInfo, direction))
  }

  protected static function mapTunaValue(data : KeyableBean, dtoInstance: Object, tunaDtoProp: IPropertyInfo, direction: MapDTODirection) {
    if(MapDTODirection.FROM.equals(direction) && dtoInstance != null) {
      var tunaDTO = tunaDtoProp.Accessor.getValue(dtoInstance) as TunaValueDTO
      if(tunaDTO != null) {
        tunaDTO.initialize(tunaDtoProp)
        tunaDTO.setValuesOnEntity(data)
      }
    }  else {
      var tunaDTO = new TunaValueDTO(tunaDtoProp)
      tunaDTO.getValuesFromEntity(data)
      tunaDtoProp.Accessor.setValue(dtoInstance, tunaDTO)
    }
  }


  protected enum MapDTODirection {
    TO(),
    FROM()
  }
}