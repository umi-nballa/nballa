package gwservices.pc.dm.gx.shared.product

uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.shared.product.covtermmodel.types.complex.CovTerm
uses gw.api.productmodel.ClausePatternLookup
uses gw.api.web.productmodel.MissingRequiredCoverageIssue

class CoveragePopulator extends AbstractCovTermPopulator<Coverage, Coverable> {
  /* Logging prefix */
  private static final var _LOG_TAG = "${CoveragePopulator.Type.RelativeName} - "
  override function initialize(xmlTypeInfo: ITypeInfo) {
    // no initialization necessary for coverage
  }

  override function findEntity(model: XmlElement, parent: Coverable, bundle: Bundle): Coverage {
    var patternCode = findElement(Coverage#PatternCode, model).SimpleValue.GosuValue as String
    var covPattern = ClausePatternLookup.getCoveragePatternByCode(patternCode)
    if (covPattern == null) {
      var msg = "${Coverage#PatternCode} not available"
      throw new DataMigrationNonFatalException(CODE.INVALID_COVERAGE, msg)
    }
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "findEntity coverage pattern ${covPattern.Code}, parent ${parent}")
    }
    var coverage = parent.getOrCreateCoverage(covPattern)
    if (coverage == null) {
      var missingCovSyncIssue = new MissingRequiredCoverageIssue(covPattern, parent)
      missingCovSyncIssue.fixIssue(parent.BranchUntyped)
      coverage = parent.getOrCreateCoverage(covPattern)
    }
    if (coverage == null) {
      var msg = "${Coverage#PatternCode} not available"
      throw new DataMigrationNonFatalException(CODE.MISSING_COVERAGE, msg)
    }
    return coverage
  }

  override function populate(model: XmlElement, entity: Coverage) {
    super.populate(model, entity)
    var covTerms = findElement("CovTerms", model)["Entry"] as List
    for (covTerm in covTerms) {
      populateCovTerm(covTerm["$TypeInstance"] as CovTerm, entity)
    }
  }

  override function remove(parent: Coverable, child: Coverage, bundle: Bundle) {
    parent.removeCoverageFromCoverable(child)
  }
}
