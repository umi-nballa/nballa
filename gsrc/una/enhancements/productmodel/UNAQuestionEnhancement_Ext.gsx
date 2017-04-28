package una.enhancements.productmodel

uses java.lang.Integer
uses una.utils.UNAProductModelUtil
uses una.utils.UNAProductModelUtil.DwellingUWQuestionCodes

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 4/20/17
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAQuestionEnhancement_Ext : gw.api.productmodel.Question {

  public function getDisplayOrder(policyPeriod : PolicyPeriod) : Integer{
    var result : Integer

    if(this.QuestionSet.CodeIdentifier == "HODwellingUWQuestions_Ext"){
      if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)){
        result = UNAProductModelUtil.DWELLING_UW_QUESTIONS_DISPLAY_ORDER_DP.get(this.CodeIdentifier)
      }else{
        result = this.Priority
      }
    }else{
      result = this.Priority
    }

    return result
  }

  //provides special handling for "incorrect" answers that's not configurable in product model
  function getAnswerMessage(answer : PCAnswerDelegate) : String{
    var result : String

    switch(this.CodeIdentifier){
      case "TypeOfFuel":
        result = getTypeOfFuelAnswerMessage(answer)
        break
      case "DoesFuelTankMeetBuildingCodes":
        result = getDoesFuelTankMeetBuildingCodesAnswerMessage(answer)
        break
      case "ClosestDistanceTankToDwelling":
        result = getDoesClosestDistanceTankToDwellingAnswerMessage(answer)
        break
      case "PrimaryProtectionForPoolHottub":
        result = getPrimaryProtectionForPoolHottubAnswerMessage(answer)
        break
      case "TypeOfBusinessConducted":
      case "WhatTypeOfBusiness_DF":
        result = getWhatTypeOfBusinessIsConductedAnswerMessage(answer)
        break
      case "HasCommercialDaycareLiabilityInsurance":
        result = getHasCommercialDaycareLiabilityInsuranceAnswerMessage(answer)
        break
      case "HasBusinessPolicyInPlaceHO":
      case "IsBusinessPolicyInPlace_DF":
        result = getHasBusinessPolicyInPlaceHOAnswerMessage(answer)
        break
      case "HasMoldBeenProfessionallyRemoved":
        result = getHasMoldBeenProfessionallyRemovedAnswerMessage(answer)
        break
      case "TotalNumberOfRentalUnitsUnderCommonOwnership":
        result = getTotalNumberOfRentalUnitsAnswerMessage(answer)
        break
    }

    return result
  }

  private function getTypeOfFuelAnswerMessage(answer : PCAnswerDelegate) : String{
    var result : String

    if(answer.ChoiceAnswer.ChoiceCode == "GasDiesel"){
      result = displaykey.una.answerwarnings.TypeOfFuelGasDiesel
    }else if(answer.ChoiceAnswer.ChoiceCode == "Other"){
      result = displaykey.una.answerwarnings.TypeOfFuelOther
    }

    return result
  }

  private function getDoesFuelTankMeetBuildingCodesAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String

    if(answer.ChoiceAnswer.ChoiceCode == "No"){
      result = displaykey.una.answerwarnings.DoesFuelTankMeetBuildingCodesNo
    }

    return result
  }

  private function isTankLessThan500GallonsAnd15FeetAway(tankCapacityAnswer : PCAnswerDelegate, distanceAnswer : PCAnswerDelegate) : boolean{
    return tankCapacityAnswer.ChoiceAnswer.ChoiceCode == "LessThan500" and distanceAnswer.ChoiceAnswer.ChoiceCode == "LessThan15Feet"
  }

  private function isTankGreaterThan500GallonsAndTooClose(tankCapacityAnswer : PCAnswerDelegate, distanceAnswer : PCAnswerDelegate) : boolean{
    return tankCapacityAnswer.ChoiceAnswer.ChoiceCode == "GreaterThanOrEqual500"
       and (distanceAnswer.ChoiceAnswer.ChoiceCode == "15To25Feet" or distanceAnswer.ChoiceAnswer.ChoiceCode == "LessThan15Feet")
  }

  private function getDoesClosestDistanceTankToDwellingAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String
    var tankCapacityAnswer = (answer as PeriodAnswer).Branch.getAnswerForQuestionCode("FuelTankCapacity")

    if(isTankLessThan500GallonsAnd15FeetAway(tankCapacityAnswer, answer as PeriodAnswer)
        or isTankGreaterThan500GallonsAndTooClose(tankCapacityAnswer, answer as PeriodAnswer)){
      result = displaykey.una.answerwarnings.ClosestDistanceTankToDwellingWrongAnswer
    }

    return result
  }

  private function getPrimaryProtectionForPoolHottubAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String

    if(answer.ChoiceAnswer.ChoiceCode == "None" or answer.ChoiceAnswer.ChoiceCode == "HotTubCover"){
      result = displaykey.una.answerwarnings.PrimaryProtectionForPoolHottubWrongAnswer
    }

    return result
  }

  private function getWhatTypeOfBusinessIsConductedAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String

    if(answer.ChoiceAnswer.ChoiceCode == "AdultDaycare" or answer.ChoiceAnswer.ChoiceCode == "AssistedLiving"){
      result = displaykey.una.answerwarnings.TypeOfBusinessWrongAnswer
    }else if(answer.ChoiceAnswer.ChoiceCode == "ChildDaycare" and (answer as PeriodAnswer).Branch.BaseState != TC_FL){
      result = displaykey.una.answerwarnings.WhatTypeOfBusinessDaycareNonFL
    }

    return result
  }

  private function getHasCommercialDaycareLiabilityInsuranceAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String

    if(answer.BooleanAnswer){
      result = displaykey.una.answerwarnings.HasCommercialDaycareLiabilityInsuranceYes
    }else{
      result = displaykey.una.answerwarnings.HasCommercialDaycareLiabilityInsuranceNo
    }

    return result
  }

  private function getHasBusinessPolicyInPlaceHOAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String
    var branch = (answer as PeriodAnswer).Branch
    var typeOfBusiness : PCAnswerDelegate

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(branch.HomeownersLine_HOE.HOPolicyType)){
      typeOfBusiness = branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_DF.QuestionCode)
    }else{
      typeOfBusiness = branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_HO.QuestionCode)
    }


    if(!answer.BooleanAnswer and branch.BaseState != TC_TX and typeOfBusiness.ChoiceAnswer.ChoiceCode == "HomeOffice"){
      result = "Applicant's home based business activities may qualify for “Permitted Incidental Occupancy– Residence Premises (HO 04 42)"
    }

    return result
  }

  private function getHasMoldBeenProfessionallyRemovedAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String
    var isThereMoldDamage = (answer as PeriodAnswer).Branch.getAnswerForQuestionCode("IsThereAnyMoldDamage").BooleanAnswer

    if(isThereMoldDamage){
      if(answer.BooleanAnswer){
        result = displaykey.una.answerwarnings.HasMoldBeenProfessionallyRemovedYes
      }else{
        result = displaykey.una.answerwarnings.HasMoldBeenProfessionallyRemovedNo
      }
    }

    return result
  }

  private function getTotalNumberOfRentalUnitsAnswerMessage(answer: PCAnswerDelegate) : String{
    var result : String

    var unitsGreaterThan5 = {"6", "7", "8", "9", "10", "MoreThanTen"}

    if(unitsGreaterThan5.contains(answer.ChoiceAnswer.ChoiceCode)){
      result = displaykey.una.answerwarnings.TotalNumberOfRentalUnitsGreaterThan5
    }

    return result
  }
}
