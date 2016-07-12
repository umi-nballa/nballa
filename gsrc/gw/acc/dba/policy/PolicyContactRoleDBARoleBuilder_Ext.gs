package gw.acc.dba.policy


uses gw.api.databuilder.DataBuilder

@Export
class PolicyContactRoleDBARoleBuilder_Ext extends DataBuilder<entity.PolicyContactRoleDBARole_Ext, PolicyContactRoleDBARoleBuilder_Ext> {
  var _policyContactRole : PolicyContactRole
  var _policyDBARole : PolicyDBARole_Ext

  construct() {
    super(PolicyContactRoleDBARole_Ext)

  }

  function withPolicyContactRole(policyContactRole : PolicyContactRole) : PolicyContactRoleDBARoleBuilder_Ext {
    _policyContactRole = policyContactRole
    return this
  }
  
  function withPolicyDBARoleole(policyDBARole : PolicyDBARole_Ext) : PolicyContactRoleDBARoleBuilder_Ext {
    _policyDBARole = policyDBARole
    return this
  }
  
}
