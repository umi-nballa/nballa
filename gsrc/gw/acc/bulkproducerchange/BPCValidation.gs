package gw.acc.bulkproducerchange

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

class BPCValidation extends PCValidationBase {

  construct(valContext : PCValidationContext) {
    super(valContext)
  }

  override function validateImpl() {}

  override property get Name() : String {
    return null //validations are handled elsewhere in the code
  }
}
