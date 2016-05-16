package una.utils

uses gw.api.system.server.ServerUtil
uses una.logging.UnaLoggerCategory

uses java.util.MissingResourceException
uses java.util.ResourceBundle

/**
 * Class to retrieve property values configured specific to each environment.
 * Created By: vtadi001 on 5/16/2016
 */
final class PropertiesHolder {
  final static var _logger = UnaLoggerCategory.INTEGRATION
  final static var RESOURCE_BUNDLE = "una.properties.ApplicationProperties"
  final static var ENV = ServerUtil.Env

  private construct(){}

  /**
   * Returns the property value for the given key based on the current environment.
   * @param key
   */
  static function getProperty(key : String): String {
    _logger.debug("Entering method PropertiesHoder.getProperty()")
    var result = ''
    key = ENV.HasContent ? "${ENV}.${key}" : key
    var resourceBundle = ResourceBundle.getBundle(RESOURCE_BUNDLE)
    try{
      result = resourceBundle.getString(key)
    } catch(missingResource : MissingResourceException ){
      key = key.split('\\.').toList().get(1)
      result = resourceBundle.getString(key)
    }
    _logger.debug("Exiting method PropertiesHoder.getProperty()")
    return result
  }

}