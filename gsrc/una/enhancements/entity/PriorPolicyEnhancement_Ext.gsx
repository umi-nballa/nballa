package una.enhancements.entity

/**
 * Created with IntelliJ IDEA.
 * User: tmanickavachagam
 * Date: 9/25/17
 * Time: 10:36 AM
 * To change this template use File | Settings | File Templates.
 */

enhancement PriorPolicyEnhancement_Ext : entity.PriorPolicy {

  static function getValuesByFilter(policyPeriod:PolicyPeriod) :  List<typekey.CarrierType_Ext> {
    if(policyPeriod.BaseState==typekey.Jurisdiction.TC_FL) {
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6 ||
          policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_DP3_EXT)
        return typekey.CarrierType_Ext.TF_FL_HO_DP.TypeKeys
    } else if (policyPeriod.BaseState==typekey.Jurisdiction.TC_CA) {
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6 ||
          policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_DP3_EXT)
        return typekey.CarrierType_Ext.TF_CA_HO_TDP.TypeKeys
    } else if (policyPeriod.BaseState==typekey.Jurisdiction.TC_NV){
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6)
        return typekey.CarrierType_Ext.TF_NV_HO.TypeKeys
    } else if (policyPeriod.BaseState==typekey.Jurisdiction.TC_SC){
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6)
        return typekey.CarrierType_Ext.TF_SC_HO.TypeKeys
    } else if (policyPeriod.BaseState==typekey.Jurisdiction.TC_HI){
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6 ||
          policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_DP3_EXT)
        return typekey.CarrierType_Ext.TF_HI_HO_DP.TypeKeys
    } else if (policyPeriod.BaseState==typekey.Jurisdiction.TC_TX) {
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HOA_EXT || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HOB_EXT || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HCONB_EXT ||
          policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_TDP1_EXT || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_TDP2_EXT || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_TDP3_EXT){
        return typekey.CarrierType_Ext.TF_TX_HO_TDP.TypeKeys
      }
    }else if(policyPeriod.BaseState == typekey.Jurisdiction.TC_NC){
        if(policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO4 ||
            policyPeriod.HomeownersLine_HOE.HOPolicyType==HOPolicyType_HOE.TC_HO6 ||policyPeriod.HomeownersLine_HOE.HOPolicyType == HOPolicyType_HOE.TC_LPP_EXT)
              return typekey.CarrierType_Ext.TF_NC_HO_LPP.TypeKeys
    }
    if(policyPeriod.BaseState==typekey.Jurisdiction.TC_FL and policyPeriod.HomeownersLine_HOEExists=="false")
      return typekey.CarrierType_Ext.TF_FL_BOP_CRP.TypeKeys

    return null
  }

  static function CarrierReq(policyPeriod:PolicyPeriod) : boolean{
    for(pp in policyPeriod.Policy.PriorPolicies*.CarrierType)   {
      if(pp == typekey.CarrierType_Ext.TC_UNA)
        return true
    }
    return false
  }

  static function noPriorIns(policyPeriod:PolicyPeriod) : boolean{
    for(p1 in policyPeriod.Policy.PriorPolicies*.CarrierType){
      if(p1 == typekey.CarrierType_Ext.TC_NOPRIORINS)
        return true
    }
    return false
  }
}
