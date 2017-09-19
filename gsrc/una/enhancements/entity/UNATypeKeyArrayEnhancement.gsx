package una.enhancements.entity

uses gw.entity.TypeKey
uses java.lang.IllegalArgumentException
uses gw.entity.ITypeList
uses gw.lang.reflect.TypeSystem
uses java.lang.IllegalStateException
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 9/6/17
 * Time: 11:01 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNATypeKeyArrayEnhancement: entity.TypekeyArray_Ext {
  public property set TypeCodes(codes : List<TypeKey>){
    var list = codes?.first().IntrinsicType

    if(codes?.allMatch( \ code -> code.IntrinsicType == list)){
      this.setFieldValue("TypeListName", list.Name)
      this.setFieldValue("Codes", codes?.join(","))
    }else{
      var typeKeys = codes*.IntrinsicType?.toSet()
      throw new IllegalArgumentException("All typecodes ${codes*.Code?.toList()} must belong to the same typelist.  Typelists '${typeKeys}' detected.")
    }
  }

  public property get TypeCodes() : List<TypeKey>{
    var results : List<TypeKey> = {}
    var typeList = TypeList
    var typeCodes = (this.getFieldValue("Codes") as String)?.split(",")

    typeCodes?.each(\ code -> {
      results.add(typeList.getTypeKey(code))
    })

    return results
  }

  public function addToTypeCodes(typeCode : TypeKey){
    if(typeCode == null){
      throw new IllegalStateException("typeCode cannot be null.")
    }

    var typeList = TypeList

    if(typeList == null){
      typeList = typeCode.IntrinsicType
      this.setFieldValue("TypeListName", typeList.Name)
    }

    if(typeList.getTypeKeys(true)?.contains(typeCode)){
      var codes = TypeListCodes

      if(codes == null){
        codes = new ArrayList<String>()
      }

      if(!codes?.contains(typeCode)){
        codes.add(typeCode.Code)
      }

      this.setFieldValue("Codes", codes?.join(","))
    }else{
      throw new IllegalArgumentException("Typecode ${typeCode.Code} does not belong to typeList of type ${typeList.Name}")
    }
  }

  public function removeFromTypeCodes(typeCode : TypeKey){
    var typeList = TypeList

    if(typeList != null and typeList.getTypeKeys(true).contains(typeCode)){
      var codes = TypeListCodes

      codes?.removeWhere( \ code -> code?.equalsIgnoreCase(typeCode.Code))
      this.setFieldValue("Codes", codes?.join(","))
    }else{
      throw new IllegalArgumentException("Typecode ${typeCode} does not belong to typeList of type ${typeList.Name}")
    }
  }

  private property get TypeList() : ITypeList{
    var result : ITypeList

    var listName = this.getFieldValue("TypeListName") as String

    if(listName != null){
      result = TypeSystem.getByFullName(listName) as ITypeList
    }

    return result
  }

  private property get TypeListCodes() : List<String>{
    return (this.getFieldValue("Codes") as String)?.split(",")?.toList()
  }
}
