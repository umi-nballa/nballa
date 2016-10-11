package una.integration.mapping.hpx.homeowners

uses java.util.List
uses java.util.List
uses java.util.List
uses una.integration.mapping.hpx.common.HPXAdditionalNameInsuredMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXProducerMapper
uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXAdditionalInterestMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper
uses gw.xml.XmlElement
uses wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyCancelReinstateType
uses una.integration.mapping.hpx.common.HPXAdditionalInsuredMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingPolicyMapper extends HPXPolicyMapper {

  function createDwellingPolicy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellingPolicyType
  {
    var dwellingPolicy = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellingPolicyType()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    var additionalInsuredMapper = new HPXAdditionalInsuredMapper()
    var locationMapper = new HPXLocationMapper()
    var producerMapper = new HPXProducerMapper()
    dwellingPolicy.addChild(new XmlElement("PolicySummaryInfo", createPolicySummaryInfo(policyPeriod)))
    dwellingPolicy.addChild(new XmlElement("InsuredOrPrincipal", createInsuredOrPrincipal(policyPeriod)))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      dwellingPolicy.addChild(new XmlElement("InsuredOrPrincipal", additionalNamedInsured))
    }
    var additionalInsureds = additionalInsuredMapper.createAdditionalInsureds(policyPeriod)
    for (additionalInsured in additionalInsureds) {
      dwellingPolicy.addChild(new XmlElement("InsuredOrPrincipal", additionalInsured))
    }
    dwellingPolicy.addChild(new XmlElement("DwellingLineBusiness", createDwellingLineBusiness(policyPeriod)))
    dwellingPolicy.addChild(new XmlElement("PolicyInfo", createPolicyDetails(policyPeriod)))
    dwellingPolicy.addChild(new XmlElement("Producer", producerMapper.createProducer(policyPeriod)))
    dwellingPolicy.addChild(new XmlElement("Location", locationMapper.createBillingLocation(policyPeriod)))
    // TODO  - PolicyCancelReinstateType
    //dwellingPolicy.addChild(new XmlElement("PolicyCancelReinstate", new PolicyCancelReinstateType()))
    return dwellingPolicy
  }

  function createDwellingLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellingLineBusinessType {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellingLineBusinessType()
    dwellingLineBusiness.addChild(new XmlElement("Dwell", createDwell(policyPeriod)))
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    var discounts = createDiscounts(policyPeriod)
    for (discount in discounts) {
      dwellingLineBusiness.addChild(new XmlElement("Discount", discount))
    }
    return dwellingLineBusiness
  }

  /************************************** Dwell  ******************************************************/
  function createDwell(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var locationMapper = new HPXLocationMapper()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests(policyPeriod.HomeownersLine_HOE.Dwelling.AdditionalInterestDetails)
    var loc = locationMapper.createLocation(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation)
    for (additionalInterest in additionalInterests) {
      loc.addChild(new XmlElement("AdditionalInterest", additionalInterest))
    }
    var dwellMapper = new HPXDwellMapper()
    var dwellConstructionMapper = new HPXHODwellConstructionMapper ()
    var dwell = dwellMapper.createDwell(policyPeriod)
    dwell.addChild(new XmlElement("Construction", dwellConstructionMapper.createDwellConstruction(policyPeriod)))
    dwell.addChild(new XmlElement("Location", loc))
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var transactions = policyPeriod.HOTransactions
    var covs = createCoveragesInfo(policyPeriod, getCoverages(policyPeriod), getCoverages(previousPeriod))
    for (cov in covs) {
      dwell.addChild(new XmlElement("Coverage", cov))
    }
    return dwell
  }

  function createCoveragesInfo(policyPeriod : PolicyPeriod, currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXDwellingCoverageMapper()
    for (cov in currentCoverages) {
      var hoTransactions = getTransactions(policyPeriod)
      var trxs = hoTransactions.where( \ elt -> cov.PatternCode.equals(elt.HomeownersCost.Coverage.PatternCode))
      if (previousCoverages != null) {
        var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(cov.PatternCode))
        coverages.add(coverageMapper.createCoverageInfo(cov, previousCoverage, trxs))
      } else {
        coverages.add(coverageMapper.createCoverageInfo(cov, null, trxs))
      }
    }
    return coverages
  }

  function createDiscounts(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType> {
    var discounts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType>()
    var allOtherCosts : List<HomeownersCost_HOE>
    var lineLevelCosts = policyPeriod.AllCosts.where( \ elt -> elt typeis HomeownersLineCost_EXT)
    var discnts = lineLevelCosts.where( \ elt -> (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGE or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_AFFINITYDISCOUNT or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNT or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_HIGHERALLPERILDEDUCTIBLE or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_CONCRETETILEROOFDISCOUNT or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGE or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_GATEDCOMMUNITYDISCOUNT or
                                                        (elt as HomeownersLineCost_EXT).HOCostType == typekey.HOCostType_Ext.TC_PRIVATEFIRECOMPANYDISCOUNT)
    for (cost in discnts) {
      var discount = new wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType()
      discount.DiscountDescription = cost.DisplayName
      discount.DiscountAmount.Amt = cost.ActualTermAmount.Amount
      discounts.add(discount)
    }
    return discounts
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return policyPeriod.HomeownersLine_HOE.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<HOTransaction_HOE> {
    return policyPeriod.HOTransactions
  }
}