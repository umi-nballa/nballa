package una.integration.mapping.hpx.common

uses java.math.BigDecimal


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/11/17
 * Time: 9:53 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXEstimatedDiscount {
  public var Code : String
  public var Description : String
  public var Amount : BigDecimal
  public var Percent : BigDecimal

  function getEstimatedDiscount(maxFactor : BigDecimal, amount : BigDecimal, code : String, description : String) : HPXEstimatedDiscount {
    this.Percent = maxFactor*100
    this.Code = code
    this.Amount = amount
    this.Description = description
    return this
  }
}