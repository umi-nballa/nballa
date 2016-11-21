package una.enhancements.entity
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/4/16
 * Time: 8:06 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAPolicyContactRoleEnhancement : entity.PolicyContactRole {
  property get LastCreditReportReceived() : CreditReportExt{
    return this.CreditReportsExt.where( \ creditReport -> CreditStatusExt.TF_RECEIVEDCREDITSTATUSES.TypeKeys.contains(creditReport.CreditStatus))
                               ?.orderByDescending(\ creditReport -> creditReport.CreditScoreDate)?.first()
  }
}
