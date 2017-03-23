package gw.lob.ho

uses gw.api.copier.AbstractEffDatedCopyable
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 7/22/16
 * Time: 6:35 AM
 * To change this template use File | Settings | File Templates.
 */
class HOLocationCopier_HOE_Ext extends AbstractEffDatedCopyable<HOLocation_HOE> {

  construct(item : HOLocation_HOE) {
    super(item)
  }

  override function copyBasicFieldsFromBean(item : HOLocation_HOE) {

  }
}