package onbase.enhancements.typelist
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 12/2/16
 * Time: 1:22 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement OnBaseDocumentEnhancement : typekey.OnBaseDocumentType_Ext {
  public static function getByName(name: String): OnBaseDocumentType_Ext {
    return typekey.OnBaseDocumentType_Ext.getTypeKeys().firstWhere( \ elt -> elt.DisplayName.equalsIgnoreCase(name))
  }
}
