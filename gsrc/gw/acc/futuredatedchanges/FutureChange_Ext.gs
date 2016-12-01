package gw.acc.futuredatedchanges

uses java.util.ArrayList
uses java.util.Set
uses java.util.List
uses java.util.ArrayList
uses java.util.Date

/**
 * Provides utility methods to support the analysis of future changes in a policy.
 */

class FutureChange_Ext {

  /**
   * Serialize a slice's desired data into string array
   */
  @Param("policy","The target policy in force")
  @Returns("A two dimensional array - array of slices' data")
  public static function getFutureSlicesInStringArray(policy : Policy):String[][]{
    var list : List<String[]> = new ArrayList<String[]>()
    var renewalJob = policy.OpenRenewalJob
    if(renewalJob != null){
      var sliceDates : Set<Date> = {}
      sliceDates.add(renewalJob.LatestPeriod.EditEffectiveDate)
      sliceDates.addAll(renewalJob.LatestPeriod.FutureSliceDatesInPeriod)
      sliceDates.each( \ sliceDate -> {
        var slice = renewalJob.LatestPeriod.getSlice(sliceDate)
        var data : String[] = new String[3]
        data[0] = String.valueOf(slice.SliceDate.Calendar.TimeInMillis)
        data[1] = policy.OpenRenewalJob.LatestPeriod.EditEffectiveDate == slice.SliceDate ? displaykey.Accelerator.FutureDatedChanges.Renewal  : displaykey.Accelerator.FutureDatedChanges.FutureChange
        data[2] = slice.Job.JobNumber
        list.add(data)
      })
    }
    return list.toArray(new String[list.size()][3])
  }

  /**
   * Serialize a bounded renewal's slice's desired data into string array
   */
  @Param("policy","The target policy in force")
  @Returns("A two dimensional array - array of slices' data")
  public static function getSlicesInBoundRenewal(policy: Policy):String[][]{
    var list : List<String[]> = new ArrayList<String[]>()
    var sliceDates = policy.MostRecentBoundPeriodOnMostRecentTerm?.FutureSliceDatesInPeriod
    if(not  sliceDates?.IsEmpty){
      sliceDates.each( \ sliceDate -> {
        var slice = policy.MostRecentBoundPeriodOnMostRecentTerm.getSlice(sliceDate)
        var data : String[] = new String[3]
        data[0] = String.valueOf(slice.SliceDate.Calendar.TimeInMillis)
        data[1] = policy.MostRecentBoundPeriodOnMostRecentTerm.EditEffectiveDate == slice.SliceDate ? displaykey.Accelerator.FutureDatedChanges.Renewal  : displaykey.Accelerator.FutureDatedChanges.FutureChange
        data[2] = slice.Job.JobNumber
        list.add(data)
      })
    }
    return list.toArray(new String[list.size()][3])
  }


}