package una.integration.mapping.hpx.common

uses java.io.File
uses java.io.FileReader
uses java.io.BufferedReader
uses java.lang.StringBuilder
uses una.integration.mapping.hpx.homeowners.HPXDwellingCoverageMapper
uses una.integration.mapping.hpx.homeowners.HPXDwellingPolicyMapper
uses una.integration.mapping.hpx.businessowners.HPXBusinessOwnersPolicyMapper
uses una.integration.mapping.hpx.commercialpackage.HPXCommercialPackagePolicyMapper
uses gw.xml.XmlElement
uses javax.xml.namespace.QName
uses gw.xml.XmlNamespace
uses gw.xml.XmlSimpleValue

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 7/14/16
 * Time: 6:50 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRequestMapper {
  function createRequestModel(policyPeriod : PolicyPeriod) {

  }


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

  function createForms(policyPeriod : PolicyPeriod) : String {
    var mapper = new HPXRequestMapper()
    var coverageMapper = new HPXDwellingCoverageMapper()
    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var businessOwnersPolicyMapper = new HPXBusinessOwnersPolicyMapper()
    var commercialPackagePolicyMapper = new HPXCommercialPackagePolicyMapper()
    var returnString = new String()
    if (policyPeriod.HomeownersLine_HOEExists) {
      var dwellingPolicy = dwellingPolicyMapper.createDwellingPolicy(policyPeriod)
      var compositionUnit = compositionUnitMapper.createCompositionUnit(policyPeriod)
      returnString = createHPXDwellingPolicyRequestModel(dwellingPolicy, compositionUnit)
    } else if (policyPeriod.BP7LineExists) {
      var businessOwnersPolicy = businessOwnersPolicyMapper.createBusinessOwnersPolicy(policyPeriod)
      var compositionUnit = compositionUnitMapper.createCompositionUnit(policyPeriod)
      returnString = createHPXBusinessOwnersPolicyRequestModel(businessOwnersPolicy, compositionUnit)
    } else if (policyPeriod.CPLineExists) {
      var commercialPackagePolicy = commercialPackagePolicyMapper.createCommercialPackagePolicy(policyPeriod)
      var compositionUnit = compositionUnitMapper.createCompositionUnit(policyPeriod)
      returnString = createHPXCommercialPackagePolicyRequestModel(commercialPackagePolicy, compositionUnit)
    }
    return returnString
  }

  function createHPXDwellingPolicyRequestModel(dwellingPolicy : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellingPolicyType,
                                 compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType) : String {
    var hpxRequestType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType()
    //var hpxRequest = new XmlElement("PublishDocumentRequest", hpxRequestType)

    var ns = new XmlNamespace("http://wservices.universalpr.com/standards/pcnew/", "")
    var hpxRequest = new XmlElement(ns.qualify("PublishDocumentRequest"), hpxRequestType)
   // var hpxRequest = new XmlElement("PublishDocumentRequest", hpxRequestType)

    var policyDocumentPublish = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyDocumentPublishType()
    hpxRequestType.PublishingEngineFileKey = "PolicyCenterNA.pub"
    policyDocumentPublish.addChild(new XmlElement("DwellingPolicy", dwellingPolicy))
    hpxRequest.addChild(new XmlElement("PolInfoTypeRq", policyDocumentPublish))
    hpxRequest.addChild(new XmlElement("CompositionUnit", compositionUnit))
    hpxRequestType.Transaction = "Policy Dwelling"
    hpxRequest.addChild(new XmlElement("PublishingConsumerAppKey", createPublishingConsumerAppKey()))
    /*for (att in hpxRequest.AttributeNames) {
      hpxRequest.removeChildren(att)
    }  */

    return hpxRequest.asUTFString().replace("ns0:", "" ).replace(":ns0", "")
  }

  function createHPXBusinessOwnersPolicyRequestModel(businessOwnersPolicy : wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerPolicyType,
                                               compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType) : String {


    var hpxRequestType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType()
    var ns = new XmlNamespace("http://wservices.universalpr.com/standards/pcnew/", "")
    var hpxRequest = new XmlElement(ns.qualify("PublishDocumentRequest"), hpxRequestType)
    var policyDocumentPublish = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyDocumentPublishType()
    hpxRequestType.PublishingEngineFileKey = "PolicyCenterNA.pub"
    policyDocumentPublish.addChild(new XmlElement("BusinessOwnerPolicy", businessOwnersPolicy))
    hpxRequest.addChild(new XmlElement("PolInfoTypeRq", policyDocumentPublish))
    hpxRequestType.CompositionUnit.addChild(new XmlElement("CompositionUnit", compositionUnit))
    hpxRequestType.Transaction = "Policy Business Owners"
    hpxRequest.addChild(new XmlElement("PublishingConsumerAppKey", createPublishingConsumerAppKey()))
    return hpxRequest.asUTFString().replace("ns0:", "" ).replace(":ns0", "")
  }

  function createHPXCommercialPackagePolicyRequestModel(commercialPackagePolicy : wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackagePolicyType,
                                                     compositionUnit : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType) : String {

    var hpxRequestType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishDocumentRequestType()
    var ns = new XmlNamespace("http://wservices.universalpr.com/standards/pcnew/", "")
    var hpxRequest = new XmlElement(ns.qualify("PublishDocumentRequest"), hpxRequestType)
    var policyDocumentPublish = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyDocumentPublishType()
    hpxRequestType.PublishingEngineFileKey = "PolicyCenterNA.pub"
    policyDocumentPublish.addChild(new XmlElement(commercialPackagePolicy))
    hpxRequest.addChild(new XmlElement("PolInfoTypeRq", policyDocumentPublish))
    hpxRequestType.CompositionUnit.addChild(new XmlElement("CompositionUnit", compositionUnit))
    hpxRequestType.Transaction = "Policy Commercial Package"
    hpxRequest.addChild(new XmlElement("PublishingConsumerAppKey", createPublishingConsumerAppKey()))
    return hpxRequest.asUTFString().replace("ns0:", "" ).replace(":ns0", "")
  }

  function createPublishingConsumerAppKey() : wsi.schema.una.hpx.hpx_application_request.types.complex.PublishingConsumerAppKeyType {
    var publishingConsumerAppKey = new wsi.schema.una.hpx.hpx_application_request.types.complex.PublishingConsumerAppKeyType()
    publishingConsumerAppKey.AppKeyCd = "a"
    publishingConsumerAppKey.AppKeyDesc = "String"
    return publishingConsumerAppKey
  }
}