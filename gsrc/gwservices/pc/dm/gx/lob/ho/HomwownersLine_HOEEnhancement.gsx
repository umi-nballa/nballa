package gwservices.pc.dm.gx.lob.ho

uses gw.web.productmodel.ProductModelSyncIssueWrapper
/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 7/12/16
 * Time: 12:15 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement HomwownersLine_HOEEnhancement : entity.HomeownersLine_HOE {

  function addNewPolicyAddlInsuredOfContactType(contactType : typekey.ContactType) : PolicyAddlInsured {
    var acctContact = this.Branch.Policy.Account.addNewAccountContactOfType(contactType)
    acctContact.addNewRole( "AdditionalInterest" )
    return addNewPolicyAddlInsuredForContact(acctContact.Contact)
  }

  function addNewPolicyAddlInsuredForContact(contact : Contact) : PolicyAddlInsured {
    /*if (this.PolicyAddlInterest.hasMatch(\ driver -> driver.AccountContactRole.AccountContact.Contact == contact)) {
      throw new DisplayableException(displaykey.Web.PolicyDriver.Error.AlreadyExists(contact))
    }*/
    var policyAddlInsured = this.Branch.addNewPolicyContactRoleForContact(contact, "PolicyAddlInsured") as PolicyAddlInsured
    this.addToAdditionalInsureds(policyAddlInsured)
    return policyAddlInsured
  }

  function createAndAddCoverages(){
    var cov = new HomeownersLineCov_HOE(this.Branch)
    var _branch = this.Branch
    _branch.Lines*.AllCoverables.each( \ c -> c.createOrSyncCoverages())

//    return _branch.HomeownersLine_HOE.HOLineCoverages;
  }
}
