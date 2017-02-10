package una.integration.mapping.hpx.common

uses java.io.File
uses java.io.FileReader
uses java.io.BufferedReader
uses java.lang.StringBuilder
uses una.integration.mapping.hpx.homeowners.HPXDwellingPolicyMapper
uses una.integration.mapping.hpx.businessowners.HPXBusinessOwnersPolicyMapper
uses una.integration.mapping.hpx.commercialpackage.HPXCommercialPackagePolicyMapper
uses gw.xml.XmlElement
uses gw.xml.XmlNamespace
uses una.logging.UnaLoggerCategory
uses una.integration.mapping.hpx.common.composition.HPXInsuredCompositionUnitMapper
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 7/14/16
 * Time: 6:50 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRequestMapper {
  function createXMLRequestModel(policyPeriod : PolicyPeriod) : String {
    var file = new File("//uimfs02/users/Shared_Documents/Core Systems Transformation Program(Guidewire)/Integration Docs/FileIntegrations/DevServer/HPX/ewsrequest/xml.txt")
    var myScan = new FileReader(file)
    var bis = new BufferedReader(myScan)
    var xml = new StringBuilder()
    while (bis.ready()) {
      xml.append(bis.readLine())
    }
    return xml.toString()
  }

  function createFormsRequest(policyPeriod : PolicyPeriod, compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType) : String {
    var mapper = new HPXRequestMapper()
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var businessOwnersPolicyMapper = new HPXBusinessOwnersPolicyMapper()
    var commercialPackagePolicyMapper = new HPXCommercialPackagePolicyMapper()
    var returnString = new String()
    var returnModel : XmlElement
    if (policyPeriod.HomeownersLine_HOEExists) {
      var dwellingPolicy = dwellingPolicyMapper.createDwellingPolicy(policyPeriod)
      returnModel = createHPXDwellingPolicyRequestModel(dwellingPolicy, compositionUnit, policyPeriod)
    } else if (policyPeriod.BP7LineExists) {
      var businessOwnersPolicy = businessOwnersPolicyMapper.createBusinessOwnersPolicy(policyPeriod)
      returnModel = createHPXBusinessOwnersPolicyRequestModel(businessOwnersPolicy, compositionUnit, policyPeriod)
    } else if (policyPeriod.CPLineExists) {
      var commercialPackagePolicy = commercialPackagePolicyMapper.createCommercialPackagePolicy(policyPeriod)
      returnModel = createHPXCommercialPackagePolicyRequestModel(commercialPackagePolicy, compositionUnit, policyPeriod)
    }
    returnString = returnModel.asUTFString().replace("ns0:", "" ).replace("xmlns:ns0=\"http://wservices.universalpr.com/standards/pcnew/\"",
                                                                          "xsi:noNamespaceSchemaLocation=\"HPX_Application_Request.xsd\"")
    var _logger = UnaLoggerCategory.UNA_HPX
    _logger.debug(returnString)
    return returnString
  }

  function createHPXRequestModel(compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType, policyPeriod : PolicyPeriod) : XmlElement {
    var hpxRequestType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType()
    var ns = new XmlNamespace("http://wservices.universalpr.com/standards/pcnew/", "")
    var hpxRequest = new XmlElement(ns.qualify("PublishDocumentRequest"), hpxRequestType)
    var policyDocumentPublish = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyDocumentPublishType()
    var HPXClueReportMapper = new HPXClueReportMapper()
    hpxRequestType.PublishingEngineFileKey = "PolicyCenterNA.pub"
    hpxRequestType.addChild(new XmlElement("PolInfoTypeRq", policyDocumentPublish))
    if (policyPeriod.HomeownersLine_HOEExists) {
      foreach(cluePriorLoss in policyPeriod.HomeownersLine_HOE.HOPriorLosses_Ext.where( \ elt -> elt.ClueReport != null)) {
        hpxRequest.addChild(new XmlElement("ClaimsDocumentPublish", HPXClueReportMapper.createClueReport(cluePriorLoss)))
      }
    }
    hpxRequestType.addChild(new XmlElement("CompositionUnit", compositionUnit))
    hpxRequestType.addChild(new XmlElement("PublishingDocumentOutput", createPublishingDocumentOutput()))
    hpxRequestType.addChild(new XmlElement("PublishingConsumerAppKey", createPublishingConsumerAppKey()))
    return hpxRequest
  }

  function createHPXDwellingPolicyRequestModel(dwellingPolicy : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellingPolicyType,
                                 compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType,
                                 policyPeriod : PolicyPeriod) : XmlElement {
    var hpxRequest = createHPXRequestModel(compositionUnit, policyPeriod)
    if (hpxRequest.TypeInstance typeis wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType) {
      var hpxRequestType = (hpxRequest.TypeInstance as wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType)
      hpxRequestType.Transaction = "Policy Dwelling"
      var publishDocumentRequest = hpxRequestType.getChild("PolInfoTypeRq")
      publishDocumentRequest.addChild(new XmlElement("DwellingPolicy", dwellingPolicy))
    }
    return hpxRequest
  }

  function createHPXBusinessOwnersPolicyRequestModel(businessOwnersPolicy : wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerPolicyType,
                                               compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType,
                                               policyPeriod : PolicyPeriod) : XmlElement {
    var hpxRequest = createHPXRequestModel(compositionUnit, policyPeriod)
    if (hpxRequest.TypeInstance typeis wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType) {
      var hpxRequestType = (hpxRequest.TypeInstance as wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType)
      hpxRequestType.Transaction = "Policy Business Owners"
      var publishDocumentRequest = hpxRequestType.getChild("PolInfoTypeRq")
      publishDocumentRequest.addChild(new XmlElement("BusinessOwnerPolicy", businessOwnersPolicy))
    }
    return hpxRequest
  }

  function createHPXCommercialPackagePolicyRequestModel(commercialPackagePolicy : wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackagePolicyType,
                                                     compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType,
                                                     policyPeriod : PolicyPeriod) : XmlElement {
    var hpxRequest = createHPXRequestModel(compositionUnit, policyPeriod)
    if (hpxRequest.TypeInstance typeis wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType) {
      var hpxRequestType = (hpxRequest.TypeInstance as wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType)
      hpxRequestType.Transaction = "Policy Commercial Package"
      var publishDocumentRequest = hpxRequestType.getChild("PolInfoTypeRq")
      publishDocumentRequest.addChild(new XmlElement("CommercialPackagePolicy", commercialPackagePolicy))
    }
    return hpxRequest
  }

  function createPublishingConsumerAppKey() : wsi.schema.una.hpx.hpx_application_request.types.complex.PublishingConsumerAppKeyType {
    var publishingConsumerAppKey = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishingConsumerAppKeyType()
    publishingConsumerAppKey.AppKeyCd = "a"
    publishingConsumerAppKey.AppKeyDesc = "String"
    return publishingConsumerAppKey
  }

  function createPublishingDocumentOutput() : wsi.schema.una.hpx.hpx_application_request.types.complex.PublishingDocumentOutputType {
    var publishingDocumentOutput = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishingDocumentOutputType()
    publishingDocumentOutput.FileName = java.util.UUID.randomUUID().toString()
    publishingDocumentOutput.Directory = "North_America\\PC"
    return publishingDocumentOutput
  }
}