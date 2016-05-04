package una.pcf_gs

uses gw.web.productmodel.ProductModelSyncIssuesHandler
/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/3/16
 * Time: 8:55 AM
 * To change this template use File | Settings | File Templates.
 */
class CovTermPOCHOEInputSet {

  // Sen Pitchaimuthu: Added onchange function to calculate the Other Structure, Personal Property and Loss of use
  // coverages based on Dwelling Coverage
  static function onchange(_coverable: Coverable, _covTerm: gw.api.domain.covterm.CovTerm)
  {
    var dwelling = _coverable as Dwelling_HOE
    if(dwelling.PolicyPeriod.HomeownersLine_HOEExists and dwelling.PolicyPeriod.HomeownersLine_HOE.HOPolicyType ==
        typekey.HOPolicyType_HOE.TC_HO6
        and _covTerm.PatternCode == "HODW_Dwelling_Limit_HOE")  {
      var value = _covTerm.ValueAsString == null ? 0.0bd : _covTerm.ValueAsString.toBigDecimal()
      _covTerm.setValueFromString(value?.setScale(0, java.math.RoundingMode.DOWN) as java.lang.String)
    }
    else  {
        dwelling.PolicyPeriod.editIfQuoted()
        ProductModelSyncIssuesHandler.syncCoverages(dwelling.PolicyPeriod.Lines*.AllCoverables, null)

        switch(_covTerm.PatternCode) {
        case "HODW_Dwelling_Limit_HOE":
              dwelling.HODW_Dwelling_Cov_HOE.setDwellingDefaultLimits_Ext()
              break
        default:
              break;
        }
        }
    }
}