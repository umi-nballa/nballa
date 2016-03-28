package gw.lob.ho

uses gw.api.copier.AbstractEffDatedCopyable

class CoveredLocationCopier_HOE extends AbstractEffDatedCopyable<CoveredLocation_HOE> {

  construct(loc : CoveredLocation_HOE) {
    super(loc)
  }

  override function copyBasicFieldsFromBean(loc : CoveredLocation_HOE) {
    _bean.LocationLimit = loc.LocationLimit
  }
}
