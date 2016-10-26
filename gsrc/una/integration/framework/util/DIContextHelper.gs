package una.integration.framework.util

uses gw.api.util.ConfigAccess
uses org.springframework.context.support.GenericXmlApplicationContext
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.exception.FieldErrorInformation
uses una.logging.UnaLoggerCategory

uses java.lang.Exception
uses java.util.concurrent.locks.ReentrantLock

/**
 * This class manages a singleton Application Context, loads configured beans into the context and retrieves the required beans from the context.
 * Created By: vtadi on 5/18/2016
 */
class DIContextHelper {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var DB_DATA_SOURCE_TYPE_KEY = "db_datasourcetype"
  final static var PERSISTENCE_CONTEXT_FILE = "una/integration/framework/persistence/di_config/integrationDatabase-persistence.xml"
  final static var PERSISTENCE_FILE_PATH = "file:" + ConfigAccess.getModuleRoot("configuration").Path + "/gsrc/" + PERSISTENCE_CONTEXT_FILE

  static var _applicationContext: GenericXmlApplicationContext
  static var _lock = new ReentrantLock()

  private construct() {}

  /**
   * Returns the application context. Initialises the application context, if it is null.
   */
  private static property get Context() : GenericXmlApplicationContext {
    using(_lock) {
      if (_applicationContext == null) {
        _applicationContext = new GenericXmlApplicationContext()
        // Setting default data source profile based on the environment
        var dataSourceType = PropertiesHolder.getProperty(DB_DATA_SOURCE_TYPE_KEY)
        _applicationContext.Environment.addActiveProfile(dataSourceType)
        // Loading beans into application context
        _applicationContext.load(new String[]{ PERSISTENCE_FILE_PATH })
        _applicationContext.refresh()
      }
      return _applicationContext
    }
  }

  /**
   * Loads beans into the application context as configured in the given config file pattern.
   * @param configFileLocation the location of the bean configuration file.
   */
  static function loadBeansIntoContext(beanLocationPattern: String) {
    _logger.debug("Entering the function 'loadBeansIntoContext' of DIContextHelper.")
    if (beanLocationPattern != null && !beanLocationPattern.Empty) {
      try {
        Context.load(new String[]{beanLocationPattern})
      } catch (ex: Exception) {
        ExceptionUtil.throwException(ErrorCode.UNEXPECTED_EXCEPTION, null, ex)
      }
    }
    _logger.debug("Exiting the function 'loadBeansIntoContext' of DIContextHelper.")
  }

  /**
   * Retrieves bean with the given name from the application context.
   * @param beanName the name of the bean as configured.
   */
  static function getBean(beanName: String): Object {
    var bean: Object
    if (beanName != null && Context.containsBeanDefinition(beanName)) {
      bean = Context.getBean(beanName)
    } else {
      var errorInfo = new FieldErrorInformation(){:FieldName = "Bean", :FieldValue = beanName, :ErrorMessage = "Bean Definition is missing"}
      ExceptionUtil.throwException(ErrorCode.MISSING_BEAN_DEFINITION, {errorInfo})
    }
    return bean
  }

  /**
   * Checks if a bean with the given beanName exists in the application context.
   * @param beanName the name of the bean as configured.
   */
  static function containsBeanDefinition(beanName: String): boolean {
    return Context.containsBeanDefinition(beanName)
  }

}
