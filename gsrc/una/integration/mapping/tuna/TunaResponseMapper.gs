package una.integration.mapping.tuna

uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

/**
 * Created for TunaResponse Mapping
 * Created By: pyerrumsetty
 * Created Date: 5/11/16
 */
abstract class TunaResponseMapper {

  /*
  * Abstract method for Tuna Services, where all the response mappings were done
  * @param tunaResponse of type PropertyGeographyModel
  * */

  abstract function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse
}