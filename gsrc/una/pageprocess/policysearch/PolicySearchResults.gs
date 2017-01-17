package una.pageprocess.policysearch

uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 10/10/16
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicySearchResults {

  public static function filteredSearchResults(searchResults: PolicyPeriodSummaryQuery, searchCriteria : PolicySearchCriteria): List<PolicyPeriodSummary>{
    var filteredList = new ArrayList<PolicyPeriodSummary>()
    if(searchCriteria.NameCriteria.MiddleName_Ext == null || searchCriteria.NameCriteria.MiddleName_Ext?.trim() == ""){
     return searchResults?.toList()
    }
    for(elt in searchResults?.toList()){
      var thePolicyPeriod = elt.fetchPolicyPeriod()
      var theInsuredContact = thePolicyPeriod.PNIContactDenorm
      var theMiddleName = searchCriteria.NameCriteria.MiddleName_Ext.trim()
      if(theMiddleName!=null && (theInsuredContact typeis Person) && (theInsuredContact as Person)?.MiddleName?.trim()?.startsWith(theMiddleName)){
        filteredList.add(elt)
      }
    }
    return filteredList
  }

}