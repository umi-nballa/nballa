package gw.plugin.protectionclass.impl

/** 
 * Note that this plugin class is not a formal plugin, but a regular Gosu class that is an integration point
 * for customer implementations.
 */
class ProtectionClassPlugin_HOE {

  /** 
   * Sets homeowner protection class code on the dwelling, based on territory code, distance from fire hydrant and
   * distance from fire station.   This method contains sample code that should be modified to call the external 
   * system/method that calculates the protection class code.
   */
  static function setProtectionClassCode(dwelling : entity.Dwelling_HOE) {
    
    if (dwelling.HOLocation.DistanceToFireHydrant == null or dwelling.HOLocation.DistanceToFireStation == null) {
      dwelling.HOLocation.DwellingProtectionClassCode = null
    }
    else {
      if (dwelling.HOLocation.DistanceToFireHydrant < 1000 and dwelling.HOLocation.DistanceToFireStation < 5) {
        dwelling.HOLocation.DwellingProtectionClassCode = typekey.ProtectionClassCode_Ext.TC_1//"01"
      }
      else {
        if ((dwelling.HOLocation.DistanceToFireHydrant >= 1000 and dwelling.HOLocation.DistanceToFireHydrant < 2000) and
          (dwelling.HOLocation.DistanceToFireStation >= 5 and dwelling.HOLocation.DistanceToFireStation < 10)) {
          dwelling.HOLocation.DwellingProtectionClassCode = typekey.ProtectionClassCode_Ext.TC_2//"02"
        }
        else {
          dwelling.HOLocation.DwellingProtectionClassCode = typekey.ProtectionClassCode_Ext.TC_3//"03"
        }
      }
    }
  }

}
