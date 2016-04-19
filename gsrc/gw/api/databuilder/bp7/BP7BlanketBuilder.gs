package gw.api.databuilder.bp7

uses gw.api.databuilder.DataBuilder

uses java.math.BigDecimal

class BP7BlanketBuilder extends DataBuilder<BP7Blanket, BP7BlanketBuilder> {
  
  construct() {
    super(BP7Blanket)
    numbered(1)
  }

  function withBlanketType(blanketType : typekey.BP7BlktType) : BP7BlanketBuilder {
    set(BP7Blanket#BlanketType.PropertyInfo, blanketType)
    return this
  }

  function withBlanketLimit(blanketLimit : BigDecimal) : BP7BlanketBuilder {
    set(BP7Blanket#BlanketLimit.PropertyInfo, blanketLimit)
    return this
  }

  final function numbered(blanketNumber : int) : BP7BlanketBuilder {
    set(BP7Blanket.Type.TypeInfo.getProperty("BlanketNumber"), blanketNumber)
    return this
  }

}
