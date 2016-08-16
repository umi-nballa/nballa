package una.integration.creditreport

uses typekey.State
uses typekey.CreditStatusExt

uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.creditreport.testutil.AccountFactory

@gw.testharness.ServerTest
class CreditReportResponseTest extends gw.testharness.TestBase {

  function testBuilder() {
            
    var resp = new CreditReportResponse
               .Builder()
               .withFirstName(AccountFactory.FirstNameArray[0])
               .withMiddleName(null)
               .withLastName(AccountFactory.LastNameArray[0])
               .withAddress1(AccountFactory.AddressLine1Array[0])
               .withAddresscity(AccountFactory.AddressCityArray[0])
               .withAddressState(typekey.State.TC_CA as String)
               .withAddressZip(AccountFactory.AddressZipArray[0])
               .withStatusCode(typekey.CreditStatusExt.TC_NO_SCORE)
               .withStatusDescription(AccountFactory.StatusDescription)
               .withScore(AccountFactory.CreditScoreArray[0])
               .withCreditBureau(AccountFactory.CreditBureau)
               .withScoreDate(AccountFactory.date)
               .withFolderId(AccountFactory.folderID)
               .withDateOfBirth(AccountFactory.date)
               .withSocialSecurityNumber(AccountFactory.IsuredSocialSecurityNumberArray[0])
               .withGender(AccountFactory.gender[0])
               .withScoreDate(AccountFactory.date)
               .withOrderedDate(AccountFactory.date)
               .withAddressDiscrepancyInd(false)
               .withReasons(null)
               .create()
                 
    assertEquals(AccountFactory.FirstNameArray[0], resp.FirstName)
    assertNull(resp.MiddleName)
    assertEquals(AccountFactory.LastNameArray[0], resp.LastName)
    assertEquals(AccountFactory.AddressLine1Array[0], resp.AddressLine1)
    assertEquals(AccountFactory.AddressCityArray[0], resp.AddressCity)
    assertEquals(typekey.State.TC_CA, resp.AddressState)
    assertEquals(AccountFactory.AddressZipArray[0], resp.AddressZip)
    assertEquals(typekey.CreditStatusExt.TC_NO_SCORE, resp.StatusCode)
    assertEquals(AccountFactory.StatusDescription, resp.StatusDescription)
    assertEquals(AccountFactory.CreditScoreArray[0], resp.Score)
    assertEquals(AccountFactory.CreditBureau, resp.CreditBureau)
    assertEquals(AccountFactory.folderID, resp.FolderID)
    assertEquals(AccountFactory.date, resp.DateOfBirth)
    assertEquals(AccountFactory.IsuredSocialSecurityNumberArray[0], resp.SocialSecurityNumber)
    assertEquals(AccountFactory.gender[0], resp.Gender)
    assertEquals(AccountFactory.date, resp.ScoreDate)
    assertEquals(AccountFactory.date, resp.OrderedDate)
    assertEquals(false, resp.AddressDiscrepancyInd)
    assertEquals(0, resp.Reasons.Count)
  }
}
