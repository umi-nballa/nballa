package una.enhancements.entity

uses java.lang.IllegalArgumentException
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 4/20/17
 * Time: 5:35 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAPolicyPeriodEnhancement : entity.PolicyPeriod {
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
