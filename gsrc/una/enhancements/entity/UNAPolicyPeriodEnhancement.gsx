package una.enhancements.entity

uses java.lang.IllegalArgumentException
uses java.lang.Exception
uses java.lang.IllegalStateException
uses gw.api.domain.Clause

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
}
