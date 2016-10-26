package gwservices.pc.dm.gx.shared.product

uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
//uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_PersonalAutoLine_PALineExclusions_Entry
uses gw.api.productmodel.ClausePatternLookup
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_HomeownersLine_HOE_HOLineExclusions_Entry

class ExclusionPopulator extends AbstractCovTermPopulator<Exclusion, Coverable> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
    // no initialization necessary for coverage
  }

  override function findEntity(model: XmlElement, parent: Coverable, bundle: Bundle): Exclusion {
    var patternCode = findElement(Exclusion#PatternCode, model).SimpleValue.GosuValue as String
    var exclPattern = ClausePatternLookup.getExclusionPatternByCode(patternCode)
    if (exclPattern == null) {
      throw new DataMigrationNonFatalException(CODE.INVALID_EXCLUSION, patternCode)
    }
    var exclusion = parent.getOrCreateExclusion(exclPattern)
    if (exclusion == null) {
      throw new DataMigrationNonFatalException(CODE.MISSING_EXCLUSION, patternCode)
    }
    return exclusion
  }

  override function populate(model: XmlElement, entity: Exclusion) {
    super.populate(model, entity)
    if (model typeis PolicyLine_Entity_HomeownersLine_HOE_HOLineExclusions_Entry) {
      for (covTerm in model.CovTerms.Entry) {
        populateCovTerm(covTerm.$TypeInstance, entity as Coverage)
      }
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, "cov terms not implemented for ${typeof(model)}")
    }
  }

  override function remove(parent: Coverable, child: Exclusion, bundle: Bundle) {
    parent.removeExclusionFromCoverable(child)
  }
}
