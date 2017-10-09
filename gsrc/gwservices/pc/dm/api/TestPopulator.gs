package gwservices.pc.dm.api

uses java.io.File
uses gwservices.pc.dm.batch.MigrationRecord
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/23/17
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */
class TestPopulator {

  function printCoverages(file : File) {
    //var file = new File("C:/User Stories/Conversion/HOB.xml")
    var policyperiod = gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod.parse(file)
    var policyLines = policyperiod.Lines
    var homeownersLine = policyLines.Entry.atMostOne().entity_HomeownersLine_HOE
    var dwelling = homeownersLine.Dwelling
    print(dwelling.BaseFloodElValMatchLevel_Ext)
    var coverages = dwelling.Coverages
    var covTerms = coverages.Entry.toCollection().CovTerms
    for (covTerm in covTerms.Entry) {
      print(covTerm.PatternCode)
      print (covTerm.ValueAsString)
    }
    print("...")
  }

  function populateFromMigrationRecord(file : File) {
    var policyperiod = gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod.parse(file)
    var migrationRecord = new MigrationRecord()
    migrationRecord.PayloadType = "ConversionOnRenewal"
    migrationRecord.MigrationEntityTransactionID = "TXHB0000037205"
    migrationRecord.PolicyPeriod = policyperiod
    var _transactionContainer = new gwservices.pc.dm.api.DMTransactionContainer()

    try {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        var record = _transactionContainer.getTransactionAPI(migrationRecord.PayloadType).processRecord(migrationRecord, bundle)
        var policyPeriod = record.PolicyPeriod
        print("....")
        print(typeof policyperiod)


      }, User.util.UnrestrictedUser)
    } catch (e : Exception) {
      e.printStackTrace()
      throw e
    }
  }

  function populateUsingPopulators(file : File) {
    var policyperiod = gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod.parse(file)
    var account = policyperiod.$TypeInstance.AccountEntity
    print(account.AccountNumber)
    var product = policyperiod.$TypeInstance.ProductFromProductModel
    var producer = policyperiod.$TypeInstance.ProducerCodeEntity
    var effectiveDate = policyperiod.$TypeInstance.EditEffectiveDate

    try {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        account = bundle.add(account)
        var registry = new gwservices.pc.dm.gx.entitypopulators.Registry()
        var populatorUtil = new gwservices.pc.dm.gx.entitypopulators.EntityPopulatorUtil(registry)
        var populator = registry.getPopulator(typeof (policyperiod))
        var renewal = account.createConversionRenewal(effectiveDate, product, producer, \ p -> {
          populatorUtil.CachedItems = {gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> p}
          populatorUtil.populate(policyperiod ,new gwservices.pc.dm.batch.MigrationRecord(), bundle)
          p.Policy.markIssued(policyperiod.EditEffectiveDate)

        })
        var policyPeriodEntity = renewal.Periods.LatestPeriod
        print("....")
        print(typeof policyperiod)

        populator.populate(policyperiod, policyPeriodEntity)
        print(policyPeriodEntity.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm)

      }, User.util.UnrestrictedUser)
    } catch (e : Exception) {
      e.printStackTrace()
    }
  }

  function populateEmptyPolicyPeriod(file : File) {
    var policyperiod = gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod.parse(file)
    var account = policyperiod.$TypeInstance.AccountEntity
    print(account.AccountNumber)
    var product = policyperiod.$TypeInstance.ProductFromProductModel
    var producer = policyperiod.$TypeInstance.ProducerCodeEntity
    var effectiveDate = policyperiod.$TypeInstance.EditEffectiveDate

    try {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        account = bundle.add(account)
        var registry = new gwservices.pc.dm.gx.entitypopulators.Registry()
        var populatorUtil = new gwservices.pc.dm.gx.entitypopulators.EntityPopulatorUtil(registry)
        var populator = registry.getPopulator(typeof (policyperiod))
        var renewal = account.createConversionRenewal(effectiveDate, product, producer, \ p -> {
          //populatorUtil.CachedItems = {gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> p}
          //populatorUtil.populate(policyperiod ,new gwservices.pc.dm.batch.MigrationRecord(), bundle)
          //p.Policy.markIssued(policyperiod.EditEffectiveDate)

        })
        var policyPeriodEntity = renewal.Periods.LatestPeriod
        print("....")
        print(typeof policyperiod)

        populator.populate(policyperiod, policyPeriodEntity)
        print(policyPeriodEntity.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm)

      }, User.util.UnrestrictedUser)
    } catch (e : Exception) {
      e.printStackTrace()
    }
  }
}