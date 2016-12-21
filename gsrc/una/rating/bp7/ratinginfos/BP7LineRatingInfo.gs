package una.rating.bp7.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/7/16
 * Time: 3:57 PM
 */
class BP7LineRatingInfo {

  var _coverageType : BP7CoverageType_Ext as CoverageType
  var _coverageOptions : BP7CoverageOptions_Ext as CoverageOptions
  var _deductible : int as Deductible
  var _computerAttackLimit : int as ComputerAttackLimit

  construct(lineCov: BP7LineCov) {
    if(lineCov typeis BP7CyberOneCov_EXT){
      _coverageType = lineCov?.CoverageType_ExtTerm?.Value
      _coverageOptions = lineCov?.CoverageOptions_EXTTerm?.Value
      _deductible = lineCov?.Deductible_EXTTerm?.Value.intValue()
      _computerAttackLimit = lineCov?.ComputerAttackLimit_EXTTerm?.Value.intValue()
    }
  }
}