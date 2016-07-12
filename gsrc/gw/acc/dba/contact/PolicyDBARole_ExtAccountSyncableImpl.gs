package gw.acc.dba.contact
uses entity.PolicyDBARole_Ext
uses gw.lang.Export

uses gw.contact.AbstractPolicyContactRoleAccountSyncableImpl
uses com.google.common.collect.ImmutableSet
uses gw.api.domain.account.AccountSyncedField
uses gw.api.domain.account.AccountSyncable
uses java.util.Set
uses gw.account.AccountContactRoleToPolicyContactRoleSyncedField

/**
 * Implementation that handles PolicyDBARole_Ext's account syncing behavior.
 */
@Export
class PolicyDBARole_ExtAccountSyncableImpl extends AbstractPolicyContactRoleAccountSyncableImpl<PolicyDBARole_Ext> {

  static final var ACCOUNT_SYNCED_FIELDS = ImmutableSet.copyOf
  (
    AbstractPolicyContactRoleAccountSyncableImpl.AccountSyncedFieldsInternal.union(
      {
        AccountContactRoleToPolicyContactRoleSyncedField.PrimaryDBA,
        AccountContactRoleToPolicyContactRoleSyncedField.EffectiveDBADate ,
        AccountContactRoleToPolicyContactRoleSyncedField.ExpirationDBADate
      }
    )
  )
  protected static property get AccountSyncedFieldsInternal() : Set<AccountSyncedField<AccountSyncable, ?>> {  // provided so subclasses can extend this list
    return ACCOUNT_SYNCED_FIELDS
  }

  construct(accountSyncable : PolicyDBARole_Ext) {
    super(accountSyncable)
  }

  override property get AccountSyncedFields() : Set<AccountSyncedField<AccountSyncable, ?>> {  // must override to ensure that we call the correct static AccountSyncedFieldsInternal property
    return AccountSyncedFieldsInternal
  }

}
