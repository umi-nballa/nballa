package una.enhancements.productmodel

uses gw.api.domain.covterm.CovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.DirectCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/20/17
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNACoverageEnhancement : entity.Coverage {

  public property get LimitTerm() : CovTerm{
    var result : CovTerm

    switch(this.PatternCode){
      case "HODW_Dwelling_Cov_HOE":
        result = this.CovTerms.singleWhere(\ term -> term.PatternCode == "HODW_Dwelling_Limit_HOE")
        break
      case "DPDW_Dwelling_Cov_HOE":
        result = this.CovTerms.singleWhere(\ term -> term.PatternCode == "DPDW_Dwelling_Limit_HOE")
        break
      case "HODW_Other_Structures_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "HODW_OtherStructures_Limit_HOE")
        break
      case "DPDW_Other_Structures_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "DPDW_OtherStructuresLimit_HOE")
        break
      case "HODW_Personal_Property_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "HODW_PersonalPropertyLimit_HOE")
        break
      case "DPDW_Personal_Property_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "DPDW_PersonalPropertyLimit_HOE")
        break
      case "HODW_Loss_Of_Use_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "HODW_LossOfUseDwelLimit_HOE")
        break
      case "DPDW_FairRentalValue_Ext":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "DPDW_FairRentalValue_Ext")
        break
      case "HOLI_Personal_Liability_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "HOLI_Liability_Limit_HOE")
        break
      case "DPLI_Personal_Liability_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "DPLI_LiabilityLimit_HOE")
        break
      case "HOLI_Med_Pay_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "HOLI_MedPay_Limit_HOE")
        break
      case "DPLI_Med_Pay_HOE":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "DPLI_MedPay_Limit_HOE")
        break
      case "DPLI_Premise_Liability_HOE_Ext":
        result = this.CovTerms.singleWhere( \ term -> term.PatternCode == "DPLI_Premise_LiabilityLimit_HOE")
        break
    }

    return result
  }

  //returns a cost (for increased limit), if any
  public property get Cost() : Cost{
    var result : Cost
    var line = this.OwningCoverable.PolicyLine

    if(line typeis HomeownersLine_HOE){
      if(this.PatternCode == "HODW_SectionI_Ded_HOE"){
        result = line.Branch.AllCosts?.where( \ c -> (c typeis HomeownersLineCost_EXT) and typekey.HOCostType_Ext.TF_SECTIONIDEDCOSTS.TypeKeys.contains(c.HOCostType))?.orderByDescending( \ c -> c.ID).first()
      }else{
        result = line.Branch.AllCosts?.where( \ c -> (c as HomeownersCost_HOE).Coverage == this)?.orderByDescending( \ c -> c.ID)?.first()
      }
    }

    return result
  }
}
