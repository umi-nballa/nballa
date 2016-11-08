package una.integration.mapping.hpx.commercialpackage.generalliability

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper
uses gw.lang.reflect.IType
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper
uses una.integration.mapping.hpx.common.HPXExclusionMapper
uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXGLPolicyMapper extends HPXPolicyMapper {

  function createGeneralLiabilityLineCoverages(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createLineCoverages(policyPeriod, policyPeriod.GLLine)
  }

  function createGeneralLiabilityLineExclusions(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createLineExclusions(policyPeriod, policyPeriod.GLLine)
  }

  function createGeneralLiabilityLinePolicyConditions(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createLinePolicyConditions(policyPeriod, policyPeriod.GLLine)
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
      return policyPeriod.GLLine.AllCoverages
  }

  override function getExclusions(policyPeriod: PolicyPeriod): List<Exclusion> {
    return policyPeriod.GLLine.AllExclusions
  }

  override function getPolicyConditions(policyPeriod: PolicyPeriod): List<PolicyCondition> {
    return policyPeriod.GLLine.AllConditions
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
      return policyPeriod.GLTransactions
  }


  function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case GLCost:
        result = cost.Coverage
        break
      case GLCovCost:
          result = cost.Coverage
          break
      case GLCovExposureCost:
          result = cost.Coverage
          break
      case GLAddlInsuredCost:
          result = cost.Coverage
          break
      case GLStateCost:
          result = cost.Coverage
          break
    }

    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXGLCoverageMapper()
  }

  override function getStructureMapper() : HPXStructureMapper {
    return null
  }

  override function getClassificationMapper() : HPXClassificationMapper {
    return null
  }

  override function getExclusionMapper() : HPXExclusionMapper {
    return new HPXGLExclusionMapper()
  }

  override function getPolicyConditionMapper() : HPXPolicyConditionMapper {
    return new HPXGLPolicyConditionMapper()
  }

  override function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable> {
    return null
  }

  override function getLocation(coverable : Coverable) : PolicyLocation {
    return null
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

  override  function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override  function getStructureExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override  function getStructurePolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override  function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getScheduleTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
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

  override function getAdditionalInterests(coverable : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType> {
    return null
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return policyPeriod.GLLine
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    var lineCovs = (line as GLLine).CoveragesFromCoverable
    return lineCovs
  }

  override function getLineExclusions(line : Coverable) : java.util.List<Exclusion> {
    var glLineExcls = (line as GLLine).ExclusionsFromCoverable
    var cpLineExcls = line?.PolicyLine?.AssociatedPolicyPeriod.CPLine.ExclusionsFromCoverable
    return glLineExcls?.union(cpLineExcls)?.toList()
  }

  override function getLinePolicyConditions(line : Coverable) : java.util.List<PolicyCondition> {
    var lineConds = (line as GLLine).ConditionsFromCoverable
    return lineConds
  }

  override function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }

  override function getCostType(cost : Cost) :  String {
    return null
  }

  override function getDiscountCostTypes() : String[] {
    return null
  }
}