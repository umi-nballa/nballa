package gw.acc.dba.accountContact
uses java.util.Date

enhancement DBARole_ExtEnhancement : entity.DBARole_Ext {
  
  function isActive() : Boolean{
    return (this.EffectiveDBADate <= Date.CurrentDate and
           this.ExpirationDBADate > Date.CurrentDate) or 
           (this.EffectiveDBADate == null and this.ExpirationDBADate == null)
  }
  
  function isExpired() : Boolean {
    return Date.CurrentDate >= this.ExpirationDBADate
  }
  
}
