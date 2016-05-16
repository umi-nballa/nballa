package gw.lob.ho
/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/16/16
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement CovTermEnhancement_Ext : gw.api.domain.covterm.CovTerm {

  @Param("holine", "The current homeowners instance")
  @Param("option", "The deductible option which availability is going to be evaluated")
  @Returns("The availability of the received option")
  static function isMedPayOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _holine: entity.HomeownersLine_HOE) : boolean {
    var state = _holine.Branch.BaseState
    var policyType = _holine.HOPolicyType
    var isHO3HO4HO6 = policyType == typekey.HOPolicyType_HOE.TC_HO3 or policyType == typekey.HOPolicyType_HOE.TC_HO4 or policyType == typekey.HOPolicyType_HOE.TC_HO6
    var isHOAHOBHCONB = policyType == typekey.HOPolicyType_HOE.TC_HOA_EXT or policyType == typekey.HOPolicyType_HOE.TC_HOB_EXT or policyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT
    var personalLiabilityLimit = _holine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value
    var specificStatesGreater100kLiabilityLimit = ((state == TC_AZ or state == TC_FL or state == TC_CA or state == TC_NV or state == TC_TX)
        and personalLiabilityLimit > 100000bd and (isHO3HO4HO6 or isHOAHOBHCONB))
    var  HIwith300KLiability = (isHO3HO4HO6 and personalLiabilityLimit == 300000bd)
    var  HIwith500KLiability = (isHO3HO4HO6 and personalLiabilityLimit == 500000bd)

    switch (_option.OptionCode) {
        case "1000":
        case "2000":
        case "2500":
        case "4000_Ext":
        case "10000" :
            if (specificStatesGreater100kLiabilityLimit)
              return false
            break
        case "3000":
            if (specificStatesGreater100kLiabilityLimit or HIwith500KLiability)
              return false
            break
        case "5000":
            if (HIwith300KLiability)
              return false
            break

        default:
            break

      }
    return true
  }



}
