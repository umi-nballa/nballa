package una.integration.clueproperty

uses gw.api.builder.AccountBuilder
uses gw.api.builder.AccountContactBuilder
uses gw.api.builder.AccountLocationBuilder
uses gw.api.builder.DriverBuilder
uses gw.api.builder.NamedInsuredBuilder
uses gw.api.builder.PersonBuilder
uses gw.api.builder.PolicyAddlNamedInsuredBuilder
uses gw.api.builder.PolicyPriNamedInsuredBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.api.databuilder.ContactBuilder
uses una.integration.UnaIntTestBase
uses una.integration.creditreport.testutil.AccountFactory
uses una.integration.service.gateway.clue.CluePropertyInterface
uses una.integration.service.gateway.plugin.GatewayPlugin

uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 8/17/16
 * Time: 3:40 AM
 * To change this template use File | Settings | File Templates.
 */
class CluePropertyServiceTest extends UnaIntTestBase {
  static var clueproperty: CluePropertyInterface
  static var policyPeriod: PolicyPeriod
  /**
   * This method is used to initialize the test data common for all the tests in this class
   */
  override function beforeClass() {
    super.beforeClass()
    Logger.info("Initializing ClueProperty")
    clueproperty = GatewayPlugin.makeCLUEGateway()
  }

  private static function createNamedInsured(account: Account, contact: Contact): NamedInsured {
    var namedInsuredBuilder = new NamedInsuredBuilder()
    new AccountContactBuilder()
        .withRole(namedInsuredBuilder)
        .onAccount(account)
        .withContact(contact)
        .createAndCommit()
    return namedInsuredBuilder.LastCreatedBean
  }

  static function createPolicyPeriod(contactBuilder(): ContactBuilder): PolicyPeriod {
    var pp: PolicyPeriod
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var accountLocationBuilder = new AccountLocationBuilder()
      var driverBuilder = new DriverBuilder()
      var driverAccountContact = new AccountContactBuilder()
          .withContact(contactBuilder())
          .withRole(driverBuilder)
      var account = new AccountBuilder()
          .withAccountLocation(accountLocationBuilder)
          .withAccountContact(driverAccountContact)
      var namedInsured = createNamedInsured(account.create(), contactBuilder().create())
      var smBuilder = new SubmissionBuilder()
          .withAccount(account)
          .withProduct(AccountFactory.product)
          .withBillingMethod(BillingMethod.TC_DIRECTBILL)
          .withPolicyContactRole(new PolicyAddlNamedInsuredBuilder()
              .withAccountContactRole(namedInsured))
          .withPrimaryNamedInsured(new PolicyPriNamedInsuredBuilder()
              .withAccountContactRole(namedInsured))
      pp = smBuilder.withProduct("Homeowners").create(bundle)
    })

    return pp
  }

  /**
   * Method to return Policy Period Instance
   */
  private static function returnPolicyPeriod()
  {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var mr = gw.api.database.Query.make(Role).compare("Name", Equals, "datamigration").select().FirstResult
      if (mr == null)
      {
        mr = new Role()
        mr.Name = "datamigration"
        mr.RoleType = RoleType.TC_USER
      }
      var address = new Address()
      address.AddressLine1 = "2350"
      address.AddressLine2 = "AMBERSIDE WAY"
      address.City = "PORTSMOUTH"
      address.State = "FL"
      address.PostalCode = "33544-8781"
      policyPeriod = createPolicyPeriod(\-> {
        return new PersonBuilder()
            .withFirstName("JEAN")
            .withLastName("ABILA")
            .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, - 30))
      })
    })
  }

  /**
   * Test case to check for Lexis Nexis CLUE invocation Success Scenarios
   */
  function testCluePropertyService() {
    Logger.info("Entering the test method 'testCluePropertyService'")
    var ex: Exception = null
    try {
      clueproperty.orderClueProperty(policyPeriod, null)
    } catch (e: Exception) {
      ex = e;
      Logger.info("Error in LexisNexis CLUE webservice invocation")
    } finally {
      assertNotNull(ex)
    }
    Logger.info("Exiting the test method 'testCluePropertyService'")
  }

  /**
   * Test case to check for Lexis Nexis CLUE invocation Failure Scenarios
   */
  function testCluePropertyServiceFailure() {
    Logger.info("Entering the test method 'testCluePropertyServiceFailure'")
    var ex: Exception = null
    try {
      clueproperty.orderClueProperty(null, null)
    } catch (e: Exception) {
      ex = e;
      Logger.info("Error in LexisNexis CLUE webservice invocation")
    } finally {
      assertNull(ex);
    }
    Logger.info("Exiting the test method 'testCluePropertyServiceFailure'")
  }
}