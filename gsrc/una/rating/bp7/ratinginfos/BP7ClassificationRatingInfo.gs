package una.rating.bp7.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/7/16
 * Rating info for the BP7 classification coverages
 */
class BP7ClassificationRatingInfo {

  var _spoilageType : String as SpoilageType
  var _spoilageCovLimit : BigDecimal as SpoilageCovLimit
  var _accountsReceivableLimit : BigDecimal as AccountsReceivableLimit
  var _valuablePapersAndRecordsLimit : BigDecimal as ValuablePapersAndRecordsLimit
  var _condoCommercialMiscRealPropertyLimit : BigDecimal as CondoCommercialMiscRealPropertyLimit
  var _condoCommercialLossAssessmentLimit : BigDecimal as CondoCommercialLossAssessmentLimit
  var _businessIncomeFromDependentPropertiesLimit : BigDecimal as BusinessIncomeFromDependentPropertiesLimit
  var _numOfBarbers : int as NumOfBarbers
  var _numOfManicurists :int as NumOfManicurists
  var _numOfFullTimeBeauticians : int as NumOfFullTimeBeauticians
  var _numOfPartTimeBeauticians : int as NumOfPartTimeBeauticians
  var _businessLiabilityOccurrenceLimit : int as BusinessLiabilityOccurrenceLimit
  var _hearingAidSvcsProfLiabLimit : BigDecimal as HearingAidSvcsProfLiabLimit
  var _optProfLiabLimit : BigDecimal as OptProfLiabLimit
  var _numOfFuneralsAnnually : int as NumOfFuneralsAnnually
  var _funeralDirectorsProfLiabLimit : BigDecimal as FuneralDirectorsProfLiabLimit

  construct(classification : BP7Classification){
    _businessLiabilityOccurrenceLimit = classification?.Building.Location?.Line?.BP7BusinessLiability?.BP7EachOccLimitTerm?.Value.intValue()
    if(classification.BP7SpoilgCovExists){
      _spoilageType = classification?.BP7SpoilgCov?.BP7CovType2Term?.DisplayValue
      _spoilageCovLimit = classification?.BP7SpoilgCov?.BP7Limit32Term?.Value
    }
    if(classification.BP7ClassificationAccountsReceivableExists){
      _accountsReceivableLimit = classification?.BP7ClassificationAccountsReceivable?.BP7LimitatDescribedPremises_EXTTerm?.Value
    }
    if(classification.BP7ClassificationValuablePapersExists){
      _valuablePapersAndRecordsLimit = classification?.BP7ClassificationValuablePapers?.BP7LimitDescribedPremises_EXTTerm?.Value
    }
    if(classification.BP7CondoCommlUnitOwnersOptionalCovMiscRealPropExists){
      _condoCommercialMiscRealPropertyLimit = classification?.BP7CondoCommlUnitOwnersOptionalCovMiscRealProp?.Limit_EXTTerm?.Value
    }
    if(classification.BP7CondoCommlUnitOwnersOptionalCovsLossAssessExists){
      _condoCommercialLossAssessmentLimit = classification?.BP7CondoCommlUnitOwnersOptionalCovsLossAssess?.LimitTerm?.Value
    }
    if(classification.BP7ClassificationBusinessIncomeFromDependentPropsExists){
      _businessIncomeFromDependentPropertiesLimit = classification?.BP7ClassificationBusinessIncomeFromDependentProps?.BP7Limit38Term?.Value
    }
    if(classification.BP7BarbersBeauticiansProfessionalLiability_EXTExists){
      _numOfBarbers = classification?.BP7BarbersBeauticiansProfessionalLiability_EXT?.BP7NumBarbers_EXTTerm?.Value?.intValue()
      _numOfManicurists = classification?.BP7BarbersBeauticiansProfessionalLiability_EXT?.BP7NumManicuristTerm?.Value?.intValue()
      _numOfFullTimeBeauticians = classification?.BP7BarbersBeauticiansProfessionalLiability_EXT?.BP7NumFullTimeBeauticiansTerm?.Value?.intValue()
      _numOfPartTimeBeauticians = classification?.BP7BarbersBeauticiansProfessionalLiability_EXT?.BP7NumPartTimeBeauticiansTerm?.Value?.intValue()
    }
    if(classification.BP7HearingAidSvcsProfLiab_EXTExists){
      _hearingAidSvcsProfLiabLimit = classification?.BP7HearingAidSvcsProfLiab_EXT?.BP7HearingAidSvcsProfLiabLimit_EXTTerm?.Value
    }
    if(classification.BP7OptProfLiabCov_EXTExists){
      _optProfLiabLimit = classification?.BP7OptProfLiabCov_EXT?.BP7OptProfLiabCovLimit_EXTTerm?.Value
    }
    if(classification.BP7FuneralDirectorsProflLiab_EXTExists){
      _numOfFuneralsAnnually = classification?.BP7FuneralDirectorsProflLiab_EXT?.NumberofFunerals_EXTTerm?.Value.intValue()
      _funeralDirectorsProfLiabLimit = classification?.BP7FuneralDirectorsProflLiab_EXT?.BP7FuneralLimit_EXTTerm?.Value
    }
  }
}