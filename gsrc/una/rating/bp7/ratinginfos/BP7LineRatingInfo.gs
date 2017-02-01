package una.rating.bp7.ratinginfos

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/7/16
 * Rating info for the BP7 Line coverages
 */
class BP7LineRatingInfo {

  var _cyberOneCoverageType : BP7CoverageType_Ext as CyberOneCoverageType
  var _cyberOneCoverageOptions : BP7CoverageOptions_Ext as CyberOneCoverageOptions
  var _cyberOneDeductible : int as CyberOneDeductible
  var _cyberOneComputerAttackLimit : int as CyberOneComputerAttackLimit
  var _employeeDishonestyLimit : int as EmployeeDishonestyLimit
  var _numOfEmployees : int as NumOfEmployees
  var _equipmentBreakdownEndorsementLimit : BigDecimal as EquipmentBreakdownEndorsementLimit
  var _hiredNonOwnedAutoLimit : BigDecimal as HiredNonOwnedAutoLimit
  var _numOfAdditionalInterestsFranchisors : int as NumOfAdditionalInterestsFranchisors
  var _numOfAdditionalInterestsLessorOfBuildings : int as NumOfAdditionalInterestsLessorOfBuildings
  var _numOfAdditionalInterestsLessorOfEqmt : int as NumOfAdditionalInterestsLessorOfEqmt
  var _numOfAdditionalInterestsDesignatedPersonOrOrg : int as NumOfAdditionalInterestsDesignatedPersonOrOrg
  var _medicalExpensesPerPersonLimit : BigDecimal as MedicalExpensesPerPersonLimit
  var _ordinanceOrLawCoverage : String as OrdinanceOrLawCoverage
  var _ordinanceOrLawCoverage1Limit : BigDecimal as OrdinanceOrLawCoverage1Limit
  var _ordinanceOrLawCoverage2Limit : BigDecimal as OrdinanceOrLawCoverage2Limit
  var _ordinanceOrLawCoverage3Limit : BigDecimal as OrdinanceOrLawCoverage3Limit
  var _dataCompromiseFirstPartyLimit : BigDecimal as DataCompromiseFirstPartyLimit
  var _dataCompromiseFirstPartyDeductible : BigDecimal as DataCompromiseFirstPartyDeductible
  var _dataCompromiseFirstPartyForensicITLegalReviewLimit : String as DataCompromiseFirstPartyForensicITLegalReviewLimit
  var _dataCompromiseFirstThirdPartyLimit : BigDecimal as DataCompromiseFirstThirdPartyLimit
  var _dataCompromiseFirstThirdPartyDeductible : BigDecimal as DataCompromiseFirstThirdPartyDeductible
  var _dataCompromiseFirstThirdPartyForensicITLegalReviewLimit : String as DataCompromiseFirstThirdPartyForensicITLegalReviewLimit
  var _classificationClassCode : String as ClassificationClassCode
  var _employmentPracticesLiabilityCoverageOptions : String as EmploymentPracticesLiabilityCoverageOptions
  var _employmentPracticesLiabilityLimit : int as EmploymentPracticesLiabilityLimit
  var _employmentPracticesLiabilityDeductible : int as EmploymentPracticesLiabilityDeductible
  var _numberOfFullTimeEmployees : int as NumberOfFullTimeEmployees
  var _numberOfPartTimeEmployees : int as NumberOfPartTimeEmployees
  var _employeeDishonestyPremium : BigDecimal as EmployeeDishonestyPremium = 0.0

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
    if(lineCov typeis BP7OrdinanceOrLawCov_EXT){
      _ordinanceOrLawCoverage = lineCov.BP7OrdinLawCov_EXTTerm?.DisplayValue
      _ordinanceOrLawCoverage1Limit = lineCov?.Cov1Limit_EXTTerm?.Value
      _ordinanceOrLawCoverage2Limit = lineCov?.Cov2Limit_EXTTerm?.Value
      _ordinanceOrLawCoverage3Limit = lineCov?.Cov3Limit_EXTTerm?.Value
    }
    if(lineCov typeis DataCmprmiseRspnseExpns_EXT){
      _dataCompromiseFirstPartyLimit = lineCov.DataCmprmseRspnseExpnsLimit_EXTTerm?.Value
      _dataCompromiseFirstPartyDeductible = lineCov.DataCmprmseRspnseExpnsDeduc_EXTTerm?.Value
      _dataCompromiseFirstPartyForensicITLegalReviewLimit = lineCov.ForensicITLegalRvwSublimits_EXTTerm?.DisplayValue
      _classificationClassCode = lineCov.BP7Line.AllBuildings*.Classifications?.first().ClassCode_Ext
    }
    if(lineCov typeis BP7DataCompromiseDfnseandLiabCov_EXT){
      _dataCompromiseFirstThirdPartyLimit = lineCov.DataCompromiseDfnseandLiabCovLimit_EXTTerm?.Value
      _dataCompromiseFirstThirdPartyDeductible = lineCov.DataCompromiseDfnseandLiabCovDeduc_EXTTerm?.Value
      _dataCompromiseFirstThirdPartyForensicITLegalReviewLimit = lineCov.DfnseLiabForensicITLegalRvwSublimits_EXTTerm?.DisplayValue
      _classificationClassCode = lineCov.BP7Line.AllBuildings*.Classifications?.first().ClassCode_Ext
    }
    if(lineCov typeis BP7EmploymentPracticesLiabilityCov_EXT){
      _employmentPracticesLiabilityLimit = lineCov?.EmployPracLiabCovLimit_EXTTerm?.Value?.intValue()
      _employmentPracticesLiabilityDeductible = lineCov?.EmployPracLiabCovDeduc_EXTTerm?.Value?.intValue()
      _employmentPracticesLiabilityCoverageOptions = lineCov?.CovOptions_EXTTerm?.DisplayValue
      _numberOfFullTimeEmployees = lineCov?.BP7Line?.NoOfEmployees_Ext?.intValue()
      _numberOfPartTimeEmployees = lineCov?.BP7Line?.NoOfPartEmployee_Ext?.intValue()
    }
  }
}