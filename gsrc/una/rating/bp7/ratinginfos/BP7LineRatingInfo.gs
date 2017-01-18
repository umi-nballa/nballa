package una.rating.bp7.ratinginfos

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/7/16
 * Time: 3:57 PM
 */
class BP7LineRatingInfo {

  var _cyberOneCoverageType : BP7CoverageType_Ext as CyberOneCoverageType
  var _cyberOneCoverageOptions : BP7CoverageOptions_Ext as CyberOneCoverageOptions
  var _cyberOneDeductible : int as CyberOneDeductible
  var _cyberOneComputerAttackLimit : int as CyberOneComputerAttackLimit
  var _employeeDishonestyLimit : int as EmployeeDishonestyLimit
  var _numOfEmployees : int as NumOfEmployees
  var _forgeryOrAlterationLimit : BigDecimal as ForgeryOrAlterationLimit
  var _equipmentBreakdownEndorsementLimit : BigDecimal as EquipmentBreakdownEndorsementLimit
  var _hiredNonOwnedAutoLimit : BigDecimal as HiredNonOwnedAutoLimit
  var _numOfAdditionalInterestsFranchisors : int as NumOfAdditionalInterestsFranchisors
  var _numOfAdditionalInterestsLessorOfBuildings : int as NumOfAdditionalInterestsLessorOfBuildings
  var _numOfAdditionalInterestsLessorOfEqmt : int as NumOfAdditionalInterestsLessorOfEqmt
  var _numOfAdditionalInterestsDesignatedPersonOrOrg : int as NumOfAdditionalInterestsDesignatedPersonOrOrg
  var _medicalExpensesPerPersonLimit : BigDecimal as MedicalExpensesPerPersonLimit

  construct(lineCov: BP7LineCov) {
    if(lineCov typeis BP7CyberOneCov_EXT){
      _cyberOneCoverageType = lineCov?.CoverageType_ExtTerm?.Value
      _cyberOneCoverageOptions = lineCov?.CoverageOptions_EXTTerm?.Value
      _cyberOneDeductible = lineCov?.Deductible_EXTTerm?.Value.intValue()
      _cyberOneComputerAttackLimit = lineCov?.ComputerAttackLimit_EXTTerm?.Value.intValue()
    }
    if(lineCov typeis BP7EmployeeDishty){
      _employeeDishonestyLimit = lineCov.BP7Limit6Term?.Value.intValue()
      _numOfEmployees = lineCov?.BP7NoOfEmployeesEmployeeDishonesty_EXTTerm?.Value.intValue()
    }
    if(lineCov typeis BP7ForgeryAlteration){
      _forgeryOrAlterationLimit = lineCov?.BP7Limit7Term?.Value
    }
    if(lineCov typeis BP7EquipBreakEndor_EXT){
      _equipmentBreakdownEndorsementLimit = lineCov?.BP7EquipBreakEndorLimit_ExtTerm?.Value
    }
    if(lineCov typeis BP7HiredNonOwnedAuto){
      _hiredNonOwnedAutoLimit = lineCov?.BP7HiredAutoLimit_EXTTerm?.Value
    }
    if(lineCov typeis BP7AddlInsdGrantorOfFranchiseLine_EXT){
      _numOfAdditionalInterestsFranchisors = lineCov?.ScheduledItems?.Count
    }
    if(lineCov typeis BP7AddlInsdLessorsLeasedEquipmtLine_EXT){
      _numOfAdditionalInterestsLessorOfEqmt = lineCov?.ScheduledItems?.Count
    }
    if(lineCov typeis BP7AddlInsdManagersLessorsPremisesLine_EXT){
      _numOfAdditionalInterestsLessorOfBuildings = lineCov?.ScheduledItems?.Count
    }
    if(lineCov typeis BP7AddlInsdDesignatedPersonOrg){
      _numOfAdditionalInterestsDesignatedPersonOrOrg = lineCov?.ScheduledItems?.Count
    }
    if(lineCov typeis BP7BusinessLiability) {
      _medicalExpensesPerPersonLimit = lineCov?.BP7OptionalMedicalCovLimitPerPersonTerm?.Value
    }
  }
}