package una.pageprocess

uses gw.api.web.job.JobWizardHelper
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

  static function setTheftLimitationValue(line:BP7BusinessOwnersLine){
    if(line.BP7TheftExclusion_EXTExists){
      for(classification in line.AllClassifications){
        if(classification typeis BP7TheftLimitations){
          classification.BP7TheftLimitations.BP7LimitOptions_EXTTerm.setValueFromString("BP7TheftExcluded_EXT")
        }
      }
    }
  }

  static function isBarbAndBeautiProfLiabCoverageAvailable(classification:BP7Classification):boolean{
    if( classification typeis BP7BarbersBeauticiansProfessionalLiability_EXT and (classification.ClassCode_Ext=="71332" ||
        classification.ClassCode_Ext=="71952") ){
      return true
    }
    return false
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
}