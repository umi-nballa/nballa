package gw.acc.dba.contact

uses gw.api.copier.AbstractEffDatedCopyable

@Export
class PolicyContactRoleDBARoleCopier_Ext extends AbstractEffDatedCopyable<PolicyContactRoleDBARole_Ext>{

  construct(pcrdba : PolicyContactRoleDBARole_Ext) {
    super(pcrdba)
  }
  override function copyBasicFieldsFromBean(p0 : PolicyContactRoleDBARole_Ext) {
    //nothing to do
  } 
}
