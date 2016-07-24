package gw.lob.ho

uses gw.api.copier.AbstractEffDatedCopyable
/**
 * Created with IntelliJ IDEA.
 * User: adash
 * Date: 7/22/16
 * Time: 6:35 AM
 * To change this template use File | Settings | File Templates.
 */
class HOScheduledItemCopier_HOE_Ext extends AbstractEffDatedCopyable<HOscheduleItem_HOE_Ext> {

  construct(item : HOscheduleItem_HOE_Ext) {
    super(item)
  }

  override function copyBasicFieldsFromBean(item : HOscheduleItem_HOE_Ext) {

  }
}