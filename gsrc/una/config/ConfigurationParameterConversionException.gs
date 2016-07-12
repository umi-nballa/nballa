package una.config

uses java.lang.Exception
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/16/16
 * Time: 10:52 AM
 * To change this template use File | Settings | File Templates.
 */
class ConfigurationParameterConversionException extends Exception{
  construct(expectedType : String, value : String){
    super("Unable to convert the value ${value} to the type ${expectedType}")
  }
}