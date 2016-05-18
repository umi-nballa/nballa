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
    var  HIwith300KLiability = (state == TC_HI and isHO3HO4HO6 and personalLiabilityLimit == 300000bd)
    var  HIwith500KLiability = (state == TC_HI and isHO3HO4HO6 and personalLiabilityLimit == 500000bd)

    switch (_option.OptionCode) {
        case "1000":
            if (personalLiabilityLimit > 100000bd)
              return false
            break
        case "2000":
            if (specificStatesGreater100kLiabilityLimit or (state == TC_NC and personalLiabilityLimit == 100000bd))
              return false
            break
      case "4000":
          if (personalLiabilityLimit == 100000bd)
            return false
          break
      case "3000":
            if ((state == TC_HI and personalLiabilityLimit != 300000bd) or (state == TC_NC and personalLiabilityLimit == 100000bd))
              return false
            break
        case "5000":
            if (HIwith300KLiability or (state == TC_NC and personalLiabilityLimit == 100000bd))
              return false
            break
        default:
            break
      }
    return true
  }

  static function isHurricaneDedOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _dwelling: entity.Dwelling_HOE) : boolean {
    var state = _dwelling.Branch.BaseState
    var policyType = _dwelling.HOPolicyType
    var isHO3 = policyType == typekey.HOPolicyType_HOE.TC_HO3
    var isHO4 = policyType == typekey.HOPolicyType_HOE.TC_HO4
    var isHO6 = policyType == typekey.HOPolicyType_HOE.TC_HO6
    var isHOAHOBHCONB = policyType == typekey.HOPolicyType_HOE.TC_HOA_EXT or policyType == typekey.HOPolicyType_HOE.TC_HOB_EXT or policyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT
    var dwellingLimit = _dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    var personalPerpertyLimit = _dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
    var allPerilDed = _dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value

    if (state == TC_FL)
    {
      switch (_option.OptionCode) {
        case "500":
            if (allPerilDed != 500bd)
              return false
            break

        case "2":
           if (allPerilDed == 500bd or allPerilDed == 1000bd)
             return true
            if (isHO3)
           {
            if ((allPerilDed == 2500bd and dwellingLimit > 100000bd)
                or ((allPerilDed == 5000bd or allPerilDed == 7500bd) and dwellingLimit > 200000bd))
                return true
            return false
           }
           if (isHO4)
             return false
           if (isHO6 and personalPerpertyLimit >= 50000bd and personalPerpertyLimit <= 300000bd)
             return true
           else return false

        case "5":
        case "10":
            if (isHO4)
              return false
            if (isHO6 and personalPerpertyLimit >= 50000bd and personalPerpertyLimit <= 300000bd)
              return true
            if (isHO3 and dwellingLimit >= 100000bd)
              return true
            else return false
        default:
        break
    }
  }
  return true
  }
}
