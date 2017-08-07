package onbase.enhancements.typelist

uses gw.entity.ITypeList
uses gw.entity.TypeKey

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 8/4/17
 * Time: 4:33 PM
 * To change this template use File | Settings | File Templates.
 */
class DocumentTypeUtil {

  public function getByName<T extends TypeKey>(typeList: ITypeList, name: String) : T {

    return typeList.getTypeKeys().firstWhere( \ elt -> elt.DisplayName.replaceAll(" ", "").equalsIgnoreCase(name.replaceAll(" ", ""))) as T
  }
}