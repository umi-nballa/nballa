package una.integration.lexisnexis.util

/**
 * Created with IntelliJ IDEA.
 * User: ptheegala
 * Date: 1/13/17
 *
 */
class ClueUtilInfo {
  static function copyClueReport(oldPeriod: PolicyPeriod, newPeriod: PolicyPeriod) {
    //Copy Clue Data
    var prevPriorLoss = oldPeriod.HomeownersLine_HOE.HOPriorLosses_Ext
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      for (res in prevPriorLoss) {
        var priorLoss = new HOPriorLoss_Ext()
        priorLoss.Bundle.add(res).HomeownersLineID = newPeriod.HomeownersLine_HOE.PublicID
      }
    }, "su")
  }

 static function calculateChargeable(claim: HOPriorLoss_Ext,
                               period: PolicyPeriod): Chargeable_Ext {
    // To Simplify the logic below , I have created may type Filters for state / Policy Types that are not chargeable
    // so the not of Type filter will be chargeable ( Since hte no of non chargeable was less hence the approach.
    // condition one all not chargeable states code
    // condition 2 new business or renewal
    // condition 3  applicable state
    //condition 4   loss cause codes
    //condition 5 claim date less than 3 years
    // condition 6 amount > 500 or 1 as per the PC.23.01.45 / Policy - Risk Analysis V1.1
    //refer the the tabs that has Clue HO / TDP / RNL Prior loss TDp / HO
    // if multiple payments for the same loss , then add the amount of all the chargeable loss to determine the flag.
    if (period.HomeownersLine_HOE.Dwelling?.HomePurchaseDate_Ext != null && claim.ClaimDate?.toDate() < period.HomeownersLine_HOE.Dwelling?.HomePurchaseDate_Ext) {
      if (typekey.State.TF_CLAIMCHARGEABLEFILTERHO.TypeKeys.hasMatch(\elt1 -> elt1.Code == period.BaseState.Code) &&
          !typekey.HOPolicyType_HOE.TF_ALLDPTDPLPP.TypeKeys.hasMatch(\elt1 -> elt1.Code == (period.HomeownersLine_HOE?.HOPolicyType) as String))
        return Chargeable_Ext.TC_NO
      else if (typekey.State.TC_FL.Code == period.BaseState.Code && typekey.HOPolicyType_HOE.TC_DP3_EXT == period.HomeownersLine_HOE?.HOPolicyType) {
        return Chargeable_Ext.TC_NO
      }
    }

    if (!(period.Job typeis Renewal) && claim.ClaimDate != null) {
      if (typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.hasMatch(\elt1 -> elt1.Code == period.HomeownersLine_HOE.HOPolicyType.Code)) {
        var amount = 0
        for (pay in claim.ClaimPayment) {
          if (period.BaseState.Code == (typekey.State.TC_HI) as String) {
            if (!typekey.LossCause_Ext.TF_HIHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
            }
          } else if (period.BaseState.Code == (typekey.State.TC_NC) as String) {
            if (typekey.LossCause_Ext.TC_LAE.Code != pay.LossCause_Ext.Code)
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
          }
          else if (period.BaseState.Code == (State.TC_TX) as String) {
              if (!typekey.LossCause_Ext.TF_TXHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
                if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                  amount += (pay.ClaimAmount?.toBigDecimal()) as int
            } else if (period.BaseState.Code == (typekey.State.TC_FL) as String) {
              if (!typekey.LossCause_Ext.TF_FLSCHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
                if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                  amount += (pay.ClaimAmount?.toBigDecimal()) as int
              }
            }
            else if (period.BaseState.Code == (typekey.State.TC_SC) as String) {
                if (!typekey.LossCause_Ext.TF_FLSCHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
                  if (period.EditEffectiveDate.addMonths(- 3).differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                    amount += (pay.ClaimAmount?.toBigDecimal()) as int
              } else if (period.BaseState.Code == (typekey.State.TC_AZ) as String || period.BaseState.Code == (typekey.State.TC_CA) as String || period.BaseState.Code == (typekey.State.TC_NE) as String){
                if (!typekey.LossCause_Ext.TF_AZCANEHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
                  if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3 && period.BaseState.Code == (typekey.State.TC_NE) as String)
                    amount += (pay.ClaimAmount?.toBigDecimal()) as int
                if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3
                    && period.BaseState.Code == (typekey.State.TC_AZ) as String || period.BaseState.Code == (typekey.State.TC_CA) as String)
                  amount += (pay.ClaimAmount?.toBigDecimal()) as int
              }
        }
        if (period.BaseState.Code == (typekey.State.TC_AZ) as String || period.BaseState.Code == (typekey.State.TC_CA) as String) {
          if (amount >= 500) return Chargeable_Ext.TC_YES
        } else {
          if (amount >= 1) return Chargeable_Ext.TC_YES
        }
      } else if (typekey.HOPolicyType_HOE.TF_ALLDPTDPLPP.TypeKeys.hasMatch(\elt1 -> elt1.Code == period.HomeownersLine_HOE.HOPolicyType.Code))  {
        var amount = 0
        for (pay in claim.ClaimPayment) {
          if (period.BaseState.Code == (typekey.State.TC_HI) as String) {
            if (!typekey.LossCause_Ext.TF_HITDPFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
            }
          } else if (period.BaseState.Code == (typekey.State.TC_NC) as String || period.BaseState.Code == (typekey.State.TC_CA) as String) {
            if (!typekey.LossCause_Ext.TF_CANCTDPFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
          }
          else if (period.BaseState.Code == (typekey.State.TC_TX) as String) {
              if (!typekey.LossCause_Ext.TF_TXTDPFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
                if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                  amount += (pay.ClaimAmount?.toBigDecimal()) as int
            } else if (period.BaseState.Code == (typekey.State.TC_FL) as String){
              if (!typekey.LossCause_Ext.TF_FLTDPFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
                if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                  amount += (pay.ClaimAmount?.toBigDecimal()) as int
              }
            }
        }
        if (amount >= 1) return Chargeable_Ext.TC_YES
      }
    }
    else if (period.Job typeis Renewal && claim.ClaimDate != null){
      // Renewal Calculation for chargeable

      if (typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.hasMatch(\elt1 -> elt1.Code == period.HomeownersLine_HOE.HOPolicyType.Code)) {
        var amount = 0
        for (pay in claim.ClaimPayment) {
          if (period.BaseState.Code == (typekey.State.TC_HI) as String || period.BaseState.Code == (typekey.State.TC_TX) as String || period.BaseState.Code == (typekey.State.TC_FL) as String ||
              period.BaseState.Code == (typekey.State.TC_AZ) as String || period.BaseState.Code == (typekey.State.TC_CA) as String) {
            if (!typekey.ExpanedLossCause_Ext.TF_RNLHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.ExpandedLossCause_Ext.Code == elt1.Code) ||
                !typekey.LossCause_Ext.TF_RNLFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
            }
          } else if (period.BaseState.Code == (typekey.State.TC_NC) as String) {
            if (!typekey.ExpanedLossCause_Ext.TF_RNLNCHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.ExpandedLossCause_Ext.Code == elt1.Code) ||
                !typekey.LossCause_Ext.TF_RNLFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
          } else if (period.BaseState.Code == (typekey.State.TC_SC) as String){
            if (!typekey.ExpanedLossCause_Ext.TF_RNLHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code) ||
                !typekey.LossCause_Ext.TF_RNLFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code))
              if (period.EditEffectiveDate.addMonths(- 3).differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
          }
        }
        if (period.BaseState.Code == (typekey.State.TC_AZ) as String || period.BaseState.Code == (typekey.State.TC_CA) as String) {
          if (amount >= 500) return Chargeable_Ext.TC_YES
        } else {
          if (amount >= 1) return Chargeable_Ext.TC_YES
        }
      } else if (typekey.HOPolicyType_HOE.TF_ALLDPTDPLPP.TypeKeys.hasMatch(\elt1 -> elt1.Code == period.HomeownersLine_HOE.HOPolicyType.Code))  {

        var amount = 0
        for (pay in claim.ClaimPayment) {
          if (period.BaseState.Code == (typekey.State.TC_HI) as String || period.BaseState.Code == (typekey.State.TC_NC) as String || period.BaseState.Code == (typekey.State.TC_FL) as String ||
              period.BaseState.Code == (typekey.State.TC_TX) as String) {
            if (!typekey.ExpanedLossCause_Ext.TF_RNLHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.ExpandedLossCause_Ext.Code == elt1.Code) ||
                !typekey.LossCause_Ext.TF_RNLFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
            }
          } else if (period.BaseState.Code == (typekey.State.TC_CA) as String){
            if (!typekey.ExpanedLossCause_Ext.TF_RNLNCHOFILTER.TypeKeys.hasMatch(\elt1 -> pay.ExpandedLossCause_Ext.Code == elt1.Code) ||
                typekey.ExpanedLossCause_Ext.TC_MOLD_FLOODRELATED != pay.ExpandedLossCause_Ext ||
                !typekey.LossCause_Ext.TF_RNLFILTER.TypeKeys.hasMatch(\elt1 -> pay.LossCause_Ext.Code == elt1.Code)){
              if (period.EditEffectiveDate.differenceInYears(claim.ClaimDate?.toDate()) <= 3)
                amount += (pay.ClaimAmount?.toBigDecimal()) as int
            }
          }
          if (period.BaseState.Code == (typekey.State.TC_CA) as String) {
            if (amount >= 500) return Chargeable_Ext.TC_YES
          } else {
            if (amount >= 1) return Chargeable_Ext.TC_YES
          }
        }
      }
    }

    return Chargeable_Ext.TC_NO
  }


}