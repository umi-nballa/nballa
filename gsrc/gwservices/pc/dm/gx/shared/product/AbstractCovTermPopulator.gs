package gwservices.pc.dm.gx.shared.product

uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.PackageCovTerm
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.shared.product.covtermmodel.types.complex.CovTerm

abstract class AbstractCovTermPopulator<C extends KeyableBean, P extends KeyableBean> extends BaseEntityPopulator<C, P> {
  /* Logging prefix */
  private static final var _LOG_TAG = "${AbstractCovTermPopulator.Type.RelativeName} - "
  /**
   * Populate a coverage term
   */
  protected function populateCovTerm(covTermModel: CovTerm, coverage: Coverage) {
    if (covTermModel == null) {
      var msg = "null coverage term"
      throw new DataMigrationNonFatalException(CODE.MISSING_COVERAGE_TERM, msg)
    }
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "populateCovTerm starting cov term patterncode ${covTermModel.PatternCode}")
      _logger.debug(_LOG_TAG + "populateCovTerm starting cov term type name ${covTermModel.ValueTypeName}")
      _logger.debug(_LOG_TAG + "populateCovTerm starting cov term value as string ${covTermModel.ValueAsString}")
    }
    var covTerm = coverage.getCovTerm(covTermModel.PatternCode)
    if (covTerm == null) {
      var msg = "${covTermModel.PatternCode} not available"
      throw new DataMigrationNonFatalException(CODE.INVALID_COVERAGE_TERM, msg)
    }
    if (_logger.DebugEnabled) {
      if (covTerm typeis OptionCovTerm) {
        var optionValues = covTerm.Pattern.getAvailableValues(covTerm)
        for (value in optionValues) {
          _logger.debug(_LOG_TAG + "populateCovTerm cov term option values ${value.OptionCode}")
        }
      }
      if (covTerm typeis PackageCovTerm) {
        if (covTerm.Pattern == null) {
          _logger.debug(_LOG_TAG + "populateCovTerm cov term pattern is null")
        } else {
          var packageValues = covTerm.Pattern.getAvailableValues(covTerm)
          for (value in packageValues) {
            _logger.debug(_LOG_TAG + "populateCovTerm cov term package value ${value.PackageCode}")
          }
        }
      }
    }
    if (covTermModel.ValueTypeName == "Package") {
      var packageTerm = covTerm as PackageCovTerm
      var valid = false
      for (pkg in packageTerm.Pattern.getAvailableValues(covTerm)) {
        if (pkg.PackageCode == covTermModel.ValueAsString) {
          packageTerm.setPackageValue(pkg)
          valid = true
          break;
        }
      }
      if (valid == false) {
        var msg = "invalid package type, ${covTermModel.ValueAsString} not available"
        throw new DataMigrationNonFatalException(CODE.INVALID_COVERAGE_TERM, msg)
      }
    } else {
      covTerm.setValueFromString(covTermModel.ValueAsString)
      if (covTerm.ValueAsString != covTermModel.ValueAsString) {
        var msg = "unable to set ${covTermModel.ValueAsString} on term type ${covTermModel.PatternCode}"
        throw new DataMigrationNonFatalException(CODE.INVALID_COVERAGE_TERM, msg)
      }
    }
  }
}