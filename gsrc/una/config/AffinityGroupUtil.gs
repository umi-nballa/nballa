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
uses java.util.Map
uses java.util.Calendar

/**
 * Created with IntelliJ IDEA.
 * User: sgopal
 * Date: 10/6/16
 * Time: 9:07 PM
 * To change this template use File | Settings | File Templates.
 */
class AffinityGroupUtil {
  private static var _lazyJurisdictionParam = LockingLazyVar.make(\ -> new HashSet<Jurisdiction>())
  private static var _lazyPreferredBuilder = LockingLazyVar.make(\ -> new HashMap<Jurisdiction, Map<String, Date>>())
  private static var _lazyPreferredFinInst = LockingLazyVar.make(\ -> new HashMap<Jurisdiction, Map<String, Date>>())
  private static var _lazyPreferredEmployer = LockingLazyVar.make(\ -> new HashMap<Jurisdiction, Map<String, Date>>())
  private static final var START_DATE = "StartDate"


  public static function getAffinityDiscountByCategory(affinityDiscountCategory : AffinityDisCategory_Ext,
                                              jurisdiction : Jurisdiction, effectiveDate : Date) : List<String>{
    var result : List<String>
    var currentDate = Date.CurrentDate

    loadConfigurationParameters(jurisdiction)
    if(affinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDBUILDER){
      result = getValidPreferredList(_lazyPreferredBuilder.get().get(jurisdiction), effectiveDate)
    } else if(affinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDFININST) {
      result = getValidPreferredList(_lazyPreferredFinInst.get().get(jurisdiction), effectiveDate)
    } else {
      result = getValidPreferredList(_lazyPreferredEmployer.get().get(jurisdiction), effectiveDate)
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
        var preferredBuilderMap = new HashMap<String, Date>()
        queryResults.each( \ elt -> {
          if(elt.PreferredBuilderDescription != null && elt.getFieldValue(jurisdiction.Code+START_DATE) != null)
          preferredBuilderMap.put(elt.PreferredBuilderDescription,
              elt.getFieldValue(jurisdiction.Code+START_DATE) as java.util.Date)
        })
        _lazyPreferredBuilder.get().put(jurisdiction, preferredBuilderMap)
      }
      if(queryResults.hasMatch( \ elt1 -> elt1.AffinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDFININST)) {
        var preferredFinInstMap = new HashMap<String, Date>()
        queryResults.each( \ elt -> {
          if(elt.PreferredFinancialInstitution != null && elt.getFieldValue(jurisdiction.Code+START_DATE) != null) {
            preferredFinInstMap.put(elt.PreferredFinancialInstitution,
                elt.getFieldValue(jurisdiction.Code+START_DATE) as java.util.Date)
          }
        })
        _lazyPreferredFinInst.get().put(jurisdiction, preferredFinInstMap)
      }
      if(queryResults.hasMatch( \ elt1 -> elt1.AffinityDiscountCategory == AffinityDisCategory_Ext.TC_PREFERREDEMPLOYER)) {
        var preferredEmployerMap = new HashMap<String, Date>()
        queryResults.each( \ elt -> {
          if(elt.PreferredEmployer != null && elt.getFieldValue(jurisdiction.Code+START_DATE) != null) {
            preferredEmployerMap.put(elt.PreferredEmployer,
                elt.getFieldValue(jurisdiction.Code+START_DATE) as java.util.Date)
          }
        })
        _lazyPreferredEmployer.get().put(jurisdiction, preferredEmployerMap)
      }
      _lazyJurisdictionParam.get().add(jurisdiction)
    }
  }

  private static function shouldLoadConfigParameter(jurisdiction : Jurisdiction) : boolean {
    var load = !_lazyJurisdictionParam.get().contains(jurisdiction)
    return load
  }

  private static function getValidPreferredList(preferredMap : Map<String, Date>, effectiveDate : Date): List<String> {
    var preferredList = new ArrayList<String>()
    preferredMap?.eachKey( \ key -> {
      if(preferredMap.get(key) != null && preferredMap.get(key)?.before(effectiveDate)) {
        preferredList.add(key)
      }
    })
    return preferredList
  }

  /**
  * Method to set the Affinity Discount Eligibility based on the Jurisdiction
  */
  public static function setAffinityDiscountEligibility(polPeriod : PolicyPeriod) : boolean {
    var yearBuilt = polPeriod.HomeownersLine_HOE?.Dwelling?.YearBuilt != null ? polPeriod.HomeownersLine_HOE?.Dwelling?.YearBuilt : 0
    var ageOfHome = Calendar.getInstance().get(Calendar.YEAR) - yearBuilt
    var affinityDiscount = false
    switch(polPeriod.BaseState){
      case Jurisdiction.TC_AZ :
          if((polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO3
              or polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO6)
                and ageOfHome < 11 and (polPeriod.PreferredBuilder_Ext != null
                  or polPeriod.PreferredFinInst_Ext != null or polPeriod.PreferredEmpGroup_Ext != null)) {
            affinityDiscount = true
          }
      break
      case Jurisdiction.TC_CA :
          if(ageOfHome < 11 or polPeriod.PreferredBuilder_Ext != null or polPeriod.PreferredFinInst_Ext != null ) {
            affinityDiscount = true
          }
      break
      case Jurisdiction.TC_FL :
      break
      case Jurisdiction.TC_HI :
          if(polPeriod.PreferredFinInst_Ext != null ) {
            affinityDiscount = true
          }
      break
      case Jurisdiction.TC_NV :
          if((polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO3
              or polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO6)
              and ageOfHome < 11 and (polPeriod.PreferredBuilder_Ext != null
                  or polPeriod.PreferredFinInst_Ext != null)) {
            affinityDiscount = true
          }
      break
      case Jurisdiction.TC_NC :
          if((polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO3
              or polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO6
                or polPeriod.HomeownersLine_HOE.HOPolicyType == TC_DP3_EXT)
                  and ((ageOfHome < 5 and polPeriod.PreferredBuilder_Ext != null)
                  or polPeriod.PreferredFinInst_Ext != null)) {
            affinityDiscount = true
          }
      break
      case Jurisdiction.TC_SC :
          if((polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO3
              or polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HO6)
              and ageOfHome < 11 and (polPeriod.PreferredBuilder_Ext != null
                  or polPeriod.PreferredFinInst_Ext != null)) {
            affinityDiscount = true
          }
      break
      case Jurisdiction.TC_TX :
          if(polPeriod.HomeownersLine_HOE.HOPolicyType == TC_HOB_EXT && polPeriod.PreferredEmpGroup_Ext != null ) {
            affinityDiscount = true
          }
       break
      default :
    }
    if(!affinityDiscount) {
      polPeriod.QualifiesAffinityDisc_Ext = false
    } else {
      polPeriod.QualifiesAffinityDisc_Ext = true
    }
    return affinityDiscount
  }

}