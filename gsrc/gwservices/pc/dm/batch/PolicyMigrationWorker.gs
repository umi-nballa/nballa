package gwservices.pc.dm.batch

uses com.gwservices.pc.dm.util.PropertyHelper

/**
 * Personal auto implementation of migration work item
 */
class PolicyMigrationWorker extends MigrationWorker {

  construct() {
    super("PolicyDataMigration_Ext")
  }

  override function lineConfigure(helper : PropertyHelper) {
    setPrefixedProperties("PA_", helper)
  }

}