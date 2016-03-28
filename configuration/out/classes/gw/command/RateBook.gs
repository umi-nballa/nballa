package gw.command

uses com.guidewire.commons.config.APIConfigFileAccess
uses com.guidewire.pl.quickjump.Argument
uses com.guidewire.pl.quickjump.BaseCommand
uses gw.api.database.Query
uses gw.api.system.PCLoggerCategory
uses gw.pl.logging.LoggerCategory
uses gw.rating.rtm.domain.migration.RateBookImporter
uses gw.rating.rtm.mock.MockWebFile

uses java.io.File
uses java.io.FileInputStream
uses java.io.FilenameFilter
uses gw.rating.LOBRateBookImporter

@Export
class RateBook extends BaseCommand {
  private var RATEBOOKS_DIR : String = "/config/content/ratebooks"

  private static var LineByPrefix = {
      "CA7" -> "CA7Line",
      "CP7" -> "CP7Line",
      "BP7" -> "BP7Line",
      "WC7" -> "WC7Line",
      "CR7" -> "CR7Line",
      "GL7" -> "GeneralLiabilityLine_GLE"}



  @Argument("LinePrefix")
  function remove() {
    var line = getLinePrefixArg()

    var rateBookQuery = Query.make(RateBook).compare("PolicyLine", Equals, line)
    var rateBooks = rateBookQuery.select().toList()

    var paramSetsQuery = Query.make(CalcRoutineParameterSet).compare("PolicyLinePatternCode", Equals, line)
    var paramSets = paramSetsQuery.select().toList()

    if (rateBooks.HasElements or paramSets.HasElements) {
      removeRateBooks(rateBooks, paramSets)
      PCLoggerCategory.RTM.info("Removed ${rateBooks.Count} rate books and ${paramSets.Count} parameter sets for ${line}")
    }
    else {
      PCLoggerCategory.RTM.info("There are no rate books or parameter sets to remove for ${line}")
    }
  }

  @Argument("LinePrefix")
  @Argument("Jurisdiction")
  function load() {
    var line = getLinePrefixArg()
    var jurisdiction = getArgumentAsString("Jurisdiction")
    new LOBRateBookImporter(line)
        .loadBooks(jurisdiction)
  }

  @Argument("LinePrefix")
  function loadAll() {
    var line = getLinePrefixArg()
    new LOBRateBookImporter(line).loadBooks()
  }

  private function getLinePrefixArg(): String {
    var linePrefix = getArgumentAsString("LinePrefix")
    return LineByPrefix.get(linePrefix)
  }

  private function removeRateBooks(rateBooks : List<RateBook>, paramSets : List<CalcRoutineParameterSet>) {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      rateBooks.each(\rateBook-> {
      bundle.add(rateBook)
      rateBook.removeRateBook()
    })
    paramSets.each(\paramSet -> {
      bundle.add(paramSet)
      paramSet.remove()
      })
    }, "su")
  }

}