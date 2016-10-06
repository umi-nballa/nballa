package una.config

uses java.math.BigDecimal
uses java.lang.NumberFormatException
uses gw.util.concurrent.LockingLazyVar
uses java.util.HashSet
uses java.util.Date
uses gw.api.database.Query
uses java.lang.IllegalStateException
uses java.lang.Integer
uses java.lang.Double
uses una.logging.UnaLoggerCategory
uses una.utils.EnvironmentUtil
uses java.util.HashMap
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/15/16
 * Time: 10:27 PM
 * To change this template use File | Settings | File Templates.
 */
class ConfigParamsUtil {
  private static var _lazyConfigParams = LockingLazyVar.make(\ -> new HashSet<ConfigurationParameter_Ext>())
  private static final var _logger = UnaLoggerCategory.UNA_CONFIG_PARAMS

  /*
    gets a BigDecimal config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a BigDecimal, that was returned for the given configParameterType and state.")
  public static function getBigDecimal(configParameterType : ConfigParameterType_Ext, state : Jurisdiction) : BigDecimal{
    var result : BigDecimal
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      try{
        configParameter = getConfigParameter(configParameterType, state, null)

        if(configParameter != null){
          result = new BigDecimal(configParameter.Value)
        }

      }catch(e : NumberFormatException){
        throw new ConfigurationParameterConversionException(BigDecimal.Type.toString(), configParameter.Value)
      }
    }

    return result
  }

  /*
    gets an Integer config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a Integer, that was returned for the given configParameterType and state")
  public static function getInt(configParameterType : ConfigParameterType_Ext, state : Jurisdiction) : Integer{
    var result : Integer
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      try{
        configParameter = getConfigParameter(configParameterType, state, null)

        if(configParameter != null){
          result = configParameter.Value.toInt()
        }

      }catch(e : NumberFormatException){
        throw new ConfigurationParameterConversionException(BigDecimal.Type.toString(), configParameter.Value)
      }
    }

    return result
  }

  /*
    gets a String config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a String, that was returned for the given configParameterType and state")
  public static function getString(configParameterType : ConfigParameterType_Ext, state : Jurisdiction) : String{
    var result : String

    if(configParameterType != null){
      result = getConfigParameter(configParameterType, state, null).Value
    }

    return result
  }

  /*
    gets a Double config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a Double, that was returned for the given configParameterType and state")
  public static function getDouble(configParameterType : ConfigParameterType_Ext, state : Jurisdiction) : Double {
    var result : java.lang.Double
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      try{
        configParameter = getConfigParameter(configParameterType, state, null)

        if(configParameter != null){
          result = configParameter.Value.toDouble()
        }
      }catch(e : NumberFormatException){
        throw new ConfigurationParameterConversionException(double.Type.toString(), configParameter.Value)
      }
    }

    return result
  }

  /*
    gets a Boolean config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a Boolean, that was returned for the given configParameterType and state")
  public static function getBoolean(configParameterType : ConfigParameterType_Ext, state : Jurisdiction) : Boolean {
    var result : Boolean
    var configParameter : ConfigurationParameter_Ext
    var booleanStrings = {"false", "true", null}

    if(configParameterType != null){
      configParameter = getConfigParameter(configParameterType, state,  null)

      if(!booleanStrings.contains(configParameter.Value?.toLowerCase())){
        throw new ConfigurationParameterConversionException(boolean.Type.toString(), configParameter.Value)
      }

      result = configParameter.Value as Boolean
    }

    return result
  }

  /*
    gets a Range config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a Range, that was returned for the given configParameterType and state.")
  public static function getRange(configParameterType : ConfigParameterType_Ext, state : Jurisdiction) : Range{
    var result : Range
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      configParameter = getConfigParameter(configParameterType, state, null)

      if(configParameter != null){
        var splitConfigParams = configParameter.Value?.split(",")*.trim()

        if(splitConfigParams.Count != 2){
          throw new ConfigurationParameterConversionException(Range.Type.toString(), configParameter.Value)
        }

        result = new Range()
        result.LowerBound = splitConfigParams[0].toBigDecimal()
        result.UpperBound = splitConfigParams[1].toBigDecimal()

        if(result.LowerBound >= result.UpperBound){
          throw new ConfigurationParameterConversionException(Range.Type.toString(), configParameter.Value)
        }
      }
    }

    return result
  }

  /*
    gets a Range config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Returns("The config parameter value, converted to a List of values, that was returned for the given configParameterType and state.")
  public static function getList(configParamType : ConfigParameterType_Ext, state : Jurisdiction) : List<String> {
    var results : List<String> = {}

    if(configParamType != null){
      var retrievedConfigParam = getConfigParameter(configParamType, state, null)
      results = retrievedConfigParam.Value?.split(",")*.trim() as List<String>
    }

    return results
  }

  /*
    gets a BigDecimal config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to a BigDecimal, that was returned for the given configParameterType and state.")
  public static function getBigDecimal(configParameterType : ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : BigDecimal{
    var result : BigDecimal
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      try{
        configParameter = getConfigParameter(configParameterType, state, configFilter)

        if(configParameter != null){
          result = new BigDecimal(configParameter.Value)
        }
      }catch(e : NumberFormatException){
        throw new ConfigurationParameterConversionException(BigDecimal.Type.toString(), configParameter.Value)
      }
    }

    return result
  }

  /*
    gets a Boolean config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to an Integer, that was returned for the given configParameterType and state.")
  public static function getInt(configParameterType : ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : Integer{
    var result : Integer
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      try{
        configParameter = getConfigParameter(configParameterType, state, configFilter)

        if(configParameter != null){
          result = configParameter.Value.toInt()
        }
      }catch(e : NumberFormatException){
        throw new ConfigurationParameterConversionException(BigDecimal.Type.toString(), configParameter.Value)
      }
    }

    return result
  }

  /*
    gets a Boolean config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter String value that was returned for the given configParameterType and state.")
  public static function getString(configParameterType: ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : String{
    var result : String

    if(configParameterType != null){
      result = getConfigParameter(configParameterType, state, configFilter).Value
    }

    return result
  }

  /*
    gets a Boolean config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to a Double, that was returned for the given configParameterType and state.")
  public static function getDouble(configParameterType: ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : Double{
    var result : java.lang.Double
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      try{
        configParameter = getConfigParameter(configParameterType, state, configFilter)

        if(configParameter != null){
          result = configParameter.Value.toDouble()
        }
      }catch(e : NumberFormatException){
        throw new ConfigurationParameterConversionException(double.Type.toString(), configParameter.Value)
      }
    }

    return result
  }

  /*
    gets a Boolean config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to a Boolean, that was returned for the given configParameterType and state")
  public static function getBoolean(configParameterType: ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : Boolean{
    var result : Boolean
    var configParameter : ConfigurationParameter_Ext
    var booleanStrings = {"false", "true", null} //null == false.  if not present, it is inferred that we should return false

    if(configParameterType != null){
      configParameter = getConfigParameter(configParameterType, state, configFilter)

      if(!booleanStrings.contains(configParameter.Value?.toLowerCase())){
        throw new ConfigurationParameterConversionException(boolean.Type.toString(), configParameter.Value)
      }

      result = configParameter.Value as Boolean
    }

    return result
  }

  /*
    gets a Boolean config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to a Range, that was returned for the given configParameterType and state.")
  public static function getRange(configParameterType : ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : Range{
    var result : Range
    var configParameter : ConfigurationParameter_Ext

    if(configParameterType != null){
      configParameter = getConfigParameter(configParameterType, state, configFilter)

      if(configParameter != null){
        var splitConfigParams = configParameter.Value?.split(",")*.trim()

        if(splitConfigParams.Count != 2){
          throw new ConfigurationParameterConversionException(Range.Type.toString(), configParameter.Value)
        }

        result = new Range()
        result.LowerBound = splitConfigParams[0].toBigDecimal()
        result.UpperBound = splitConfigParams[1].toBigDecimal()

        if(result.LowerBound >= result.UpperBound){
          throw new ConfigurationParameterConversionException(Range.Type.toString(), configParameter.Value)
        }
      }
    }

    return result
  }

  /*
    gets a Range config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to a List of values, that was returned for the given configParameterType and state.")
  public static function getList(configParamType : ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : List<String> {
    var results : List<String> = {}

    if(configParamType != null){
      var retrievedConfigParam = getConfigParameter(configParamType, state, configFilter)
      results = retrievedConfigParam.Value?.split(",")*.trim() as List<String>
    }

    return results
  }

  /*
    gets a mapp config parameter
   */
  @Param("configParameterType", "The ConfigParameterType_Ext typekey to be retrieved.")
  @Param("state", "The state for which to retrieve the config parameter for.")
  @Param("configFilter", "A string that can be used to further filter a config param.")
  @Returns("The config parameter value, converted to a List of values, that was returned for the given configParameterType and state.")
  public static function getMap<T,E>(configParamType : ConfigParameterType_Ext, state : Jurisdiction, configFilter: String) : HashMap<T,E> {
    var results = new HashMap<T,E>()

    if(configParamType != null){
      var retrievedConfigParam = getConfigParameter(configParamType, state, configFilter)

      var mapPairs = retrievedConfigParam.Value.split(",")*.trim()
      mapPairs?.each( \ elt -> {
        var pair = elt.split("->")*.trim()

        try{
          var key = pair[0] as T
          var value = pair[1] as E
          results.put(key, value)
        }catch(e: Exception){
          throw e
        }
      })
    }

    return results
  }

  private static function getConfigParameter(configParamType : ConfigParameterType_Ext, state : Jurisdiction, configFilter : String) : ConfigurationParameter_Ext{
    var result : ConfigurationParameter_Ext
    var currentDate = Date.CurrentDate

    loadConfigurationParameters(configParamType)
    removeExpiredConfigParameters()
    result = retrieveConfigParameter(configParamType, state, configFilter)

    return result
  }

  private static function loadConfigurationParameters(configParamType : ConfigParameterType_Ext){
    var currentDate = Date.CurrentDate

    if(shouldLoadConfigParameter(configParamType)){
      var query = Query.make(ConfigurationParameter_Ext)
                       .compare(ConfigurationParameter_Ext#ConfigParameterType, Equals, configParamType)
                       .or(\ orCriteria -> {orCriteria.compare(ConfigurationParameter_Ext#ServerTier, Equals, getServerTier())
                                            orCriteria.compare(ConfigurationParameter_Ext#ServerTier, Equals, null)
                                           })
                       .or(\ orCriteria -> {orCriteria.compare(ConfigurationParameter_Ext#EffectiveDate, LessThanOrEquals, currentDate)
                                            orCriteria.compare(ConfigurationParameter_Ext#EffectiveDate, Equals, null)
                                           })
                       .or(\ orCriteria -> {orCriteria.compare(ConfigurationParameter_Ext#ExpirationDate, GreaterThan, currentDate)
                                            orCriteria.compare(ConfigurationParameter_Ext#ExpirationDate, Equals, null)
                                           })
       var queryResults = query.select()?.toList()
      _lazyConfigParams.get().addAll(queryResults)
    }
  }

  private static function shouldLoadConfigParameter(configParamType: ConfigParameterType_Ext) : boolean {
    return !_lazyConfigParams.get().hasMatch( \ elt -> elt.ConfigParameterType == configParamType
                                                  and (elt.ServerTier == getServerTier() or elt.ServerTier == null))
  }

  private static function removeExpiredConfigParameters(){
    _lazyConfigParams.get().removeWhere( \ elt -> elt.ExpirationDate != null
                                              and elt.ExpirationDate.beforeIgnoreTime(java.util.Date.CurrentDate))
  }

  /**
  * returns the best-matching configuration parameter from the cached list.
  * If none is found, it will return null
  */
  private static function retrieveConfigParameter(configParamType : ConfigParameterType_Ext, baseState : Jurisdiction, configFilter : String) : ConfigurationParameter_Ext{
    var result : ConfigurationParameter_Ext

    var configParams = _lazyConfigParams.get().where( \ configParam -> configParam.ConfigParameterType == configParamType
                                                    and configParam.ConfigurationFilter?.toLowerCase() == configFilter?.toLowerCase())

    var firstTierMatch = configParams?.where( \ configParam -> configParam.State == baseState and configParam.ServerTier == getServerTier()).first()
    var secondTierMatch = configParams?.where( \ configParam -> configParam.State == baseState and configParam.ServerTier == null).first()
    var thirdTierMatch = configParams?.where( \ configParam -> configParam.State == null and configParam.ServerTier == getServerTier()).first()
    var fourthTierMatch = configParams?.where( \ configParam -> configParam.State == null and configParam.ServerTier == null).first()

    if(firstTierMatch != null){
      result = firstTierMatch
    }else if(secondTierMatch != null){
      result = secondTierMatch
    }else if(thirdTierMatch != null){
      result = thirdTierMatch
    }else if(fourthTierMatch != null){
      result = fourthTierMatch
    }

    return result
  }

  private static function getServerTier() : String{
    return EnvironmentUtil.PolicyCenterRuntime
  }
}