package una.pageprocess

uses gw.api.web.job.JobWizardHelper
uses gw.api.productmodel.ClausePattern
uses gw.api.util.DisplayableException

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
    for(coveragePattern in coveragePatterns){
      if( ((coverable.PolicyLine as BP7BusinessOwnersLine).BP7DataCompromiseDfnseandLiabCov_EXTExists && coveragePattern == "DataCmprmiseRspnseExpns_EXT" ) ||
          ((coverable.PolicyLine as BP7BusinessOwnersLine).DataCmprmiseRspnseExpns_EXTExists && coveragePattern == "BP7DataCompromiseDfnseandLiabCov_EXT")  ){
            jobWizardHelper.addErrorWebMessage("Only one Data Compromise Coverage can be added")
            //throw new gw.api.util.DisplayableException("Only one Data Compromise Coverage can be added")
      }
    }
  }
}