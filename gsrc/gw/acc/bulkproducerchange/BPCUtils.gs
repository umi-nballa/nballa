package gw.acc.bulkproducerchange

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses gw.api.database.IQueryBeanResult

class BPCUtils {

  private static final var POLICY = "Policy"
  private static final var POLICY_ID = "id"

  /**
   * Return policies with the given producer codes
   */
  public static function getPoliciesForCodes(producerCodes : List<ProducerCode>) : IQueryBeanResult<entity.Policy> {
    //find all current periods that are not cancelled
    var periodsSubquery = Query.make(PolicyPeriod)
        .compare(PolicyPeriod#PeriodEnd, GreaterThanOrEquals, DateUtil.currentDate())
        .compare(PolicyPeriod#MostRecentModel, Equals, true)
        .compare(PolicyPeriod#Status, Equals, typekey.PolicyPeriodStatus.TC_BOUND)
        .compare(PolicyPeriod#CancellationDate, Equals, null)
    //find policies with a producercde of record that we want
    var policies = Query.make(Policy)
        .compareIn(Policy#ProducerCodeOfService, producerCodes)
        .subselect(POLICY_ID, CompareIn, periodsSubquery, POLICY)
        .withDistinct(true)
    return policies.select()
  }

  /**
   * Get queue for the agent/broker of the producer code
   */
  public static function getProducerQueue(producerCode : ProducerCode) : AssignableQueue {
    if (producerCode.Branch.AssignableQueues.length > 0) {
      return producerCode.Branch.AssignableQueues[0]
    }
    if (producerCode.Branch.Parent.AssignableQueues.length > 0) {
      return producerCode.Branch.Parent.AssignableQueues[0]
    }
    return null
  }

  /**
   * Determine whether the given group is a producer group, so will have a queue to which we can move activities
   */
  public static function isProducer(group : Group) : boolean {
    return group.GroupType == GroupType.TC_PRODUCER
  }

  /**
   * Returns accounts with the given producer code
   */
  public static function getAccountsWithCode(producerCode : ProducerCode) : IQueryBeanResult<Account> {
    var accounts = Query.make(Account)
        .join(AccountProducerCode, AccountProducerCode#Account.PropertyInfo)
        .compare(AccountProducerCode#ProducerCode.PropertyInfo, Equals, producerCode)
    return accounts.select()
  }
}