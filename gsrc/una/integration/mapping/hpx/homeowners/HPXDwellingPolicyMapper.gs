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
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper

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
    //dwellingLineBusiness.addChild(new XmlElement("Dwell", createDwell(policyPeriod)))
    var structures = createStructuresInfo(policyPeriod)
    for (struct in structures) {
      dwellingLineBusiness.addChild(new XmlElement("Dwell", struct))
    }
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

  /************************************** Dwell  *****************************************************
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
    //dwell.addChild(new XmlElement("Location", loc))
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var transactions = policyPeriod.HOTransactions
    var covs = createCoveragesInfo(getCoverages(policyPeriod), getCoverages(previousPeriod), getTransactions(policyPeriod), getTransactions(previousPeriod))
    for (cov in covs) {
      dwell.addChild(new XmlElement("Coverage", cov))
    }
    return dwell
  }
  ***/
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

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage
    switch(typeof cost){
      case HomeownersLineCost_EXT:
          result = cost.Coverage
          break
      case DwellingCovCost_HOE:
          result = cost.Coverage
          break
    }
    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXDwellingCoverageMapper()
  }

  override function getStructureMapper() : HPXStructureMapper {
    return new HPXDwellMapper()
  }

  override function getClassificationMapper() : HPXClassificationMapper {
    return null
  }

  override function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable> {
    var structures = new java.util.ArrayList<Coverable>()
    var dwelling = policyPeriod.HomeownersLine_HOE.Dwelling
    structures.add(dwelling)
    return structures
  }

  override function getLocation(coverable : Coverable) : PolicyLocation {
    return (coverable as Dwelling_HOE).HOLocation.PolicyLocation
  }

  override function getLocationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override  function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override  function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }

  override function getClassifications(coverable : Coverable) : java.util.List<BP7Classification> {
    return null
  }

  override function getClassificationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getClassificationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getAdditionalInterests(coverable : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType> {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests((coverable as Dwelling_HOE).AdditionalInterestDetails)
    return additionalInterests
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return policyPeriod.HomeownersLine_HOE
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    var lineCovs = (line as HomeownersLine_HOE).CoveragesFromCoverable //.where( \ elt -> (elt.OwningCoverable as HomeownersLine_HOE) == line)
    return lineCovs
  }

  override function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }
}