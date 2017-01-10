package una.productmodel
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 1/5/17
 * Time: 10:52 AM
 * To change this template use File | Settings | File Templates.
 */
class GLAutoPopulateUtil {

    public static function setCoveragesFromDefaultScreen(gLine:GeneralLiabilityLine):boolean
    {
      if(gLine.GLTerrorCov_EXTExists)
        {
         // gLine.addToGLLineConditions(gLine.ExcludeCertifiedActsTerrorism_EXT)
        gLine.setConditionExists(gLine.ExcludeCertifiedActsTerrorism_EXT.PatternCode,true)
         }
      gLine.syncConditions()
      gLine.refresh()

      return true

    }

}