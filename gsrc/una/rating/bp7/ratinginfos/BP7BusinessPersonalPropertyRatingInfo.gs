package una.rating.bp7.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Rating info for the BP7 Business personal property coverage
 */
class BP7BusinessPersonalPropertyRatingInfo {

  var _occupancyType : BP7PredominentOccType_Ext as OccupancyType
  var _predominantOccupancyType : BP7ClassificationPropertyType as PredominantOccupancyType
  var _protectionClassCode : String as ProtectionClassCode
  var _protectionClassCodeInt : int as ProtectionClassCodeInt
  var _constructionType : BP7ConstructionType as ConstructionType

  var _businessIncomeExtraExpenseNumberOfMonths : String as BusinessIncomeExtraExpenseNumberOfMonths
  var _businessIncomeExtraExpenseLimit : BigDecimal as BusinessIncomeExtraExpenseLimit

  var _businessPersonalPropertyLimit : BigDecimal as BusinessPersonalPropertyLimit
  var _seasonalIncrease : BigDecimal as SeasonalIncrease

  var _businessLiabilityOccurrenceLimit : int as BusinessLiabilityOccurrenceLimit
  var _classificationClassCode : String as ClassificationClassCode

  construct(classificationCov : BP7ClassificationBusinessPersonalProperty){
    var classification = classificationCov?.Classification
    var building = classification?.Building
    var line = building?.Location?.Line
    _occupancyType = building.PredominentOccType_Ext
    _predominantOccupancyType = classification.ClassPropertyType
    _constructionType = building?.ConstructionType
    _protectionClassCode = building?.OverrideDwellingPCCode_Ext? building?.DwellingPCCodeOverridden_Ext : building?.DwellingProtectionClassCode
    _protectionClassCodeInt = (_protectionClassCode == "8B")? 9 : _protectionClassCode?.toInt()

    _businessIncomeExtraExpenseLimit = line?.BP7BuildingBusinessIncomeExtraExpense_EXT?.BP7AnnualBI_EXTTerm?.Value
    _businessIncomeExtraExpenseNumberOfMonths = line?.BP7BuildingBusinessIncomeExtraExpense_EXT?.BP7NumberOfMonths_EXTTerm?.DisplayValue
    _businessLiabilityOccurrenceLimit = line?.BP7BusinessLiability?.BP7EachOccLimitTerm?.Value.intValue()

    _businessPersonalPropertyLimit = classificationCov.BP7BusnPrsnlPropLimitTerm?.Value
    _seasonalIncrease = classificationCov?.BP7BusnPrsnlPropSeasIncTerm?.Value

    _classificationClassCode = classification.ClassDescription == null? "" : classification.ClassCode_Ext
  }
}