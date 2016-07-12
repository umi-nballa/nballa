package gw.acc.dba.accountContact
uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext


@Export
class AccountContactValidation extends PCValidationBase{

  var _accountContact : AccountContact
  construct(valContext : PCValidationContext, ac : AccountContact) {
      super(valContext)
      _accountContact = ac
  }


  override function validateImpl() {
    Context.addToVisited(this, "validate")
    checkIfAcctContactIsDBA()
  }
  
  function checkIfAcctContactIsDBA(){
    Context.addToVisited(this , "checkIfAcctContactIsDBA")
    if(_accountContact.hasRole(typekey.AccountContactRole.TC_DBAROLE_EXT)){
      Result.addError(_accountContact , "default", displaykey.Accelerator.DBA.Account.Contact.AddDBARole)
    }
  }

}
