package una.integration.lexisnexis.clueproperty.enhancement

uses gw.api.database.Query

/**
 * This enhancement supports a soft-link between {@link entity.HomeownersLine_HOE} and {@link entity.HOPriorLoss_Ext}
 *
 *Author:Jgupta
 * Date: 01/Augus/2016
 */
enhancement HomeownersLineEnhancement : entity.HomeownersLine_HOE {
  /**
   *  Gets a list of {@link entity.HOPriorLossExt} associated to this instance
   *  @return HOPriorLossExt[]
   */
  property get  HOPriorLosses_Ext() : HOPriorLoss_Ext[] {
    return Query
        .make(HOPriorLoss_Ext)
        .compare(HOPriorLoss_Ext#HomeownersLineID, Equals, this.PublicID)
        .select().toTypedArray()
  }

  /**
   * Associates a {@link entity.HOPriorLossExt} instance to this instance
   * @param The instance of {@link entity.HOPriorLossExt} to be associated
   */
  function addToHOPriorLosses_Ext(priorLoss : HOPriorLoss_Ext) {
    if(priorLoss != null) {
      this.Bundle.add(priorLoss).HomeownersLineID = this.PublicID
    }
  }

  /**
   * Dissociates a {@link entity.HOPriorLossExt} instance to this instance
   * @param The instance of {@link entity.HOPriorLossExt} to be dissociated
   */
  function removeFromHOPriorLosses_Ext(priorLoss : HOPriorLoss_Ext) {
    if(priorLoss != null) {
      this.Bundle.add(priorLoss).HomeownersLineID = null
    }
  }
}
