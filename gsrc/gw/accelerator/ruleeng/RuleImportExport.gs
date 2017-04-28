package gw.accelerator.ruleeng

uses gw.api.database.Query
uses gw.api.importing.XmlExporterXmlWriter
uses gw.api.util.DisplayableException
uses gw.api.webservice.importTools.ImportResults
uses gw.pl.util.FileUtil
uses gw.transaction.Transaction
uses gw.wsi.pl.ImportToolsAPI

uses java.io.File
uses java.lang.StringBuilder
uses java.util.Collection
uses una.logging.UnaLoggerCategory

/**
 * Class RuleImportExport manages importing and exporting Rule_Ext instances.
 */
class RuleImportExport {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  /** The script parameter that specifies the PC installation location. */
  static final var PC_ROOT = ScriptParameters.$PC_ROOT.trim()
  /** The local rule file, configured by script parameters. */
  static final var RULE_FILE_LOCAL =
      ScriptParameters.RuleImportExportPathLocal.replace("$PC_ROOT", PC_ROOT)
          + "/Rule_Ext.xml"
  /** A temporary rule file, also configured by script parameters. */
  static final var RULE_FILE_TMP =
      ScriptParameters.RuleImportExportPathTmp + "/Rule_Ext.xml"

  @Returns("An import file, based on the permissions of the current user")
  static property get ImportFile() : File {
    if (perm.System.devruleadmin) {
      return new File(RULE_FILE_LOCAL)
    }
    else {
      return new File(RULE_FILE_TMP)
    }
  }

  /**
   * Exports a collection of rules to the {@link #ImportFile()}.
   */
  @Param("rules", "The rules to export to the file")
  @Returns("A status message.")
  static function exportRules(rules : Collection<Rule_Ext>) : String{
    var writer = new XmlExporterXmlWriter(rules)
    rules.each(\ rule -> {
      writer.addAll(rule.Jobs.toList())
      writer.addAll(rule.Jurisdictions.toList())
      writer.addAll(rule.PolicyTypes.toList())
      if (rule typeis ValidationRule_Ext) {
        writer.addAll(rule.VehicleTypes.toList())
      }
    })
    var bundle = Transaction.newBundle()
    writer.finishExport(bundle)

    FileUtil.copyBinaryFile(writer.InputStream, ImportFile)

    return displaykey.Accelerator.RulesFramework.Export.Complete(rules.Count,
        ImportFile.AbsolutePath)
  }

  /**
   * This method uses the {@link gw.wsi.pl.ImportToolsAPI} to import rules
   * from the {@link #ImportFile()}.
   */
  @Returns("A description of what was modified during the import")
  static function importRules() : String {
    var resultString = new StringBuilder()

    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      // Retire all rules in the system to replace them with the imported file
      _logger.info("Path is " + new File("").AbsolutePath)
      _logger.info("Path is " + new File("").CanonicalPath)
      _logger.info("RULE_FILE_LOCAL" +RULE_FILE_LOCAL)
      Query.make(Rule_Ext).select().each(
          \rule -> bundle.add(rule).remove())
      bundle.commit()
     //"./modules/configuration/config/resources/rulesframework/Rule_Ext.xml"
      var rulesFile = new File(RULE_FILE_LOCAL)
      var fullstr = rulesFile.read()

      var import = new ImportToolsAPI()
      var iResults : ImportResults

      iResults = import.importArchiveXmlData(fullstr)

      if (iResults.Ok) {
        if (iResults.Summaries.HasElements) {
          iResults.Summaries.each(\ i -> resultString.append(
              displaykey.Accelerator.RulesFramework.Import.ChangeMessage(
                  i.Count, i.EntityName)).append("\n"))
        } else {
          resultString.append(
            displaykey.Accelerator.RulesFramework.Import.NoChanges
          )
        }
      } else {
        throw new DisplayableException(iResults.ErrorLog.join("\n"))
      }
    }, "su")

    return resultString.toString()
  }

  /**
   * validFilePath: This method is used on the high level to validate that the
   * file path exists.
   */
  @Returns("True if the import file exists")
  static function validFilePath() : boolean {
    return ImportFile.exists()
  }

}