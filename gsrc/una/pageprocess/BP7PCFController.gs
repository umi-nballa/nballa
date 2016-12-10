package una.pageprocess

uses gw.api.web.job.JobWizardHelper
uses gw.api.productmodel.ClausePattern
uses gw.api.util.DisplayableException
uses java.math.BigDecimal

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
    if(line.BP7ExclusionProductsCompletedOpernsUnrelatedtoBuilOwners_EXTExists){
      line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.setValueFromString("Excluded_EXT")
    }else{
      line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.setValueFromString("Included_EXT")
    }
  }

  static function infoMessage(line:BP7BusinessOwnersLine,jobWizardHelper : JobWizardHelper){
    if(line.BP7BusinessLiability.BP7ProdCompldOps_EXTTerm.OptionValue.OptionCode.equalsIgnoreCase("Excluded_EXT"))
      jobWizardHelper.addInfoWebMessage("Products/Completed Ops. has been changed to Excluded")
  }

  static function dataCompromiseCoverageRestriction(coverable:Coverable, coveragePatterns:ClausePattern[], jobWizardHelper : JobWizardHelper){
    if(coverable.PolicyLine typeis BP7BusinessOwnersLine){
      for(coveragePattern in coveragePatterns){
        if(coverable.PolicyLine.BP7DataCompromiseDfnseandLiabCov_EXTExists && coveragePattern == "DataCmprmiseRspnseExpns_EXT" ){
          jobWizardHelper.addErrorWebMessage("Only one Data Compromise Coverage can be added")
          coverable.PolicyLine.DataCmprmiseRspnseExpns_EXT.remove()
        }
        if(coverable.PolicyLine.DataCmprmiseRspnseExpns_EXTExists && coveragePattern == "BP7DataCompromiseDfnseandLiabCov_EXT") {
          jobWizardHelper.addErrorWebMessage("Only one Data Compromise Coverage can be added")
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
    }
    bp7Line.BP7EquipBreakEndor_EXT.BP7EquipBreakEndorLimit_ExtTerm.Value = limitValue
  }
}