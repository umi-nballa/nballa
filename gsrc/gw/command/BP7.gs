package gw.command

uses com.guidewire.pl.quickjump.Argument
uses com.guidewire.pl.quickjump.BaseCommand
uses com.guidewire.pl.quickjump.DefaultMethod
uses gw.api.builder.AccountBuilder
uses gw.api.builder.AddressBuilder
uses gw.api.builder.PersonBuilder
uses gw.api.dsl.bp7.BP7JobTestDSLDelegate
uses gw.transaction.Transaction

@Export
@DefaultMethod("basic")
class BP7 extends BaseCommand {
  static function basic() {
    var period : PolicyPeriod

    Transaction.runWithNewBundle( \ bundle -> {
      var dsl = new BP7JobTestDSLDelegate()
      period = dsl.createAndCommit(dsl.aBasicSubmission())
    })

    period.BP7Line.syncAllCoverablesAndModifiers(null)
    period.Bundle.commit()
    pcf.SubmissionWizard.go(period.Submission, period)
  }

  static function large() {
    var period : PolicyPeriod

    Transaction.runWithNewBundle( \ bundle -> {
      var dsl = new BP7JobTestDSLDelegate()
      var submission = dsl.aBasicSubmissionWithNoLocation()

      for (i in 1..6) {
        submission.with(anotherLocation(dsl))
      }
      period = dsl.createAndCommit(submission)
    })

    period.BP7Line.syncAllCoverablesAndModifiers(null)
    period.Bundle.commit()
    pcf.SubmissionWizard.go(period.Submission, period)
  }

  private static function anotherLocation(dsl : BP7JobTestDSLDelegate) : gw.api.dsl.bp7.expressions.BP7LocationExpression {
    var location = dsl.aBasicLocationWithNoBuilding()
        .with(anotherBuilding(dsl))
        .with(anotherBuilding(dsl))
        .with(anotherBuilding(dsl))
        .with(anotherBuilding(dsl))
    return location
  }

  private static function anotherBuilding(dsl : BP7JobTestDSLDelegate) : gw.api.dsl.bp7.expressions.BP7BuildingExpression {
    return dsl.aBasicBuildingWithNoClassification()
        .withPctOwnerOccupied(BP7PctOwnerOccupied.TC_10ORLESS)
        .with(dsl.aBuildingCoverage())
        .with(dsl.aBuildingLimitedFungiOrBacteriaCoverage()
            .withSeparateLimitPerBuilding("NotApplicable"))
        .with(dsl.aNamedPerilsBldgCoverage())
        .with(dsl.aWindstormOrHailExclExclusion())
        .with(dsl.aBuildingLimitationsOnCoverageForRoofSurfacingCondition()
            .withIndicateApplicability("ActualCashValueProvision")
    )
        .with(dsl.aProtectiveSafeguardsCoverage()
            .with(dsl.aProtectiveSafeguardsCoverageScheduledItem()
                .withScheduleNumber(1)
                .withSymbol(BP7ProtectiveDeviceOrService.TC_P1AUTOMATICSPRINKLERSYSTEM.Code)))
        .with(dsl.aBasicClassification())
        .with(dsl.aBasicClassification())
        .with(dsl.aBasicClassification())
  }

  @Argument("state")
  function account() {
    Transaction.runWithNewBundle(\bundle -> {
      var state = getArgumentAsString("state")
      var address = new AddressBuilder().withStateAbbreviation(state)
      var person = new PersonBuilder().withAddress(address)
      var account = new AccountBuilder(false).withAccountHolderContact(person).createAndCommit()
      pcf.AccountFile_Summary.go(account)
    })
  }
}
