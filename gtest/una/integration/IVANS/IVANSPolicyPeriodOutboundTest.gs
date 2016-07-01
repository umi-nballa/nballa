package una.integration.IVANS

uses una.integration.UnaIntTestBase
uses gw.api.builder.PolicyBuilder
uses gw.api.databuilder.OfficialIDBuilder
uses gw.api.builder.AddressBuilder
uses gw.api.builder.CompanyBuilder
uses gw.api.builder.AccountBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.webservice.pc.pc800.MaintenanceToolsAPI

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 6/28/16
 * Time: 5:45 AM
 * To change this template use File | Settings | File Templates.
 */
class IVANSPolicyPeriodOutboundTest extends UnaIntTestBase {
  function testIVANSPolicyPeriodOutbound()
  {
    assertNotNull("Policy Period is NULL", createPolicyPeriod())
  }

  function createPolicyPeriod(): PolicyPeriod {
    Logger.info("Test for IVANS")
    var code = 47

    var address = new AddressBuilder()
        .withAddressLine1(code + " Main St.")
        .withAddressLine2("Suite " + code)
        .withCity("San Mateo")
        .withState("CA")
        .withPostalCode("94404-" + code)
        .asBusinessAddress()

    var company = new CompanyBuilder(code, false)
        .withCompanyName("This Company " + code)
        .withWorkPhone("650-555-" + code)
        .withAddress(address)
        .withOfficialID(new OfficialIDBuilder().withType("FEIN").withValue("11-222" + code))

    var account = new AccountBuilder(false)
        .withIndustryCode("1011", "SIC")
        .withAccountOrgType("Corporation")
        .withAccountHolderContact(new CompanyBuilder(code, false)
            .withCompanyName("This Company " + code)
            .withWorkPhone("650-555-" + code)
            .withAddress(new AddressBuilder()
                .withAddressLine1(code + " Main St.")
                .withAddressLine2("Suite " + code)
                .withCity("San Mateo")
                .withState("CA")
                .withPostalCode("94404-" + code)
                .asBusinessAddress()
        )
            .withOfficialID(new OfficialIDBuilder()
                .withType("FEIN")
                .withValue("11-22245" + code))
    )
        .createAndCommit()
    /*var policyPeriod: PolicyPeriod
    var policy = new PolicyBuilder().withAccount(account).createAndCommit()*/
    var builder = new SubmissionBuilder()
        .withAccount(account)
        .withProduct("BusinessOwners").create()
  runBatchProcess(BatchProcessType.TC_IVANSPOLICYPERIOD)

    return builder.Policy.Periods.first()
  }
}