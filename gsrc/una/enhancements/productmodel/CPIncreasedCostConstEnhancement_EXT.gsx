package una.enhancements.productmodel
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
/**
 * Created with IntelliJ IDEA.
 * User: SKashyap
 * To change this template use File | Settings | File Templates.
 */
enhancement CPIncreasedCostConstEnhancement_EXT: productmodel.CPIncreasedCostConst_EXT
{

  /*static function setDefaultLimit(building:entity.CPBuilding):void
  {
    if(building.CPBldgCov.CPBldgCovLimitTerm!=null && 0.05*building.CPBldgCov.CPBldgCovLimitTerm.Value.compareTo(new BigDecimal(10000))==-1)
      {
      building.CPIncreasedCostConst_EXT.CPIncreasedCostLimit_EXTTerm.Value=0.05*building.CPBldgCov.CPBldgCovLimitTerm.Value
    }
    else
    {
      building.CPIncreasedCostConst_EXT.CPIncreasedCostLimit_EXTTerm.Value=new BigDecimal(10000)
    }
  }  */

}