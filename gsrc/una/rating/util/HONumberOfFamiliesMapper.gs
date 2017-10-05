package una.rating.util

uses una.logging.UnaLoggerCategory

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 10/5/17
 * Time: 8:32 AM
 * To change this template use File | Settings | File Templates.
 */
class HONumberOfFamiliesMapper {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  static function getNumberOfFamilies(residenceType : typekey.ResidenceType_HOE) : int {
    var numberOfFamilies : int

    switch(residenceType){
      case TC_Duplex:
        numberOfFamilies = 2
        break
      case TC_triplex_Ext:
        numberOfFamilies = 3
        break
      case TC_quadplex_Ext:
        numberOfFamilies = 4
        break
      case TC_singleFamily_Ext:
      case TC_apartment_Ext:
      case TC_Condo:
      case TC_townhouseRowhouse_Ext:
      case TC_modular_Ext:
      case TC_mobileHome_Ext:
      case TC_travelTrailer_Ext:
      case TC_preFab_Ext:
      case TC_dome_Ext:
      case TC_diyConstruction_Ext:
        numberOfFamilies = 1
        break
      default:
        _logger.debug("ResidenceType: " + residenceType +" is not mapped to number of Families")
        break

    }

    return numberOfFamilies
  }

}