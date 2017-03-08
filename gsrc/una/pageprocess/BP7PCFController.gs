package una.pageprocess

uses gw.api.web.job.JobWizardHelper
uses gw.api.productmodel.ClausePattern
uses java.math.BigDecimal
uses gw.api.domain.covterm.CovTerm

/**
 * Created with IntelliJ IDEA.
 * User: tmanickam
 * Date: 10/26/16
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */
class BP7PCFController {
  private var _jobWizardHelper : JobWizardHelper
  private var _bp7Line:BP7BusinessOwnersLine

  construct(jobWizardHelper : JobWizardHelper, bp7Line : BP7BusinessOwnersLine){
    this._jobWizardHelper = jobWizardHelper
    this._bp7Line = bp7Line
  }

  static function prodsCompletedOpsCovTermActions(line:BP7BusinessOwnersLine){
    for(building in line.AllBuildings){
      if(building.BP7ExclusionProductsCompletedOpernsUnrelatedtoBuilOwners_EXTExists){
        line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.setValueFromString("Excluded_EXT")
      }else{
        line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.setValueFromString("Included_EXT")
      }
    }
  }

  static function removeProductsCompletedOpernsUnrelatedtoBuilOwnersExcl(bp7Building:BP7Building){
    if(bp7Building.PredominentOccType_Ext != typekey.BP7PredominentOccType_Ext.TC_BUILDINGOWNER || bp7Building.PredominentOccType_Ext != typekey.BP7PredominentOccType_Ext.TC_BOOCCUPANT ||
        bp7Building.PredominentOccType_Ext != typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMASSOCIATION || bp7Building.PredominentOccType_Ext != typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMUNITOWNER &&
          !bp7Building.BP7ExclusionProductsCompletedOpernsUnrelatedtoBuilOwners_EXTExists){
          (bp7Building.PolicyLine as BP7BusinessOwnersLine).BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.setValueFromString("Included_EXT")
    }
  }

  static function infoMessage(line:BP7BusinessOwnersLine,jobWizardHelper : JobWizardHelper, openForEdit:boolean){
    if(line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Excluded_EXT") && openForEdit)
      jobWizardHelper.addInfoWebMessage(displaykey.una.productmodel.validation.ProductsCompletedOpsMessage)
  }

  static function dataCompromiseCoverageRestriction(coverable:Coverable, coveragePatterns:ClausePattern[], jobWizardHelper : JobWizardHelper){
    if(coverable.PolicyLine typeis BP7BusinessOwnersLine){
      for(coveragePattern in coveragePatterns){
        if(coverable.PolicyLine.BP7DataCompromiseDfnseandLiabCov_EXTExists && coveragePattern == "DataCmprmiseRspnseExpns_EXT" ){
          jobWizardHelper.addErrorWebMessage(displaykey.una.productmodel.validation.DataCompromiseCoverageMessage)
          coverable.PolicyLine.DataCmprmiseRspnseExpns_EXT.remove()
        }
        if(coverable.PolicyLine.DataCmprmiseRspnseExpns_EXTExists && coveragePattern == "BP7DataCompromiseDfnseandLiabCov_EXT") {
          jobWizardHelper.addErrorWebMessage(displaykey.una.productmodel.validation.DataCompromiseCoverageMessage)
          coverable.PolicyLine.BP7DataCompromiseDfnseandLiabCov_EXT.remove()
        }
      }
    }
  }

  static function equipBreakEndorsementCovLimitValue(bp7Line:BP7BusinessOwnersLine){
    var limitValue:BigDecimal = 0.0
    //Equipment Breakdown Endorsement Coverage Limit = Building Limit value + Business Personal Property Limit value
    if(bp7Line.BP7EquipBreakEndor_EXTExists){
      for(bp7Building in bp7Line.AllBuildings){
        if(bp7Building.BP7Structure.BP7BuildingLimitTerm !=null){
          limitValue = limitValue + bp7Building.BP7Structure.BP7BuildingLimitTerm.Value
        }
      }
      for(bp7Classification in bp7Line.AllClassifications){
        if(bp7Classification.BP7ClassificationBusinessPersonalPropertyExists && bp7Classification.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm!=null){
          limitValue = limitValue + bp7Classification.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm.Value
        }
      }
      bp7Line.BP7EquipBreakEndor_EXT.BP7EquipBreakEndorLimit_ExtTerm.Value = limitValue
    }
  }
  
  static function isBP7OrdinanceLawCov1LimitCovTermAvailable(term:CovTerm):boolean{
      if(term!=null){
        var bp7Line = term.Clause.OwningCoverable as BP7BusinessOwnersLine
        if(bp7Line.BP7OrdinanceOrLawCov_EXTExists && bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm!=null &&
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue!=null &&
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov1Only_EXT") || bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov12and3_EXT") ||
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov1and3_EXT")){
            return true
        }
      }
    return false
  }

  private static function isBP7OrdinanceLawCov2LimitCovTermAvailable(term:CovTerm):boolean{
    if(term!=null){
      var bp7Line = term.Clause.OwningCoverable as BP7BusinessOwnersLine
      if(bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm!=null && bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue!=null &&
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov12and3_EXT")){
        return true
      }
    }
    return false
  }

  private static function isBP7OrdinanceLawCov3LimitCovTermAvailable(term:CovTerm):boolean{
    if(term!=null){
      var bp7Line = term.Clause.OwningCoverable as BP7BusinessOwnersLine
      if(bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm!=null && bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue!=null &&
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov3Only_EXT") ||
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov12and3_EXT") ||
          bp7Line.BP7OrdinanceOrLawCov_EXT.BP7OrdinLawCov_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Cov1and3_EXT")){
        return true
      }
    }
    return false
  }

  //NetworkSecuLimit_EXT/MalwareTransmission_EXT/DenialofSvcCompAttackTriggers_EXT CovTerms Availability
  static function isCyberOneCoverageTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if( bp7Line.BP7CyberOneCov_EXTExists && bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value!=null &&
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_NETWORKSECURITYLIAB_EXT ||
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT){
      return true
    }
    return false
  }

  //DataRestorationCosts_EXT/SysRestorationCosts_EXT CovTerms Availability
  static function isCyberOneCovTermAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if( bp7Line.BP7CyberOneCov_EXTExists && bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value!=null &&
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTACK_EXT ||
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT){
      return true
    }
    return false
  }

  //DataRecreationCosts_EXT/LossofBusiness_EXT/PublicRelationsSvcs_EXT CovTerms Availability
  static function isCyberOneCovTermsAvailable(bp7Line:BP7BusinessOwnersLine):boolean{
    if(bp7Line.BP7CyberOneCov_EXTExists && (bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value!=null &&
        bp7Line.BP7CyberOneCov_EXT.CoverageOptions_EXTTerm.Value == typekey.BP7CoverageOptions_Ext.TC_FULL) &&
        (bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value!=null && bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTACK_EXT ||
        bp7Line.BP7CyberOneCov_EXT.CoverageType_ExtTerm.Value == typekey.BP7CoverageType_Ext.TC_COMPUTERATTCKANDNWSECURLIAB_EXT)){
      return true
    }
    return false
  }
}