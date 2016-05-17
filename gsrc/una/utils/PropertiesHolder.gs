package una.utils

uses gw.api.system.server.ServerUtil
uses gw.api.util.ConfigAccess
uses una.logging.UnaLoggerCategory

uses java.io.FileInputStream
uses java.util.Properties

/**
 * Class to retrieve property values configured specific to each environment.
 * Created By: vtadi on 5/16/2016
 */
final class PropertiesHolder {
  final static var LOGGER = UnaLoggerCategory.INTEGRATION
  final static var PROP_FILE_PATH = ConfigAccess.getModuleRoot("configuration").Path + "/gsrc/una/properties/ApplicationProperties.properties"
  final static var SERVER_ENV = ServerUtil.Env
  static var _properties: Properties = null

  private construct(){}

  /**
   * Creates an instance of Properties and Loads the properties from the file path specified in the PROP_FILE_PATH static variable.
   */
  private static function loadProperties() {
    var properties = new Properties()
    var propInputStream = new FileInputStream(PROP_FILE_PATH)
    properties.load(propInputStream)
    _properties = properties
  }

  /**
   * Returns the property value for the given key based on the current environment.
   * @param key
   */
  static function getProperty(propertyKey : String): String {
    LOGGER.debug("Entering method PropertiesHoder.getProperty('${propertyKey}')")
    if (_properties == null) {
      loadProperties()
    }
    var propertyValue = _properties.getProperty("${SERVER_ENV}.${propertyKey}")
    if (propertyValue == null) {
      propertyValue = _properties.getProperty(propertyKey)
    }
    LOGGER.debug("Exiting method PropertiesHoder.getProperty()")
    return propertyValue
  }

}