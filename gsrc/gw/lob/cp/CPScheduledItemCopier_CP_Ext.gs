package gw.lob.cp

uses gw.api.copier.AbstractEffDatedCopyable
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 7/22/16
 * Time: 6:35 AM
 * To change this template use File | Settings | File Templates.
 */
class CPScheduledItemCopier_CP_Ext extends AbstractEffDatedCopyable<CPscheduleItem_CP_Ext> {

  construct(item : CPscheduleItem_CP_Ext) {
    super(item)
  }

  override function copyBasicFieldsFromBean(item : CPscheduleItem_CP_Ext) {

  }
}