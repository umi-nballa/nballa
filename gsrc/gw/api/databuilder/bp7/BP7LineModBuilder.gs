package gw.api.databuilder.bp7
uses gw.api.builder.ModifierBuilder

class BP7LineModBuilder extends ModifierBuilder<BP7LineMod, BP7LineModBuilder> {
  
  construct() {
    super(BP7LineMod)
    withPatternCode("BP7IRPM")
  }
  
  final function addRateFactor(factor : BP7LineRFBuilder) : BP7LineModBuilder {
    addArrayElement(BP7LineMod#LineRateFactors.PropertyInfo, factor)     
    return this
  } 

  final function withJustification(justification : String) : BP7LineModBuilder {
    set(BP7LineMod#Justification.PropertyInfo, justification)
    return this
  }

}
