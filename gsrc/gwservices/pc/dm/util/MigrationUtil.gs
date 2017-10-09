package gwservices.pc.dm.util

uses com.gwservices.pc.dm.data.access.IDataAccessInbound
uses com.gwservices.pc.dm.exception.DAException
uses com.gwservices.pc.dm.util.PropertyHelper
uses gw.api.database.Query
uses gw.api.system.server.ServerUtil
uses gw.api.util.DisplayableException
uses gw.api.web.WebUtil
uses gw.lang.reflect.TypeSystem
uses gw.util.concurrent.LockingLazyVar
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.base.account.accountmodel.Account
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod
uses org.apache.commons.io.IOUtils

uses java.io.File
uses java.io.FileInputStream
uses java.io.FileOutputStream
uses java.lang.Exception
uses java.lang.System
uses java.util.Map
uses java.util.zip.ZipEntry
uses java.util.zip.ZipOutputStream
uses java.lang.StringBuilder
uses gwservices.pc.dm.batch.DataMigrationNonFatalException

/**
 * Migration utility functions
 */
abstract class MigrationUtil {
  public static final var SEQUENCE_MIN_PARAM: String = "SEQUENCE_MIN"
  public static final var SEQUENCE_MAX_PARAM: String = "SEQUENCE_MAX"
  private static final var _MIGRATION_CONFIG_FILE = "accountsMigration"
  private static final var _MIGRATION_ROLE_PROPERTY = "MIGRATION_ROLE"
  private static final var _ENV_PARAM = "gw.pc.env"
  private static final var _ENV_WILDCARD = "*"
  private static final var _migrationRoleName: LockingLazyVar<String> as MIGRATION_ROLE_NAME = LockingLazyVar.make(\-> {
    var ph = getPropertyHelper(_MIGRATION_CONFIG_FILE)
    return ph.getProperty(_MIGRATION_ROLE_PROPERTY)
  })
  public static final var _migrationRole: LockingLazyVar<Role> as MIGRATION_ROLE = LockingLazyVar.make(\-> {
    var mr = Query.make(Role).compare("Name", Equals, MIGRATION_ROLE_NAME.get()).select().FirstResult
    if (mr == null) {
      throw new DAException("migration role not loaded")
    }
    return mr
  })
  private static final var _LOG_TAG = "${MigrationUtil.Type.RelativeName} - "
  private static final var _DATA_ACCESS_PLUGIN = "DATA_ACCESS_PLUGIN"
  private static final var _logger = DMLogger.General
  private static final var _generateIds =
      {"PublicID", "AccountNumber", "PolicyNumber", "AddressBookUID", "InternalRequestID"}
  /**
   * Is this a migration job
   */
  static function isMigrationJob(job: Job): boolean {
    return job.MigrationJobInfo_Ext != null
  }

  /**
   * Should we disable underwriting rules as part of RPF?
   */
  static function DisableUWRule(issueType: UWIssueType, bean: entity.PolicyPeriod): boolean {
    return disableValidation("UWIssue", issueType.Code, bean)
  }

  /**
   * Should we disable class based validation as part of RPF?
   */
  static function DisableClassValidation(message: String, bean: KeyableBean): boolean {
    if (bean typeis entity.PolicyPeriod) {
      return disableValidation("ClassValidation", message, bean)
    } else if (bean typeis EffDated and bean.BranchUntyped typeis entity.PolicyPeriod) {
      return disableValidation("ClassValidation", message, bean.BranchUntyped)
    } else {
      return disableValidation("ClassValidation", message, null)
    }
  }

  /**
   * Loads data access inbound plugin
   */
  static function loadDataAccessInbound(propertyHelper: PropertyHelper): IDataAccessInbound {
    var inBoundDataAccessPlugin: IDataAccessInbound = null
    var daInboundPluginName = propertyHelper.getRequiredProp(_DATA_ACCESS_PLUGIN)
    try {
      var cls = TypeSystem.getByFullName(daInboundPluginName)
      var constructor = cls.TypeInfo.Constructors.first().Constructor
      inBoundDataAccessPlugin = constructor.newInstance(new Object[0]) as IDataAccessInbound
      inBoundDataAccessPlugin.setConfiguration(propertyHelper)
    } catch (ex: Exception) {
      var msg = _LOG_TAG + "loadDataAccessInbound() ${typeof(ex)} for ${daInboundPluginName}"
      _logger.error(msg, ex)
      inBoundDataAccessPlugin = null
      throw new DAException(msg, ex)
    }
    return inBoundDataAccessPlugin
  }

  /**
   * Convenience. Get int param or default value
   * @param key the parameter
   * @param defaultVal the default value, assuming value is not in the map
   */
  static function getIntParam(propertyHelper: PropertyHelper, key: String, defaultVal: int): int {
    var val = propertyHelper.getIntProperty(key)
    return val != null or val < 1 ? val : defaultVal
  }

  /**
   * Extract sample payloads for all transactions on an account
   */
  static function extractPayloads(accountNumber: String, pubidPrefix: String, resultDir: File): List<File> {
    var files: List<File> = {}
    var accountQuery = Query.make(entity.Account).compare(entity.Account#AccountNumber, Equals, accountNumber)
    var account = accountQuery.select().AtMostOneRow
    if (account == null) {
      throw new DisplayableException(displaykey.Accelerator.DataMigration.Web.ServerTools.AccountMissing)
    }
    var accountFileName = accountNumber.replaceAll("\\W+", "")
    resultDir = new File(resultDir, accountFileName)
    if (not resultDir.exists()) {
      resultDir.mkdirs()
    }
    var idMap: Map<String, String> = {}
    var accountXmlStr = replacePubIds(new Account(account), pubidPrefix, idMap, {}).asUTFString()
    var acctFile = new File(resultDir, "account-" + accountFileName + ".xml")
    acctFile.write(accountXmlStr)
    files.add(acctFile)
    for (policy in account.Policies) {
      for (job in policy.Jobs) {
        if (job.Periods.Count > 1) {
          _logger.warn(_LOG_TAG + "extractPayloads multiple periods on job ${job.JobNumber}")
        }
        var policyXmlStr = replacePubIds(new PolicyPeriod(job.LatestPeriod), pubidPrefix, idMap, {}).asUTFString()
        var jobType = ((typeof(job)).RelativeName).toLowerCase()
        var jobNumber = job.JobNumber.replaceAll("\\W+", "")
        var policyNumber = getPolicyPeriodIdentifier(job.LatestPeriod)
        var transactionFileName = "policy-${policyNumber}-${jobType}-${jobNumber}.xml"
        var transactionFile = new File(resultDir, transactionFileName)
        transactionFile.write(policyXmlStr)
        files.add(transactionFile)
      }
    }
    return files
  }

  /**
   * Send payloads in zip file to a UI client
   */
  static function downloadPayloads(accountNumber: String, pubidPrefix: String) {
    if (accountNumber == null) {
      throw new DisplayableException(displaykey.Accelerator.DataMigration.Web.ServerTools.AccountNumberNonNull)
    }
    var tempDir = File.createTempFile("modelpayloads", "")
    tempDir.delete()
    tempDir.mkdirs()
    var files = extractPayloads(accountNumber, pubidPrefix, tempDir)
    var zipFile = File.createTempFile("modelpayloads", ".zip")
    var zos = new ZipOutputStream(new FileOutputStream(zipFile));
    for (file in files) {
      var fis = new FileInputStream(file);
      zos.putNextEntry(new ZipEntry(file.getName()));
      IOUtils.write(IOUtils.toString(fis), zos)
      zos.closeEntry();
      fis.close();
    }
    zos.close();
    WebUtil.copyFileToClient("application/zip", zipFile)
  }

  /**
   * Should this validation be disabled, based on admin and control configuration?
   */
  private static function disableValidation(controlType: RPFControlType_Ext, pattern: String,
                                            policyPeriod: entity.PolicyPeriod): boolean {
    pattern = pattern?.trim()
    if (policyPeriod == null) {
      var msg = "disableValidation() policy period is null"
      _logger.warn(_LOG_TAG + msg)
      return false
    }
    if (policyPeriod.Job == null) {
      var msg = "disableValidation() no job associated with ${policyPeriod}"
      _logger.warn(_LOG_TAG + msg)
      return false
    }
    if (not policyPeriod.Job.MigrationJob) {
      if (_logger.isDebugEnabled()) {
        _logger.debug(_LOG_TAG + "disableValidation() ignoring non-migrated period ${policyPeriod}")
      }
      return false
    }
    var env = ServerUtil.Env
    var rpfAdminQuery = Query.make(RPFAdmin_Ext).compare(RPFAdmin_Ext#Type, Equals, controlType)
    rpfAdminQuery.compare(RPFAdmin_Ext#Env, Equals, env)
    var rpfAdmin = rpfAdminQuery.select().AtMostOneRow
    var globalLevel = rpfAdmin.GlobalLevel
    if (pattern.HasContent and rpfAdmin != null and globalLevel != "Normal") {
      var controlQuery = Query.make(RPFControl_Ext).compare(RPFControl_Ext#Type, Equals, controlType)
      controlQuery.or(\orCriteria -> {
        orCriteria.compare(RPFControl_Ext#Env, Equals, env)
        orCriteria.compare(RPFControl_Ext#Env, Equals, _ENV_WILDCARD)
      })
      controlQuery.compare(RPFControl_Ext#Ignore, Equals, false)
      var allControls = controlQuery.select().toList()
      var control = allControls.firstWhere(\elt -> elt.Pattern != null and pattern.matches(elt.Pattern))
      if (globalLevel == null and control == null and _logger.WarnEnabled) {
        _logger.warn(_LOG_TAG + "disableValidation() missing control pattern for [${pattern}]")
        return false
      }
      var controlLevel = control.Level
      if (globalLevel == "Log" or globalLevel == "Disable" or controlLevel != "Normal") {
        if (globalLevel == "Log" or (controlLevel == "Log" and globalLevel != "Disable")) {
          logRPF(policyPeriod, pattern, controlType, control)
        }
        return true
      }
    }
    return false
  }

  /**
   * Convenience. Only log if is hasn't been done already
   */
  private static function logRPF(policyPeriod: entity.PolicyPeriod, pattern: String, type: RPFControlType_Ext, control: RPFControl_Ext) {
    var logged: boolean
    var jobNumber = policyPeriod.Job.JobNumber
    var policyNumber = policyPeriod.PolicyNumber
    if (jobNumber.HasContent or policyNumber.HasContent) {
      var existingQuery = Query.make(RPFLog_Ext)
      existingQuery.or(\orCriteria -> {
        if (jobNumber.HasContent) orCriteria.compare(RPFLog_Ext#JobNumber, Equals, jobNumber)
        if (policyNumber.HasContent) orCriteria.compare(RPFLog_Ext#PolicyNumber, Equals, policyNumber)
      })
      existingQuery.compare(RPFLog_Ext#Pattern, Equals, pattern)
      logged = existingQuery.select().HasElements
      if (not logged) {
        // start a new transaction, necessary because job may not commit
        gw.transaction.Transaction.runWithNewBundle(\bundle -> {
          var newLog = new RPFLog_Ext()
          // pattern length is limited to 255
          newLog.Pattern = pattern.size > 255 ? pattern.substring(0, 255) : pattern
          newLog.Type = type
          newLog.Control = control
          newLog.JobNumber = jobNumber
          newLog.PolicyNumber = policyNumber
        })
      }
    } else {
      var msg = "logRPF - missing job and policy number for pattern ${pattern} for policy period ${policyPeriod}"
      _logger.warn(_LOG_TAG + msg)
    }
  }

  /**
   * Return policy period identifier
   */
  private static function getPolicyPeriodIdentifier(period: entity.PolicyPeriod): String {
    var periodId = period.PolicyNumber?.replaceAll("\\W+", "")
    if (not periodId.HasContent) {
      periodId = period.PublicID?.replaceAll("\\W+", "")
    }
    return periodId
  }

  /**
   * Replace public IDs in an XML element
   */
  private static function replacePubIds(xml: XmlElement, prefix: String, idMap: Map<String, String>,
                                        processed: List<XmlElement>): XmlElement {
    processed.add(xml)
    if (prefix.Empty) {
      prefix = ""
    }
    for (child in xml.Children) {
      var localPart = child.QName.LocalPart
      if (_generateIds.contains(localPart)) {
        var val = child.Text
        if (not val.matches("[a-z,A-Z]+:.*")) {
          val = "mig:" + val.replaceAll("\\W+", "")
        }
        var replace = idMap.get(val)
        if (replace == null) {
          replace = "$" + "{" + prefix + val + "}"
          idMap.put(val, replace)
        }
        child.Text = replace
      } else if (child typeis XmlElement) {
        if (not processed.contains(child)) {
          replacePubIds(child, prefix, idMap, processed)
        }
      }
    }
    return xml
  }

  public static function getPropertyHelper(_CONFIG_FILE : String) : PropertyHelper{
    var  proHelper : PropertyHelper
    proHelper = new PropertyHelper(_CONFIG_FILE)
    proHelper.Prefix = ServerUtil.Env + "."
    return proHelper
  }
}
