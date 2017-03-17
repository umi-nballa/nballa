package una.integration.mapping.hpx.common

uses java.math.BigDecimal




/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/11/17
 * Time: 9:53 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXEstimatedPremium {
  public var Code : String
  public var Description : String
  public var Exposure : BigDecimal
  public var Deductible : BigDecimal
  public var Premium : BigDecimal

  function getEstimatedPremium(premium : BigDecimal, deductible : BigDecimal, code : String, description : String, exposure : BigDecimal) : HPXEstimatedPremium {
    this.Premium = premium
    this.Code = code
    this.Exposure = exposure
    this.Deductible = deductible
    this.Description = description
    return this
  }
}