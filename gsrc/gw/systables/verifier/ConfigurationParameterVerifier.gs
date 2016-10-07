package gw.systables.verifier

uses gw.xml.parser2.PLXMLNode
uses java.util.Map
uses java.util.HashMap
uses java.lang.Exception
uses java.text.SimpleDateFormat
uses java.util.Date
uses java.math.BigDecimal
uses org.apache.commons.lang3.builder.EqualsBuilder
uses una.utils.EnvironmentUtil
uses una.logging.UnaLoggerCategory

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/23/16
 * Time: 4:14 PM
 * To change this template use File | Settings | File Templates.
 */
class ConfigurationParameterVerifier extends VerifierBase{
  private final static var LOGGER = UnaLoggerCategory.UNA_CONFIG_PARAMS
  private var _loadedList : List<ConfigParamBean> = {}
  private final var TABLE_NAME = "ConfigurationParameter_Ext"
  private final var EFFECTIVE_DATE = "EffectiveDate"
  private final var EXPIRATION_DATE = "ExpirationDate"
  private final var SERVER_TIER = "ServerTier"
  private final var STATE = "State"
  private final var VALUE = "Value"
  private final var CONFIG_PARAM_TYPE = "ConfigParameterType"
  private final var VALUE_CONVERSION_ERROR = "Unable to convert value in table. You may need to add an additional config data type category to the given config typekey.  Msg: "
  private final var CONFIG_FILTER="ConfigurationFilter"


  override function verify(xmlNode : PLXMLNode) : Map<PLXMLNode, List<String>>{
    var results : Map<PLXMLNode, List<String>> = new HashMap<PLXMLNode, List<String>>()

    super.verify(xmlNode)
    var tableRows = xmlNode.Children

    tableRows.each( \ row -> {
      var validationResults = validateRow(row)
      results.putAll(validationResults)
    })

    return results
  }

  function validateRow(xmlNode : PLXMLNode) : Map<PLXMLNode, List<String>>{
    var results : Map<PLXMLNode, List<String>> = {}
    var children = xmlNode.Children
    var expirationDateNode = children.atMostOneWhere(\ child -> child.ElementName == EXPIRATION_DATE)
    var effectiveDateNode = children.atMostOneWhere( \ child -> child.ElementName == EFFECTIVE_DATE)
    var stateNode = children.atMostOneWhere( \ child -> child.ElementName == STATE)
    var serverTierNode = children.atMostOneWhere( \ child -> child.ElementName == SERVER_TIER)
    var configParamTypeNode = children.atMostOneWhere( \ child -> child.ElementName== CONFIG_PARAM_TYPE)
    var configFilterNode = children.atMostOneWhere(\ child -> child.ElementName == CONFIG_FILTER)
    var valueNode = children.atMostOneWhere( \ child -> child.ElementName == VALUE)

    var bean = new ConfigParamBean(){
        :state = stateNode.Text,
        :expDate = getDate(expirationDateNode.Text),
        :effDate = getDate(effectiveDateNode.Text),
        :configParamType = ConfigParameterType_Ext.get(configParamTypeNode.Text),
        :serverTier = serverTierNode.Text,
        :value = valueNode.Text,
        :configFilter = configFilterNode.Text
    }

    results.putAll(validateDuplicates(bean, xmlNode))
    results.putAll(validateServerTier(serverTierNode))
    results.putAll(validateDates(bean.effDate, bean.expDate, effectiveDateNode))
    results.putAll(validateValue(bean.configParamType, bean.value, xmlNode))

    return results
  }

  function validateDates(effectiveDate : Date, expirationDate : Date, effectiveDateNode : PLXMLNode) : Map<PLXMLNode, List<String>>{
    var results = new HashMap<PLXMLNode, List<String>>()

    if(effectiveDate != null and expirationDate != null and effectiveDate.afterIgnoreTime(expirationDate)){
      results.put(effectiveDateNode, {"EffectiveDate cannot occur after ExpirationDate."})
    }

    return results
  }

  function validateServerTier(serverNode : PLXMLNode) : Map<PLXMLNode, List<String>>{
    var results = new HashMap<PLXMLNode, List<String>>()

    var acceptableValues = {EnvironmentUtil.LOCAL_DEV_ENVIRONMENT,
                            EnvironmentUtil.LOCAL_ENVIRONMENT,
                            EnvironmentUtil.INT1_ENVIRONMENT,
                            EnvironmentUtil.PROD_ENVIRONMENT,
                            EnvironmentUtil.QA_ENVIRONMENT,
                            EnvironmentUtil.UAT_ENVIRONMENT, null}

    if(!acceptableValues.contains(serverNode.Text)){
      results.put(serverNode, {"Environment / Server Tier is invalid.  Value=${serverNode.Text}"})
    }

    return results
  }

  private function getDate(xmlDate : String) : java.util.Date{
    var result : Date
    var dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.S")
    if(xmlDate != null){
      result = dateFormat.parse(xmlDate)
    }

    return result
  }

  function validateDuplicates(bean : ConfigParamBean, node : PLXMLNode) : Map<PLXMLNode, List<String>>{
    var results : Map<PLXMLNode, List<String>> = {}{}

    if(_loadedList.contains(bean)){
      results.put(node, {"Duplicate values not allowed.  Values: ${bean.toString()}"})
    }else{
      _loadedList.add(bean)
    }

    return results
  }

  function validateValue(configParamType : ConfigParameterType_Ext, value : String, rowNode : PLXMLNode) : Map<PLXMLNode, List<String>>{
    var results : Map<PLXMLNode, List<String>> = {}{}
    var dataCategories = configParamType.Categories?.whereTypeIs(ConfigParamDataType_Ext)
    var validationResults : List<String> = {}

    dataCategories?.each( \ dataCategory -> {
      switch(dataCategory){
        case TC_DOUBLE:
          try{
            value?.toDouble()
          }catch(e : Exception){
            validationResults.add(VALUE_CONVERSION_ERROR + " value = ${value}; configParamType = ${configParamType}; configDataType = ${dataCategory}")
          }
          break
        case TC_BIGDECIMAL:
            try{
              new BigDecimal(value)
            }catch(e : Exception){
              validationResults.add(VALUE_CONVERSION_ERROR + " value = ${value}; configParamType = ${configParamType}; configDataType = ${dataCategory}")
            }
          break
        case TC_INT:
            try{
              value?.toInt()
            }catch(e : Exception){
              validationResults.add(VALUE_CONVERSION_ERROR + " value = ${value}; configParamType = ${configParamType}; configDataType = ${dataCategory}")
            }
          break
        case TC_BOOLEAN:
          if(!{"true", "false", null}.contains(value)){
            validationResults.add(VALUE_CONVERSION_ERROR + " value = ${value}; configParamType = ${configParamType}; configDataType = ${dataCategory}")
          }
          break
        case TC_RANGE:
          var splitConfigParams = value?.split(",")*.trim()

          if(splitConfigParams == null or splitConfigParams.Count != 2){
            validationResults.add(VALUE_CONVERSION_ERROR + " value = ${value}; configParamType = ${configParamType}; configDataType = ${dataCategory}")
          }
          break
        case TC_MAP:
          var splitConfigParams = value?.split("->")*.trim()

          if(splitConfigParams == null or splitConfigParams.Count != 2){
            validationResults.add(VALUE_CONVERSION_ERROR + " value = ${value}; configParamType = ${configParamType}; configDataType = ${dataCategory}")
          }
          break
        default:
          LOGGER.debug("Not validating data category of ${dataCategory} for configParam row with a type of ${configParamType} and value of ${value}")
      }
    })

    if(validationResults.HasElements){
      results.put(rowNode, validationResults)
    }

    return results
  }

  class ConfigParamBean{
    var state : String
    var configParamType : ConfigParameterType_Ext
    var value : String
    var effDate : Date
    var expDate : Date
    var serverTier : String
    var configFilter : String

    override function toString() : String{
      return "state=${state}, configParamType=${configParamType}, value=${value}, effDate=${effDate}, expDate=${expDate}, serverTier=${serverTier}, configFilter=${configFilter}"
    }

    override function equals(obj: Object): boolean {
      var result = false

      if(obj typeis ConfigParamBean){
        result = new EqualsBuilder().append(state, obj.state)
                                    .append(configParamType.Code, obj.configParamType.Code)
                                    .append(effDate, obj.effDate)
                                    .append(expDate, obj.expDate)
                                    .append(serverTier, obj.serverTier)
                                    .append(value, obj.value)
                                    .append(configFilter, obj.configFilter).Equals
      }

      return result
    }
  }
}