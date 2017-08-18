package una.enhancements.entity

uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem
uses gw.api.database.Query

/**
 * Created with IntelliJ IDEA.
 * User: tvang
 * Date: 8/17/17
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADocumentRequestEnhancement : entity.DocumentRequest_Ext {
  public property set AssociatedEntity(bean : gw.pl.persistence.core.Bean){
    var entityName = bean.IntrinsicType.Name
    var entityID = bean?.getFieldValue("PublicID")

    if(entityName != null and entityID != null){
      this.setFieldValue("RelatedEntityID", entityID)
      this.setFieldValue("RelatedEntityType", entityName)
    }
  }

  public property get AssociatedEntity() : gw.pl.persistence.core.Bean{
    var result : gw.pl.persistence.core.Bean
    var relatedEntityName = this.getFieldValue("RelatedEntityType")?.toString()
    var relatedEntityType : IType
    var relatedEntityID = this.getFieldValue("RelatedEntityID")?.toString()

    if(relatedEntityName != null){
      relatedEntityType = TypeSystem.getByFullName(relatedEntityName)
    }

    if(relatedEntityType != null and relatedEntityID != null){
      result = Query.make(relatedEntityType)?.compare("PublicID", Equals, relatedEntityID)?.select()?.atMostOne()
    }

    return result
  }
}
