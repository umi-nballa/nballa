package gwservices.pc.dm.batch

uses com.gwservices.pc.dm.util.PropertyHelper
/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 6/9/16
 * Time: 9:12 AM
 * To change this template use File | Settings | File Templates.
 */
class PAAccountMigrationWorker extends MigrationWorker {

  construct() {
    super("DataMigrationPAAcct_Ext")
  }

  override function lineConfigure(helper: PropertyHelper) {
    setPrefixedProperties("PA_", helper)
  }
}