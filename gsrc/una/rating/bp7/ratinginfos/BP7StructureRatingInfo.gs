package una.rating.bp7.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/21/16
 */
class BP7StructureRatingInfo {

  var _automaticSprinklerSystems : boolean as AutomaticSprinklerSystems
  var _occupancyType : BP7PredominentOccType_Ext as OccupancyType
  var _predominantOccupancyType : BP7PropertyType as PredominantOccupancyType
  var _protectionClassCode : String as ProtectionClassCode
  var _protectionClassCodeInt : int as ProtectionClassCodeInt
  var _constructionType : BP7ConstructionType as ConstructionType

  var _businessIncomeExtraExpenseNumberOfMonths : String as BusinessIncomeExtraExpenseNumberOfMonths
  var _businessIncomeExtraExpenseLimit : BigDecimal as BusinessIncomeExtraExpenseLimit

  var _automaticIncreasePercentage : String as AutomaticIncreasePercentage
  var _buildingLimit : BigDecimal as BuildingLimit
  var _buildingValuationFactor : String as BuildingValuationFactor
  var _buildingOwnerOccupies : BigDecimal as BuildingOwnerOccupies

  var _businessLiabilityOccurrenceLimit : int as BusinessLiabilityOccurrenceLimit
  var _classificationClassCode : String as ClassificationClassCode

  construct(buildingCov : BP7Structure){
    var building = buildingCov?.Building
    var line = building?.Location?.Line
    _buildingLimit = buildingCov?.BP7BuildingLimitTerm?.Value
    _buildingValuationFactor = buildingCov?.BP7RatingBasisTerm?.DisplayValue
    _automaticIncreasePercentage = buildingCov?.BP7AutomaticIncreasePct1Term?.DisplayValue
    _buildingOwnerOccupies = buildingCov?.BP7BuildingOwnerOccupies_EXTTerm?.Value

    _automaticSprinklerSystems = building.Sprinklered
    _occupancyType = building?.PredominentOccType_Ext
    _predominantOccupancyType = building?.PropertyType
    _constructionType = building?.ConstructionType

    _businessIncomeExtraExpenseLimit = line?.BP7BuildingBusinessIncomeExtraExpense_EXT?.BP7AnnualBI_EXTTerm?.Value
    _businessIncomeExtraExpenseNumberOfMonths = line?.BP7BuildingBusinessIncomeExtraExpense_EXT?.BP7NumberOfMonths_EXTTerm?.DisplayValue
    _businessLiabilityOccurrenceLimit = line?.BP7BusinessLiability?.BP7EachOccLimitTerm?.Value.intValue()
    _protectionClassCode = building?.OverrideDwellingPCCode_Ext? building?.DwellingPCCodeOverridden_Ext : building?.DwellingProtectionClassCode
    _protectionClassCodeInt = (_protectionClassCode == "8B")? 9 : _protectionClassCode?.toInt()

    _classificationClassCode = building.Classifications?.first().ClassCode_Ext
  }
}