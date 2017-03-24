package util

uses gw.api.database.Query
uses java.util.Date
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/28/17
 * Time: 6:05 PM
 */
class TemplateSearchCriteria implements java.io.Serializable{

  var _type : DocumentType as Type
  //var _state : Jurisdiction as State
  var _lang:LanguageType as Language
  var _keywords : String as Keywords
  var _effdt : Date as effectiveDate


  function performSearch(searchCriteria : TemplateSearchCriteria) : Template_Ext[] {

    var result = Query.make(Template_Ext)

    if(searchCriteria.Type == null && searchCriteria.effectiveDate == null)
      {
           return result.select().toTypedArray()
      }

    if(searchCriteria.Type != null && searchCriteria.effectiveDate != null)
  {
        result.compare("Type" , Equals , searchCriteria.Type)
            .compare("DateEffective" , GreaterThanOrEquals , searchCriteria.effectiveDate)

    return result.select().toTypedArray()

  }

        if(searchCriteria.effectiveDate != null && searchCriteria.Type == null )
        {  result.compare("DateEffective" , LessThanOrEquals , searchCriteria.effectiveDate)

      return result.select().toTypedArray()
         }

    if(searchCriteria.effectiveDate == null && searchCriteria.Type != null )
    {  result.compare("Type" , Equals , searchCriteria.Type)

      return result.select().toTypedArray()
    }

  /*  if(searchCriteria.Type == null  && searchCriteria.Language != null){
      var result = Query.make(Template_Ext)
          .compare("Language" , Equals , searchCriteria.Language).select()
      return result.toTypedArray()
    }

    if(searchCriteria.Language != null && searchCriteria.Keywords != null){
      var result = Query.make(Template_Ext).compare("Type" , Equals , searchCriteria.Type )
          .compare("Keywords" , Equals , searchCriteria.Keywords).select()
      return result.toTypedArray()
    }
    if(searchCriteria.Language == null  && searchCriteria.Type != null){
      var result = Query.make(Template_Ext).compare("Type" , Equals , searchCriteria.Type ).select()
      return result.toTypedArray()
    }

    if( searchCriteria.Language == null && searchCriteria.Type == null){
      var result = Query.make(Template_Ext).select()
      return result.toTypedArray()
    }
    if(searchCriteria.Language != null  && searchCriteria.Type == null){
      var result = Query.make(Template_Ext).compare("Language" , Equals , searchCriteria.Language).select()
      return result.toTypedArray()
    }

    if(searchCriteria.Type != null && searchCriteria.Language == null){
      var result = Query.make(Template_Ext).compare("Type" , Equals , searchCriteria.Type).select()
      return result.toTypedArray()
    }

    var result = Query.make(Template_Ext).compare("Type" , Equals , Type ).select()
    return result.toTypedArray()*/


    return result.select().toTypedArray()
  }


}