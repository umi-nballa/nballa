package gw.job
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/26/16
 * Time: 1:35 PM
 * To change this template use File | Settings | File Templates.
 */
class UNACPPRenewalProcess extends UNARenewalProcess{
  construct(period : PolicyPeriod){
    super(period)
  }

  override function issueAutomatedRenewal(){
    //Intentionally override and do nothing.  CPP does not auto-issue renewals.  By still hitting the step but
    //intentionally doing nothing, we bypass having to use different workflows which just complicates things
  }
}