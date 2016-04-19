package gw.lob.bp7.utils
uses gw.lob.common.util.SystemTableQuery

class BP7SysTableQueryUtil {

  static function getClassCode(classPropertyType : BP7ClassificationPropertyType, classDescription : typekey.BP7ClassDescription) : String {
    if(classPropertyType == null or classDescription == null)
      return null
    
    var classCodeQueryArgs = {
      BP7ClassCode#PropertyType.PropertyInfo.Name -> classPropertyType.Description,
      BP7ClassCode#Description.PropertyInfo.Name -> classDescription.Description
    }
    
    return SystemTableQuery.query(BP7ClassCode, classCodeQueryArgs, 
                                  BP7ClassCode#Code.PropertyInfo.Name).first()  
  }
  
  static function isLandscapeGardeningForClassification(classCode : String) : boolean {
    var landscapeGardeningClassCodes = {"24891", "24901"}
    return landscapeGardeningClassCodes.contains(classCode)
  }

}
