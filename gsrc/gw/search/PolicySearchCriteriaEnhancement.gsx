package gw.search
uses gw.api.database.IQueryBeanResult
uses gw.api.util.DisplayableException
uses gw.api.database.Query

enhancement PolicySearchCriteriaEnhancement : entity.PolicySearchCriteria {

  function search() : IQueryBeanResult<PolicyPeriodSummary> {
    /**
    // Additional criteria can be added to the policy period search query using 
    // SummaryQuery like the following...  
    
    // construct the query using the base product criteria fields
    var query = this.SummaryQuery
    
    // Add any additional query logic here for extension criteria fields
    // In this example, we are adding a subselect to find policy periods containing a vehicle with
    // a matching VIN
    var subQuery = new Query<PolicyPeriodSummary>(PolicyPeriodSummary)
    var vehTable = subQuery.subselect("ID", CompareIn, PersonalVehicle, "BranchValue")
    vehTable.compare("Vin", Equals, vin)
    query = query.intersect(subQuery)
    
    // Then execute the query and check whether it exceeds a max number of rows
    var result = query.select()
    if(result.getCountLimitedBy(MAX + 1) > MAX) throw "Too many results"
    */
    
    // If no additional criteria are required, this method will construct the query and execute 
    // the select as above.
    //PC.24.01.25 changes
    if (!meetsMinimumSearchCriteria()) {
      if(this.SearchObjectType == SearchObjectType.TC_POLICY or this.SearchObjectType == SearchObjectType.TC_REWRITE
          or this.SearchObjectType == SearchObjectType.TC_REWRITENEWACCOUNT or this.SearchObjectType == SearchObjectType.TC_RENEWAL
          or this.SearchObjectType == SearchObjectType.TC_CANCELLATION or this.SearchObjectType == SearchObjectType.TC_POLICYCHANGE
          or this.SearchObjectType == SearchObjectType.TC_REINSTATEMENT){
        throw new DisplayableException(displaykey.Web.Policy.MinimumPolicySearchCriteria);
      }else{
        throw new DisplayableException(displaykey.Web.Policy.MinimumSearchCriteria)
      }
    }

    // Adding HO Policy Type to the Policy Search Criteria - PC.24.01.20
    if(this.HOPolicyType != null) {
      var query = this.SummaryQuery
      var subQuery = new Query<PolicyPeriodSummary>(PolicyPeriodSummary)
      var dwellingTable = subQuery.subselect("ID", CompareIn, Dwelling_HOE, "BranchValue")
      dwellingTable.compare("HOPolicyType", Equals, this.HOPolicyType)
      query = query.intersect(subQuery)
      var result = query.select()
      return result
    }


    // Adding Search using Risk Address and Billing Address DE 1184
    if (this.PrimaryInsuredAddressLine1_Ext != null || this.PrimaryInsuredAddressLine2_Ext != null ){
      var query = this.SummaryQuery
      var subQuery = gw.api.database.Query.make(PolicyPeriodSummary)
      var address = subQuery.subselect("ID", CompareIn, PolicyLocation, "ID")
      address.compareIn("AddressTypeInternal"  ,{typekey.AddressType.TC_BILLING,typekey.AddressType.TC_RISKADDRESS_EXT})
      address.compareIgnoreCase("AddressLine1Internal", Equals ,this.PrimaryInsuredAddressLine1_Ext)
      address.compareIgnoreCase("AddressLine2Internal", Equals ,this.PrimaryInsuredAddressLine2_Ext)
      query = query.union(subQuery)
      var result = query.select()
      return result
   }

    var result = this.performSearch()
    return result
  }
  
  @Deprecated("PC 7.0.4. Use search() instead")
  function validateAndSearchForCopyData() : PolicyPeriodSummaryQuery  {
    return search()
  }
  
  /**
  * Check that the search criteria meets the minimum requirements.
  */
  function meetsMinimumSearchCriteria() : boolean {
    if (this.NameCriteria.OfficialId.NotBlank) return true
    if (this.AccountNumber.NotBlank) return true
    if (this.PolicyNumber.NotBlank) return true
    if (this.PrimaryInsuredPhone.NotBlank) return true
    // Producer is force-populated for external users and therefore ignored
    if (this.Producer != null and not User.util.CurrentUser.ExternalUser) return true
    if (this.ProducerCode != null) return true
    if (this.JobNumber != null) return true
    
    if (this.NameCriteria.CompanyName.NotBlank) {
      if (this.CompanyNameExact || this.PermissiveSearch) return true
      else if (this.NameCriteria.CompanyName.length() >= 5) return true
    }
    if (this.NameCriteria.CompanyNameKanji.NotBlank) return true

    if (this.NameCriteria.FirstNameKanji.NotBlank || this.NameCriteria.LastNameKanji.NotBlank) {
      return true;
    }

    var has_name = (this.NameCriteria.FirstName.NotBlank && (this.NameCriteria.FirstName.length >= 3 || this.FirstNameExact)) &&
                   (this.NameCriteria.LastName.NotBlank && (this.NameCriteria.LastName.length >= 3 || this.LastNameExact))

    var has_location = false
    //PC.24.01.25 changes
    if(this.SearchObjectType == SearchObjectType.TC_POLICY or this.SearchObjectType == SearchObjectType.TC_REWRITE
        or this.SearchObjectType == SearchObjectType.TC_REWRITENEWACCOUNT or this.SearchObjectType == SearchObjectType.TC_RENEWAL
        or this.SearchObjectType == SearchObjectType.TC_CANCELLATION or this.SearchObjectType == SearchObjectType.TC_POLICYCHANGE
        or this.SearchObjectType == SearchObjectType.TC_REINSTATEMENT){
          has_location = (((this.PrimaryInsuredAddressLine1_Ext.NotBlank) &&  (this.PrimaryInsuredAddressLine2_Ext.NotBlank) &&
                           (this.PrimaryInsuredCity.NotBlank || this.PrimaryInsuredCityKanji.NotBlank) && this.PrimaryInsuredState != null) || this.PrimaryInsuredPostalCode.NotBlank)
    }else{
          has_location =(((this.PrimaryInsuredCity.NotBlank || this.PrimaryInsuredCityKanji.NotBlank)
                        && this.PrimaryInsuredState != null) || this.PrimaryInsuredPostalCode.NotBlank)
    }
     
    return has_name && (this.LastNameExact || has_location || this.PermissiveSearch)
  }

  @Deprecated("PC 7.0.4. Use meetsMinimumSearchCriteria() instead.")
  property get MinimumCopyDataCriteriaForSearch() : boolean {
    return meetsMinimumSearchCriteria()
  }

  /**
   * Used to reset the search for search items, typically after a search failure.
   */
  function resetForSearchItems(searchObjectType : SearchObjectType, policyNumber : String, jobNumber : String) {
    this.SearchObjectType = searchObjectType
    this.PolicyNumber = policyNumber
    this.JobNumber = jobNumber
  }
  
  /**
   * Return the date fields to search on based on the search object type.
   */
  property get DateFieldsSearchType() : List<DateFieldsToSearchType> {
    return IsAuditSearch ? DateFieldsToSearchType.TF_AUDITSEARCHTYPES.TypeKeys : DateFieldsToSearchType.TF_NONAUDITSEARCHTYPES.TypeKeys
  }

  property get WorkOrderSearchForCopyData() : boolean {
    return this.SearchObjectType == SearchObjectType.TC_SUBMISSION or
           this.SearchObjectType == SearchObjectType.TC_POLICYCHANGE or 
           this.SearchObjectType == SearchObjectType.TC_REWRITENEWACCOUNT or 
           this.SearchObjectType == SearchObjectType.TC_RENEWAL or 
           this.SearchObjectType == SearchObjectType.TC_REWRITE  
  }
  
  /**
   * Returns the appropriate PolicySearch LV mode to use in the UI.
   */
  property get ResultsLVMode() : String {
    return IsAuditSearch ? "Audit" : this.SearchObjectType.Code
  }
  
  private property get IsAuditSearch() : boolean {
    return new SearchObjectType[]{"FinalAudit", "PremiumReport"}.contains(this.SearchObjectType)
  }
  
}
