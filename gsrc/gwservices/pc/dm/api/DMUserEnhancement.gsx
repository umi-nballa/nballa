package gwservices.pc.dm.api

uses gwservices.pc.dm.util.MigrationUtil

/**
 * Migration user enhancement
 */
enhancement DMUserEnhancement: entity.User {
  /**
   * Is this a migration user?
   */
  property get MigrationUser(): boolean {
    return this.hasRole(MigrationUtil.MIGRATION_ROLE.get())
  }
}
