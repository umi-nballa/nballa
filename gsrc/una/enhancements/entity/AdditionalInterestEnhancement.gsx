package una.enhancements.entity
uses gw.entity.TypeKey

/**
 * Created with IntelliJ IDEA.
 * User: tmanickam
 * Date: 11/10/16
 * Time: 1:56 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement AdditionalInterestEnhancement : entity.AdditionalInterest {


  static function getAdditionalInterestTypes(addlInterestDetail:AddlInterestDetail,contact:Contact) : List {
    var addnlInterestTypes : List<TypeKey>

    if(addlInterestDetail.Branch.CPLineExists) {
      addnlInterestTypes = AdditionalInterestType.Type.getTypeKeysByCategory(typekey.AddlInterestDetail.TC_CPBLDGADDLINTEREST)
      return addnlInterestTypes.where( \ elt -> elt.Categories.contains(typekey.AddlInterestDetail.TC_CPBLDGADDLINTEREST)).toList()
    }else if(addlInterestDetail.Branch.HomeownersLine_HOEExists){
      var contactType =  contact typeis Company ? ContactType.TC_COMPANY : ContactType.TC_PERSON
      addnlInterestTypes = AdditionalInterestType.Type.getTypeKeysByCategories({contactType, typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE})
      if(addlInterestDetail.Branch.BaseState != TC_SC) {
        addnlInterestTypes.removeWhere( \ elt -> elt.Code == "premiumFinanceCompany_Ext")
      }
    }else if(addlInterestDetail.Branch.BP7LineExists) {
      addnlInterestTypes = AdditionalInterestType.Type.getTypeKeysByCategory(typekey.AddlInterestDetail.TC_BP7BLDGADDLINTEREST)
      return addnlInterestTypes.where( \ elt -> elt.Categories.contains(typekey.AddlInterestDetail.TC_BP7BLDGADDLINTEREST)).toList()
    }
    return addnlInterestTypes
  }
}
