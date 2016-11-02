package gw.job
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/26/16
 * Time: 1:41 PM
 * To change this template use File | Settings | File Templates.
 */
class UNABOPRenewalProcess extends UNARenewalProcess{
  construct(period : PolicyPeriod){
    super(period)
  }

  override function pendingRenewalFirstCheck(){
    //Intentionally override and do nothing.  BOP does not do anything for the "first check".  By still hitting the step but
    //intentionally doing nothing, we bypass having to use different workflows which just complicates things
  }
}