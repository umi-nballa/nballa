package una.integration

uses gw.api.builder.UserBuilder
uses gw.api.database.Query
uses gw.api.databuilder.CredentialBuilder
uses gw.api.messaging.MessageProcessingDirection
uses gw.api.webservice.maintenanceTools.MaintenanceToolsImpl
uses gw.api.webservice.pc.maintenanceTools.PCMaintenanceToolsImpl
uses gw.pl.messaging.MessageStatus
uses gw.testharness.RunLevel
uses gw.testharness.TestBase
uses gw.webservice.pc.pc800.MessagingToolsAPI
uses gw.workqueue.WorkQueueTestUtil
uses org.apache.commons.io.FileUtils

uses java.io.File
uses java.lang.Integer

/**
 * Base class for all the integration GUnit test classes.
 * CreatedBy: VTadi
 * Date: 5/31/2016
 */
@RunLevel (gw.api.system.server.Runlevel.MULTIUSER)
abstract class UnaIntTestBase extends TestBase {
  static var maintenanceTools : MaintenanceToolsImpl

  /**
   * This method is used to initialize the test data common for all the tests
   */
  override function beforeClass() {
    super.beforeClass()
    Logger.info("Initializing the PCMaintenanceToolsImpl")
    maintenanceTools = new PCMaintenanceToolsImpl()
  }

  /**
   * This method is used to free up of resources initialized in the beforeClass() method
   */
  override function afterClass() {
    Logger.info("Dereferencing the PCMaintenanceToolsImpl")
    maintenanceTools = null
    super.afterClass()
  }

  /**
   * Create a new user with the given userName, password, and permission.
   * If password is not provided, use the default password 'gw'.
   */
  protected function createUser(userName: String, password: String = null, permission: SystemPermissionType = null): User {
    var credential = new CredentialBuilder()
        .withUserName(userName)
        .withPassword(password?:"gw")
        .create()

    var user = new UserBuilder()
        .withName("TestFN", "TestLN")
        .withCredential(credential)
        .withPermission(permission?:typekey.SystemPermissionType.TC_USERVIEW)
        .createAndCommit()
    Logger.info("Created a user with the name '${user.Credential.UserName}'")
    return user
  }

  /**
   * Runs the given batch process and asserts the success of the batch run.
   * @param type the batch process type
   */
  protected function runBatchProcess(type: BatchProcessType) {
    Logger.info("Executing the batch process '${type.DisplayName}'")
    // Run the Batch Process
    WorkQueueTestUtil.startWriterViaBatchProcessManagerThenWorkersAndWaitUntilWorkFinishedThenStop(type, {})
    // Check the status
    var isSuccess = maintenanceTools.batchProcessStatusByName(type.Code).Success
    assertTrue("Batch Process '${type.DisplayName}' is failed to execute.", isSuccess)
  }

  /**
   * Skips the error messages and resumes the messaging destination if suspended.
   * @param destID the messaging destination ID
   */
  protected function clearMessagingBlockers(destID: Integer) {
    Logger.info("Clearing the messaging blockers for the message destination id: ${destID}")
    var messagingAPI: MessagingToolsAPI = new()
    var errorMsgIds=
        Query.make(Message)
            .compare(Message#DestinationID, Equals, destID).compareIn(Message#Status, {MessageStatus.ERROR, MessageStatus.RETRYABLE_ERROR} as Integer[])
            .select()?.toList()*.ID*.Value

    for (msgId in errorMsgIds) {
      messagingAPI.skipMessage(msgId)
    }

    if (messagingAPI.isSuspended(destID, MessageProcessingDirection.both)) {
      messagingAPI.resumeDestinationBothDirections(destID)
    }
  }

  /**
   * Deletes the existing files in the given directory.
   * Also, if the directory doesn't exist, it will create.
   */
  protected function clearExistingFiles(dir: File) {
    Logger.info("Clearing the existing files in the directory: ${dir.AbsolutePath}")
    if (dir.exists()) {
      FileUtils.cleanDirectory(dir)
    } else {
      dir.mkdirs()
    }
  }
}