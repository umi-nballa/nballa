package gwservices.pc.dm.gx.entitypopulators

uses com.guidewire.commons.system.gx.GXTypeLoader
uses com.gwservices.pc.dm.exception.DAException
uses gw.api.web.WebUtil
uses gw.lang.reflect.IConstructorInfo
uses gw.lang.reflect.IMethodInfo
uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem
uses gw.util.concurrent.LockingLazyVar
uses gwservices.pc.dm.gx.base.account.AccountPopulator
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_AccountContacts_Entry
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_AllHistory_Entry
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_AllOpenActivitiesList_Entry
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_DocumentsList_Entry
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_Notes_Entry
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_PrimaryLocation
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_ProducerCodes_Entry
uses gwservices.pc.dm.gx.base.policy.PolicyPeriodPopulator
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_AllContacts_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Forms_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Job
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Lines_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Notes_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PeriodAnswers_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Policy
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyAddress
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyContactRoles_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyLocations_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_ProducerCodeOfRecord
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_UWCompany
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_UWIssuesIncludingSoftDeleted_Entry
uses gwservices.pc.dm.gx.shared.contact.AccountContactPopulator
uses gwservices.pc.dm.gx.shared.contact.ContactPopulator
uses gwservices.pc.dm.gx.shared.contact.PolicyContactRolePopulator
uses gwservices.pc.dm.gx.shared.contact.accountcontactrolemodel.anonymous.elements.AccountContactRole_AccountContact
uses gwservices.pc.dm.gx.shared.contact.addlinterestdetailmodel.anonymous.elements.AddlInterestDetail_PolicyAddlInterest
uses gwservices.pc.dm.gx.shared.general.ActivityPopulator
uses gwservices.pc.dm.gx.shared.general.CancellationPopulator
uses gwservices.pc.dm.gx.shared.general.DocumentPopulator
uses gwservices.pc.dm.gx.shared.general.FormPopulator
uses gwservices.pc.dm.gx.shared.general.GroupPopulator
uses gwservices.pc.dm.gx.shared.general.HistoryPopulator
uses gwservices.pc.dm.gx.shared.general.JobPopulator
uses gwservices.pc.dm.gx.shared.general.NotePopulator
uses gwservices.pc.dm.gx.shared.general.ReinstatementPopulator
uses gwservices.pc.dm.gx.shared.general.UWCompanyPopulator
uses gwservices.pc.dm.gx.shared.general.UWIssuePopulator
uses gwservices.pc.dm.gx.shared.general.UserPopulator
uses gwservices.pc.dm.gx.shared.general.activitymodel.anonymous.elements.Activity_ActivityPattern
uses gwservices.pc.dm.gx.shared.general.activitymodel.anonymous.elements.Activity_AssignedGroup
uses gwservices.pc.dm.gx.shared.general.activitymodel.anonymous.elements.Activity_AssignedUser
uses gwservices.pc.dm.gx.shared.general.historymodel.anonymous.elements.History_User
uses gwservices.pc.dm.gx.shared.general.jobmodel.anonymous.elements.Job_Entity_Cancellation
uses gwservices.pc.dm.gx.shared.general.jobmodel.anonymous.elements.Job_Entity_Reinstatement
uses gwservices.pc.dm.gx.shared.general.notemodel.anonymous.elements.Note_Activity
uses gwservices.pc.dm.gx.shared.general.notemodel.anonymous.elements.Note_Author
uses gwservices.pc.dm.gx.shared.general.usermodel.anonymous.elements.User_Credential
uses gwservices.pc.dm.gx.shared.general.uwissuemodel.anonymous.elements.UWIssue_ApprovingUser
uses gwservices.pc.dm.gx.shared.general.uwissuemodel.anonymous.elements.UWIssue_IssueType
uses gwservices.pc.dm.gx.shared.location.AddressModelPopulator
uses gwservices.pc.dm.gx.shared.location.PolicyAddressPopulator
uses gwservices.pc.dm.gx.shared.location.PolicyLocationPopulator
uses gwservices.pc.dm.gx.shared.location.policyaddressmodel.anonymous.elements.PolicyAddress_Address
uses gwservices.pc.dm.gx.shared.location.policylocationmodel.anonymous.elements.PolicyLocation_AccountLocation
uses gwservices.pc.dm.gx.shared.policy.PolicyLinePopulator
uses gwservices.pc.dm.gx.shared.policy.PolicyPopulator
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_LineAnswers_Entry
uses gwservices.pc.dm.gx.shared.policy.policymodel.anonymous.elements.Policy_Account
uses gwservices.pc.dm.gx.shared.policy.policymodel.anonymous.elements.Policy_AllHistory_Entry
uses gwservices.pc.dm.gx.shared.policy.policymodel.anonymous.elements.Policy_AllOpenActivitiesList_Entry
uses gwservices.pc.dm.gx.shared.producer.AccountProducerCodePopulator
uses gwservices.pc.dm.gx.shared.producer.ProducerCodePopulator
uses gwservices.pc.dm.gx.shared.producer.accountproducercodemodel.anonymous.elements.AccountProducerCode_ProducerCode
uses gwservices.pc.dm.gx.shared.product.CoveragePopulator
uses gwservices.pc.dm.gx.shared.product.ExclusionPopulator
uses gwservices.pc.dm.gx.shared.product.ModiferPopulator
uses gwservices.pc.dm.gx.shared.product.RateFactorPopulator
uses gwservices.pc.dm.util.DMLogger
uses org.apache.commons.io.IOUtils

uses java.io.File
uses java.io.FileOutputStream
uses java.lang.StringBuilder
uses java.util.Map
uses java.util.concurrent.locks.ReentrantLock
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_IndustryCode
uses gwservices.pc.dm.gx.shared.general.IndustryCodePopulator

/**
 * Entity populator registry
 */
class Registry {
  /** Logging prefix */
  private static final var _LOG_TAG = "${Registry.Type.RelativeName} - "
  /** Logging instance */
  private static var _logger = DMLogger.GX
  /** Backing references for GX model */
  private static var _backingReferences = LockingLazyVar.make(\-> {
    var results: Map<String, IType> = {}
    for (model in new GXTypeLoader(TypeSystem.Type.TypeLoader.Module).AllGXModels) {
      var relativeName = model.RootType.RelativeName
      var modelName = model.Name
      results.put(model.Name + "." + relativeName, model.RootType)
      for (mappedProperty in model.MappedProperties) {
        if (mappedProperty.ReferencedModel.HasContent) {
          var simpleName = mappedProperty.FullDotPath
          simpleName = simpleName.replace("(entity-", "Entity_").replace(").", "_").replace("[]", "_Entry")
          simpleName = simpleName.replaceAll("\\.", "_")
          results.put(model.Name + ".anonymous.elements." + relativeName + "_" + simpleName, mappedProperty.Type)
        }
      }
    }
    return results
  })
  /** Cache reflective methods for performance */
  private static var _cachedMethods: Map<String, IMethodInfo> = {}
  /** Cache method locks */
  private static var _cachedMethodLock = new ReentrantLock()
  /** Registered populators */
  private var _populators: Map<IType, IConstructorInfo> = {
      gwservices.pc.dm.gx.base.account.accountmodel.Account -> getConstructor(AccountPopulator),
      gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod -> getConstructor(PolicyPeriodPopulator),
      AccountContactRole_AccountContact -> getConstructor(AccountContactPopulator),
      PolicyPeriod_AllContacts_Entry -> getConstructor(ContactPopulator),
      PolicyPeriod_PolicyContactRoles_Entry -> getConstructor(PolicyContactRolePopulator),
      AddlInterestDetail_PolicyAddlInterest -> getConstructor(PolicyContactRolePopulator),
      Account_AllOpenActivitiesList_Entry -> getConstructor(ActivityPopulator),
      Policy_AllOpenActivitiesList_Entry -> getConstructor(ActivityPopulator),
      Note_Activity -> getConstructor(ActivityPopulator),
      Job_Entity_Cancellation -> getConstructor(CancellationPopulator),
      Account_DocumentsList_Entry -> getConstructor(DocumentPopulator),
      Activity_AssignedGroup -> getConstructor(GroupPopulator),
      Account_AllHistory_Entry -> getConstructor(HistoryPopulator),
      Policy_AllHistory_Entry -> getConstructor(HistoryPopulator),
      PolicyPeriod_Job -> getConstructor(JobPopulator),
      Job_Entity_Reinstatement -> getConstructor(ReinstatementPopulator),
      Note_Author -> getConstructor(UserPopulator),
      History_User -> getConstructor(UserPopulator),
      UWIssue_ApprovingUser -> getConstructor(UserPopulator),
      Activity_AssignedUser -> getConstructor(UserPopulator),
      PolicyPeriod_UWCompany -> getConstructor(UWCompanyPopulator),
      PolicyPeriod_UWIssuesIncludingSoftDeleted_Entry -> getConstructor(UWIssuePopulator),
      PolicyPeriod_PolicyLocations_Entry -> getConstructor(PolicyLocationPopulator),
      PolicyPeriod_Lines_Entry -> getConstructor(PolicyLinePopulator),
      PolicyPeriod_Policy -> getConstructor(PolicyPopulator),
      Account_ProducerCodes_Entry -> getConstructor(AccountProducerCodePopulator),
      AccountProducerCode_ProducerCode -> getConstructor(ProducerCodePopulator),
      PolicyPeriod_ProducerCodeOfRecord -> getConstructor(ProducerCodePopulator),
      Account_PrimaryLocation -> getConstructor(AddressModelPopulator),
      PolicyPeriod_Forms_Entry -> getConstructor(FormPopulator),
      PolicyLocation_AccountLocation -> getConstructor(AddressModelPopulator),
      PolicyPeriod_PolicyAddress -> getConstructor(PolicyAddressPopulator),
      PolicyAddress_Address -> getConstructor(AddressModelPopulator),
      Account_Notes_Entry -> getConstructor(NotePopulator),
      PolicyPeriod_Notes_Entry -> getConstructor(NotePopulator),
      Account_AccountContacts_Entry -> getConstructor(AccountContactPopulator),
      Account_IndustryCode -> getConstructor(IndustryCodePopulator)
  }
  /** Items that should not be populated */
  private var _doNotPopulate: List<IType> as DoNotPopulate = {
      Activity_ActivityPattern,
      User_Credential,
      UWIssue_IssueType,
      Policy_Account,
      UWIssue_IssueType,
      Policy_Account
  }
  /**
   * Entity types to not auto delete
   */
  private var _doNotAutodelete: List<IType> as DoNotAutoDelete = {
      PolicyPeriod_Forms_Entry,
      PolicyPeriod_PeriodAnswers_Entry,
      PolicyLine_LineAnswers_Entry,
      Policy_AllHistory_Entry,
      Policy_AllOpenActivitiesList_Entry,
      Account_AllOpenActivitiesList_Entry
  }
  /** Registered populators */
  private var _populatorInstances: Map<IType, IEntityPopulator>
  /**
   * Refresh the backing references
   */
  static function refreshBackingReferences() {
    _backingReferences.clear()
  }

  /**
   * Retrieve a backing type
   */
  static function getBackingType(xmlModelType: IType): IType {
    return _backingReferences.get().get(xmlModelType.Name)
  }

  /**
   * Generate a CSV file map of XML types to their corresponding entities
   */
  static function createXmlModelBackingReferencesReport(resultFile: File) {
    var sb = new StringBuilder('Model Name,Related Entity')
    _backingReferences.get().eachKeyAndValue(\key, val -> {
      sb.append('\n"').append(key).append('","').append(val).append('"')
    })
    var fio = new FileOutputStream(resultFile)
    try {
      IOUtils.write(sb.toString(), fio)
    } finally {
      IOUtils.closeQuietly(fio)
    }
  }

  /**
   * Download backing report
   */
  static function downloadXmlModelBackingReferencesReport() {
    var tmpFile = File.createTempFile("backingclasses", ".csv")
    createXmlModelBackingReferencesReport(tmpFile)
    WebUtil.copyFileToClient("text/csv", tmpFile)
  }

  /**
   * Retrieve a cached method
   */
  static function getCachedMethod(itype: IType, methodSignature: String,
                                  create: block(itype: IType, methodSignature: String): IMethodInfo): IMethodInfo {
    var key = itype.Name + methodSignature
    var method = _cachedMethods.get(key)
    if (method == null) {
      _cachedMethodLock.lock()
      try {
        method = _cachedMethods.get(key)
        if (method == null) {
          method = create(itype, methodSignature)
          _cachedMethods.put(key, method)
        }
      } finally {
        _cachedMethodLock.unlock()
      }
    }
    return method
  }

  /**
   * Get a populator instance
   */
  function getPopulator(type: IType): IEntityPopulator {
    return PopulatorInstances.get(type)
  }

  /**
   * Set a populator instance
   */
  function setPopulator(type: IType, entityPopulator: IEntityPopulator) {
    PopulatorInstances.put(type, entityPopulator)
  }

  /**
   * Load a constructor
   */
  private static function getConstructor(populator: IType): IConstructorInfo {
    var constructor = populator.TypeInfo.Constructors.firstWhere(\constructor -> constructor.Parameters.Count == 0)
    if (constructor == null) {
      throw new DAException("No constructor found without parameters")
    }
    return constructor
  }

  /**
   * Initialize the populators available to this instance
   */
  private property get PopulatorInstances(): Map<IType, IEntityPopulator> {
    if (_populatorInstances == null) {
      _populatorInstances = {}
      _populators.eachKeyAndValue(\modelType, constructor -> {
        if (_logger.InfoEnabled) {
          var type = constructor.OwnersType.RelativeName
          _logger.info(_LOG_TAG + "PopulatorInstances load type ${type} for model ${modelType}")
        }
        var instance = constructor.Constructor.newInstance(null) as IEntityPopulator
        instance.initialize(modelType.TypeInfo)
        _populatorInstances.put(modelType, instance)
      })
    }
    return _populatorInstances
  }
}
