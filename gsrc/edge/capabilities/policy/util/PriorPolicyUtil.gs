package edge.capabilities.policy.util

uses edge.capabilities.quote.draft.dto.BaseTunaValueUtil
uses java.lang.UnsupportedOperationException
uses gw.api.util.DateUtil
uses edge.capabilities.policy.dto.PriorPolicyDTO

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/10/17
 * Time: 11:46 AM
 * To change this template use File | Settings | File Templates.
 */
class PriorPolicyUtil extends BaseTunaValueUtil{
    private static final var PORTAL_INDEX_FIELD_NAME = "PortalIndex"
    construct() {
      throw new UnsupportedOperationException("This is an utility class.")
    }

    /**
     * TECH DEBT - Coding this to target prior policy added through the portal.  Portal can only pass in one prior policy.
     * Therefore, we should only pass one prior policy.  This is not future proof and will need
     * to be modify if the portal ever decides that they want to be able to add more than one prior policy.  Yes this code
     * sucks but portal devs and management not willing to conform to using public ids.  Lets hope that if UNA ever
     * decides to capture more than one prior policy through portal that they switch to using public ids.
     */
    public static function fillBaseProperties(policyPeriod : PolicyPeriod) : PriorPolicyDTO{
      var results : List<PriorPolicyDTO> = {}
      for(priorPolicy in policyPeriod.Policy.PriorPolicies.where( \ pp -> pp.FromPortal == true)){
        var priorPolicyDTO = new PriorPolicyDTO()
        priorPolicyDTO.CarrierType = priorPolicy.CarrierType
        priorPolicyDTO.CarrierOther = priorPolicy.Carrier
        priorPolicyDTO.ExpirationDate = priorPolicy.ExpirationDate
        priorPolicyDTO.PolicyNumber = priorPolicy.PolicyNumber
        priorPolicyDTO.ReasonNoPriorInsurance = priorPolicy.ReasonNoPriorIns_Ext
        priorPolicyDTO.Tenure = priorPolicy.Tenure_Ext
        results.add(priorPolicyDTO)
      }
      return results[0]
    }

    /**
     * TECH DEBT - Coding this to target prior policy added through the portal.  Portal can only pass in one prior policy.
     * This should preserve any prior policy that didn't come through the portal.  This is not future proof and will need
     * to be modify if the portal ever decides that they want to be able to add more than one prior policy.  Yes this code
     * sucks but portal devs and management not willing to conform to using public ids.  Lets hope that if UNA ever
     * decides to capture more than one prior policy through portal that they switch to using public ids.
     */
    public static function updateFrom(policyPeriod : PolicyPeriod, dto : PriorPolicyDTO) {
      var priorPoliciesAddedThroughPortal = policyPeriod.Policy.PriorPolicies.where( \ pp -> pp.FromPortal == true)

      if(dto == null && !priorPoliciesAddedThroughPortal.IsEmpty){
        priorPoliciesAddedThroughPortal[0].remove()
      }

      if(priorPoliciesAddedThroughPortal.IsEmpty){
        policyPeriod.Policy.addToPriorPolicies(createPriorPolicy(dto))
      }else{
        for(priorPolicy in priorPoliciesAddedThroughPortal){
          updatePriorPolicy(priorPolicy,dto)
        }
      }
    }

    private static function updatePriorPolicy(priorPolicy : PriorPolicy, dto : PriorPolicyDTO){
      priorPolicy.CarrierType = dto.CarrierType
      priorPolicy.Carrier = dto.CarrierOther
      priorPolicy.PolicyNumber = dto.PolicyNumber
      priorPolicy.ExpirationDate = dto.ExpirationDate
      priorPolicy.Tenure_Ext = dto.Tenure
      priorPolicy.ReasonNoPriorIns_Ext = dto.ReasonNoPriorInsurance
    }

    private static function createPriorPolicy(dto : PriorPolicyDTO) : PriorPolicy{
      var priorPolicy = new PriorPolicy()
      priorPolicy.ExpirationDate = dto.ExpirationDate
      priorPolicy.CarrierType = dto.CarrierType
      priorPolicy.Carrier = dto.CarrierOther
      priorPolicy.Tenure_Ext = dto.Tenure
      priorPolicy.ReasonNoPriorIns_Ext = dto.ReasonNoPriorInsurance
      priorPolicy.PolicyNumber = dto.PolicyNumber
      //defaulting effective date since UNA is not capturing this at the moment and OOTB functionality requires this to not be null
      priorPolicy.EffectiveDate = DateUtil.currentDate()
      priorPolicy.FromPortal = true
      return priorPolicy
    }
}