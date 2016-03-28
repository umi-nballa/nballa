package gw.lob.ho

uses gw.api.builder.AccountBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PeriodAnswerBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.api.databuilder.ho.DwellingBuilder_HOE
uses gw.api.databuilder.ho.HOLocationBuilder_HOE
uses gw.api.databuilder.ho.HomeownersLineBuilder_HOE
uses gw.command.critical.KeyGenerator
uses gw.command.critical.SamplePolicyGenerator
uses gw.api.builder.AddressBuilder
uses gw.api.builder.PolicyPriNamedInsuredBuilder
uses gw.api.builder.PersonBuilder
uses gw.api.builder.NamedInsuredBuilder
uses gw.api.builder.AccountContactBuilder
uses java.util.Date

class SubmissionTestUtil_HOE {

  construct() {
  }
  
  static function addConditionsAndExclusionsToLine(hoLineBuilder : HomeownersLineBuilder_HOE) : HomeownersLineBuilder_HOE {
    var warAndTerrorismWithLimitedExceptionExcl = new ExclusionBuilder(HomeownersLineExcl_HOE)
      .withPatternCode("HODW_LimitedTerrorismExc_HOE")
    var personalAndAdvertisingExcl = new ExclusionBuilder(HomeownersLineExcl_HOE)
      .withPatternCode("HODW_PersonalAdvertisingExc_HOE")
    var warAndTerrorismExcl = new ExclusionBuilder(HomeownersLineExcl_HOE)
      .withPatternCode("HODW_Terrorism_HOE")
    var waterExcl = new ExclusionBuilder(HomeownersLineExcl_HOE)
      .withPatternCode("HODW_WaterExc_HOE")
    var alarmOrFireProtectionCond = new PolicyConditionBuilder(HomeownersLineCond_HOE)
      .withPatternCode("HODW_AlarmFire_HOE")
    var lossSettlementCond = new PolicyConditionBuilder(HomeownersLineCond_HOE)
      .withPatternCode("HODW_LossSettlement_HOE")
    var windstormProtectiveCond = new PolicyConditionBuilder(HomeownersLineCond_HOE)
      .withPatternCode("HODW_WindProtectionDevise_HOE")
      
    hoLineBuilder = hoLineBuilder
      .withExclusion(warAndTerrorismWithLimitedExceptionExcl)
      .withExclusion(personalAndAdvertisingExcl)
      .withExclusion(warAndTerrorismExcl)
      .withExclusion(waterExcl)
      .withCondition(alarmOrFireProtectionCond)
      .withCondition(lossSettlementCond)
      .withCondition(windstormProtectiveCond)
      
    return hoLineBuilder
  }
  
  static function addProtectionDetails(dwelling : DwellingBuilder_HOE): DwellingBuilder_HOE {
    dwelling = dwelling
      .withDwellingLocationType("city")
      .withFireExtinguishers(true)
      .withBurglarAlarm(false)
      .withFireAlarm(false)
      .withSmokeAlarm(true)
      .withSmokeAlarmOnAllFloors(true)
      .withSprinklerSystemType("partial")
      .withDeadbolt(false)
      .withVisibleToNeighbors(true)
    return dwelling
  }
  
  static function addConstruction(dwelling : DwellingBuilder_HOE): DwellingBuilder_HOE {
    dwelling = dwelling
      .withYearBuilt(1970)
      .withConstructionType("C")
      .withNumStories("3")
      .withRoofType("fiberCement")
      .withFoundationType("RaisedSlab")
      .withPrimaryHeating("Gas")
      .withPlumbingType("galv")
      .withWiringType("copper")
      .withElectricalType("CircuitBreaker")
      .withWindClass("resistive")
      .withConstructionCode("600")
    return dwelling
  }
  
  static function addHOLocation(dwelling : DwellingBuilder_HOE, policyLocation : PolicyLocationBuilder) :
    DwellingBuilder_HOE {
    
    var hoLocation = new HOLocationBuilder_HOE()
      .withDistHydrant(200)
      .withDistStation(10)
      .withFlooding(false)
      .withProtectionClass("03")
      .withWithinCommercial(false)
      .withLocation(policyLocation)
    dwelling = dwelling
      .withHOLocation(hoLocation)
    return dwelling
  }
  
  static function addTaxLocation() : TaxLocation {
    var newTaxLocation = new TaxLocation()
    
    // TODO: populate TaxLocation
    return newTaxLocation
  }
  
  static function addAnswersToSubmission(policyType: String, submissionBuilder : SubmissionBuilder) : SubmissionBuilder {
    var periodAnswerBuilderBusiness = new PeriodAnswerBuilder()
      .withQuestionCode("HOBusiness_HOE")
      .withBooleanAnswer(false)
    var periodAnswerBuilderCovDeclined = new PeriodAnswerBuilder()
      .withQuestionCode("HOCovDeclined_HOE")
      .withBooleanAnswer(false)
    var periodAnswerBuilderManager = new PeriodAnswerBuilder()
      .withQuestionCode("HOManager_HOE")
      .withBooleanAnswer(false)
    var periodAnswerBuilderAttendant = new PeriodAnswerBuilder()
      .withQuestionCode("HOAttendant_HOE")
      .withBooleanAnswer(false)
    var periodAnswerBuilderEntrance = new PeriodAnswerBuilder()
      .withQuestionCode("HOEntrance_HOE")
      .withBooleanAnswer(false)
    
    submissionBuilder = submissionBuilder
      .withAnswer(periodAnswerBuilderBusiness)
      .withAnswer(periodAnswerBuilderCovDeclined)  
    if (policyType.equalsIgnoreCase("HO4") or policyType.equalsIgnoreCase("HO6")) {
      submissionBuilder = submissionBuilder
        .withAnswer(periodAnswerBuilderManager)
        .withAnswer(periodAnswerBuilderAttendant)
        .withAnswer(periodAnswerBuilderEntrance)                                    
    }
    
    return submissionBuilder
  }

  static function addMandatoryDwellingCoverages(dwelling : DwellingBuilder_HOE, policyType : String) : DwellingBuilder_HOE {
    if (policyType.equalsIgnoreCase("HO3") or policyType.equalsIgnoreCase("HO6")) {
      var dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_Dwelling_Cov_HOE")
        .withDirectTerm("HODW_Dwelling_Limit_HOE", 100000)
      dwelling = dwelling.withCoverage(dwellingCov)
    }
    if (policyType.equalsIgnoreCase("DP2")) {
      var dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("DPDW_Dwelling_Cov_HOE")
        .withDirectTerm("DPDW_Dwelling_Limit_HOE", 100000)
      dwelling = dwelling.withCoverage(dwellingCov)
    } else {
      var dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_Loss_Of_Use_HOE")
        .withOptionCovTerm("HODW_LossOfUseDwelLimit_HOE", "30%")
        .withOptionCovTerm("HODW_LossOfUsePropLimit_HOE", "30%")
      dwelling = dwelling.withCoverage(dwellingCov)
      dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_OrdinanceCov_HOE")
        .withOptionCovTerm("HODW_OrdinanceLimit_HOE", "10%")
      dwelling = dwelling.withCoverage(dwellingCov)      
    }
    if (policyType.equalsIgnoreCase("HO4") or policyType.equalsIgnoreCase("HO6")) {
      var dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_Personal_Property_HOE")
        .withOptionCovTerm("HODW_PropertyHO4_6Limit_HOE", "25,000")
        .withOptionCovTerm("HODW_PropertyValuation_HOE", "Actual Cash Value")
      dwelling = dwelling.withCoverage(dwellingCov)
    } else if (policyType.equalsIgnoreCase("HO3")) {
      var dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_Other_Structures_HOE")
        .withOptionCovTerm("HODW_OtherStructures_Limit_HOE", "10%")
      dwelling = dwelling.withCoverage(dwellingCov)
      dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_Personal_Property_HOE")
        .withOptionCovTerm("HODW_PersonalPropertyLimit_HOE", "50%")
        .withOptionCovTerm("HODW_PropertyValuation_HOE", "Actual Cash Value")
      dwelling = dwelling.withCoverage(dwellingCov)
    }
    var dwellingCov = new CoverageBuilder(DwellingCov_HOE)
        .withPatternCode("HODW_SectionI_Ded_HOE")
        .withOptionCovTerm("HODW_OtherPerils_Ded_HOE", "250")
        .withOptionCovTerm("HODW_WindHail_Ded_HOE", "1%") //Cannot use zero value when testing CC integration as it will be treated as null
      dwelling = dwelling.withCoverage(dwellingCov)
    return dwelling
  }
  
  static function addMandatoryLineCoverages(hoLineBuilder : HomeownersLineBuilder_HOE, policyType : String) : HomeownersLineBuilder_HOE {
    if (!(policyType.equalsIgnoreCase("DP2"))) {
      var personalLiabilityCov = new CoverageBuilder(HomeownersLineCov_HOE)
        .withPatternCode("HOLI_Personal_Liability_HOE")
        .withOptionCovTerm("HOLI_Liability_Limit_HOE", "100,000")
      var medicalPaymentsCov = new CoverageBuilder(HomeownersLineCov_HOE)
        .withPatternCode("HOLI_Med_Pay_HOE")
        .withOptionCovTerm("HOLI_MedPay_Limit_HOE", "1,000")
      hoLineBuilder = hoLineBuilder
        .withCoverage(personalLiabilityCov)
        .withCoverage(medicalPaymentsCov)
    }
    return hoLineBuilder
  }

  static function generateQuotablePolicy(policyType : String, dwellingCoverages : CoverageBuilder[],
    lineCoverages : CoverageBuilder[], state : State, nonOwnedDwelling : boolean,
    exclusions : ExclusionBuilder[], conditions : PolicyConditionBuilder[], policyLocation : PolicyLocationBuilder, quickQuote : boolean,
    effDate : Date) : PolicyPeriod{
    var period : PolicyPeriod
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {      
      var submissionBuilder = createHOSubmissionBuilder(policyType, dwellingCoverages, lineCoverages, state, nonOwnedDwelling,
        exclusions, conditions, policyLocation, quickQuote, effDate)
      period = submissionBuilder.create(bundle)
    })
    return period
  }

  static function generateHOSubmssionBuilder(effDate : Date) : SubmissionBuilder {
    return createHOSubmissionBuilder("HO3", null, null, null, false, null, null, null, false, effDate)
  }

  static function generateHOSubmssionBuilder(policyType : String, dwellingCoverages : CoverageBuilder[],
                                             lineCoverages : CoverageBuilder[], state : State, nonOwnedDwelling : boolean,
                                             exclusions : ExclusionBuilder[], conditions : PolicyConditionBuilder[],
                                             policyLocation : PolicyLocationBuilder, quickQuote : boolean, effDate : Date) : SubmissionBuilder {
    return createHOSubmissionBuilder(policyType, dwellingCoverages, lineCoverages, state, nonOwnedDwelling,
        exclusions, conditions, policyLocation, quickQuote, effDate)
  }

  private static function createHOSubmissionBuilder(policyType : String, dwellingCoverages : CoverageBuilder[],
                                                    lineCoverages : CoverageBuilder[], state : State, nonOwnedDwelling : boolean,
                                                    exclusions : ExclusionBuilder[], conditions : PolicyConditionBuilder[],
                                                    policyLocation : PolicyLocationBuilder, quickQuote : boolean, effDate : Date) : SubmissionBuilder {

    var addressBuilder = new AddressBuilder()
    if (state <> null) {
      addressBuilder = addressBuilder.withState(state)
    }
    var contactBuilder = new PersonBuilder()
        .withPrimaryAddress(addressBuilder)
    var accountContactRoleBuilder = new NamedInsuredBuilder()
    var accountContactBuilder = new AccountContactBuilder().withContact(contactBuilder).withRole(accountContactRoleBuilder)
    var policyPriNamedInsuredBldr = new PolicyPriNamedInsuredBuilder().withAccountContactRole(accountContactRoleBuilder)

    var account = new AccountBuilder()
        .withAccountNumber(KeyGenerator.nextString())
        .withAccountContact(accountContactBuilder)

    if (policyLocation == null) {
      policyLocation = new PolicyLocationBuilder()
    }
    if (state <> null) {
      policyLocation = policyLocation.withState(state)
    }

    var dwelling = new DwellingBuilder_HOE()
        .withResidenceType("Fam1")
        .withDwellingUsage("prim")
        .withPolicyType(policyType)
    if (nonOwnedDwelling) {
      dwelling = dwelling.withDwellingOccupancy("nonown")
    } else {
      dwelling = dwelling.withDwellingOccupancy("owner")
    }
    dwelling = SubmissionTestUtil_HOE.addMandatoryDwellingCoverages(dwelling, policyType)
    dwelling = SubmissionTestUtil_HOE.addProtectionDetails(dwelling)
    dwelling = SubmissionTestUtil_HOE.addHOLocation(dwelling, policyLocation)
    dwelling = SubmissionTestUtil_HOE.addConstruction(dwelling)
    if (dwellingCoverages <> null) {
      dwelling = SubmissionTestUtil_HOE.addArrayOfDwellingCoverages(dwelling, dwellingCoverages)
    }

    var hoLineBuilder = new HomeownersLineBuilder_HOE()
        .withPolicyType(policyType)
        .withDwelling(dwelling)
    hoLineBuilder = SubmissionTestUtil_HOE.addMandatoryLineCoverages(hoLineBuilder, policyType)
    if (lineCoverages <> null) {
      hoLineBuilder = SubmissionTestUtil_HOE.addArrayOfLineCoverages(hoLineBuilder, lineCoverages)
    }
    if (exclusions <> null) {
      hoLineBuilder = SubmissionTestUtil_HOE.addArrayOfLineExclusions(hoLineBuilder, exclusions)
    }
    if (conditions <> null) {
      hoLineBuilder = SubmissionTestUtil_HOE.addArrayOfLineConditions(hoLineBuilder, conditions)
    }

    var effectiveDate = effDate
    if (effectiveDate == null) {
      effectiveDate = Date.Today
    }

    var submissionBuilder = new SubmissionBuilder()
        .withPolicyLocation(policyLocation)
        .withAccount( account )
        .withProduct("Homeowners")
        .withPolicyLine(hoLineBuilder)
        .withProducerCodeOfRecord(SamplePolicyGenerator.getProducerCode())
        .withPrimaryNamedInsured(policyPriNamedInsuredBldr)
        .withEffectiveDate(effectiveDate)
        .isDraft()
    submissionBuilder = SubmissionTestUtil_HOE.addAnswersToSubmission(policyType, submissionBuilder)
    if (state <> null) {
      submissionBuilder = submissionBuilder.withBaseState(state)
    }
    if (quickQuote) {
      submissionBuilder = submissionBuilder.withQuoteType("Quick")
    }
    return submissionBuilder
  }

  static function generateAndQuotePolicy(policyType : String, dwellingCoverages : CoverageBuilder[],
    lineCoverages : CoverageBuilder[], state : State, nonOwnedDwelling: boolean,
    exclusions : ExclusionBuilder[], conditions : PolicyConditionBuilder[], policyLocation : PolicyLocationBuilder) : PolicyPeriod {
    var period = SubmissionTestUtil_HOE.generateQuotablePolicy(policyType, dwellingCoverages, lineCoverages, state,
      nonOwnedDwelling, exclusions, conditions, policyLocation, false, null)
    period.PrimaryNamedInsured.FirstName = "HO"
    period.Bundle.commit()
    period.SubmissionProcess.requestQuote()
    period.Bundle.commit()
    return period
  }

  static function generateAndBindPolicy(policyType : String, dwellingCoverages : CoverageBuilder[],
    lineCoverages : CoverageBuilder[], state : State, nonOwnedDwelling: boolean,
    exclusions : ExclusionBuilder[], conditions : PolicyConditionBuilder[], policyLocation : PolicyLocationBuilder,
                                        quickQuote : boolean, effDate : Date) : PolicyPeriod {
    var period = SubmissionTestUtil_HOE.generateQuotablePolicy(policyType, dwellingCoverages, lineCoverages, state,
      nonOwnedDwelling, exclusions, conditions, policyLocation, quickQuote, effDate)
    period.PrimaryNamedInsured.FirstName = "HO"
    period.Bundle.commit()
    period.SubmissionProcess.requestQuote()
    period.SubmissionProcess.issue()
    period.Bundle.commit()
    return period
  }

  static function addArrayOfDwellingCoverages(dwelling : DwellingBuilder_HOE, 
    dwellingCoverages : CoverageBuilder[]) : DwellingBuilder_HOE {
    for (coverage in dwellingCoverages) {
      dwelling.withCoverage(coverage)
    }
    return dwelling
  }
  
  static function addArrayOfLineCoverages(hoLineBuilder : HomeownersLineBuilder_HOE,
    lineCoverages : CoverageBuilder[]) : HomeownersLineBuilder_HOE {
    for (coverage in lineCoverages) {
      hoLineBuilder.withCoverage(coverage)
    }
    return hoLineBuilder
  }
  
  static function addArrayOfLineExclusions(hoLineBuilder : HomeownersLineBuilder_HOE,
    lineExclusions : ExclusionBuilder[]) : HomeownersLineBuilder_HOE {
    for (exclusion in lineExclusions) {
      hoLineBuilder.withExclusion(exclusion)
    }
    return hoLineBuilder
  }
  
  static function addArrayOfLineConditions(hoLineBuilder : HomeownersLineBuilder_HOE,
    lineConditions : PolicyConditionBuilder[]) : HomeownersLineBuilder_HOE {
    for (condition in lineConditions) {
      hoLineBuilder.withCondition(condition)
    }
    return hoLineBuilder
  }
}
