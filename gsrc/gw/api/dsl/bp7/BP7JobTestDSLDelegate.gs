package gw.api.dsl.bp7

uses gw.api.builder.BuildingBuilder
uses gw.api.builder.PolicyChangeBuilder
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.dsl.bp7.assertions.BP7BlanketableAssertion
uses gw.api.dsl.bp7.assertions.BP7CostsAssertion
uses gw.api.dsl.bp7.codegen.BP7AbuseMolestationExclExclusionExpression
uses gw.api.dsl.bp7.codegen.BP7AbuseOrMolestationExclSpecdSrvcsExclusionExpression
uses gw.api.dsl.bp7.codegen.BP7AmendmentAggLimitsOfInsPerProjectCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7AmendmentLiquorLiabExclExcptnScheduledCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7AmendmentLiquorLiabExclExcptnScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7ApartmentBuildingsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7BeautySalonsProflLiabCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7BrandsAndLabelsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7BuildingLimitedFungiOrBacteriaCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7BusinessIncomeScheduledCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7BusinessIncomeScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7BusinessLiabExclExclusionExpression
uses gw.api.dsl.bp7.codegen.BP7BusinessLiabilityCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ClassificationAccountsReceivableCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ClassificationBusinessIncomeFromDependentPropsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ClassificationBusinessPersonalPropertyCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ClassificationOutdoorPropertyCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ClassificationPermanentYardsStorageCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ClassificationValuablePapersCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ComputerFraudFundsTransferFraudCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ContrctrsInstalltnToolsAndEquipmtNonOwnedToolsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ContrctrsInstalltnTypesCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ContrctrsToolsAndEquipmntBlanketCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ContrctrsToolsAndEquipmntScheduleScheduledCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ContrctrsToolsAndEquipmntScheduleScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7DesignatedPremisesProjectScheduledConditionExpression
uses gw.api.dsl.bp7.codegen.BP7DesignatedPremisesProjectScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7ElectronicDataLiabilityLimitedCovConditionExpression
uses gw.api.dsl.bp7.codegen.BP7EmployeeDishtyCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ExclOfLossDueToByProdsOfProductionOrProcessingOExclusionExpression
uses gw.api.dsl.bp7.codegen.BP7FireDeptServiceContractCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7FunctlBusnPrsnlPropValtnScheduledCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7FunctlBusnPrsnlPropValtnScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LimitationsOnCovForRoofSurfacingConditionExpression
uses gw.api.dsl.bp7.codegen.BP7LimitedFungiBacteriaCovCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LimitedPolltnLiabExtConditionExpression
uses gw.api.dsl.bp7.codegen.BP7LiquorLiabCovBringYourOwnAlcoholEstablishmentsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LiquorLiabCovCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LiquorLiabCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LocationComputerFraudFundsTransferFraudCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LocationEmployeeDishtyCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LocationLimitedFungiOrBacteriaCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7LocationMoneySecuritiesCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7MedExpensesExclExclusionExpression
uses gw.api.dsl.bp7.codegen.BP7MotelLiabGuestsPropCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7MotelsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7NamedPerilsBldgCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7NamedPerilsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7PesticideHerbicideCovCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ProtectiveSafeguardsScheduledCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7ProtectiveSafeguardsScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7SelfStorageFacilitiesCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7StructureCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7TenantsLiabilityCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7TheftLimitationsCoverageExpression
uses gw.api.dsl.bp7.codegen.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledConditionExpression
uses gw.api.dsl.bp7.codegen.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledItemExpression
uses gw.api.dsl.bp7.codegen.BP7WindstormOrHailExclExclusionExpression
uses gw.api.dsl.bp7.expressions.BP7BlanketExpression
uses gw.api.dsl.bp7.expressions.BP7BuildingExpression
uses gw.api.dsl.bp7.expressions.BP7ClassificationExpression
uses gw.api.dsl.bp7.expressions.BP7LineModifierExpression
uses gw.api.dsl.bp7.expressions.BP7LocationExpression
uses gw.api.dsl.bp7.expressions.BP7PolicyChangeExpression
uses gw.api.dsl.bp7.expressions.BP7SubmissionExpression
uses gw.api.dsl.common.BaseJobTestDSLDelegate
uses gw.api.dsl.common.PolicyLocationExpression
uses gw.lob.bp7.blanket.BP7Blanketable

uses java.lang.Integer
uses java.util.Date

class BP7JobTestDSLDelegate extends BaseJobTestDSLDelegate<BP7SubmissionExpression> implements BP7JobTestDSL {

  var _currentSubmission : BP7SubmissionExpression
  var _blanket : BP7BlanketExpression

  override function createAndCommit(submission : BP7SubmissionExpression) : PolicyPeriod {
    var period = super.createAndCommit(submission)
    period.BP7Line.updateDependentFields()
    return period
  }

  override function populateBlanketFor(period : PolicyPeriod) : PolicyPeriod {
    if (_blanket != null) {
      var blanket = _blanket.fromPeriod(period)
      blanket.addCoverages(blanket.EligibleCoverages)
    }
    return period
  }

  override function quote(period : PolicyPeriod) {
    period.JobProcess.requestQuote()
  }

  override function aSubmission() : BP7SubmissionExpression {
    _currentSubmission = new BP7SubmissionExpression().isDraft()
    return _currentSubmission
  }

  override function aBasicSubmissionWithNoLocation() : BP7SubmissionExpression {
    _currentSubmission = aSubmission()
        .with(aBusinessLiabilityPrimaryCoverage())
        .with(aBusinessIncomeCoverage()
            .withExemptEmployeesJobs(true)
            .with(aBusinessIncomeExemptScheduledItem()
                .withExemptEmployee("emp")
                .withScheduleNumber(1)))
        .with(aContractorsScheduleCoverage()
            .with(aContractorsScheduleCoverageScheduledItem()
                .withDescription("Paint gun")
                .withLimit(500)))
        .with(aLimitedFungiCoverage())
        .with(anEmployeeDishonestyCoverage().withLimit("25000"))
        .with(aComputerFraudAndFundsTransferFraudCoverage())
        .with(anAmendmentAggLimitsOfInsPerProjectCoverage())
        .with(anAbuseMolestationExclExclusion())
        .with(aLimitedPolltnLiabExtCondition())
        .with(aLiquorLiabCoverage())
        .with(anAmendmentLiquorLiabilityCoverage()
            .with(anAmendmentLiquorLiabilityCoverageItem()))
        .with(aWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsScheduleCondition()
            .with(aWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsScheduleConditionItem()))
        .with(anIRPMModifier()
            .withRateFactor(0.0, RateFactorType.TC_MANAGEMENT))

    return _currentSubmission
  }

  override function aBasicSubmission() : BP7SubmissionExpression {
    _currentSubmission = aBasicSubmissionWithNoLocation()
        .withPrimary(aBasicLocation())

    return _currentSubmission
  }

  override function aPolicyChangeFor(initialPeriod : PolicyPeriod) : BP7PolicyChangeExpression {
    return new BP7PolicyChangeExpression(initialPeriod)
  }

  override function aSubmissionPolicyLocation() : PolicyLocationExpression {
    var policyLocation = aPolicyLocation()
    _currentSubmission.DataBuilder.withPolicyLocation(policyLocation.DataBuilder)
    return policyLocation
  }

  override function aSubmissionPolicyLocation(name : String) : PolicyLocationExpression {
    var policyLocation = aPolicyLocation()
        .withName(name)
    _currentSubmission.DataBuilder.withPolicyLocation(policyLocation.DataBuilder)
    return policyLocation
  }

  override function aLocation() : BP7LocationExpression {
    return createLocation()
  }

  override function aLocationWithName(locationName : String) : BP7LocationExpression {
    return createLocation(locationName)
  }

  override function aBasicLocationWithNoBuilding() : BP7LocationExpression {
    return
        aLocation()
            .with(anApartmentBuildingsCoverage())
            .with(aBusinessLiabilityExclusion())
            .with(aFireDepartmentServiceContractCoverage())
            .with(aLocationEmployeeDishonestyCoverage()
            .withIncluded("Yes")
            .withNumberOfEmployees(100)
        )
            .with(aLocationComputerFraudAndFundsTransferFraudCoverage())
            .with(aLimitedFungiOrBacteriaCoverage())
  }

  override function aBasicLocation() : BP7LocationExpression {
    return
        aBasicLocationWithNoBuilding()
            .with(aBasicBuilding())
  }

  private function createLocation(locationName : String = null): BP7LocationExpression{
    return new BP7LocationExpression()
        .withPolicyLocation(
        (locationName == null ? MinnesotaLocation : MinnesotaLocation.withName(locationName))
            .withTerritoryCode("BP7Line", "702"))
        .withFeetToHydrant(BP7FeetToHydrant.TC_1000ORLESS)
        .withFireProtectionClass(BP7FireProtectionClassPPC.TC_1)
  }

  override function aBuilding() : BP7BuildingExpression {
    return new BP7BuildingExpression()
        .with(DefaultBuilding)
        .withUnitNumber("1")
        .withPropertyType(typekey.BP7PropertyType.TC_CONTRACTOR)
        .withBldgCodeEffGradeClass(typekey.BP7BldgCodeEffectivenessGradeClass.TC_NOTGRADED)
        .withBldgCodeEffectivenessGrade(typekey.BP7BldgCodeEffectivenessGrade.TC_UNGRADED)
        .withConstructionType(typekey.BP7ConstructionType.TC_NONCOMBUSTIBLE)
        .withSprinklered(false)
        .withPctOwnerOccupied(typekey.BP7PctOwnerOccupied.TC_NOTAPPLICABLE)
        .withTotalCondoBldgSquareFootage(1000)
  }

  override function aBasicBuildingWithNoClassification() : BP7BuildingExpression {
    return
        aBuilding()
            .withPctOwnerOccupied(BP7PctOwnerOccupied.TC_10ORLESS)
            .with(aBuildingCoverage())
            .with(aBuildingLimitedFungiOrBacteriaCoverage()
            .withSeparateLimitPerBuilding("NotApplicable"))
            .with(aNamedPerilsBldgCoverage().withBurglaryAndRobberyCoverage(false))
            .with(aWindstormOrHailExclExclusion())
            .with(aBuildingLimitationsOnCoverageForRoofSurfacingCondition()
            .withIndicateApplicability("ActualCashValueProvision")
        )
  }

  override function aBasicBuilding() : BP7BuildingExpression {
    return
        aBasicBuildingWithNoClassification()
            .withPctOwnerOccupied(BP7PctOwnerOccupied.TC_10ORLESS)
            .with(aBuildingCoverage())
            .with(aBuildingLimitedFungiOrBacteriaCoverage()
            .withSeparateLimitPerBuilding("NotApplicable"))
            .with(aNamedPerilsBldgCoverage())
            .with(aWindstormOrHailExclExclusion())
            .with(aBuildingLimitationsOnCoverageForRoofSurfacingCondition()
            .withIndicateApplicability("ActualCashValueProvision")
        )
            .with(aProtectiveSafeguardsCoverage()
            .with(aProtectiveSafeguardsCoverageScheduledItem()
                .withScheduleNumber(1)
                .withSymbol(BP7ProtectiveDeviceOrService.TC_P1AUTOMATICSPRINKLERSYSTEM.Code)))
            .with(aBasicClassification())
  }

  override function aClassification(number : Integer = null) : BP7ClassificationExpression {
    return new BP7ClassificationExpression(number)
        .withClassPropertyType(typekey.BP7ClassificationPropertyType.TC_CONTRACTOR)
        .withClassDescription(typekey.BP7ClassDescription.TC_CARPENTRYINTERIOROFFICE)
        .withExposureBasis(typekey.BP7ExposureBasis.TC_ANNUALPAYROLL)
        .withPlayground(typekey.BP7Playground.TC_INDOOR)
        .withExposure(10000000)
        .withArea(1100)
        .withAmusementArea(false)
        .withNumSwimmingPools("0")
  }

  override function aBasicClassification() : BP7ClassificationExpression {
    return
        aClassification()
            .with(aClassificationBusinessPersonalPropertyCoverage())
            .with(anAccountsReceivableCoverage())
            .with(aTheftLimitationsCoverage())
            .with(aValuablePapersAndRecordsCoverage())
            .with(aClassificationOutdoorPropertyCoverage())
            .with(aClassificationBusinessIncomeFromDependentPropertiesCoverage())
            .with(aClassificationFunctionalBPPValuationCoverage()
            .with(aClassificationFunctionalBPPValuationScheduledItem())
        )
            .with(aClassificationMedicalExpensesExclusion())
            .with(aClassificationElectronicDataLiabilityLimitedCoverage()
            .withLossOfElectronicDataLimit("20,000"))
            .with(aBrandsAndLabelsCoverage())

  }

  override function aBlanket() : BP7BlanketExpression {
    _blanket = new BP7BlanketExpression()
    return _blanket
  }

  override function aCombinedBlanket() : BP7BlanketExpression {
    _blanket = new BP7BlanketExpression()
        .withBlanketType(BP7BlktType.TC_BUILDINGANDBUSINESSPERSONALPROPERTYCOMBINED)
        .withBlanketLimit(0)
    return _blanket
  }

  override function aBuildingBlanket() : BP7BlanketExpression {
    _blanket = new BP7BlanketExpression()
        .withBlanketType(BP7BlktType.TC_BUILDINGONLY)
        .withBlanketLimit(0)
    return _blanket
  }

  override function aClassificationBlanket() : BP7BlanketExpression {
    _blanket = new BP7BlanketExpression()
        .withBlanketType(BP7BlktType.TC_BUSINESSPERSONALPROPERTYONLY)
        .withBlanketLimit(0)
    return _blanket
  }

  override function anIRPMModifier() : BP7LineModifierExpression {
    return new BP7LineModifierExpression()
  }

  override function aBusinessLiabilityPrimaryCoverage() : BP7BusinessLiabilityCoverageExpression {
    return new BP7BusinessLiabilityCoverageExpression()
        .withEachOccurrenceLimit("500000")
        .withMedicalExpensesPerPersonLimit("5000")
        .withGeneralAggregateLimit("1000000")
        .withProductsCompletedOpsAggregateLimit("1000000")
        .withPdDeductible("1000")
        .withPdDeductibleType("PerClaimBasis")
        .withDamageToPremisesRentedToYou(50000)
  }

  override function aBusinessIncomeCoverage() : BP7BusinessIncomeScheduledCoverageExpression {
    return new BP7BusinessIncomeScheduledCoverageExpression()
        .withExtendedPeriodOfIndemnityNumberOfDays("60")
        .withOrdinaryPayrollNumberOfDays("60")
  }

  override function aBusinessIncomeExemptScheduledItem() : BP7BusinessIncomeScheduledItemExpression {
    return new BP7BusinessIncomeScheduledItemExpression()
  }

  override function aContractorsInstallationCoverage() : BP7ContrctrsInstalltnTypesCoverageExpression {
    return new BP7ContrctrsInstalltnTypesCoverageExpression()
  }

  override function aContractorsBlanketCoverage() : BP7ContrctrsToolsAndEquipmntBlanketCoverageExpression {
    return new BP7ContrctrsToolsAndEquipmntBlanketCoverageExpression()
  }

  override function aContractorsScheduleCoverage() : BP7ContrctrsToolsAndEquipmntScheduleScheduledCoverageExpression {
    return new BP7ContrctrsToolsAndEquipmntScheduleScheduledCoverageExpression()
  }

  override function aContractorsScheduleCoverageScheduledItem() : BP7ContrctrsToolsAndEquipmntScheduleScheduledItemExpression {
    return new BP7ContrctrsToolsAndEquipmntScheduleScheduledItemExpression()
  }

  override function aContractorsEmployeesToolsCoverage() : BP7ContrctrsInstalltnToolsAndEquipmtNonOwnedToolsCoverageExpression {
    return new BP7ContrctrsInstalltnToolsAndEquipmtNonOwnedToolsCoverageExpression()
        .withNonOwnedLimit(5000)
  }

  override function anAbuseMolestationExclExclusion() : BP7AbuseMolestationExclExclusionExpression {
    return new BP7AbuseMolestationExclExclusionExpression()
  }

  override function anAbuseOrMolestationExclSpecdSrvcsExclusion() : BP7AbuseOrMolestationExclSpecdSrvcsExclusionExpression {
    return new BP7AbuseOrMolestationExclSpecdSrvcsExclusionExpression()
        .withDescriptionOfServices("Description")
  }

  override function aLimitedPolltnLiabExtCondition() : BP7LimitedPolltnLiabExtConditionExpression {
    return new BP7LimitedPolltnLiabExtConditionExpression()
        .withAggregateLimit(50000)
  }

  override function anAmendmentAggLimitsOfInsPerProjectCoverage() : BP7AmendmentAggLimitsOfInsPerProjectCoverageExpression {
    return new BP7AmendmentAggLimitsOfInsPerProjectCoverageExpression()
  }

  override function aLiquorLiabCoverage() : BP7LiquorLiabCoverageExpression {
    return new BP7LiquorLiabCoverageExpression()
  }

  override function aLiquorLiabCovCoverage() : BP7LiquorLiabCovCoverageExpression {
    return new BP7LiquorLiabCovCoverageExpression()
  }

  override function aLiquorLiabCovBringYourOwnAlcoholEstablishmentsCoverage() : BP7LiquorLiabCovBringYourOwnAlcoholEstablishmentsCoverageExpression {
    return new BP7LiquorLiabCovBringYourOwnAlcoholEstablishmentsCoverageExpression()
  }

  override function anApartmentBuildingsCoverage() : BP7ApartmentBuildingsCoverageExpression {
    return new BP7ApartmentBuildingsCoverageExpression()
  }

  override function aBusinessLiabilityExclusion() : BP7BusinessLiabExclExclusionExpression {
    return new BP7BusinessLiabExclExclusionExpression()
        .withExclusionType("PremisesOnly")
  }

  override function anEmployeeDishonestyCoverage() : BP7EmployeeDishtyCoverageExpression {
    return new BP7EmployeeDishtyCoverageExpression()
  }

  override function aLocationEmployeeDishonestyCoverage() : BP7LocationEmployeeDishtyCoverageExpression {
    return new BP7LocationEmployeeDishtyCoverageExpression()
  }

  override function aComputerFraudAndFundsTransferFraudCoverage() : BP7ComputerFraudFundsTransferFraudCoverageExpression {
    return new BP7ComputerFraudFundsTransferFraudCoverageExpression()
        .withLimit("25000")
  }

  override function aLocationComputerFraudAndFundsTransferFraudCoverage() : BP7LocationComputerFraudFundsTransferFraudCoverageExpression {
    return new BP7LocationComputerFraudFundsTransferFraudCoverageExpression()
        .withIncluded("Yes")
        .withNumberOfEmployees(100)
  }

  override function aLimitedFungiCoverage() : BP7LimitedFungiBacteriaCovCoverageExpression {
    return new BP7LimitedFungiBacteriaCovCoverageExpression()
        .withSeparatePremisesOrLocationsOption(true)
        .withBusinessIncomeExtraExpenseNumberOfDays("30")
  }

  override function aLimitedFungiOrBacteriaCoverage() : BP7LocationLimitedFungiOrBacteriaCoverageExpression {
    return new BP7LocationLimitedFungiOrBacteriaCoverageExpression()
        .withSeparateLimitPerLocation("Yes")
        .withLimit(15000)
  }

  override function aFireDepartmentServiceContractCoverage() : BP7FireDeptServiceContractCoverageExpression {
    return new BP7FireDeptServiceContractCoverageExpression()
  }

  override function aClassificationFunctionalBPPValuationCoverage() : BP7FunctlBusnPrsnlPropValtnScheduledCoverageExpression {
    return new BP7FunctlBusnPrsnlPropValtnScheduledCoverageExpression()
  }

  override function aClassificationFunctionalBPPValuationScheduledItem() : BP7FunctlBusnPrsnlPropValtnScheduledItemExpression {
    return new BP7FunctlBusnPrsnlPropValtnScheduledItemExpression()
        .withLimit(1000)
        .withACV(800)
        .withScheduleNumber(1)
        .withDescription("default description")
  }

  override function aClassificationOutdoorPropertyCoverage() : BP7ClassificationOutdoorPropertyCoverageExpression {
    return new BP7ClassificationOutdoorPropertyCoverageExpression()
        .withLimit(5000)
  }

  override function aBuildingLimitedFungiOrBacteriaCoverage() : BP7BuildingLimitedFungiOrBacteriaCoverageExpression {
    return new BP7BuildingLimitedFungiOrBacteriaCoverageExpression()
  }

  override function aNamedPerilsBldgCoverage() : BP7NamedPerilsBldgCoverageExpression {
    return new BP7NamedPerilsBldgCoverageExpression()
  }

  override function aWindstormOrHailExclExclusion() : BP7WindstormOrHailExclExclusionExpression {
    return new BP7WindstormOrHailExclExclusionExpression()
  }

  override function aClassificationBusinessPersonalPropertyCoverage() : BP7ClassificationBusinessPersonalPropertyCoverageExpression {
    return new BP7ClassificationBusinessPersonalPropertyCoverageExpression()
        .withLimit(10000)
  }

  override function aClassificationBusinessIncomeFromDependentPropertiesCoverage() : BP7ClassificationBusinessIncomeFromDependentPropsCoverageExpression {
    return new BP7ClassificationBusinessIncomeFromDependentPropsCoverageExpression()
        .withLimit(8000)
        .withSecondaryDependentProperties(true)
  }

  override function anAccountsReceivableCoverage() : BP7ClassificationAccountsReceivableCoverageExpression {
    return new BP7ClassificationAccountsReceivableCoverageExpression()
        .withLimit(15000)
  }

  override function aTheftLimitationsCoverage() : BP7TheftLimitationsCoverageExpression {
    return new BP7TheftLimitationsCoverageExpression()
        .withLimit(3000)
  }

  override function aValuablePapersAndRecordsCoverage() : BP7ClassificationValuablePapersCoverageExpression {
    return new BP7ClassificationValuablePapersCoverageExpression()
        .withLimit(10000)
  }

  override function aBuildingCoverage() : BP7StructureCoverageExpression {
    return new BP7StructureCoverageExpression()
        .withLimit(100000)
        .withValuation("ActualCashValue")
  }

  override function aBroadenedCoverageForDamage() : BP7TenantsLiabilityCoverageExpression {
    return new BP7TenantsLiabilityCoverageExpression()
        .withLimit(50000)
  }

  override function aClassificationPermanentYardsStorageCoverage() : BP7ClassificationPermanentYardsStorageCoverageExpression {
    return new BP7ClassificationPermanentYardsStorageCoverageExpression()
        .withLimit(10000)
  }

  override function aClassificationMedicalExpensesExclusion() : BP7MedExpensesExclExclusionExpression {
    return new BP7MedExpensesExclExclusionExpression()
  }

  override function aClassificationElectronicDataLiabilityLimitedCoverage() : BP7ElectronicDataLiabilityLimitedCovConditionExpression {
    return new BP7ElectronicDataLiabilityLimitedCovConditionExpression()
        .withLossOfElectronicDataLimit("Data Limit")
  }

  override function aBrandsAndLabelsCoverage() : BP7BrandsAndLabelsCoverageExpression {
    return new BP7BrandsAndLabelsCoverageExpression()
  }

  override function aBuildingExclOfLossDueToByProductsOfProductionOrProcessingOperationsExclusion() : BP7ExclOfLossDueToByProdsOfProductionOrProcessingOExclusionExpression {
    return new BP7ExclOfLossDueToByProdsOfProductionOrProcessingOExclusionExpression()
        .withDescriptionOfRentalUnit("Rental Unit Description")
  }

  override function aBuildingLimitationsOnCoverageForRoofSurfacingCondition() : BP7LimitationsOnCovForRoofSurfacingConditionExpression {
    return new BP7LimitationsOnCovForRoofSurfacingConditionExpression()
        .withIndicateApplicability("CosmeticExclusion")
  }

  override function assertThatBlanketableCoverage(coverage : BP7Blanketable) : BP7BlanketableAssertion {
    return new BP7BlanketableAssertion(coverage)
  }

  override function anAmendmentLiquorLiabilityCoverage() : BP7AmendmentLiquorLiabExclExcptnScheduledCoverageExpression {
    return new BP7AmendmentLiquorLiabExclExcptnScheduledCoverageExpression()
  }

  override function anAmendmentLiquorLiabilityCoverageItem() : BP7AmendmentLiquorLiabExclExcptnScheduledItemExpression {
    return new BP7AmendmentLiquorLiabExclExcptnScheduledItemExpression()
        .withScheduleNumber(1)
        .withDescription("Christmas Party")
  }

  override function aWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsScheduleCondition() : BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledConditionExpression {
    return new BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledConditionExpression()
  }

  override function aWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsScheduleConditionItem() : BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledItemExpression {
    return new BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledItemExpression()
        .withScheduleNumber(1)
        .withDescription("Organization Name")
  }

  override function aDesignatedPremisesProjectScheduleCondition() : BP7DesignatedPremisesProjectScheduledConditionExpression{
    return new BP7DesignatedPremisesProjectScheduledConditionExpression()
  }

  override function aDesignatedPremisesProjectScheduleConditionItem() : BP7DesignatedPremisesProjectScheduledItemExpression{
    return new BP7DesignatedPremisesProjectScheduledItemExpression()
        .withScheduleNumber(1)
        .withDescriptionOfPremises("Premises Name")
        .withDescriptionOfProject("Project Name")
  }

  override function aProtectiveSafeguardsCoverage() : BP7ProtectiveSafeguardsScheduledCoverageExpression {
    return new BP7ProtectiveSafeguardsScheduledCoverageExpression()
  }

  override function aProtectiveSafeguardsCoverageScheduledItem() : BP7ProtectiveSafeguardsScheduledItemExpression {
    return new BP7ProtectiveSafeguardsScheduledItemExpression()
  }

  override function aMotelsCoverage() : BP7MotelsCoverageExpression {
    return new BP7MotelsCoverageExpression()
  }

  override function aMotelLiabGuestsPropCoverage() : BP7MotelLiabGuestsPropCoverageExpression {
    return new BP7MotelLiabGuestsPropCoverageExpression()
  }

  override function aSelfStorageFacilitiesCoverage() : BP7SelfStorageFacilitiesCoverageExpression {
    return new BP7SelfStorageFacilitiesCoverageExpression()
  }

  override function aPesticideHerbicideApplicatorCoverage() : BP7PesticideHerbicideCovCoverageExpression {
    return new BP7PesticideHerbicideCovCoverageExpression()
  }

  override function anIncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverage() : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression {
    return new BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression()
        .withIncreasedCostOfLoss("10%")
        .withGreenUpgradesLimit("10000")
        .withRelatedExpensesLimit("100000")
  }

  override function aNamedPerilsCoverage() : BP7NamedPerilsCoverageExpression {
    return new BP7NamedPerilsCoverageExpression()
  }

  override function aMoneyAndSecuritiesCoverage() : BP7LocationMoneySecuritiesCoverageExpression {
    return new BP7LocationMoneySecuritiesCoverageExpression()
  }

  override function aBeautySalonsCoverage() : BP7BeautySalonsProflLiabCoverageExpression {
    return new BP7BeautySalonsProflLiabCoverageExpression()
  }

  override function aPolicyChangeMidTerm(period : PolicyPeriod) : PolicyPeriod {
    return new PolicyChangeBuilder()
        .withBasedOnPeriod(period)
        .withEffectiveDate(period.PeriodStart.addMonths(6))
        .isDraft()
        .create()
  }

  override function aPolicyChangeWithDate(period : PolicyPeriod, effectiveDate : Date) : PolicyPeriod {
    return new PolicyChangeBuilder()
        .withBasedOnPeriod(period)
        .withEffectiveDate(effectiveDate)
        .isDraft()
        .create()
  }

  private property get MinnesotaLocation() : PolicyLocationBuilder {
    return new PolicyLocationBuilder()
        .withName("1st Minnesota location")
        .withDescription("BP7 Address")
        .withAddressLine1("201 Northwest 4th Street")
        .withAddressLine2("Central Square Mall")
        .withCity("Grand Rapids")
        .withCounty("Grand Rapids")
        .withState(State.TC_MN)
        .withPostalCode("55744")
        .asHomeAddress()
  }

  private property get DefaultBuilding() : BuildingBuilder {
    return new BuildingBuilder()
        .withDescription("Default Building")
  }


  override function assertThatCostsFor(period : PolicyPeriod) : BP7CostsAssertion {
    return new BP7CostsAssertion(period)
  }

}
