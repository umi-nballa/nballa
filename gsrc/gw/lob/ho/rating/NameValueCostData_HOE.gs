package gw.lob.ho.rating
uses java.util.ArrayList

/**
 * POGO class used to transfer detailed data to the quote page
 * A coverage if it is a special one has a set of details
 * Used in the class CoverageCostData_HOE that has a list of details
 */
class NameValueCostData_HOE {

/**
 * Creates an object with detail description, value and low level cost
 */
  construct(desc: String, val: String, c: HomeownersCost_HOE, code:String = "") {
    description = desc
    value = val
    cost = c
    subDetails = new ArrayList<NameValueCostData_HOE>()
    this._code = code
  }
  
  // detail description
  public var description: String
  
  // detail value
  public var value: String
  
  // low level cost
  public var cost: HomeownersCost_HOE

  // lower level details (for Specific Structrures away from the Residence Premises)
  public var subDetails: List<NameValueCostData_HOE>

  var _code : String as Code

}
