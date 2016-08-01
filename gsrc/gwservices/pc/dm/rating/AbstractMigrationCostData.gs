package gwservices.pc.dm.rating

uses gw.api.domain.financials.PCFinancialsLogger
uses gw.financials.PolicyPeriodFXRateCache
uses gw.pl.util.BigDecimalUtil
uses gw.rating.CostData
uses gwservices.pc.dm.util.DMLogger

uses java.util.Date

/**
 * Base migration cost data functionality
 */
abstract class AbstractMigrationCostData<S extends entity.Cost, V extends PolicyLine> extends CostData <S, V> {
  private static var _LOG = DMLogger.Financials
  private static final var _LOG_TAG = "${AbstractMigrationCostData.Type.RelativeName} - "
  private var _newCostData: boolean as NewCostData
  construct(effDate: DateTime, expDate: DateTime, currency : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, currency, rateCache)
    _newCostData = true
  }

  construct(effDate: DateTime, expDate: DateTime) {
    super(effDate, expDate)
    _newCostData = true
  }

  construct(c: Cost) {
    super(c)
    _newCostData = false
  }

  construct(c: Cost, rateCache: PolicyPeriodFXRateCache) {
    super(c, rateCache)
    _newCostData = false
  }

  /**
   * Get the coverage associated to this cost data
   * @return null if not coverage oriented
   */
  abstract function getCoverage(line: V): Coverage

  /**
   * Merge if possible
   */
  function migrationMergeIfCostEquals(other: AbstractMigrationCostData, mci: MigrationCostInfo_Ext, prorateDate: Date,
                                      ignoreOtherActualTerm : boolean): boolean {
    if (_LOG.DebugEnabled) {
      _LOG.debug(_LOG_TAG + "migrationMergeIfCostEquals this expiration ${ExpirationDate} other effective ${other.EffectiveDate}")
    }
    if (ExpirationDate == other.EffectiveDate and isMigrationCostEqual(other, mci, ignoreOtherActualTerm)) {
      ExpirationDate = other.ExpirationDate
      ActualAmount = null
      updateAmountFields(prorateDate)
      return true
    } else {
      return false
    }
  }

  /**
   * Determine if standard costs can be overriden
   */
  function isMigrationCostEqual(other: AbstractMigrationCostData, mci: MigrationCostInfo_Ext,
                                ignoreOtherActualTerm : boolean): boolean {
    if (_LOG.DebugEnabled) {
      _LOG.debug(_LOG_TAG + "isMigrationCostEqual compare ${this.debugString()} against ${other.debugString()} mci ${mci.debugString()}")
    }
    switch (false) {
      case BigDecimalUtil.isEqual(Basis, other.Basis): logAlmostMergedCost(other, mci, "Basis"); return false
      case NumDaysInRatedTerm == other.NumDaysInRatedTerm: logAlmostMergedCost(other, mci, "NumDaysInRatedTerm"); return false
      case BigDecimalUtil.isEqual(ActualTermAmount, mci.ActualTermAmount): logAlmostMergedCost(other, mci, "this MCI ActualTermAmount"); return false
      case ignoreOtherActualTerm or BigDecimalUtil.isEqual(other.ActualTermAmount, mci.ActualTermAmount): logAlmostMergedCost(other, mci, "other MCI ActualTermAmount"); return false
      case BigDecimalUtil.isEqual(StandardTermAmount, other.StandardTermAmount): logAlmostMergedCost(other, mci, "StandardTermAmount"); return false
      case BigDecimalUtil.isEqual(ActualBaseRate, other.ActualBaseRate): logAlmostMergedCost(other, mci, "ActualBaseRate"); return false
      case BigDecimalUtil.isEqual(ActualAdjRate, other.ActualAdjRate): logAlmostMergedCost(other, mci, "ActualAdjRate"); return false
        default: return true
    }
  }

  /**
   * Debug missed merge
   */
  private final function logAlmostMergedCost(other: CostData, mci: MigrationCostInfo_Ext, field: String) {
    if (PCFinancialsLogger.isDebugEnabled()) {
      PCFinancialsLogger.logDebug("Costs were not merged because ${field} are not equal.\nThis cost:  ${this.debugString()}\nOther cost: ${other.debugString()}\nMCI ${mci.debugString()}")
    }
  }
}
