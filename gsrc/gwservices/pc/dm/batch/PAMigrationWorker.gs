package gwservices.pc.dm.batch

uses com.gwservices.pc.dm.util.PropertyHelper

/**
 * Personal auto implementation of migration work item
 */
class PAMigrationWorker extends MigrationWorker {

  construct() {
    super("DataMigrationPA_Ext")
  }
  
  override function lineConfigure(helper : PropertyHelper) {
    setPrefixedProperties("PA_", helper)
  }

}