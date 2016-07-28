package gwservices.pc.dm.util

uses gw.api.database.Query
uses gw.sampledata.AbstractSampleDataCollection
uses gw.transaction.Transaction

class MigrationSampleData extends AbstractSampleDataCollection {
  public override property get CollectionName(): String {
    return "Migration"
  }

  override property get AlreadyLoaded(): boolean {
    var role = Query.make(Role).compare("Name", Equals, MigrationUtil.MIGRATION_ROLE_NAME.get()).select().FirstResult
    return role != null
  }

  override function load() {
    Transaction.runWithNewBundle(\bundle -> {
      var role = new Role() {: Name = MigrationUtil.MIGRATION_ROLE_NAME.get() }
      var organization = Query.make(Organization).select().FirstResult
      var rolePubId = Query.make(Role).compare("Name", Equals, "Superuser").select().AtMostOneRow.PublicID
      var underwriter1 = Query.make(UWAuthorityProfile).compare("Name", Equals, "Underwriter 1").select().single()
      var user = loadUser(bundle, {rolePubId}, "Other", organization, false, false, "migrationuser",
          "migrationuser@yahoo.com", "Migration", "User", "213-555-8164", "143 Lake Ave. Suite 501", "Pasadena",
          "CA", "91253", "US", {underwriter1})
      var userRole = new UserRole()
      userRole.User = user
      userRole.Role = role
    })
  }
}