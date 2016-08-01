package gwservices.pc.dm.rating

uses java.util.Date

enhancement MigrationCostInfoEnhancement: entity.MigrationCostInfo_Ext {
  /**
   * The original effective date
   */
  property get CompareDate(): Date {
    if (this.OriginalEffDate == null) {
      this.OriginalEffDate = this["EffectiveDate"] as Date
    }
    return this.OriginalEffDate
  }

  /**
   * Print debug information for the MCI
   */
  function debugString(): String {
    var entityId = this.getFieldValue("PublicID")
    var msg = "(${entityId}) "
    msg += "Complete = ${this.Complete}, CompareDate = ${CompareDate}"
    msg += ", ActualAmount = ${this.ActualAmount}, ActualTermAmount = ${this.ActualTermAmount}"
    msg += ", PolicyCenterAmount = ${this.PolicyCenterAmount}, PolicyCenterTermAmount = ${this.PolicyCenterTermAmount}"
    msg += ", OverrideAmount = ${this.OverrideAmount}, OverrideTermAmount = ${this.OverrideTermAmount}"
    msg += ", Basis = ${this.Basis}, ActualBaseRate = ${this.ActualBaseRate}, ActualAdjRate = ${this.ActualAdjRate}"
    return msg
  }
}
