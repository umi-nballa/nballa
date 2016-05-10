package una.utils

uses com.guidewire.modules.ConfigFileAccess
uses java.io.FileInputStream
uses java.util.Properties

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 05/10/2016
 * Time: 3:45 PM
 * simple utility for getting integration properties
 */
class PropertyUtil {
  public static var INSTANCE: PropertyUtil = new PropertyUtil()
  private static var _CONFIGMODULENAME = "configuration"
  private static var _PROPERTYFILE = "plugins//integration.properties"
  private static var _properties: Properties
  construct() {
  }

  /*
     This function calls the ServerUtil.getEnv() function and gets the server's environment.(i.e. "local"),
     and returns the .properties value in the "integration.properties" file
  */

  function getProperty(messageKey: String): String {
    if (_properties == null) {
      var configFileAccess = ConfigFileAccess.INSTANCE.get()
      var file = configFileAccess.getModuleRoot(_CONFIGMODULENAME).getChild(_PROPERTYFILE)
      var fis = new FileInputStream(file)
      _properties = new Properties()
      _properties.load(fis)
    }
    var prop = _properties.get(EnvironmentUtil.PolicyCenterRuntime + "." + messageKey) as String
    if (prop == null){
      prop = _properties.get(messageKey) as String
    }
    return prop
  }
}
