package acc.appliedsystems

uses java.util.Map
uses org.slf4j.LoggerFactory
uses gw.plugin.messaging.MessageTransport
uses gw.plugin.InitializablePlugin
uses java.io.BufferedWriter
uses java.io.FileWriter
uses java.io.File
uses java.lang.Exception
uses gw.pl.messaging.entity.MessageContext
uses acc.appliedsystems.properties.IvansProps
uses java.lang.System
uses acc.appliedsystems.exception.AcceleratorException
uses acc.appliedsystems.util.CustomMessageContext

/**
 * IVANS Accelerator Transport
 * User: mpham
 * Date: 9/21/15
 * Time: 7:33 AM
 * To change this template use File | Settings | File Templates.
 */
class AcceleratorTransport implements MessageTransport, InitializablePlugin{

  public static final var CREATEPERIOD_MSG : String = "CreatePeriod"
  public static final var CANCELPERIOD_MSG : String = "CancelPeriod"
  public static final var CHANGEPERIOD_MSG : String = "ChangePeriod"
  public static final var ISSUEPERIOD_MSG : String = "IssuePeriod"
  public static final var REINSTATEPERIOD_MSG : String = "ReinstatePeriod"
  public static final var RENEWPERIOD_MSG : String = "RenewPeriod"
  public static final var REWRITEPERIOD_MSG : String = "RewritePeriod"
  private var logger = LoggerFactory.getLogger("AcceleratorTransport")
  var xmlfilesPath : String = IvansProps.xmlpath
  public static final var XML_PATH_DEFAULT : String = "C:\\Guidewire\\DEV\\PolicyCenter\\xml\\"
  override function shutdown() {
    logger.debug("AcceleratorTransport shutdown")
  }

  override function suspend() {
    logger.debug("AcceleratorTransport suspend")
  }

  override function resume() {
    logger.debug("AcceleratorTransport resume")
  }

  override function setDestinationID(p0: int) {
  }

  override function setParameters(p0: Map) {
  }

  /**
   * send the xml file to Converter system
   * @param aMessage
   * @param transformedPayload
   *
  */
  override function send(aMessage: Message, transformedPayload: String) {

    logger.info(\ -> "PolicyID=${aMessage.PolicyPeriod.Policy.ID};PolicyNumber=${aMessage.PolicyPeriod.PolicyNumber};Summary=StartAcceleratorTransportSending")
    logger.trace(\ -> "sending the message to Ivans connect. payload:\n ${transformedPayload}")
    var currentDate = gw.api.util.DateUtil.currentDate()
    var startTime = System.currentTimeMillis()
    var formateDtStr = gw.api.util.StringUtil.formatDate(currentDate,"yyyyMMddHHmmss")
    var folder : File
    var msg : String

    //check if the xml folder doesn't exist
    logger.trace( \ -> "checking the folder: " + xmlfilesPath)
    if (xmlfilesPath == null or xmlfilesPath.Empty) {
      xmlfilesPath = XML_PATH_DEFAULT
      logger.trace( \ -> "Use the default xml path: " + xmlfilesPath)
    }
    folder = new File(xmlfilesPath)
    if(!folder.exists()) {
      //Expect to retry if the folder is not exist.
      logger.error( \-> "send() Directory " + xmlfilesPath + " doesn not exist.")
      throw new AcceleratorException("Directory " + xmlfilesPath + " doesn not exist. Please create this folder.")
    }

    //do not retry if there is mapping issue
    try {
      msg = new CustomMessageContext().handleConvertPolicyPeriodToXml(aMessage.PolicyPeriod)
      logger.trace("XML payload: " + msg)
    } catch(e : Exception) {
      logger.error(\ -> e)
      logger.error(\ -> "Error occured while sending message ${e.LocalizedMessage}")
      aMessage.ErrorDescription = e.Message
      aMessage.reportError(ErrorCategory.TC_SYSTEM_ERROR)
    }

    try{
      //retry if there is anything wrong with writing the file to disk.
      logger.trace( \ -> "begin writing file to folder: " + xmlfilesPath)
      var fileName = xmlfilesPath + File.separator +  "Accelerator_" + formateDtStr + "_" + aMessage.PolicyPeriod.PolicyNumber + "_" + aMessage.PolicyPeriod.Policy.ProductCode + ".xml"

      using(var fileWriter =  new FileWriter(new File(fileName)), var output = new BufferedWriter(fileWriter)) {
        output.write(msg)
        var totalTime = System.currentTimeMillis() - startTime
        logger.warn(\ -> "TotalTime=${totalTime}ms;Summary=EndAcceleratorTransportSending")
      }
      aMessage.reportAck()
    } catch(e : Exception) {
      logger.error(\ ->  "Error occured : ${e.StackTraceAsString}")
      throw new AcceleratorException("Exception with writing xml file to hard driver");
    }

  }

}