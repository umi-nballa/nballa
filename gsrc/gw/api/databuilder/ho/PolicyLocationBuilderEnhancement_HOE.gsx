package gw.api.databuilder.ho

uses gw.api.builder.PolicyLocationBuilder

enhancement PolicyLocationBuilderEnhancement_HOE : gw.api.builder.PolicyLocationBuilder {
  
  function withTaxLocation(taxLocation : TaxLocation) : PolicyLocationBuilder {
    this.set(PolicyLocation.Type.TypeInfo.getProperty("TaxLocation"), taxLocation)
    return this
  }
}
