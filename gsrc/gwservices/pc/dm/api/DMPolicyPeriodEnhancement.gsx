package gwservices.pc.dm.api

/**
 * Policy period enhancement
 */
enhancement DMPolicyPeriodEnhancement: entity.PolicyPeriod {
  /**
   * Retrieve all contacts for the policy
   */
  property get AllContacts(): Contact[] {
    return this.Slice ? this.PolicyContactRoles*.ContactDenorm : this.LatestPeriod.PolicyContactRoles*.ContactDenorm
  }

  /**
   * Are migration costs attached to this policy?
   */
  property get HasMigrationCostInfos(): boolean {
    return null
  }

  /**
   * Retrieve the disable adjustment entity for this slice
   */
  property get DisableAdjustments(): MigrationDisableAdjustments_Ext {
    var migrationPolicyInfo = this.Policy.MigrationPolicyInfo_Ext
    var disableAdjustments = migrationPolicyInfo.DisableAdjustments
    var disableAdjustment = disableAdjustments.firstWhere(\da -> da.SliceDate == this.EditEffectiveDate)
    var disabled = false
    var effDate = this.EditEffectiveDate
    if (disableAdjustment == null and this.BasedOn.EditEffectiveDate != null) {
      var ea = disableAdjustments.firstWhere(\da -> da.SliceDate == this.BasedOn.EditEffectiveDate)
      if (ea != null) {
        disabled = ea.Disabled
      }
    }
    if (disableAdjustment == null) {
      disableAdjustment = new MigrationDisableAdjustments_Ext() { : SliceDate = effDate, : Disabled = disabled }
      migrationPolicyInfo.addToDisableAdjustments(disableAdjustment)
    }
    return disableAdjustment
  }

  /**
   * Toggle migration adjustments
   */
  function toggleDisableAdjustments() {
    var disableAdjustment = DisableAdjustments
    disableAdjustment.Disabled = not disableAdjustment.Disabled
  }
}
