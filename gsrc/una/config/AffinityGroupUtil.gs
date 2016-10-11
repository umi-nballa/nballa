package una.config

uses gw.util.concurrent.LockingLazyVar
uses java.util.HashSet
uses java.math.BigDecimal
uses java.lang.NumberFormatException
uses gw.util.concurrent.LockingLazyVar
uses java.util.HashSet
uses java.util.Date
uses gw.api.database.Query
uses java.lang.IllegalStateException
uses java.lang.Integer
uses java.lang.Double
uses una.logging.UnaLoggerCategory
uses una.utils.EnvironmentUtil
uses java.util.HashMap
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: sgopal
 * Date: 10/6/16
 * Time: 9:07 PM
 * To change this template use File | Settings | File Templates.
 */
class AffinityGroupUtil {
  private static var _lazyJurisdictionParam = LockingLazyVar.make(\ -> new HashSet<Jurisdiction>())
  private static var _lazyPreferredBuilder = LockingLazyVar.make(\ -> new HashMap<Jurisdiction, List<String>>())
  private static var _lazyPreferredFinInst = LockingLazyVar.make(\ -> new HashMap<Jurisdiction, List<String>>())
  private static var _lazyPreferredEmployer = LockingLazyVar.make(\ -> new HashMap<Jurisdiction, List<String>>())


  public static function getAffinityDiscountByCategory(affinityDiscountCategory : AffinityDisCategory_Ext,
                                              jurisdiction : Jurisdiction) : List<String>{
    var result : List<String>
    var currentDate = Date.CurrentDate

    loadConfigurationParameters(jurisdiction)
    if(affinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDBUILDER){
      result = _lazyPreferredBuilder.get().get(jurisdiction)
    } else if(affinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDFININST) {
      result = _lazyPreferredFinInst.get().get(jurisdiction)
    } else {
      result = _lazyPreferredEmployer.get().get(jurisdiction)
    }
    return result
  }

  private static function loadConfigurationParameters(jurisdiction : Jurisdiction){
    var currentDate = Date.CurrentDate

    if(shouldLoadConfigParameter(jurisdiction)){
      var query = Query.make(AffinityDiscount_Ext)
          .compare(jurisdiction.Code, Equals, true)
      var queryResults = query.select()?.toList()
      if(queryResults.hasMatch( \ elt1 -> elt1.AffinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDBUILDER)) {
        var preferredBuilderList = new ArrayList<String>()
        queryResults.each( \ elt -> preferredBuilderList.add(elt.PreferredBuilderDescription))
        _lazyPreferredBuilder.get().put(jurisdiction, preferredBuilderList)
      }
      if(queryResults.hasMatch( \ elt1 -> elt1.AffinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDFININST)) {
        var preferredFinInst = new ArrayList<String>()
        queryResults.each( \ elt -> preferredFinInst.add(elt.PreferredFinancialInstitution))
        _lazyPreferredFinInst.get().put(jurisdiction, preferredFinInst)
      }
      if(queryResults.hasMatch( \ elt1 -> elt1.AffinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDEMPLOYER)) {
        var preferredEmployer = new ArrayList<String>()
        queryResults.each( \ elt -> preferredEmployer.add(elt.PreferredFinancialInstitution))
        _lazyPreferredEmployer.get().put(jurisdiction, preferredEmployer)
      }
    }
  }

  private static function shouldLoadConfigParameter(jurisdiction : Jurisdiction) : boolean {
    return !_lazyJurisdictionParam.get().contains(jurisdiction)
  }


}