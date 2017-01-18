package onbase.webservice

uses gw.api.util.Logger
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService
uses onbase.webservice.dataobject.AccountInfoForOnBase
uses onbase.webservice.dataobject.JobInfoForOnBase
uses onbase.webservice.dataobject.PolicyInfoForOnBase
uses onbase.webservice.dataobject.ContactInfoForOnBase
uses java.util.ArrayList

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   04/22/2014 - Daniel Q. Yu 
 *     * Initial implementation.
 *
 *   05/13/2014 - Daniel Q. Yu
 *     * Change query primarily based on policy number instead of account number.
 *
 *   05/28/2014 - Daniel Q. Yu
 *     * If account number is not null but invalid, then throw an error.
 *     * If job number is not null but invalid, then throw an error.
 *     * If policy number is null, but job number is valid, then only return the policy contains the job number.
 *
 *  03/20/2014 - Daniel Q. Yu.
 *     * Modified to improve performance according to GW recommendations.
 *
 *  11/03/2016 - Chris Mattox
 *     * Modified for UIHNA
 *
 *
 */
/**
 * Guidewire web service returns account, policy and job metadata information.
 */
@WsiWebService("http://onbase.net/onbase/webservice/QueryPolicyAPI")
@WsiPermissions({})
@WsiAvailability(MULTIUSER)
class QueryPolicyAPI {
  /** Logger */
  private var logger = Logger.forCategory("Document.OnBaseDMS")
  /**
   * Constructor.
   */
  construct() {
  }

  /**
   * Web service method returns the account, policy and job meta information.
   *
   * @param policyNumber The policy number. It is optional and when it is null returns all meta information.
   * @param jobNumber The job number. It is optional and when it is null returns all meta information.
   *
   * @return AccountInfoForOnBase object contains account and/or policy and/or job information.
   */
  function getPolicyInfoForOnBase(policyNumber: String = "NULL", accountNumber: String = "NULL", jobNumber: String = "NULL"): AccountInfoForOnBase {
    if (logger.DebugEnabled) {
      logger.debug("Running web service method QueryPolicyAPI.getPolicyInfoForOnBase(" + accountNumber + ", " + policyNumber + ", " + jobNumber + ")...")
    }
    var info = new AccountInfoForOnBase()
    if (policyNumber != null && policyNumber.trim().length() == 0) {
      policyNumber = null
    }
    if (accountNumber != null && accountNumber.trim().length() == 0) {
      accountNumber = null
    }
    if (jobNumber != null && jobNumber.trim().length() == 0) {
      jobNumber = null
    }
    // Either policyNumber or accountNumber is required parameter.
    if (policyNumber == null && accountNumber == null && jobNumber == null) {
      logger.error("Unable to get policy meta data information because both policy number and account number are NULL.")
      info.Error = "Policy number and account number and job number a are NULL!"
      return info
    }

    // Find job first the get policy/account from job object to improve performance.
    var job: Job = null
    if (jobNumber != null) {
      job = Job.finder.findJobByJobNumber(jobNumber)
    }

    // Query based on policy number.
    if (policyNumber != null) {
      var policy: Policy = null
      if (job != null && job.Periods[0].PolicyNumber.equalsIgnoreCase(policyNumber)) {
        // Find the policy within job object.
        policy = job.Policy
      } else {
        // Find the policy from policy number.
        policy = Policy.finder.findPolicyByPolicyNumber(policyNumber)
        job = null
      }
      if (policy == null) {
        logger.error("Unable to get policy meta data information because policy " + policyNumber + " does not exist.")
        info.Error = "Policy " + policyNumber + " does not exist!"
        return info
      }
      if (accountNumber != null && !policy.Account.AccountNumber.equalsIgnoreCase(accountNumber)) {
        logger.error("Unable to find policy " + policyNumber + " in account " + accountNumber + ".")
        info.Error = "Policy " + policyNumber + " does not exist in account " + accountNumber + "."
        return info
      }
      populateAccountInformation(policy.Account, info)
      info.Policies = new PolicyInfoForOnBase[1]
      info.Policies[0] = new PolicyInfoForOnBase()
      if (jobNumber == null) {
        populatePolicyInformation(policy, null, info.Policies[0])
      } else {
        if (job != null) {
          populatePolicyInformation(policy, job, info.Policies[0])
        } else {
          logger.error("Unable to find job " + jobNumber + "in policy " + policyNumber + ".")
          info.Error = "Job " + jobNumber + " does not exist in Policy " + policyNumber + "."
          return info
        }
      }
    } else {
      // Query based on Account number.
      var account: Account = null
      if (job != null) {
        // Find the account with job object.
        account = job.Policy.Account
      } else {
        // Find the Account with account number.
        account = Account.finder.findAccountByAccountNumber(accountNumber)
        job = null
      }
      if (account != null) {
        // populate account basic meta information.
        populateAccountInformation(account, info)
        // populate policy meta information.
        if (jobNumber == null) {
          populatePolicies(account, info)
        } else {
          if (job != null) {
            info.Policies = new PolicyInfoForOnBase[1]
            info.Policies[0] = new PolicyInfoForOnBase()
            populatePolicyInformation(job.Policy, job, info.Policies[0])
          } else {
            info = new AccountInfoForOnBase()
            logger.error("Unable to find job " + jobNumber + "in account " + accountNumber + ".")
            info.Error = "Job " + jobNumber + " does not exist in account " + accountNumber + "."
            return info
          }
        }
      } else {
        logger.error("Unable to get account/policy meta information because account " + accountNumber + " does not exist.")
        info.Error = "Account " + accountNumber + " does not exist."
      }
    }
    return info
  }

  /**
   * private helper method populates account meta information to data object. 
   */
  private function populateAccountInformation(account: Account, info: AccountInfoForOnBase) {
    info.PublicID = account.PublicID
    info.AccountNumber = account.AccountNumber
    info.AccountName = account.AccountHolderContact.DisplayName
    info.AccountStatus = account.AccountStatus.DisplayName
  }

  /**
   * private helper method populates policy meta information to data objects.
   */
  private function populatePolicies(account: Account, info: AccountInfoForOnBase) {
    info.Policies = new PolicyInfoForOnBase[account.Policies.length]
    for (policy in account.Policies index i) {
      info.Policies[i] = new PolicyInfoForOnBase()
      populatePolicyInformation(policy, null, info.Policies[i])
    }
  }

  /**
   * private helper method populates policy meta information to data object.
   */
  private function populatePolicyInformation(policy: Policy, job: Job, info: PolicyInfoForOnBase) {
    info.PublicID = policy.PublicID
    var policyPeriod = policy.MostRecentBoundPeriodOnMostRecentTerm //policy.Periods[0]

    info.PolicyNumber = policyPeriod.PolicyNumber
    info.PolicyType = policy.Product.Abbreviation
    info.IssuedDate = policy.IssueDate
    info.Underwriter = policy.getUserRoleAssignmentByRole(typekey.UserRole.TC_UNDERWRITER).AssignedUser.DisplayName

    if(policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact typeis Company)  {
      info.PrimaryNamedInsured = new ContactInfoForOnBase(policyPeriod.PrimaryNamedInsured.DisplayName, "")
    } else {
      info.PrimaryNamedInsured = new ContactInfoForOnBase(policyPeriod.PrimaryNamedInsured.FirstName,  policyPeriod.PrimaryNamedInsured.LastName)
    }

    var additionalNamedInsureds : List<ContactInfoForOnBase> = null
    var additionalNamedInsuredContacts = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)
    if(additionalNamedInsuredContacts.Count > 0) {
      additionalNamedInsureds = new ArrayList<ContactInfoForOnBase>()
      additionalNamedInsuredContacts.each( \ contact -> additionalNamedInsureds.add(new ContactInfoForOnBase(contact.FirstName, contact.LastName)))
    }

    info.AdditionalNamedInsured = additionalNamedInsureds

    info.ProductName =  policy.Product.DisplayName
    info.PolicyEffectiveDate =  policyPeriod.PeriodStart
    info.PolicyExpirationDate =  policyPeriod.PeriodEnd
    info.Term = policyPeriod.TermType.Code
    info.AgencyCode = policyPeriod.ProducerCodeOfRecord.Organization.AgenyNumber_Ext
    info.LegacyPolicyNumber = policyPeriod.LegacyPolicyNumber_Ext
    info.TransactionEffectiveDate = policyPeriod.PeriodStart
    info.CSR = policy.getUserRoleAssignmentByRole(typekey.UserRole.TC_CUSTOMERREP).AssignedUser.DisplayName

    if (job != null) {
      info.PolicyJobs = new JobInfoForOnBase[1]
      info.PolicyJobs[0] = new JobInfoForOnBase()
      populateJobInformation(job, info.PolicyJobs[0])
    } else {
      info.PolicyJobs = new JobInfoForOnBase[policy.Jobs.length]
      for (j in policy.Jobs index i) {
        info.PolicyJobs[i] = new JobInfoForOnBase()
        populateJobInformation(j, info.PolicyJobs[i])
      }
    }
  }

  /**
   * private helper method populates job meta information to data object.
   */
  private function populateJobInformation(job: Job, info: JobInfoForOnBase) {
    info.PublicID = job.PublicID
    info.JobNumber = job.JobNumber
    info.CreateDate = job.CreateTime
    info.JobStatus = job.DisplayStatus
    info.JobType = job.DisplayType
  }
}
