package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingPolicyMapper extends HPXPolicyMapper {

  function createDwellingPolicy(policyPeriod : PolicyPeriod,
                                coverage : wsi.schema.una.hpx.hpx_application_request.Coverage) : wsi.schema.una.hpx.hpx_application_request.DwellingPolicy
  {
    var dwellingPolicy = new wsi.schema.una.hpx.hpx_application_request.DwellingPolicy()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    dwellingPolicy.addChild(createPolicySummaryInfo(policyPeriod))
    dwellingPolicy.addChild(createInsuredOrPrincipal(policyPeriod))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      dwellingPolicy.addChild(additionalNamedInsured)
    }
    dwellingPolicy.addChild(createDwellingLineBusiness(policyPeriod, coverage))
    dwellingPolicy.addChild(createPolicyDetails(policyPeriod))
    return dwellingPolicy
  }

  function createDwellingLineBusiness(policyPeriod : PolicyPeriod,
                                      coverage : wsi.schema.una.hpx.hpx_application_request.Coverage) : wsi.schema.una.hpx.hpx_application_request.DwellingLineBusiness {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.DwellingLineBusiness()
    dwellingLineBusiness.addChild(createDwell(policyPeriod, coverage))
    return dwellingLineBusiness
  }

  /************************************** Dwell  ******************************************************/
  function createDwell(policyPeriod : PolicyPeriod,
                       coverage : wsi.schema.una.hpx.hpx_application_request.Coverage) : wsi.schema.una.hpx.hpx_application_request.Dwell {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests(policyPeriod.HomeownersLine_HOE.Dwelling.AdditionalInterestDetails)
    var loc = createLocation(policyPeriod)
    for (additionalInterest in additionalInterests) {
      loc.addChild(additionalInterest)
    }
    var dwellMapper = new HPXDwellMapper()
    var dwell = dwellMapper.createDwell(policyPeriod)
    dwell.addChild(loc)
    dwell.addChild(coverage)
    return dwell
  }
}