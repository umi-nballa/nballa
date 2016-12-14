package onbase.enhancements.typelist
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 12/2/16
 * Time: 1:22 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement OnBaseDocumentSubtypeEnhancement: typekey.OnBaseDocumentSubtype_Ext {
  public static function getByName(name: String): OnBaseDocumentSubtype_Ext {
    return typekey.OnBaseDocumentSubtype_Ext.getTypeKeys().firstWhere( \ elt -> elt.DisplayName.equalsIgnoreCase(name))
  }
}
