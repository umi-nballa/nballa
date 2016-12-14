package gw.rating

uses com.guidewire.commons.config.APIConfigFileAccess
uses com.guidewire.pl.quickjump.Argument
uses com.guidewire.pl.quickjump.BaseCommand
uses gw.api.webservice.importTools.ImportToolsImpl
uses gw.api.database.Query
uses gw.api.system.PCLoggerCategory
uses gw.pl.logging.LoggerCategory
uses gw.rating.rtm.domain.migration.RateBookImporter
uses gw.rating.rtm.mock.MockWebFile
uses gw.util.StreamUtil

uses java.io.File
uses java.io.FileInputStream
uses java.io.FilenameFilter
uses gw.api.system.logging.LOBLoggerCategory

class LOBRateBookImporter {

  private static var RATEBOOKS_DIR : String = "/config/content/ratebooks"
  private static var _rateBooksDir = APIConfigFileAccess.INSTANCE.getConfigFile(RATEBOOKS_DIR)

  private static var RatebookCodePrefixByLine =  {
      "CA7Line" -> "ISO Commercial Auto",
      "CP7Line" -> "ISO Commercial Property",
      "BP7Line" -> "ISO BOP",
      "WC7Line" -> "Workers Comp",
      "CR7Line" -> "ISO Crime and Fidelity",
      "GeneralLiabilityLine_GLE" -> "ISO General Liability"}

  private static var CWCodeByLine = {"CR7Line" -> "Country Wide"}.toAutoMap( \ anyLine -> "CW")

  private var _line : String

  construct(line : String) {
    _line = line
  }

  function loadBooks(jurisdiction : String = null) {
    if (_rateBooksDir == null) {
      LOBLoggerCategory.CONFIG.warn(displaykey.Web.RateBook.Import.Errors.MissingDirectoryStructure(RATEBOOKS_DIR))
      return
    }
    if (_rateBooksDir.listFiles().IsEmpty) {
      LOBLoggerCategory.CONFIG.warn(displaykey.Web.RateBook.Import.Errors.MissingRateBookFiles(RATEBOOKS_DIR))
      return
    }

    var rateBooksToLoad : java.io.File[]

    var allRateBooks = getAllRateBooks()

    var cwRateBooks = allRateBooks.where(\ file -> file.AbsolutePath.contains(CWCodeByLine.get(_line)))

    if (jurisdiction != null) { //load jurisdiction-specific book
      var rateBookCode = RatebookCodePrefixByLine.get(_line) + " ${jurisdiction}"
      rateBooksToLoad = allRateBooks.where( \ book -> book.NameSansExtension.startsWith(rateBookCode))
      if (rateBooksToLoad.IsEmpty) {
        LoggerCategory.CONFIG.warn("No rate book found to load for jurisdiction ${jurisdiction}.")
      }
    }
    else { //load all books
      rateBooksToLoad = allRateBooks.disjunction(cwRateBooks).toTypedArray()
    }

    if (rateBooksToLoad.HasElements) {
      //Load Country Wide rate books first and then state rate books
      importRateBooks(cwRateBooks)
      importRateBooks(rateBooksToLoad)
    }
  }

  private function importRateBooks(rateBooks : File[]) : void {
    rateBooks.each(\ file -> {
      var code = file.NameSansExtension.split("-").first()
      if (shouldLoadBook(code)) {
        using(var fileStream = new FileInputStream(file)) {
          RateBookImporter.create().import(new MockWebFile(fileStream))
        }
      }
    })
  }

  private function getAllRateBooks() : File[] {
    return _rateBooksDir.listFiles(new FilenameFilter() {
      override public function accept(dir : File, name : String) : boolean {
        return name.toLowerCase().endsWith(".xml");
      }
    })
  }

  private function shouldLoadBook(code : String) : boolean {
    var q = Query.make(RateBook).compare("PolicyLine", Equals, _line)
        .startsWith("BookCode", code, true)
    return q.select().toList().Empty
  }
}