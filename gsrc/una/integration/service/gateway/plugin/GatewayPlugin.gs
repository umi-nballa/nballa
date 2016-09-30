package una.integration.service.gateway.plugin

uses gw.lang.reflect.TypeSystem
uses java.io.File
uses gw.lang.reflect.IType
uses una.logging.UnaLoggerCategory
uses una.integration.service.gateway.tuna.TunaInterface
uses una.integration.service.gateway.hpx.HPXInterface
uses una.integration.service.gateway.clue.CluePropertyInterface
uses una.integration.service.gateway.ofac.OFACInterface

/**
 * User: pyerrumsetty
 * Date: 05/18/16
 * Time: 4:52 PM
 * Purpose: To provide a pluggable mechanism for development and testing to switch between test/stub service
 * implementations and actual implementations through configuration at runtime instead of needed to change any code.
 *
 * This class will look up the implementing class of the requested interface and using reflection will instantiate
 * the class specified in the plugin configFile.
 *
 * Example:
 * To change from the TUNA Gateway implementation from actual to stub:
 *
 *   1. Open the GatewayPlugin.xml config file
 *   2. Find and change the entry for the TUNA gateway
 *       <tns:Plugin>
 *         <tns:Name>TUNA</tns:Name>
 *         <tns:ClassImpl>una.integration.service.gateway.tuna.TunaGateway</tns:ClassImpl>
 *       </tns:Plugin>
 *   3. Change the ClassImpl to the stub class name:
 *       <tns:Plugin>
 *         <tns:Name>TUNA</tns:Name>
 *         <tns:ClassImpl>una.integration.service.gateway.tuna.TunaGatewayStub</tns:ClassImpl>
 *       </tns:Plugin>
 *  4. Now when you call this plugins getTunaGateway method it will return the stub implementation instead of the
 *      actual implementation:
 *
 *       //will return an implementation of the TunaGateway as specified in the GatewayPlugin.xml
 *       var gateway = GatewayPlugin.getTunaGateway()
 *
 */
class GatewayPlugin {

  /**************************************************
   *                   		Fields/Instance Variables
   **************************************************/

  static var logger = UnaLoggerCategory.UNA_INTEGRATION
  static var config = loadPluginConfig()


  /**
   * Operation to return implementation of the TunaInterface to the caller
   */
  static function makeTunaGateway():TunaInterface{
    var instance = makeGateway("TUNA")
    return instance as TunaInterface
  }

  /**
   * Operation to return implementation of the HPXInterface to the caller
   */
  static function makeHPXGateway():HPXInterface{
    var instance = makeGateway("HPX")
    return instance as HPXInterface
  }
  /**
   * Operation to return implementation of the CluePropertyInterface to the caller
   */
  static function makeCLUEGateway():CluePropertyInterface{
    var instance = makeGateway("CLUE")
    return instance as CluePropertyInterface
  }
  /**
   * Operation to return implementation of the OFACInterface to the caller
   */
  static function makeOfacGateway():OFACInterface{
    var instance = makeGateway("OFAC")
    return instance as OFACInterface
  }
  static private function makeGateway(pluginName:String):Object{

    try{
      //get plugin config file relative to the location of this class
      //config = loadPluginConfig()
      var plugin = config.Plugin.firstWhere( \ plugin -> plugin.Name==pluginName)
      logger.debug("Plugin name:  " + plugin.Name)
      var myFullClassName = plugin.ClassImpl

      //using reflection, instantiate implementation on the configuration file's ClassImpl
      logger.debug("Gateway Plugin: Instantiating ${myFullClassName}")
      var type = TypeSystem.getByFullName( myFullClassName )
      var params :IType[]={java.lang.String.Type}
      var timeoutThreshold = plugin.Settings.Setting.firstWhere( \ elt -> elt.Name.equalsIgnoreCase("TimeoutThreshold"))
      var paramValues:java.lang.Object[]={timeoutThreshold.Value}
      var instance = type.TypeInfo.getConstructor(params).Constructor.newInstance(paramValues)
      return instance
    }
    finally{
     }
  }


  /**
   * Operation to return plugin configuration stored in GatewayPlugin.xml
   *
   *  **This code expects the GatewayPlugin.xml file to be in the same directory as this class.**
    *
   * 1. get plugin config file physical location relative to the location of this class
   * 2. parse file contents and load into PluginConfig object and return to caller
   *
   * @return PluginConfig object unmarshalled from plugin config file
   */
  static private function loadPluginConfig() :  wsi.schema.una.config.pluginconfig.anonymous.elements.Configurations_Configuration{

    //if (config==null){
      /*
      get relative path to GatewayPlugin.xml by converting this class' package name to path and concatenate with file name
      of plugin config file.  i.e. foo.bar -> foo/bar   +  "/GatewayPlugin.xml"
       */
      var resourceName=GatewayPlugin.Type.Namespace.replace(".","/")+"/GatewayPlugin.xml"
      logger.debug("the resource name is " + resourceName)

      //get physical path to file from relative path using Type.TypeLoader.getResource(...)
      var pluginConfigFile = new File(GatewayPlugin.Type.TypeLoader.getResource(resourceName).File)


      var pluginConfig = wsi.schema.una.config.pluginconfig.PluginConfig.parse(pluginConfigFile)

      //find configuration settings for the current runtime environment
      var env = una.utils.EnvironmentUtil.PolicyCenterRuntime
      var envConfig = pluginConfig.Configuration.firstWhere( \ configx -> configx.Environment.equalsIgnoreCase(env))
      logger.info("envConfig:::"+envConfig)

      return envConfig

    //}
    //else{
    //  return config
    //}
 }


}