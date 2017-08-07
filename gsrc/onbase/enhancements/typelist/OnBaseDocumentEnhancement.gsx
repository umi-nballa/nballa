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
    return new DocumentTypeUtil().getByName<OnBaseDocumentType_Ext>(OnBaseDocumentType_Ext, name)
  }

}
