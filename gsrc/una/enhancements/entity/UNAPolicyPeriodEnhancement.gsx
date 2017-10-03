package una.enhancements.entity

uses java.lang.IllegalArgumentException
uses java.lang.Exception
uses java.lang.IllegalStateException
uses gw.api.domain.Clause
uses java.util.Date
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 4/20/17
 * Time: 5:35 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAPolicyPeriodEnhancement : entity.PolicyPeriod {
  public property get AllExclusions() : Exclusion[]{
    return this.Lines*.AllExclusions
  }

  public property get AllConditions() : PolicyCondition[]{
    return this.Lines*.AllConditions
  }

  public function getOwningCoverable(clausePattern : String, period : PolicyPeriod) : Coverable{
    var associatedCoverable : Coverable

    try{
      var owningEntityType = gw.api.productmodel.ClausePattern.OWNING_ENTITY_TYPE.get(clausePattern)

      if(period.HomeownersLine_HOEExists){ //may revisit for refactor when Commercial Lines are implemented.
        if(owningEntityType.equalsIgnoreCase("Dwelling_HOE")){
          associatedCoverable = period.HomeownersLine_HOE.Dwelling
        }else if(owningEntityType.equalsIgnoreCase("HomeownersLine_HOE")){
          associatedCoverable = period.HomeownersLine_HOE
        }else{
          throw new Exception("Coverage pattern ${clausePattern} does not exist or have an owning coverable.")
        }
      }
    }catch(e : Exception){
      throw new IllegalStateException(e.Message)
    }

    return associatedCoverable
  }

  @Returns("A list of PatternCode Strings that represent all instances of 'Clauses' (coverages, exclusions, conditions)")
  public property get AllExclusionsConditionsAndCoverages() : List<Clause>{
    var results : List<Clause> = {}

    results.addAll(AllExclusions)
    results.addAll(AllConditions)
    results.addAll(this.Lines*.AllCoverables*.CoveragesFromCoverable)

    return results
  }

  public property get PolicyAdditionalInsureds() : List<PolicyAddlInsured>{
    return this.PolicyContactRoles.whereTypeIs(PolicyAddlInsured)?.toList()
  }

  public property get DwellingAdditionalInterests() : List<entity.HODwellingAddlInt_HOE>{
    return this.HomeownersLine_HOE.Dwelling.AdditionalInterests?.toList()
  }

  @Param("questionCode", "A String code identifier for the question for which an answer is desired.")
  @Returns("")
  public function getAnswerForQuestionCode(questionCode : String) : PCAnswerDelegate{
    var result : PCAnswerDelegate

    var question = this.QuestionSets.atMostOneWhere( \ qset -> qset.Questions.hasMatch( \ q -> q.CodeIdentifier == questionCode)).Questions.atMostOneWhere( \ q -> q.CodeIdentifier == questionCode)

    if(question != null){
      result = this.getAnswer(question)
    }else{
      throw new IllegalArgumentException("The question with code '${questionCode}' cannot be found for the policy period answer container")
    }

    return result
  }

 //FL HO3 - New Submission, Renewal & Rewrite(Full & New Term) ONLY ---- To determine Named Insured or Co-Insured's(Spouse & Co-Insured ONLY)Age is greater than 60 (or) not
  public function confirmAnyInsuredAgeOver60(){
    var coInsuredAgeOver60 = false
    var primNamedInsuredAgeOver60 = false

    var coInsureds = this.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured).where( \ relnToPNI -> relnToPNI.ContactRelationship_Ext == TC_SPOUSE ||
        relnToPNI.ContactRelationship_Ext == TC_COINSURED)

    if(this.BaseState == TC_FL && this.HomeownersLine_HOE.HOPolicyType == TC_HO3 && (this.Job.Subtype == TC_SUBMISSION || this.Job.Subtype == TC_RENEWAL ||
        (this.Job.Subtype == TC_REWRITE && (this.Rewrite.RewriteType == TC_REWRITEFULLTERM || this.Rewrite.RewriteType == TC_REWRITENEWTERM)))){
      if(this.PrimaryNamedInsured.DateOfBirth!=null && this.PeriodStart.differenceInYears(this.PrimaryNamedInsured.DateOfBirth)>60){
        primNamedInsuredAgeOver60 = true
      }

      for(coInsured in coInsureds){
        if(coInsured.DateOfBirth!=null && this.PeriodStart.differenceInYears(coInsured.DateOfBirth)>60){
          coInsuredAgeOver60 = true
          break
        }
      }
      if(primNamedInsuredAgeOver60 || coInsuredAgeOver60){
        this.Aged60OrOver_Ext = true
      }else{
        this.Aged60OrOver_Ext = false
      }
    }
  }

    /**
     * Gets the Display status for this period to show in the portal
     */
    public property get UNAPortalPeriodDisplayStatus() : String {
        if (this.Status != "Bound") {
            return this.Status.DisplayName
        } else if (this.CancellationDate != null) {
            return displaykey.PolicyPeriod.PortalPeriodDisplayStatus.Canceled
        } else if (DateUtil.currentDate() >= this.PeriodEnd) {
            return displaykey.PolicyPeriod.PortalPeriodDisplayStatus.Expired
        } else {
            return displaykey.PolicyPeriod.PortalPeriodDisplayStatus.InForce
        }
    }
}