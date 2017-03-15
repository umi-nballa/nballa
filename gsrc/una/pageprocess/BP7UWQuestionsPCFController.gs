package una.pageprocess

uses java.lang.Integer
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/13/17
 * Time: 11:58 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7UWQuestionsPCFController {
  private static final var PERCENTAGE_QUESTION_CODES : String[] = {"WholesalePercentageOpenToPublic", "OffPremisesBusinessPercentage", "PercentageOfRetailSalesSpaceWholesale"}
  private static final var TOTAL_GROSS_RECEIPT_CODE = "TotalAnnualGrossReceipts"

  public static function validateAnswer(container : AnswerContainer, question : gw.api.productmodel.Question) : String{
    var result : String
    var throwValidationException : boolean
    var validationMessage : String

    if(PERCENTAGE_QUESTION_CODES.contains(question.CodeIdentifier)){
        var answer = container?.getAnswer(question).IntegerAnswer

      if(PERCENTAGE_QUESTION_CODES.contains(question.CodeIdentifier)){
        throwValidationException = answer > 100
      }
    }

    if(question.CodeIdentifier == TOTAL_GROSS_RECEIPT_CODE){
      try{
        container.getAnswer(question).TextAnswer?.toDouble()
      }catch(e : java.lang.Exception){
        throwValidationException = true
      }
    }

    if(throwValidationException){
      result = (question.CodeIdentifier == TOTAL_GROSS_RECEIPT_CODE) ? displaykey.una.bp7.uwquestions.total_gross_error : displaykey.una.bp7.uwquestions.percenterror
    }

    return result
  }
}