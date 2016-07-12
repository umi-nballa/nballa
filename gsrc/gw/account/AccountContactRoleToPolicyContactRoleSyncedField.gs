package gw.account

/**
 * Handles a field synced between an AccountContactRole and a PolicyContactRole.
 */
@Export
class AccountContactRoleToPolicyContactRoleSyncedField<S extends PolicyContactRole, T> extends AbstractPolicyContactRoleSyncedField<S, T> {
  public static final var RelationshipTitle : AccountContactRoleToPolicyContactRoleSyncedField<PolicyOwnerOfficer, Relationship> = new AccountContactRoleToPolicyContactRoleSyncedField<PolicyOwnerOfficer, Relationship>("RelationshipTitle")
  public static final var PrimaryDBA : AccountContactRoleToPolicyContactRoleSyncedField<PolicyDBARole_Ext, Boolean> = new AccountContactRoleToPolicyContactRoleSyncedField<PolicyDBARole_Ext, Boolean>("PrimaryDBA")
   public static final var EffectiveDBADate : AccountContactRoleToPolicyContactRoleSyncedField<PolicyDBARole_Ext, java.util.Date> = new AccountContactRoleToPolicyContactRoleSyncedField<PolicyDBARole_Ext, java.util.Date>("EffectiveDBADate")
    public static final var ExpirationDBADate : AccountContactRoleToPolicyContactRoleSyncedField<PolicyDBARole_Ext, java.util.Date> = new AccountContactRoleToPolicyContactRoleSyncedField<PolicyDBARole_Ext, java.util.Date>("ExpirationDBADate")

  construct(baseFieldName : String) {
    super(baseFieldName, PendingAccountContactRoleUpdate)
  }

  override function getAccountEntity(accountSyncable : S) : KeyableBean {
    return accountSyncable.AccountContactRole
  }

  override protected function setTemporaryLastUpdateTime(accountSyncable : S) {
    // AccountContactRoles will share the date field on the AccountContact
    accountSyncable.AccountContactRole.AccountContact.setFieldValue("TemporaryLastUpdateTime", accountSyncable.Branch.EditEffectiveDate)
  }
  
}
