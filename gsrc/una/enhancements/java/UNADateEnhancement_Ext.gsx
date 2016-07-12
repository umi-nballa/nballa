package una.enhancements.java

uses java.util.Date
uses java.lang.IllegalStateException

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/16/16
 * Time: 10:06 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADateEnhancement_Ext : java.util.Date {
  public function beforeOrEqualsIgnoreTime(that : Date) : boolean {
    if(that == null){
      throw new IllegalStateException("The date being compared to this date cannot be null")
    }

    return this.trimToMidnight().beforeOrEqual(that.trimToMidnight())
  }

  public function afterOrEqualsIgnoreTime(that : Date) : boolean {
    if(that == null){
      throw new IllegalStateException("The date being compared to this date cannot be null")
    }

    return this.trimToMidnight().afterOrEqual(that.trimToMidnight())
  }

  public function equalsIgnoreTime(that : Date) : boolean {
    if(that == null){
      throw new IllegalStateException("The date being compared to this date cannot be null")
    }

    return this.trimToMidnight().equals(that.trimToMidnight())
  }

  public function afterIgnoreTime(that : Date) : boolean {
    if(that == null){
      throw new IllegalStateException("The date being compared to this date cannot be null")
    }

    return this.trimToMidnight().after(that.trimToMidnight())
  }

  public function beforeIgnoreTime(that : Date) : boolean {
    if(that == null){
      throw new IllegalStateException("The date being compared to this date cannot be null")
    }

    return this.trimToMidnight().before(that.trimToMidnight())
  }

  public function betweenInclusiveIgnoreTime(lowerBound : Date, upperBound : Date) : boolean {
   if(lowerBound == null or upperBound == null){
    throw new IllegalStateException("Cannot evaluate betweenInclusiveIgnoreTime because either or both the lowerBound or upperBound dates are null.  lowerBound = ${lowerBound}.  upperBound = ${upperBound}")
   }

   return this.afterOrEqualsIgnoreTime(lowerBound) and this.beforeOrEqualsIgnoreTime(upperBound)
  }

  public function betweenExclusiveIgnoreTime(lowerBound : Date, upperBound : Date) : boolean {
    if(lowerBound == null or upperBound == null){
      throw new IllegalStateException("Cannot evaluate betweenInclusiveIgnoreTime because either or both the lowerBound or upperBound dates are null.  lowerBound = ${lowerBound}.  upperBound = ${upperBound}")
    }

    return this.afterIgnoreTime(lowerBound) and this.beforeIgnoreTime(upperBound)
  }

  public function trimToMidnightPlusOne() : Date {
    return this.trimToMidnight().addMinutes(1)
  }
}
