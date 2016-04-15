package gw.command.jobs

uses com.guidewire.pl.quickjump.Argument
uses com.guidewire.pl.quickjump.Arguments
uses com.guidewire.pl.quickjump.DefaultMethod
uses com.guidewire.pl.quickjump.BaseCommand
uses gw.api.builder.PolicyChangeBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.api.databuilder.UniqueKeyGenerator
uses gw.api.databuilder.pa.PASubmissionBuilder
uses gw.api.util.Range
uses gw.command.critical.Constants

uses java.lang.Integer

/**
* This command is supported by DEV and is required to work. Any change to this Test must pass
* PolicyCommandTest
*/
@Export
@DefaultMethod("wFutureVehicle")
class MultiSliceJob extends BaseCommand {

  @Argument("JobType", Constants.JOB_TYPES)
  function wFutureVehicle() : PolicyPeriod {
    var jobType = getArgumentAsString("JobType")
    var period = makePeriod(jobType, {Range.from(2 * 30)})
    pcf.JobForward.go(period.Job, period)
    return period
  }

  @Arguments("wFutureVehicle")
  function wTempVehicle() : PolicyPeriod {
    var jobType = getArgumentAsString("JobType")
    var period = makePeriod(jobType, {Range.closedOpen(2 * 30, 3 * 30)})
    pcf.JobForward.go(period.Job, period)
    return period
  }

  @Arguments("wFutureVehicle")
  function wTwoVehicles() : PolicyPeriod {
    var jobType = getArgumentAsString("JobType")
    var period = makePeriod(jobType, {Range.closedOpen(2 * 30, 3 * 30), Range.from(2 * 30 + 10)})
    pcf.JobForward.go(period.Job, period)
    return period
  }

  function makePeriod(jobType : String, ranges : List<Range<Integer>>) : PolicyPeriod {
    jobType = jobType ?: "submission"
    var period : PolicyPeriod
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      var builder = new PASubmissionBuilder()
      if (jobType == "submission") {
        period = builder.isDraft().create(bundle)
        for (range in ranges) {
          period = period.getSlice(period.PeriodStart.addDays(range.Start))
          createVehicleSliceInRange(period, range)
        }
      } else {
        period = builder.isBound().create(bundle)
        period = new PolicyChangeBuilder(period).isDraft().create(bundle)
        for (range in ranges) {
          period = period.getSlice(period.PeriodStart.addDays(range.Start))
          createVehicleSliceInRange(period, range)
        }
      }
    })
    return period
  }

  private function createVehicleSliceInRange(period : PolicyPeriod, range : Range<Integer>) {
    var vehicle = createAndAddVehicleWithVin(period, "ABC" + UniqueKeyGenerator.get().nextKey())
    vehicle.CostNew = null
    changeEffDatesToMatchRanges(vehicle, {range})
    vehicle.createCoverages()
    period.Bundle.commit()
  }

  private function createAndAddVehicleWithVin(period : PolicyPeriod, vin : String) : PersonalVehicle {
    var location = period.PolicyLocations[0]
    var vehicle = period.PersonalAutoLine.createAndAddVehicle()
    vehicle.Vin = vin
    vehicle.LicenseState = location.State
    vehicle.GarageLocation = location
    vehicle.CostNew = 10000bd.ofCurrency(period.PreferredCoverageCurrency)
    var vehicleDriver = vehicle.addPolicyDriver(period.PersonalAutoLine.PolicyDrivers[0])
    vehicleDriver.PercentageDriven = 100
    return vehicle
  }

  /**
   * Changes the effective dates of this <code>effDated</code> such that it will have slices with effective and
   * expiration dates corresponding to the passed List of Ranges of Integers.  For each Range of Integers, the
   * <code>Start</code> and <code>End</code> will be interpreted as the number of days after the <code>PeriodStart</code>.
   * If the <code>Start</code> is <code>null</code>, that value will be treated as the <code>PeriodStart</code>.
   * Similarly, if the <code>End</code> is <code>null</code>, that value will be treated as the <code>PeriodEnd</code>.
   * Thus, if the list contains the following ranges:
   * <ol>
   *   <li><code>{null, 2}</code></li>
   *   <li><code>{3, 4}</code></li>
   *   <li><code>{5, null}</code></li>
   * </ol>
   * It would result in this EffDated being altered to have the following date ranges:
   * <pre>
   *   0     1     2     3     4     5     6  etc.
   *   [===========)     [=====)     [===========>
   * </pre>
   * <em>Note that this method will only work on an EffDated that has a single slice.<em/>
   *
   * @param sliceRanges The ranges of numbers of days relative to the <code>PeriodStart</code> for which this
   *                    EffDated should be effective.
   */
  private function changeEffDatesToMatchRanges(effDated : EffDated, sliceRanges : List<Range<Integer>>) {
    var period = effDated.BranchUntyped as PolicyPeriod
    var periodStart = period.PeriodStart

    if (sliceRanges.Empty) {
      // Make the EffDated zero width since no slice ranges were passed in.
      effDated.endDateWM(effDated.EffectiveDate)
    } else {
      // Adjust effective dates to match the passed list of slice ranges.
      for (i in 0..|sliceRanges.Count) {
        var sliceRange = sliceRanges[i]
        var rangeStart = sliceRange.Start
        var rangeEnd = sliceRange.End
        var start = rangeStart == null ? periodStart : periodStart.addDays(rangeStart)
        var end = rangeEnd == null ? period.PeriodEnd : periodStart.addDays(rangeEnd)

        if (i == 0) {
          // For the first slice, we adjust the effective / expiration dates.
          var firstSlice = effDated.VersionList.AllVersionsUntyped.first()
          firstSlice.EffectiveDate = start
          firstSlice.ExpirationDate = end
        } else {
          // For other slices, we clone the EffDated into the desired date range.
          period.cloneBeanIntoSlice(effDated, start, end)
        }
      }
    }
  }

}
