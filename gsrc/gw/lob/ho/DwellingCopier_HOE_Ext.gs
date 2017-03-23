package gw.lob.ho

uses gw.api.copier.AbstractEffDatedCopyable
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 7/22/16
 * Time: 6:35 AM
 * To change this template use File | Settings | File Templates.
 */
class DwellingCopier_HOE_Ext extends AbstractEffDatedCopyable<Dwelling_HOE> {

  construct(item : Dwelling_HOE) {
    super(item)
  }

  override function copyBasicFieldsFromBean(item : Dwelling_HOE) {

  }
}