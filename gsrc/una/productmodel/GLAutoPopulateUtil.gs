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
//          if(!gLine.GLCapOnLossesTerr_ExtExists)
//            gLine.setConditionExists(gLine.GLCapOnLossesTerr_Ext.PatternCode,true)
          if(gLine.ExcludeCertifiedActsTerrorism_EXTExists)
            gLine.removeExclusionFromCoverable(gLine.ExcludeCertifiedActsTerrorism_EXT)
         }

      if(!gLine.GLTerrorCov_EXTExists)
      {
        // gLine.addToGLLineConditions(gLine.ExcludeCertifiedActsTerrorism_EXT)
        if(gLine.GLCapOnLossesTerr_ExtExists)
          gLine.removeConditionFromCoverable(gLine.GLCapOnLossesTerr_Ext)
//        if(!gLine.ExcludeCertifiedActsTerrorism_EXTExists)
//          gLine.setExclusionExists(gLine.ExcludeCertifiedActsTerrorism_EXT.PatternCode,true)
      }
      gLine.syncConditions()
      gLine.syncConditions()
      gLine.refresh()

      return true

    }

}