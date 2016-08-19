package una.integration.mapping.hpx

uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/3/16
 * Time: 8:15 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXAdditionalInterestMapper {

function createAdditionalInterests(additlInterests : AddlInterestDetail []) : List<wsi.schema.una.hpx.hpx_application_request.AdditionalInterest>  {

    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var additionalInterests = new ArrayList<wsi.schema.una.hpx.hpx_application_request.AdditionalInterest>()

    for (addtlInterest in additlInterests) {
      var additionalInterest = new wsi.schema.una.hpx.hpx_application_request.AdditionalInterest()
      additionalInterest.addChild(generalPartyInfoMapper.createGeneralPartyInfo(addtlInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact,
          addtlInterest.PolicyAddlInterest))
      additionalInterest.ItemIdInfo = dwellingPolicyMapper.createItemIdInfo()
      var additionalInterestInfo = new wsi.schema.una.hpx.hpx_application_request.AdditionalInterestInfo()

      switch (addtlInterest.AdditionalInterestType.Code) {
        case "MORTGAGEE" : additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.MORTG
            break
        case "CONSALE"   :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.CONSP
            break
        case "LENDLOSS"   :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.LENDLOSS
            break
        case "LESSOR"   :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.Lessor
            break
        case "LOSSP"   :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.LOSSP
            break
        case "LOSSPAY"   :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.LOSSPAY
            break
        case "THIRDPARTY"   :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.THIRDPARTY
            break
        default :  additionalInterestInfo.NatureInterestCd = wsi.schema.una.hpx.hpx_application_request.enums.Interest.OT
      }

      //additionalInterestInfo.Description =  (addtlInterest as HODwellingAddlInt_HOE).AddlInterestDesc
      additionalInterestInfo.Description =  addtlInterest.AdditionalInterestType.Description

      additionalInterestInfo.ContractNumber = addtlInterest.ContractNumber

      additionalInterest.addChild(additionalInterestInfo)
      additionalInterests.add(additionalInterest)
    }
    return additionalInterests
  }
}