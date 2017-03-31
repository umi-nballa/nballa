package una.enhancements.productmodel
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/28/17
 * Time: 8:39 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADwellingCovEnhancement : entity.DwellingCov_HOE {
  property get IsBaseCoverage() : boolean{
    var result : boolean

    if(this.Dwelling.HOPolicyType == TC_HO4){
      result = this.PatternCode == this.Dwelling.PersonalPropertyLimitCovTerm.Clause.Pattern.CodeIdentifier
    }else{
      result = this.PatternCode == this.Dwelling.DwellingLimitCovTerm.Clause.Pattern.CodeIdentifier
    }

    return result
  }
}
