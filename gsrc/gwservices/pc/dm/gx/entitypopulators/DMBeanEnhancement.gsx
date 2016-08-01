package gwservices.pc.dm.gx.entitypopulators

/**
 * Enhancements to all beans for data migration
 */
enhancement DMBeanEnhancement : gw.pl.persistence.core.Bean {

  /**
   * Allows us to mark an entity removeable in an XML model
   */
  property get DMRemoveEntity_Ext() : boolean {
    return false
  }

}
