package una.integration.creditreport.testutil

uses typekey.State
uses typekey.CreditStatusExt
uses typekey.Jurisdiction
uses entity.CreditInfoExt
uses entity.CreditReportExt
uses entity.PolicyContactRole
uses typekey.UWCompanyCode
uses entity.PolicyPeriod
uses entity.CreditReportParametersExt
uses una.integration.mapping.creditreport.CreditReportRequest.Builder

uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.framework.util.CreditReportUtil
uses una.integration.plugins.creditreport.impl.InMemoryDataStoreManager
uses java.util.Date
uses gw.api.builder.SubmissionBuilder
uses una.integration.framework.util.CreditReportUtil

class CreditReportFactory {
      
  static function getReportDaysValid() : int {
    
    var creditReportParameters = CreditReportUtil.getCreditReportParameters(
            'HomeownersLine',
            typekey.UWCompanyCode.get("1111_11111"), // ACME Low Hazard Insurane
            typekey.Jurisdiction.get("VA")           // Virginia
          )
    
    return creditReportParameters.CreditReportDaysValid
  }
      
  static function createCreditReportRequest(index : int) : CreditReportRequest {

    var result : CreditReportRequest = null

    if(index >= 0 && index <= 9) {
                
      result = new CreditReportRequest
               .Builder()
               .withFirstName(AccountFactory.FirstNameArray[index])
               .withMiddleName(AccountFactory.MiddleNameArray[index])
               .withLastName(AccountFactory.LastNameArray[index])
               .withSocialSecurityNumber(AccountFactory.IsuredSocialSecurityNumberArray[index])
               .withAddress1(AccountFactory.AddressLine1Array[index])
               .withAddress2(AccountFactory.AddressLine2Array[index])
               .withAddresscity(AccountFactory.AddressCityArray[index])
               .withAddressState(AccountFactory.AddressStateArray[index] as String)
               .withAddressZip(AccountFactory.AddressZipArray[index])
               .withPolicyState(AccountFactory.AddressStateArray[index] as String)
               .withCacheExpireDate(AccountFactory.date)
               .withPublicId(AccountFactory.date as String)
               .withPriorAddressLine1(AccountFactory.AddressLine1Array[index])
               .withPriorAddressLine2(AccountFactory.AddressLine2Array[index])
               .withPriorAddressCity(AccountFactory.AddressCityArray[index])
               .withPriorAddressState(AccountFactory.AddressStateArray[index] as String)
               .withPriorAddressZip(AccountFactory.AddressZipArray[index])
               .create()
    }
    
    return result
  }
  
  static function createMemoryRecordCache(index : int) : Object {

    var result : Object = null

    if(index >= 0 && index <= 9) {
      for(cl in InMemoryDataStoreManager.Type.InnerClasses.toList()) {
        if(cl.Name.containsIgnoreCase("CachedCreditReport")) {
          var obj = cl.TypeInfo.getConstructor(null).Constructor.newInstance(null)
          for(fd in cl.TypeInfo.Properties) {
            switch(fd.Name) {
            
              case "AddressLine1":
                fd.Accessor.setValue(obj, AccountFactory.AddressLine1Array[index])
                break
              
              case "AddressCity":              
                fd.Accessor.setValue(obj, AccountFactory.AddressCityArray[index])
                break
              
              case "AddressState":
                fd.Accessor.setValue(obj, typekey.State.TC_CA)
                break
              
              case "AddressZip":
                fd.Accessor.setValue(obj, AccountFactory.AddressZipArray[index])
                break
              
              case "FirstName":
                fd.Accessor.setValue(obj, AccountFactory.FirstNameArray[index])
                break
              
              /*case "MiddleName":
                fd.Accessor.setValue(obj, LastNameArray[index])
                break*/
              
              case "LastName":
                fd.Accessor.setValue(obj, AccountFactory.LastNameArray[index])
                break
              
              case "CreditDate":
                fd.Accessor.setValue(obj, AccountFactory.date)
                break
              
              case "CreditScore":
                fd.Accessor.setValue(obj, AccountFactory.CreditScoreArray[index])
                break
              
              case "StatusCode":
                fd.Accessor.setValue(obj, AccountFactory.StatusCodeArray[index%7])
                break
              
              case "StatusDescription":
                fd.Accessor.setValue(obj, "GW")
                break
            }
          }
          result = obj
        }
      }
    }
    
    return result
  }
          
  static function createPersistentRecordCache(index : int) : CreditReportExt {

    var result : CreditReportExt = null

    if(index >= 0 && index <= 9) {
          
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
              
        var sm = new SubmissionBuilder()
                 .withProduct("PersonalAuto")
                 .withEffectiveDate(new java.util.Date())
                 .isDraft().create(bundle)
              
        var cr = new CreditReportExt(sm)
        cr.CreditReportOrder = index+1
        cr.CreditScore = AccountFactory.CreditScoreArray[index]
        cr.CreditBureau = "Equifax"
        cr.CreditScoreDate = gw.api.util.DateUtil.addDays(new java.util.Date(), 1)
        cr.FolderID = "100"
        cr.CreditStatus = AccountFactory.StatusCodeArray[1]
        cr.CreditStatusDescription = "GW"
        cr.FirstName = AccountFactory.FirstNameArray[index%7]
        cr.MiddleName = null
        cr.LastName = AccountFactory.LastNameArray[index]
        cr.AddressLine1 = AccountFactory.AddressLine1Array[index]
        cr.AddressCity = AccountFactory.AddressCityArray[index]
        cr.AddressState = typekey.State.TC_CA
        cr.AddressZip = AccountFactory.AddressZipArray[index]
        result = cr

        sm.PolicyContactRoles.first().addToCreditReportsExt(cr)
        sm.CreditInfoExt.CreditReport = cr
      }, "su")
    }
  
    return result
  }
}
