package una.enhancements.entity

uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 1/17/17
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNARenewalEnhancement : entity.Renewal {
  public property get IsCreditOrderingRenewal() : boolean{
    var pastRenewals = this.Policy.Periods.where( \ period -> period.Status == TC_BOUND and period.Job.Subtype == TC_RENEWAL).Job?.toSet()
    return (pastRenewals.Count as Integer).Odd
  }
}
