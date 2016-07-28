package gwservices.pc.dm.api

/**
 * Migration job enhancements
 */
enhancement DMJobEnhancement: entity.Job {
  /**
   * Is this a migration job
   */
  property get MigrationJob(): boolean {
    return this.MigrationJobInfo_Ext != null or User.util.CurrentUser?.MigrationUser
  }
}
