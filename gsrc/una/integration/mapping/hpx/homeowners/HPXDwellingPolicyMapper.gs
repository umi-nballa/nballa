package una.integration.mapping.hpx.homeowners

uses java.util.List
uses java.util.List
uses java.util.List
uses una.integration.mapping.hpx.common.HPXAdditionalNameInsuredMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXProducerMapper
uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXAdditionalInterestMapper
uses una.integration.mapping.hpx.helper.HPXPolicyPeriodHelper
uses gw.xml.XmlElement
uses wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyCancelReinstateType
uses una.integration.mapping.hpx.common.HPXAdditionalInsuredMapper
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper
uses una.integration.mapping.hpx.common.HPXPrimaryNamedInsuredMapper
uses una.integration.mapping.hpx.common.HPXExclusionMapper
uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper
uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.util.ArrayList
uses una.integration.mapping.hpx.helper.HPXRatingHelper
uses una.integration.mapping.hpx.helper.HPXInsuranceScoreRatingHelper

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
    var primaryNamedInsuredMapper = new HPXPrimaryNamedInsuredMapper()
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
    var structures = createStructuresInfo(policyPeriod)
    for (struct in structures) {
      dwellingLineBusiness.addChild(new XmlElement("Dwell", struct))
    }
    var lineCovs = createLineCoverages(policyPeriod, policyPeriod.HomeownersLine_HOE)
    for (lineCov in lineCovs) {
      dwellingLineBusiness.addChild(new XmlElement("Coverage", lineCov))
    }
    var lineExcls = createLineExclusions(policyPeriod, policyPeriod.HomeownersLine_HOE)
    for (lineExcl in lineExcls) {
      dwellingLineBusiness.addChild(new XmlElement("Coverage", lineExcl))
    }
    var lineConds = createLinePolicyConditions(policyPeriod, policyPeriod.HomeownersLine_HOE)
    for (lineCond in lineConds) {
      dwellingLineBusiness.addChild(new XmlElement("Coverage", lineCond))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    var discounts = createDiscounts(policyPeriod)
    for (discount in discounts) {
      dwellingLineBusiness.addChild(new XmlElement("Discount", discount))
    }
    var estimatedDiscounts = createEstimatedDiscounts(policyPeriod)
    for (discount in estimatedDiscounts) {
      dwellingLineBusiness.addChild(new XmlElement("EstimatedDiscount", discount))
    }
    return dwellingLineBusiness
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return policyPeriod.HomeownersLine_HOE.AllCoverages
  }

  override function getExclusions(policyPeriod: PolicyPeriod): List<Exclusion> {
    return policyPeriod.HomeownersLine_HOE.AllExclusions
  }

  override function getPolicyConditions(policyPeriod: PolicyPeriod): List<PolicyCondition> {
    return policyPeriod.HomeownersLine_HOE.AllConditions
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<HOTransaction_HOE> {
    return policyPeriod.HOTransactions
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

  override function getExclusionMapper() : HPXExclusionMapper {
    return new HPXDwelllingExclusionMapper()
  }

  override function getPolicyConditionMapper() : HPXPolicyConditionMapper {
    return new HPXDwelllingPolicyConditionMapper()
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

  override function getLocationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override function getLocationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod)?.where( \ elt -> elt.OwningCoverable.FixedId == coverable.FixedId)
  }

  override function getStructureExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return getExclusions(policyPeriod)?.where( \ elt -> elt.OwningCoverable.FixedId == coverable.FixedId)
  }

  override function getStructurePolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return getPolicyConditions(policyPeriod)?.where( \ elt -> elt.OwningCoverable.FixedId == coverable.FixedId)
  }

  override function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<HOTransaction_HOE> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable.FixedId == coverable.FixedId)
    transactions.addAll((getScheduleTransactions(policyPeriod, coverable).toList()))
    return transactions
  }

  override function getScheduleTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<HOTransaction_HOE> {
    return getTransactions(policyPeriod)?.where( \ elt -> elt.Cost typeis ScheduleCovCost_HOE)
  }

  override function getClassifications(coverable : Coverable) : java.util.List<BP7Classification> {
    return null
  }

  override function getClassificationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getClassificationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override function getClassificationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override function getClassificationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getAdditionalInterests(coverable : Coverable) : AddlInterestDetail [] {
    var additionalInterests = (coverable as Dwelling_HOE).AdditionalInterestDetails
    return additionalInterests
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return policyPeriod.HomeownersLine_HOE
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    var lineCovs = (line as HomeownersLine_HOE).CoveragesFromCoverable
    return lineCovs
  }

  override function getLineExclusions(line : Coverable) : java.util.List<Exclusion> {
    var lineExcls = (line as HomeownersLine_HOE).ExclusionsFromCoverable
    return lineExcls
  }

  override function getLinePolicyConditions(line : Coverable) : java.util.List<PolicyCondition> {
    var lineConds = (line as HomeownersLine_HOE).AllConditions
    return lineConds
  }

  override function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable.FixedId == coverable.FixedId)
    return transactions
  }

  override function getCostType(cost : Cost) :  String {
    var costType : String = null
    if (cost typeis HomeownersLineCost_EXT) {
      costType = (cost as HomeownersLineCost_EXT).HOCostType
    }
    return costType
  }

  override function getDiscountCostTypes() : String[] {
    var discountTypeKeys = {
        typekey.HOCostType_Ext.TC_AFFINITYDISCOUNT,
        typekey.HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNT,
        typekey.HOCostType_Ext.TC_HIGHERALLPERILDEDUCTIBLE,
        typekey.HOCostType_Ext.TC_CONCRETETILEROOFDISCOUNT,
        typekey.HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGE,
        typekey.HOCostType_Ext.TC_GATEDCOMMUNITYDISCOUNT,
        typekey.HOCostType_Ext.TC_PRIVATEFIRECOMPANYDISCOUNT
    }
    return discountTypeKeys
  }

  override function getEstimatedDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var estimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    var jurisdictionState = policyPeriod.BaseState
    var ratingHelper = new HPXInsuranceScoreRatingHelper()
    switch (jurisdictionState) {
      case typekey.Jurisdiction.TC_SC :
          estimatedDiscounts.add(ratingHelper.getSouthCarolinaMaximumInsuranceScoreDiscount(policyPeriod))
          estimatedDiscounts.add(ratingHelper.getSouthCarolinaMaximumInsuranceScoreSurcharge(policyPeriod))
        break
      case typekey.Jurisdiction.TC_NV :
          estimatedDiscounts.add(ratingHelper.getNevadaMaximumInsuranceScoreDiscount(policyPeriod))
          estimatedDiscounts.add(ratingHelper.getNevadaMaximumInsuranceScoreSurcharge(policyPeriod))
        break
    }
    return estimatedDiscounts
  }
}