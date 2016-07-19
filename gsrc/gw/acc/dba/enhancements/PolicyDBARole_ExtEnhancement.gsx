package gw.acc.dba.enhancements
uses gw.account.AccountContactRoleToPolicyContactRoleSyncedField

enhancement PolicyDBARole_ExtEnhancement : entity.PolicyDBARole_Ext {
  
  /**
   * Shared and revisioned field PrimaryDBA
   */
   
   property get PrimaryDBA() : Boolean {
     return AccountContactRoleToPolicyContactRoleSyncedField.PrimaryDBA.getValue(this)
   }
   
   
   /**
   * Shared and revisioned field PrimaryDBA
   */
   
   property set PrimaryDBA(newValue : Boolean) {
     AccountContactRoleToPolicyContactRoleSyncedField.PrimaryDBA.setValue(this,newValue)
   }
   
     
  /**
   * Shared and revisioned field EffectiveDBADate
   */
   
   property get EffectiveDBADate() : java.util.Date {
     return AccountContactRoleToPolicyContactRoleSyncedField.EffectiveDBADate.getValue(this)
   }
   
   
   /**
   * Shared and revisioned field EffectiveDBADate
   */
   
   property set EffectiveDBADate(newValue : java.util.Date ) {
     AccountContactRoleToPolicyContactRoleSyncedField.EffectiveDBADate.setValue(this,newValue)
   }
   
    /**
   * Shared and revisioned field ExpirationDBADate
   */
   
   property get ExpirationDBADate() : java.util.Date {
     return AccountContactRoleToPolicyContactRoleSyncedField.ExpirationDBADate.getValue(this)
   }
   
   
   /**
   * Shared and revisioned field ExpirationDBADate
   */
   
   property set ExpirationDBADate(newValue : java.util.Date ) {
     AccountContactRoleToPolicyContactRoleSyncedField.ExpirationDBADate.setValue(this,newValue)
   }

   property get Active() : Boolean {
     var dbarole = this.AccountContactRole as DBARole_Ext
     return dbarole.isActive()
   }
   
   property get Expired() : Boolean {
     var dbarole = this.AccountContactRole as DBARole_Ext
     return dbarole.isExpired()
   }
  
}
