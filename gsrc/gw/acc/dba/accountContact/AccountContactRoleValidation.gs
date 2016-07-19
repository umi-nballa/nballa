package gw.acc.dba.accountContact
uses gw.validation.PCValidationContext
uses gw.validation.PCValidationBase

@Export
class AccountContactRoleValidation extends PCValidationBase{ 

  var _accountContactRole : AccountContactRole
  construct(valContext : PCValidationContext, acr : AccountContactRole) {
      super(valContext)
      _accountContactRole = acr
  }


  override function validateImpl() {
    Context.addToVisited(this, "validate")
    if(this._accountContactRole.Subtype.Code == "DBARole_Ext" ) 
    {
      checkIfEffDateAndExpDateValidDBA() 
    }
  }

  
  function checkIfEffDateAndExpDateValidDBA(){
    Context.addToVisited(this , "checkIfEffDateAndExpDateValidDBA")
    var role = _accountContactRole as DBARole_Ext
 
    if(role.ExpirationDBADate.before(role.EffectiveDBADate)){
      Result.addError(_accountContactRole, "default", displaykey.Accelerator.DBA.AccountContacts.DBA.ExpDateBeforeEffDate)
    }
  }
  

}
