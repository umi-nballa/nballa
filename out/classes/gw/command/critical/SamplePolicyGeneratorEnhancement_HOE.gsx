package gw.command.critical

uses gw.api.builder.AccountBuilder
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.lob.ho.SubmissionTestUtil_HOE
uses gw.api.databuilder.ho.HomeownersLineBuilder_HOE
uses gw.api.databuilder.ho.DwellingBuilder_HOE
uses java.util.Date
uses gw.api.util.DisplayableException

enhancement SamplePolicyGeneratorEnhancement_HOE : gw.command.critical.SamplePolicyGenerator {
  
  static function wHOLine(policyType : String) : PolicyPeriod{
    var period : PolicyPeriod
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
      var account = new AccountBuilder()
        .withAccountNumber( KeyGenerator.nextString() )
        .create(bundle)
      var taxLocation = getTaxLocation("600", Jurisdiction.TC_CA, Date.Today)
      var policyLocation = new PolicyLocationBuilder()
        .withTaxLocation(taxLocation)

      var dwelling = new DwellingBuilder_HOE()
        .withResidenceType("Fam1")
        .withDwellingUsage("prim")
        .withDwellingOccupancy("owner")
        .withPolicyType(policyType)
      dwelling = SubmissionTestUtil_HOE.addMandatoryDwellingCoverages(dwelling, policyType)
      dwelling = SubmissionTestUtil_HOE.addProtectionDetails(dwelling)
      dwelling = SubmissionTestUtil_HOE.addHOLocation(dwelling, policyLocation)
      dwelling = SubmissionTestUtil_HOE.addConstruction(dwelling)
    
      var hoLineBuilder = new HomeownersLineBuilder_HOE()
        .withPolicyType(policyType)
        .withDwelling(dwelling)
      hoLineBuilder = SubmissionTestUtil_HOE.addMandatoryLineCoverages(hoLineBuilder, policyType)
      var submissionBuilder = new SubmissionBuilder()
        .withPolicyLocation(policyLocation)
        .withAccount( account )
        .withProduct("Homeowners")
        .withPolicyLine(hoLineBuilder)
        .withProducerCodeOfRecord( SamplePolicyGenerator.getProducerCode() )
        .isDraft()
      submissionBuilder = SubmissionTestUtil_HOE.addAnswersToSubmission(policyType, submissionBuilder)
      period = submissionBuilder.create(bundle)
    })
    return period
  }

  static function getTaxLocation(code : String, jurisdiction : Jurisdiction, effectiveDate : Date) : TaxLocation {
    if (code == null) {
      return null
    } else {
      var locs = new gw.lob.common.TaxLocationQueryBuilder()
          .withCodeStarting(code)
          .withState(jurisdiction)
          .withEffectiveOnDate(effectiveDate)
          .build().select() as gw.api.database.IQueryBeanResult<TaxLocation>
      if (locs.Count == 1) {
        return locs.FirstResult
      } else {
        throw new DisplayableException(displaykey.TaxLocation.Search.Error.InvalidCode(code, jurisdiction.Description))
      }
    }
  }

}
