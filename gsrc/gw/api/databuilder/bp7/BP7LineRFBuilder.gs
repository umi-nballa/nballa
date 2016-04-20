package gw.api.databuilder.bp7

uses gw.api.databuilder.DataBuilder
uses java.util.HashMap
uses java.math.BigDecimal
uses java.math.RoundingMode

class BP7LineRFBuilder extends DataBuilder<BP7LineRF, BP7LineRFBuilder> {
  
  // Data found in BP7Line.xml
  static final var rateFactorTypeMap : HashMap<RateFactorType, String> = {
    RateFactorType.TC_MANAGEMENT ->"zofg80co3am2pbn67htmnfv4lf9",
    RateFactorType.TC_LOCATION ->"zb8gkqgjmod5u95s4os85682va9",
    RateFactorType.TC_BUILDING ->"zotjc0d5pm847b3lsn570ooiq4a",
    RateFactorType.TC_PREMISES ->"zf9jitlu67bpk17fmtevr9r2q2a",
    RateFactorType.TC_EMPLOYEES ->"z3ki6629qq1es2tsa8t3oddl6ga",
    RateFactorType.TC_PROTECTION -> "zi0imci54istq0eb20sa8isn939"
  }
  
  var _factor : BigDecimal as Factor  

  construct() {
    super(BP7LineRF)
  }
  
  final function withFactor(rate : double) : BP7LineRFBuilder {
    _factor = new BigDecimal(rate).setScale(4, RoundingMode.HALF_UP)
    set(BP7LineRF#Assessment.PropertyInfo, _factor)
    return this  
  }
  
  final function withType(rateFactorType : RateFactorType) : BP7LineRFBuilder {
    set(BP7LineRF#PatternCode.PropertyInfo, rateFactorTypeMap.get(rateFactorType))
    return this     
  }
 
  final function withJustification(justification : String) : BP7LineRFBuilder {
    set(BP7LineRF#Justification.PropertyInfo, justification)
    return this
  }

}