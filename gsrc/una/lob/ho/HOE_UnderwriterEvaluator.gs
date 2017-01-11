package una.lob.ho


uses gw.lob.common.AbstractUnderwriterEvaluator
uses gw.policy.PolicyEvalContext
uses java.util.Set
uses gw.lang.reflect.IType
uses gw.lob.ho.HODwellingUtil_HOE
/**
 * User: dvillapakkam
 * Date: 5/18/16
 * Time: 10:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HOE_UnderwriterEvaluator extends AbstractUnderwriterEvaluator {

  private static final var  PREQUAL_IDENTIFIER = "HO_PreQual_Ext"

  construct(policyEvalContext : PolicyEvalContext) {
    super(policyEvalContext)
  }

  override function canEvaluate() : boolean {
    var allowedJobs : Set<IType> = {Submission, PolicyChange, Reinstatement, Renewal, Rewrite, Issuance, RewriteNewAccount}
    return allowedJobs.contains(typeof(_policyEvalContext.Period.Job))
  }

  /*
  * This method is used to determine the allowed jobs and risk states for Credit Reporting
  * Add the jobs we need to use for CreditReporting to Set<IType>
  * In future if we need to include all the jobs for CreditReporting then delete the Set allowedJobsForCredit
  */
  private function allowedJobsAndStatesForCreditReporting(): boolean{
    if(!(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State.Code == "CA" ||
        _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State.Code == "HI")){
      var allowedJobsForCredit : Set<IType> = {Submission, Reinstatement, Renewal, Rewrite, Issuance, RewriteNewAccount}
      return allowedJobsForCredit.contains(typeof(_policyEvalContext.Period.Job))
    }
    return false
  }
 /*
 uim:svallabhapurapu
 This method is used to generate UW issue only submission Job type
  */
  private function submissionUWIssues() {
    var allowedJobType : Set = {Submission}
     if( allowedJobType.contains(typeof(_policyEvalContext.Period.Job))){

       createUwIssueForCoverage()
       // To do : revalidate require with latest req sheet
       //createUwIssueCovBLimitHigh()
       createUwIssueCovALimitHighDpType()
       createUwIssueFuseBox()
       createUwIssueFederalPacific()
       createUwIssueEamps150()
       createUwIssueWiringTypeKnobOrAluminum()
       createUwIssueConstructionICF()
       createUWIssueExteriorWFinish()
       createUwIssueDwellingAge50()
       CreateUwIssueDwellingAge60()
       CreateUwIssueForResidenceType()
       createUwForCs20YearsOld()
       createUwForDpCs20YearsOld()
       createUwForLppCs20YearsOld()
       createUwForCs25YearsOld()
       createUwForDpCs25YearsOld()
       createUwForCs15YearsOld()
       createUwPlumbingType()
       createUwProtectionClassCode()
     }
  }
  override function onPrequote() {
    relatedPriorLossforHomeownersOrDwelling()
    //Sunil
     submissionUWIssues()
    createDwellingRelatedUwIssuesForHO()


  }

  override function onPreBind(){
    validateQuestions()
    //This method will be called to create UW Issues related to Credit
    createsCreditRelatedUwIssuesForHO()
    createDwellingRelatedUwIssuesForHOPB()
  }

  private function createDwellingRelatedUwIssuesForHOPB()
  {

    var hoLine = _policyEvalContext.Period.HomeownersLine_HOE

    if(!hoLine.Dwelling.HOUWQuestions.moldrem || !hoLine.Dwelling.HOUWQuestions.moldrem )
    {
      var moldremm = \ -> "Properties  with prior prior unremediated mold issues are ineligible for coverage"
      _policyEvalContext.addIssue("HOMold", "HOMold",moldremm, moldremm)

    }

  }

  private function createDwellingRelatedUwIssuesForHO(){

      var hoLine = _policyEvalContext.Period.HomeownersLine_HOE


    if(hoLine.Dwelling.HOUWQuestions.typefuel==typekey.HOTypeFuel_Ext.TC_OTHER)
      {
        var fuelother = \ ->  "Fuel type ‘Other’ requires Underwriting review and approval prior to binding"

        _policyEvalContext.addIssue("FuelTypeOther_Ext", "FuelTypeOther_Ext",fuelother, fuelother)
      }

//    if(hoLine.Dwelling.HOUWQuestions.moldd != null )
//    {
//      var molddd = \ ->  "Properties with on premises business exposure require Underwriting review and approval prior to binding"
//      _policyEvalContext.addIssue("HOMold", "HOMold",molddd, molddd)
//    }

    if(hoLine.Dwelling.HOUWQuestions.moldrem || hoLine.Dwelling.HOUWQuestions.moldremediated )
    {
      var moldremm = \ -> "Properties  with prior mold damage require Underwriting review and approval prior to binding.   Please provide proof of mold remediation for Underwriting review"
      _policyEvalContext.addIssue("HOMoldRem", "HOMoldRem",moldremm, moldremm)

    }


  }

  /*
 * Creates underwriting issue if the number of PriorLosses associated with Homeowners line is one or more.
 */
  private function relatedPriorLossforHomeownersOrDwelling(){
    var numberOfLosses = _policyEvalContext.Period.HomeownersLine_HOE.HOPriorLosses_Ext.length
    var shortDescription = \ -> displaykey.Accelerator.LexisNexis.UWIssue.Homeowners.PriorLosses.shortDesc
    var longDescription = \ -> displaykey.Accelerator.LexisNexis.UWIssue.Homeowners.PriorLosses.LongDesc(numberOfLosses)
    if(numberOfLosses >= 1){
      _policyEvalContext.addIssue("HOPriorLoss_Ext", "HOPriorLoss_Ext",
          shortDescription, longDescription, numberOfLosses)
    }
    shortDescription=   \ -> displaykey.LexisNexis.UWIssue.Homeowners.PriorLosses.shortDesc
    longDescription = \ -> displaykey.LexisNexis.UWIssue.Homeowners.PriorLosses.LongDesc
    if(_policyEvalContext.Period.HomeownersLine_HOE.ClueHit_Ext==null){
      _policyEvalContext.addIssue("ClueReportOrdered_Ext", "ClueReportOrdered_Ext",
          shortDescription, longDescription)
    }
  }

  /*
   * Validation question response is checked for being true. If true create an underwriting issue
   */
  private function validateQuestions() {

    // Question set for HO
    var questionSet = _policyEvalContext.Period.QuestionSets.firstWhere(\elt -> elt.CodeIdentifier == PREQUAL_IDENTIFIER)
    questionSet.Questions.each( \ elt ->
      {
        if (elt != null) {
          if (elt?.isQuestionAvailable(_policyEvalContext.Period) ) {
            var answeredTrue = _policyEvalContext.Period.getAnswerValue(elt)?.toString() as boolean
            //uim-svallabhapurapu - DE33 : do not generate UW issues for Internal User(i.e UW issues will be generated for External user only)
            if (null != answeredTrue && answeredTrue and User.util.CurrentUser.ExternalUser) {
              switch (elt.DisplayName) {
                case 'HO_OwnATV_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_OwnATV_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_OwnATV_Ext','HO_OwnATV_Ext', shortDescription, longDescription)
                    break
                case 'HO_ATVonPremise_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_ATVonPremise_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_ATVonPremise_Ext','HO_ATVonPremise_Ext', shortDescription, longDescription)
                    break
                case 'HO_OpenClaim_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_OpenClaim_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_OpenClaim_Ext','HO_OpenClaim_Ext', shortDescription, longDescription)
                    break
                case 'HO_Damage_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Damage_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Damage_Ext','HO_Damage_Ext', shortDescription, longDescription)
                    break
                case 'HO_Crime_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Crime_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Crime_Ext','HO_Crime_Ext', shortDescription, longDescription)
                    break
                case 'HO_Fraud_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Fraud_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Fraud_Ext','HO_Fraud_Ext', shortDescription, longDescription)
                    break
                case 'HO_FamilyFelony_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_FamilyFelony_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_FamilyFelony_Ext','HO_FamilyFelony_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse_Ext','HO_Lapse_Ext', shortDescription, longDescription)
                    break
                case 'HO_LapseHO_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_LapseHO_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_LapseHO_Ext','HO_LapseHO_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse45_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse45_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse45_Ext','HO_Lapse45_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse60_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse60_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse60_Ext','HO_Lapse60_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse3years_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse3years_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse3years_Ext','HO_Lapse3years_Ext', shortDescription, longDescription)
                    break
                case 'HO_Sinkhole_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Sinkhole_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Sinkhole_Ext','HO_Sinkhole_Ext', shortDescription, longDescription)
                    break
                case 'HO_Sinkholeother_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Sinkholeother_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Sinkholeother_Ext','HO_Sinkholeother_Ext', shortDescription, longDescription)
                    break
           case 'HO_PropertyLoss1_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_PropertyLoss1_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_PropertyLoss1_Ext','HO_PropertyLoss1_Ext', shortDescription, longDescription)
                    break
                case 'HO_PropertyLossv2_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_PropertyLossv2_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_PropertyLossv2_Ext','HO_PropertyLossv2_Ext', shortDescription, longDescription)
                    break
                case 'HO_Propertyv3_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Propertyv3_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Propertyv3_Ext','HO_Propertyv3_Ext', shortDescription, longDescription)
                    break
                case 'HO_Propertyv4_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Propertyv4_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Propertyv4_Ext','HO_Propertyv4_Ext', shortDescription, longDescription)
                    break
                case 'HO_Any3Loss_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Any3Loss_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Any3Loss_Ext','HO_Any3Loss_Ext', shortDescription, longDescription)
                    break
                case 'HO_Weather_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Weather_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Weather_Ext','HO_Weather_Ext', shortDescription, longDescription)
                    break
                case 'HO_Weatherissues_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Weatherissues_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Weatherissues_Ext','HO_Weatherissues_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lease_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lease_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lease_Ext','HO_Lease_Ext', shortDescription, longDescription)
                    break
                case 'HO_DwellingQA_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_DwellingQA_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_DwellingQA_Ext','HO_DwellingQA_Ext', shortDescription, longDescription)
                    break
                case 'HO_DwellingDP_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_DwellingDP_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_DwellingDP_Ext','HO_DwellingDP_Ext', shortDescription, longDescription)
                    break
                case 'HO_Farm_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Farm_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Farm_Ext','HO_Farm_Ext', shortDescription, longDescription)
                    break
                case 'HO_island_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_island_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_island_Ext','HO_island_Ext', shortDescription, longDescription)
                    break
                case 'HO_Island_DP_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Island_DP_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Island_DP_Ext','HO_Island_DP_Ext', shortDescription, longDescription)
                    break
                case 'HO_DwellingQAflip_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_DwellingQAflip_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_DwellingQAflip_Ext','HO_DwellingQAflip_Ext', shortDescription, longDescription)
                    break
                default:
                break
              }
            }
          }
        }
      }
    )
  }

  /*
  * Creates underwriting issues, for the below Credit Statuses
  * TC_NO_SCORE, TC_ERROR, NULL, TC_NOT_ORDERED
  */
  private function createsCreditRelatedUwIssuesForHO(){
    if(allowedJobsAndStatesForCreditReporting()){
      var creditStatus = _policyEvalContext.Period.CreditInfoExt.CreditReport.CreditStatus
      if (creditStatus == CreditStatusExt.TC_NO_HIT || creditStatus == CreditStatusExt.TC_NO_SCORE){
        //adds below UW Issue if the CreditStatus is No HIT or NO Score
        var creditNoHitNoScore = \ ->  displaykey.Web.SubmissionWizard.CreditReporting.Validation.CreditReportNoHitOrNoScore(creditStatus)
        _policyEvalContext.addIssue("CreditReportNoHit", "CreditReportNoHit", creditNoHitNoScore, creditNoHitNoScore)
      }
      if (creditStatus == CreditStatusExt.TC_ERROR){
        //adds below UW Issue if the CreditStatus has Errors
        var creditReportErrors =  \ -> displaykey.Web.SubmissionWizard.CreditReporting.Validation.CreditReportErrors(creditStatus)
        _policyEvalContext.addIssue("CreditReportErrors","CreditReportErrors", creditReportErrors,creditReportErrors)
      }
      if (creditStatus == null || creditStatus == CreditStatusExt.TC_NOT_ORDERED){
        //adds below UW Issue if the CreditStatus is NULL or has NOT ORDERED yet
        var creditScoreRequiredForBinding =  \ -> displaykey.Web.SubmissionWizard.CreditReporting.Validation.CreditScoreRequiredForBinding
        _policyEvalContext.addIssue("CreditReportNotOrdered", "CreditReportNotOrdered", creditScoreRequiredForBinding, creditScoreRequiredForBinding)
      }
    }
  }
    // TO DO
  /*//uim-svallabhapurapu : UW issues 1 story   (row number 2)
  private function createUwIssueForAIType(){
    var aiPossibleType = false
    var addInterest = _policyEvalContext.Period.PolicyContactRoles.whereTypeIs(PolicyAddlInterest)
   */


   /*//uim-svallabhapurapu : UW issue (row number 3 roof material)
    private function createUwIssueForRoofTypeComp() {
      var validState = {"FL","NV","NC","SC"}
      if(validState.contains(_policyEvalContext.Period.BaseState.Code) and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER1.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)){
       // _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType == typekey.RoofType. - query pending with BA (typecode comp shingle > 20 years)
      }
    }*/

  // Row number 15, HO , TX , Personal Property is Coverage B
   private function createUwIssueCovBLimitHigh() {
      var covALimit_40000 = 40000bd
     var shortDescription = \-> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.ShortDesc_Ext
     var longDescription = \ -> displaykey.Ext.UWIssue.HO.Coverage.PersonalPropertyCovBLimit.LongDesc_Ext
     if(_policyEvalContext.Period.BaseState.Code == typekey.State.TC_TX.Code
         and _policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT
         and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOEExists
         and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm !=null
         and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value > covALimit_40000 ){

       _policyEvalContext.addIssue("HO_CovBHigherLimit_Ext","HO_CovBHigherLimit_Ext",shortDescription,longDescription)  }
  }

  // Row 17  TX, TDP types , Display key needs to be updated, new UW_issue_type got created
  private function createUwIssueCovALimitHighDpType(){
     var covALimit_80000 = 80000bd
     var shortDescription = \-> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.ShortDesc_Ext
     var longDescription = \ -> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.LongDesc_Ext
    if(
         _policyEvalContext.Period.BaseState.Code == typekey.State.TC_TX.Code
        and typekey.HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
        and _policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT
        and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
        and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value < covALimit_80000 ){

      _policyEvalContext.addIssue("HO_CovALimit80000_Ext","HO_CovALimit80000_Ext",shortDescription,longDescription)  }
  }

  // row number 36
  private function createUwIssueFuseBox(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalSystemType.shortDescription_Ext
    var longDescription =  \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalSystemType.LongDescription_Ext
   if( _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ElectricalType == typekey.BreakerType_HOE.TC_FUSE_EXT){
       _policyEvalContext.addIssue("HO_ElectricalTypeFuseBox_Ext","HO_ElectricalTypeFuseBox_Ext",shortDescription,longDescription) }
  }
  //row 37
  private function createUwIssueFederalPacific(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalSystemType.shortDescription_Ext
     var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.PanelMFedralSpecific.LongDescription_Ext
    if(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.PanelManufacturer_Ext == typekey.PanelManufacturer_Ext.TC_FEDERALPACIFIC){
      _policyEvalContext.addIssue("HO_PanelMFedralPacific_Ext","HO_PanelMFedralPacific_Ext",shortDescription,longDescription)}
  }

  //row 38 - assuming numberOfAmps and <150 is not present - no type code query to BA needs to be raised
  // row 39 - amps < 100
  private function createUwIssueEamps150(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalSystemType.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalAmpsLessThan150.LongDescription_Ext
    var longDesc =    \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalAmpsLessThan100.LongDescription_Ext
    if( _policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_CA
            and  typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER2.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
            and  _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.NumberofAmps_Ext == typekey.NumberofAmps_Ext.TC_HUNDREDPLUS) {
              _policyEvalContext.addIssue("HO_ElectricalAmpsLs150_Ext","HO_ElectricalAmpsLs150_Ext",shortDescription,longDescription)
       }else if(typekey.Jurisdiction.TF_UWISSUEFILTER4.TypeKeys.contains( _policyEvalContext.Period.BaseState)
                  and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER2.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
                  and  _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.NumberofAmps_Ext == typekey.NumberofAmps_Ext.TC_AMPSLESSTHANHUNDRED) {
               _policyEvalContext.addIssue("HO_ElectricalAmpsLs100_Ext","HO_ElectricalAmpsLs100_Ext",shortDescription,longDesc)
       }
  }
  // row 40, All states
  private function createUwIssueWiringTypeKnobOrAluminum(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ElectricalSystemType.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.BranchWiringKnobTube.LongDescription_Ext

    if(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.WiringType == typekey.WiringType_HOE.TC_KNOBANDTUBE
         or _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.WiringType == typekey.WiringType_HOE.TC_ALUMINUM){
             _policyEvalContext.addIssue("HO_BranchWiringKnob_Ext","HO_BranchWiringKnob_Ext",shortDescription,longDescription)
       }
  }

  // row 41 - All states
  private function createUwIssueConstructionICF(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ExteriorWallConstruction.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ExteriorWallConstruction.LongDescription_Ext
    if(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType != typekey.HOPolicyType_HOE.TC_HO4
            and  _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_ICF_EXT){
      _policyEvalContext.addIssue("HO_ExteriorWallIcf_Ext","HO_ExteriorWallIcf_Ext",shortDescription,longDescription)
        }
  }
    // row 42
  private function createUWIssueExteriorWFinish(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ExteriorWallFinish.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ExteriorWallFinish.LongDescription_Ext
    if(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType != typekey.HOPolicyType_HOE.TC_HO4
        and  typekey.ExteriorWallFinish_Ext.TF_UWISSUEFILTER1.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext) ){
          _policyEvalContext.addIssue("HO_ExteriorWallFinish_Ext","HO_ExteriorWallFinish_Ext",shortDescription,longDescription)
    }
  }

  // row 43
  private function createUwIssueDwellingAge50() {
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.DwellingAgeGr50.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.DwellingAgeGr50.LongDescription_Ext
     var diffYear_50 : int = 50
     var  diffYears = gw.lob.ho.HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_TX
         and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER3.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
         and diffYears > diffYear_50){
          _policyEvalContext.addIssue("HO_DwellingAgeGr50_Ext","HO_DwellingAgeGr50_Ext",shortDescription,longDescription)
    }
  }

  // row number 44  - will need to check with BA -
  private function CreateUwIssueDwellingAge60(){
    var diffYear_60 : int = 60
    var dwelling = _policyEvalContext.Period.HomeownersLine_HOE.Dwelling
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.DwellingAgeGr50.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.DwellingAgeGr60.LongDescription_Ext
    var  diffYears = gw.lob.ho.HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, dwelling?.YearBuilt)
    if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_HI
        and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER4.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
        and diffYears > diffYear_60  and !dwelling.HeatingUpgrade
        and !dwelling?.PlumbingUpgrade  and !dwelling?.HeatingUpgrade){
      _policyEvalContext.addIssue("HO_DwellingAgeGr50_Ext","HO_DwellingAgeGr50_Ext",shortDescription,longDescription)
    }
  }
  // row number 60, 61, 62, 66 , 63,64, 65
  private function CreateUwIssueForResidenceType(){
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ResidenceType.shortDescription_Ext
    var longDescription = \-> displaykey.Ext.UWIssue.HO.DwellingConstruction.ResidenceType.LongtDescription_Ext
    var longDescription_Form = \->displaykey.Ext.UWIssue.HO.DwellingConstruction.ResidenceType.form.LongtDescription_Ext
    if(typekey.ResidenceType_HOE.TF_RESIDENCETYPEFILTER1_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType)){
       _policyEvalContext.addIssue("HO_ResTypeDIYConstruction_Ext","HO_ResTypeDIYConstruction_Ext",shortDescription,longDescription)
    }
    else if(typekey.ResidenceType_HOE.TF_RESIDENCETYPEFILTER2_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType)
              and  typekey.HOPolicyType_HOE.TF_HOPOLICYTYPEFILTER5_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)){
               _policyEvalContext.addIssue("HO_ResTypeTriQuadPlex_Ext","HO_ResTypeTriQuadPlex_Ext",shortDescription,longDescription)
    }
      else if(typekey.ResidenceType_HOE.TF_RESIDENCETYPEFILTER2_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType)
          and  _policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_TX
          and  typekey.HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)){
                    _policyEvalContext.addIssue("HO_ResTypeTriPlex_Ext","HO_ResTypeTriPlex_Ext",shortDescription,longDescription)
      }
      else if(typekey.ResidenceType_HOE.TF_RESIDENCETYPEFILTER3_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType)
             and _policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType != typekey.HOPolicyType_HOE.TC_HO6){
               _policyEvalContext.addIssue("HO_ResTypeFmlyRowHse_Ext","HO_ResTypeFmlyRowHse_Ext",shortDescription,longDescription)
      }
        else if (typekey.ResidenceType_HOE.TC_APARTMENT_EXT == _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType
                   and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER6_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)){
                    _policyEvalContext.addIssue("HO_ResTypApartment_Ext","HO_ResTypApartment_Ext",shortDescription,longDescription_Form)
        }
         else if(typekey.ResidenceType_HOE.TC_CONDO_EXT == _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType
                and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER2.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
                and    typekey.Jurisdiction.TF_JURIDICTIONFILTER5_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)) {
                  _policyEvalContext.addIssue("HO_ResTypDpCondo_Ext","HO_ResTypDpCondo_Ext",shortDescription,longDescription)
            }
           else if (typekey.ResidenceType_HOE.TC_CONDO_EXT== _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.ResidenceType
                     and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER7.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)) {
                _policyEvalContext.addIssue("HO_ResTypCondo_Ext","HO_ResTypCondo_Ext",shortDescription,longDescription_Form)
              }

  }

  // Swithch case for coverage rules

  private function createUwIssueForCoverage(){
    var covALimit_1500000 = 1500000bd
    var covALimit_750000 = 750000bd
    var covALimit_90000  = 90000bd
    var covALimit_500000 = 500000bd
    var covALimit_1000000 = 1000000bd
    var covALimit_20000 = 20000bd
    var covALimit_30000 = 30000bd
    var covALimit_80000 = 80000bd
    var covALimit_100000 = 100000bd
    var covALimit_125000 = 125000bd
    var covALimit_75000 = 75000bd
    switch(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType){
      case typekey.HOPolicyType_HOE.TC_HO3 :  // row 9
          var shortDescription = \-> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.ShortDesc_Ext
          var longDescription = \ -> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.LongDesc_Ext
           if(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOEExists
                and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value > covALimit_1500000){
                 _policyEvalContext.addIssue("HO_CovALmtGr1500000_Ext","HO_CovALmtGr1500000_Ext",shortDescription,longDescription)
           } // row 22
           if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER7_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOEExists
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value < covALimit_80000){
             _policyEvalContext.addIssue("HO_CovALmtLs80000_Ext","HO_CovALmtLs80000_Ext",shortDescription,longDescription)
           } // Row 23
           if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER8_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOEExists
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value < covALimit_100000){
             _policyEvalContext.addIssue("CovALmtLs1000000_Ext","CovALmtLs1000000_Ext",shortDescription,longDescription)
           } // row 24
           if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER9_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOEExists
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value < covALimit_125000)
                   _policyEvalContext.addIssue("HO_CovALmtLs125000_Ext","HO_CovALmtLs125000_Ext",shortDescription,longDescription)
          break
      case  typekey.HOPolicyType_HOE.TC_DP3_EXT : //row 11
          var shortDescription = \-> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.ShortDesc_Ext
          var longDescription = \ -> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.LongDesc_Ext
          if( _policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_CA
              and  _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value > covALimit_750000){
              _policyEvalContext.addIssue("HO_DpCovALmtGr750000_Ext","HO_DpCovALmtGr750000_Ext",shortDescription,longDescription)
          } // row 14
          if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_CA
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value > covALimit_1000000 ){
                    _policyEvalContext.addIssue("HO_DpCovALmtGr1000000_Ext","HO_DpCovALmtGr1000000_Ext",shortDescription,longDescription)
          } // row 25
          if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_NC
               and  _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value < covALimit_75000){
            _policyEvalContext.addIssue("HO_DpCovALmtLs75000_Ext","HO_DpCovALmtLs75000_Ext",shortDescription,longDescription)
          } // row 26
          if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER10_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
              and  _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value < covALimit_100000){
                   _policyEvalContext.addIssue("HO_DpCovALmtLs100000_Ext","HO_DpCovALmtLs100000_Ext",shortDescription,longDescription)
          } // row 27
          if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_FL
             and   _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value < covALimit_125000)
                    _policyEvalContext.addIssue("HO_DpCovALmtLs125000_","HO_DpCovALmtLs125000_",shortDescription,longDescription)
          break
      case  typekey.HOPolicyType_HOE.TC_HO6 : // row 12
          var shortDescription = \-> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.ShortDesc_Ext
          var longDescription = \ -> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.LongDesc_Ext
           if( _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOEExists
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value > covALimit_750000){
                 _policyEvalContext.addIssue("HO_CovALmtGr750000_Ext","HO_CovALmtGr750000_Ext",shortDescription,longDescription)
           }  // row 13
           if( _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOEExists
               and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value > covALimit_500000){
                _policyEvalContext.addIssue("HO_CovCLmtGr500000_Ext","HO_CovCLmtGr500000_Ext",shortDescription,longDescription)
           }// row 19
          if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER1_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm?.Value < covALimit_20000 ){
                 _policyEvalContext.addIssue("HO_CovCLmtLs20000_Ext","HO_CovCLmtLs20000_Ext",shortDescription,longDescription)
          } // row 21
          if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER6_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm?.Value < covALimit_20000 ){
                    _policyEvalContext.addIssue("HO_CovCLmtLs30000_Ext","HO_CovCLmtLs30000_Ext",shortDescription,longDescription)
          }
          break
      case  typekey.HOPolicyType_HOE.TC_HO4 :   // row 18
          var shortDescription = \-> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.ShortDesc_Ext
          var longDescription = \ -> displaykey.Ext.UWIssue.HO.Coverage.DwellingLimit.LongDesc_Ext
            if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER2_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
                and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOEExists
                and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm?.Value < covALimit_20000){
                 _policyEvalContext.addIssue("HO_HO4CovCLmtLs20000_Ext","HO_HO4CovCLmtLs20000_Ext",shortDescription,longDescription)
            } // row 20
          if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER3_EXT.TypeKeys.contains( _policyEvalContext.Period.BaseState)
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOEExists
              and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm?.Value < covALimit_30000 )  {
            _policyEvalContext.addIssue("HO_HO4CovCLmtLs30000_Ext","HO_HO4CovCLmtLs30000_Ext",shortDescription,longDescription)

          }
          break
        default :
  }// end of switch

 }// end of function

  // row number 3
  private function createUwForCs20YearsOld(){
    var diffYear_20 : int = 20
    var  diffYears = HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle20YearOld.LongDesc_Ext
      //CompShingleTypes_Ext, JurisdictionTypeFilter11_Ext, HOPolicyTypesFilter1
    if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER11_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
         and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER1.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
         //and typekey.RoofType.TF_COMPSHINGLETYPES_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType)
         and diffYears > diffYear_20) {
      _policyEvalContext.addIssue("HO_RoofTypeCs20Years_Ext","HO_RoofTypeCs20Years_Ext",shortDescription,longDescription)
    }

  }

  // row number 4
  //All DP types - Need to check with BA
  private function createUwForDpCs20YearsOld(){
    var diffYear_20 : int = 20
    var  diffYears = HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle20YearOld.LongDesc_Ext
    //CompShingleTypes_Ext, JurisdictionTypeFilter11_Ext, HOPolicyTypesFilter1
    if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER12_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
        and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER2.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
       // and typekey.RoofType.TF_COMPSHINGLETYPES_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType)
        and diffYears > diffYear_20) {
      _policyEvalContext.addIssue("HO_RoofTypeCs20Years_Ext","HO_RoofTypeCs20Years_Ext",shortDescription,longDescription)
    }

  }

  // row 5, will need to check with BA
  private function createUwForLppCs20YearsOld(){
    var diffYear_20 : int = 20
    var  diffYears = HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle20YearOld.LongDesc_Ext
    if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_NC
        and _policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT
        //and typekey.RoofType.TF_COMPSHINGLETYPES_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType)
        and diffYears > diffYear_20) {
      _policyEvalContext.addIssue("HO_RoofTypeLppCs20Years_Ext","HO_RoofTypeLppCs20Years_Ext",shortDescription,longDescription)
    }
  }

  //row 6
  private function createUwForCs25YearsOld(){
    var diffYear_25 : int = 25
    var  diffYears = HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle25YearOld.LongDesc_Ext
    if(typekey.Jurisdiction.TF_JURISDICTIONTYPEFILTER10_EXT.TypeKeys.contains(_policyEvalContext.Period.BaseState)
        and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER1.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
        //and typekey.RoofType.TF_COMPSHINGLETYPES_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType)
        and diffYears > diffYear_25) {
      _policyEvalContext.addIssue("HO_RoofTypeCs25Years_Ext","HO_RoofTypeCs25Years_Ext",shortDescription,longDescription)
    }
  }

  //row number 7 ,
  private function createUwForDpCs25YearsOld(){
    var diffYear_25 : int = 25
    var  diffYears = HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle25YearOld.LongDesc_Ext
    if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_HI
        and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER2.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
        //and typekey.RoofType.TF_COMPSHINGLETYPES_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType)
        and diffYears > diffYear_25) {
      _policyEvalContext.addIssue("HO_RoofTypeDpCs25Years_Ext","HO_RoofTypeDpCs25Years_Ext",shortDescription,longDescription)
    }
  }

  // row number 8
  private function createUwForCs15YearsOld(){
    var diffYear_15 : int = 15
    var  diffYears = HODwellingUtil_HOE.diffInYears(_policyEvalContext.Period?.PeriodStart?.YearOfDate, _policyEvalContext.Period.HomeownersLine_HOE.Dwelling?.YearBuilt)
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.Rooftype.Compshingle15YearOld.LongDesc_Ext
    if(_policyEvalContext.Period.BaseState == typekey.Jurisdiction.TC_TX
        and typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER1.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)
       // and typekey.RoofType.TF_COMPSHINGLETYPES_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.RoofType)
        and diffYears > diffYear_15) {
      _policyEvalContext.addIssue("HO_RoofTypeCs15Years_Ext","HO_RoofTypeCs15Years_Ext",shortDescription,longDescription)
    }

  }
  // row 57
  private function createUwPlumbingType(){
    //YearGrp4_Ext
    var shortDescription = \-> displaykey.Ext.UWIssue.HO.PlumbingType.ShortDesc_Ext
    var longDescription = \ -> displaykey.Ext.UWIssue.HO.PlumbingType.LongDesc_Ext
   if( _policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType != typekey.HOPolicyType_HOE.TC_HO4
       and typekey.PlumbingType_HOE.TF_YEARGRP4_EXT.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.PlumbingType)){
     _policyEvalContext.addIssue("HO_PlumbingType_Ext","HO_PlumbingType_Ext",shortDescription,longDescription)
   }
  }

  // row 58,59 will need to check with BA changed as per BA
  private function createUwProtectionClassCode(){
    var clsCode10 : String = "10"
    var clsCode9 : String = "9"
    var shortDescription_10 = \-> displaykey.Ext.UWIssue.HO.ProtectionClass10.ShortDesc_Ext
    var longDescription_10 = \ -> displaykey.Ext.UWIssue.HO.ProtectionClass10.LongDesc_Ext
    var shortDescription_9 = \-> displaykey. Ext.UWIssue.HO.ProtectionClass9.ShortDesc_Ext
    var longDescription_9 = \ -> displaykey.Ext.UWIssue.HO.ProtectionClass9.LongDesc_Ext
    var protectedSubdivision = _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HOLocation.ProtectedSubDivision_Ext
    if(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode == clsCode10 and !protectedSubdivision) {
      _policyEvalContext.addIssue("HO_ProtectionC10_Ext","HO_ProtectionC10_Ext",shortDescription_10,longDescription_10)
    } else if(_policyEvalContext.Period.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode == clsCode9 and !protectedSubdivision) {
      _policyEvalContext.addIssue("HO_ProtectionC9_Ext","HO_ProtectionC9_Ext",shortDescription_9,longDescription_9)
    }

  }

  // Row 10
   private function createUwIssueCovALimitDpExceptCa(){
     var covALimit_1500000 =  1500000bd
    if( _policyEvalContext.Period.BaseState.Code != typekey.State.TC_CA.Code
     and  typekey.HOPolicyType_HOE.TF_HOPOLICYTYPESFILTER2.TypeKeys.contains(_policyEvalContext.Period.HomeownersLine_HOE.HOPolicyType)//UWIssuePolicyTypes2
     and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists
     and _policyEvalContext.Period.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value > covALimit_1500000 ) {

    }
   }
}