package una.utils

uses java.util.Map
uses una.systables.UNASystemTableQueryUtil
uses gw.api.database.Query

/**
 * Created with IntelliJ IDEA.
 * User: tmanickavachagam
 * Date: 4/20/17
 * Time: 12:48 PM
 * To change this template use File | Settings | File Templates.
 */
class CPPUtil {
  public static final var PACKAGE_RISK_TO_GL_CLASS_CODES : Map<PackageRisk, GLClassCode> = initPackageRiskToGLClassCodes()

  public static function setClassCodes(policyPeriod : PolicyPeriod) {
    if(!policyPeriod.GLLine.Exposures.IsEmpty){
      for(exposure in policyPeriod.GLLine.Exposures){
        if(exposure!=null)
          exposure.ClassCode = PACKAGE_RISK_TO_GL_CLASS_CODES.get(policyPeriod.Policy.PackageRisk)
      }
    }
  }

  private static function initPackageRiskToGLClassCodes() : Map<PackageRisk, GLClassCode>{
    var glClassCodes = Query.make(GLClassCode).or(\ orCriteria -> {orCriteria.compare(GLClassCode#Code, Equals, "60011")
                                                                   orCriteria.compare(GLClassCode#Code, Equals, "62003")
                                                                   orCriteria.compare(GLClassCode#Code, Equals, "68500")}).select().toList()
    return {TC_APARTMENT -> glClassCodes.atMostOneWhere( \ glCode -> glCode.Code == "60011"),
            TC_CONDOMINIUMASSOCIATION -> glClassCodes.atMostOneWhere( \ glCode -> glCode.Code == "62003"),
            TC_HOMEOWNERSASSOCIATION -> glClassCodes.atMostOneWhere( \ glCode -> glCode.Code == "68500")
           }
  }
}