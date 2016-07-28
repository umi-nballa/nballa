package gwservices.pc.dm.rating

uses gw.api.util.CurrencyUtil
uses gw.api.util.DisplayableException
uses gw.rating.AbstractRatingEngine
uses gw.rating.CostData
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.util.DMLogger

uses java.math.BigDecimal
uses java.math.RoundingMode
uses java.util.Date
uses java.util.Map

/**
 * Rating engine functionality for data migration
 */
abstract class AbstractMigrationRatingEngine<PL extends PolicyLine> extends AbstractRatingEngine <PL> {
  private static var _LOG = DMLogger.Financials
  private static final var _LOG_TAG = "${AbstractMigrationRatingEngine.Type.RelativeName} - "
  construct(line: PL) {
    super(line)
  }

  /**
   * Retrieve all migration cost info objects for this line. 
   */
  protected abstract function getMigrationCostInfo(lineVersion: PL): List <MigrationCostInfo_Ext>

  /**
   * Get match from cost datas
   */
  protected abstract function getCostDataMatch(mci: MigrationCostInfo_Ext, costDatas: List <AbstractMigrationCostData>): List <AbstractMigrationCostData>

  /**
   * Get match from migration cost info
   */
  protected abstract function getCostDataMatch(migrationCostData: AbstractMigrationCostData, mcis: List <MigrationCostInfo_Ext>): List <MigrationCostInfo_Ext>

  /**
   * Create a cost data directly from an MCI
   */
  protected abstract function createDirectLoadCostData(mci: MigrationCostInfo_Ext, lineVersion: PL): AbstractMigrationCostData

  override function rateOnly(): Map <PolicyLine, List <CostData>> {
    if (_LOG.InfoEnabled) {
      _LOG.info(_LOG_TAG + "rateOnly process ${typeof(PolicyLine.Branch.Job)}")
    }
    var results = CostDataMap
    var disableRating = PolicyLine.Branch.Job.MigrationJob and PolicyLine.Branch.Job.MigrationJobInfo_Ext.DisableRating
    if (disableRating) {
      results.get(PolicyLine).clear()
    } else {
      results = super.rateOnly()
    }
    if (PolicyLine.Branch.Job.MigrationJob) updateDataMigrationCosts(PolicyLine)
    else {
      // TODO find better way to locate line version
      var lineVersions = PolicyLine.getVersionsOnDates(AllEffectiveDates).orderByDescending(\lv -> lv.SliceDate)
      var branchEffDate = PolicyLine.Branch.EditEffectiveDate
      var lineVersion = lineVersions.firstWhere(\lv -> lv.EffectiveDate.beforeOrEqual(branchEffDate))
      if (_LOG.InfoEnabled) {
        var msg = _LOG_TAG + "rateOnly applying adjustments using slice effective ${lineVersion.SliceDate}"
        _LOG.info(_LOG_TAG + "${msg}, found from branch effective date ${branchEffDate.toString()}")
      }
      applyAdjustments(lineVersion as PL)
    }
    if (_LOG.DebugEnabled) _LOG.debug(_LOG_TAG + "rateOnly exit")
    return results
  }

  /**
   * Update cost with migration values. This is executed for migration transactions
   */
  private function updateDataMigrationCosts(lineVersion: PL) {
    if (_LOG.DebugEnabled) {
      _LOG.debug(_LOG_TAG + "updateDataMigrationCosts enter")
    }
    var processed: List<AbstractMigrationCostData> = {}
    var cds = CostDataMap.get(lineVersion) as List <AbstractMigrationCostData>
    if (_LOG.DebugEnabled) {
      for (c in cds) {
        _LOG.debug(_LOG_TAG + "updateDataMigrationCosts cost data ${c.debugString()}")
      }
    }
    var prorateDate = lineVersion.Branch.PeriodStart
    var allMcis = getMigrationCostInfo(lineVersion)
    if (_LOG.DebugEnabled) {
      _LOG.debug(_LOG_TAG + "updateDataMigrationCosts prorate date ${prorateDate}")
      for (m in allMcis) {
        _LOG.debug(_LOG_TAG + "updateDataMigrationCosts MCI ${m.debugString()}")
      }
    }
    // first apply new MCIs
    var incompleteMcis = allMcis.where(\mci -> not mci.Complete)
    var newMcis = incompleteMcis.partition(\mci -> mci.DirectLoad != null ? mci.DirectLoad : false)
    // update the existing MCIs in case their cost data has changed
    if (PolicyLine.Branch.Job.MigrationJobInfo_Ext.UpdatePayload) {
      for (refreshMci in allMcis.disjunction(incompleteMcis)) {
        var matches = getCostDataMatch(refreshMci, cds).where(\elt -> not elt.NewCostData)
        matches = matches.sortByDescending(\cd -> cd.EffectiveDate)
        var matchingCostData = matches.firstWhere(\cd -> cd.EffectiveDate == refreshMci.CompareDate)
        if (matchingCostData != null) {
          refreshMci.OriginalExpDate = matchingCostData.ExpirationDate
          refreshMci.ActualAmount = matchingCostData.ActualAmount
          refreshMci.PolicyCenterAmount = matchingCostData.StandardAmount
          // assume direct load of payload when update function is enabled
          refreshMci.DirectLoad = true
        }
      }
    }
    // now apply new MCIs that are not direct loaded
    for (mci in newMcis.get(false)) {
      var matches = getCostDataMatch(mci, cds).sortByDescending(\cd -> cd.EffectiveDate)
      if (_LOG.DebugEnabled) {
        for (m in matches) {
          _LOG.debug(_LOG_TAG + "MCI match ${m.debugString()}")
        }
      }
      var matchingCostData = matches.firstWhere(\cd -> cd.EffectiveDate == mci.CompareDate)
      if (_LOG.DebugEnabled) {
        var msg = "updateDataMigrationCosts process mci ${mci.debugString()}, matching cost data "
        msg += "${matchingCostData?.debugString()}, looking for date ${mci.CompareDate.toString()} "
        msg += "potential options ${matches*.EffectiveDate.toList()}"
        _LOG.debug(_LOG_TAG + msg)
      }
      if (matchingCostData != null) {
        mci.ActualAdjRate = matchingCostData.ActualAdjRate
        mci.ActualBaseRate = matchingCostData.ActualBaseRate
        mci.Currency = matchingCostData.Currency
        mci.Basis = matchingCostData.Basis
        mci.OriginalEffDate = matchingCostData.EffectiveDate
        mci.OriginalExpDate = matchingCostData.ExpirationDate
        mci.PolicyCenterAmount = matchingCostData.ActualAmount
        mci.PolicyCenterTermAmount = matchingCostData.ActualTermAmount
        applyCostUpdate(matchingCostData, mci, prorateDate)
        if (mci.ActualAmount == null) {
          mci.ActualAmount = matchingCostData.ActualAmount
        }
        if (mci.ActualTermAmount == null) {
          mci.ActualTermAmount = matchingCostData.ActualTermAmount
        }
        // look to merge based on prior cost
        if (matches.size() > 1) {
          if (matches[1].migrationMergeIfCostEquals(matches[0], mci, prorateDate, false)) {
            // merge
            if (_LOG.DebugEnabled) {
              _LOG.debug(_LOG_TAG + "updateDataMigrationCosts merge ${matches[1].debugString()}")
            }
            cds.remove(matches[0])
            if (mci typeis EffDated) {
              if (_LOG.DebugEnabled) {
                var msg = mci.debugString()
                _LOG.debug(_LOG_TAG + "updateDataMigrationCosts remove merged MigrationCostInfo " + msg)
              }
              mci.getSliceUntyped(mci.EffectiveDate).remove()
            }
          }
        }
        if (_LOG.DebugEnabled) {
          for (cd in CostDataMap.get(PolicyLine)) {
            _LOG.debug(_LOG_TAG + "updateDataMigrationCosts resulting cost data " + cd.debugString())
          }
        }
        processed.add(matchingCostData)
        mci.Complete = true
        if (PolicyLine.Branch.Job.MigrationJobInfo_Ext.UpdatePayload) {
          // assume direct load of payload when update function is enabled
          mci.DirectLoad = true
        }
      } else {
        if (mci typeis EffDated) {
          var msg = mci.debugString()
          throw new DataMigrationNonFatalException(CODE.UNMATCHED_DATA_MIGRATION_COST, msg)
        }
      }
    }
    // Create the directly loaded cost datas
    for (directMci in newMcis.get(true)) {
      var costData = createDirectLoadCostData(directMci, lineVersion)
      setIfFound(costData, "ActualAdjRate", directMci.ActualAdjRate)
      setIfFound(costData, "ActualAmount", directMci.ActualAmount)
      setIfFound(costData, "ActualBaseRate", directMci.ActualBaseRate)
      setIfFound(costData, "ActualTermAmount", directMci.ActualTermAmount)
      setIfFound(costData, "Basis", directMci.Basis)
      setIfFound(costData, "OverrideAmount", directMci.OverrideAmount)
      setIfFound(costData, "OverrideTermAmount", directMci.OverrideTermAmount)
      setIfFound(costData, "StandardAmount", directMci.PolicyCenterAmount)
      setIfFound(costData, "StandardTermAmount", directMci.PolicyCenterTermAmount)
      setIfFound(costData, "NumDaysInRatedTerm", this.NumDaysInCoverageRatedTerm)
      setIfFound(costData, "RoundingMode", RoundingMode.HALF_UP)
      cds.add(costData)
      processed.add(costData)
      directMci.Complete = true
    }
    // Now try to find matches in prior transactions. This covers situations such as cancellations
    // where all slices are re-rated, but there might not be an MCI from the migration process.
    if (allMcis.HasElements) {
      for (notProcessed in cds.where(\cd -> cd.NewCostData).disjunction(processed)) {
        var allMciMatches = getCostDataMatch(notProcessed, allMcis)
        if (allMciMatches.HasElements) {
          var termAmount = notProcessed.getExistingCost(lineVersion).StandardTermAmount
          var matchMCIs = allMciMatches.where(\mci -> {
            var effDate = notProcessed.EffectiveDate
            var mciEffDate = mci.CompareDate
            return mciEffDate == effDate and mci.PolicyCenterTermAmount == termAmount
          })
          var match = verifyMCIMatch(notProcessed, matchMCIs, allMciMatches)
          if (match != null) {
            applyCostUpdate(notProcessed, match, prorateDate)
          }
        }
      }
    }
    if (_LOG.DebugEnabled) _LOG.debug(_LOG_TAG + "updateDataMigrationCosts exit")
  }

  /**
   * Apply adjustments to new transactions
   */
  function applyAdjustments(lineVersion: PL) {
    if (_LOG.DebugEnabled) _LOG.debug(_LOG_TAG + "applyAdjustments enter")
    var mcis = getMigrationCostInfo(lineVersion)
    if (mcis.HasElements) {
      var abmcds = CostDatas as List <AbstractMigrationCostData>
      var costKeyLists = abmcds.partition(\cost -> cost.Key).Values
      costKeyLists.each(\costList -> costList.sortBy(\cost -> cost.EffectiveDate))
      for (costsPerKey in costKeyLists) {
        var lastCost: AbstractMigrationCostData = null
        for (cost in costsPerKey) {
          var adjust = not disableMigrationAdjustment(cost.EffectiveDate)
          if (lastCost != null and adjust and attemptToMigrationMerge(lastCost, cost, mcis, PolicyLine.Branch.PeriodStart)) {
            // this should have been merged, but it wasn't due to migration changes
            CostDataMap.get(PolicyLine).remove(cost)
            if (_LOG.DebugEnabled) {
              _LOG.debug(_LOG_TAG + "applyAdjustments merge " + cost.debugString())
            }
          } else {
            if (cost.NewCostData and cost.OverrideAmount == null and cost.OverrideTermAmount == null) {
              var allMatchMCIs = getCostDataMatch(cost, mcis).sortByDescending(\mci -> mci.CompareDate)
              var match = allMatchMCIs.firstWhere(\mci -> {
                var mciEffDate = mci.CompareDate
                return mciEffDate.beforeOrEqual(cost.EffectiveDate)
              })
              if (match != null) {
                if (not disableMigrationAdjustment(cost.EffectiveDate)) {
                  applySingleAdjustment(cost, match, PolicyLine.Branch.PeriodStart)
                }
              } else {
                var msg = "applyAdjustments expecting MigrationCostInfo to offet for ${cost.debugString()}, none found"
                _LOG.warn(_LOG_TAG + msg)
              }
            }
          }
          lastCost = cost
        }
      }
    }
    if (_LOG.DebugEnabled) _LOG.debug(_LOG_TAG + "applyAdjustments exit")
  }

  /**
   * Attempt to merge migration costs
   */
  private function attemptToMigrationMerge(lastCostData: AbstractMigrationCostData, costData: AbstractMigrationCostData,
                                           mcis: List <MigrationCostInfo_Ext>, prorateDate: Date): boolean {
    var termAmount = costData.StandardTermAmount
    var lastEffDate = lastCostData.EffectiveDate
    var lastExpDate = costData.ExpirationDate
    var matches = getCostDataMatch(costData, mcis).where(\mci -> {
      return termAmount == mci.PolicyCenterTermAmount and lastEffDate == mci.CompareDate
          and (mci.OriginalExpDate == null or mci.OriginalExpDate == lastExpDate)
    })
    if (matches.Count > 1) {
      var msg = "too many migration cost matches for ${costData?.debugString()}"
      throw new DataMigrationNonFatalException(CODE.MULTIPLE_MCI_MATCHES, msg)
    }
    var match = matches.first()
    if (match != null) {
      return lastCostData.migrationMergeIfCostEquals(costData, match, prorateDate, true)
    } else {
      return false
    }
  }

  /**
   * Apply override to CostData based on MigrationCostInfo converted data
   */
  private function applyCostUpdate(cd: AbstractMigrationCostData, mci: MigrationCostInfo_Ext, prorateDate: Date) {
    if (_LOG.DebugEnabled) {
      _LOG.debug(_LOG_TAG + "applyCostOverride before cost values ${cd.debugString()}, mci ${mci.debugString()}")
    }
    if (mci.OverrideTermAmount != null) {
      cd.OverrideTermAmount = CurrencyUtil.roundToCurrencyScaleNullSafe(mci.OverrideTermAmount)
    }
    if (mci.OverrideAmount != null) {
      cd.OverrideAmount = CurrencyUtil.roundToCurrencyScaleNullSafe(mci.OverrideAmount)
    }
    // override term amount to ensure a match
    if (mci.ActualTermAmount != null) {
      cd.ActualTermAmount = CurrencyUtil.roundToCurrencyScaleNullSafe(mci.ActualTermAmount)
      // assume prorated amount will be set from legacy or by proration
      cd.ActualAmount = null
    }
    if (mci.ActualAmount != null) {
      cd.ActualAmount = CurrencyUtil.roundToCurrencyScaleNullSafe(mci.ActualAmount)
    }
    cd.updateAmountFields(prorateDate)
    if (_LOG.DebugEnabled) {
      _LOG.debug(_LOG_TAG + "applyCostOverride after cost values ${cd.debugString()}")
    }
  }

  /**
   * Load costdata value if found
   */
  private function setIfFound(costData: AbstractMigrationCostData<Cost, PolicyLine>, field: String, value: Object) {
    if (value != null) {
      costData[field] = value
    }
  }

  private function verifyMCIMatch(costData: AbstractMigrationCostData, matchMCIs: List<MigrationCostInfo_Ext>,
                                  mcis: List<MigrationCostInfo_Ext>): MigrationCostInfo_Ext {
    if (_LOG.DebugEnabled) {
      var allTerms = mcis*.PolicyCenterTermAmount.toList()
      var allEffectiveDates = mcis.map(\mci -> mci["EffectiveDate"]).toList()
      var allExpirationDates = mcis.map(\mci -> mci["ExpirationDate"]).toList()
      var msg = "\n\ngetExistingMCIMatch all mci count ${mcis.Count}, match mci count ${matchMCIs.Count}"
      msg += ", all term amounts ${allTerms}, cost effective date ${costData.EffectiveDate?.toString()}"
      msg += ", all mci effective dates ${allEffectiveDates}, all mci expiration dates ${allExpirationDates}\n"
      _LOG.debug(_LOG_TAG + msg)
    }
    if (matchMCIs.Count > 1) {
      var mciString = matchMCIs*.debugString().toList()
      var msg = "Multiple matches ${mciString} for cost data ${costData?.debugString()}"
      throw new DataMigrationNonFatalException(CODE.MULTIPLE_MCI_MATCHES, msg)
    }
    if (matchMCIs.Count == 1) {
      if (_LOG.DebugEnabled) _LOG.debug(_LOG_TAG + "getExistingMCIMatch match ${matchMCIs[0].debugString()}")
      return matchMCIs[0]
    } else {
      if (_LOG.DebugEnabled) _LOG.debug(_LOG_TAG + "getExistingMCIMatch no match")
      return null
    }
  }

  /**
   * Apply an individual adjustment
   */
  private function applySingleAdjustment(cost: AbstractMigrationCostData, mci: MigrationCostInfo_Ext, prorateDate: Date) {
    switch (ScriptParameters.MigrationRatingAdjustmentType_Ext as MigrationAdjustType_Ext) {
      case "Factor":
          if (mci.ActualTermAmount != null) {
            cost.ActualTermAmount = applyFactor(mci.ActualTermAmount, mci.PolicyCenterTermAmount, cost.StandardTermAmount)
            cost.ActualAmount = null
          }
          if (mci.ActualAmount != null) {
            cost.ActualAmount = applyFactor(mci.ActualAmount, mci.PolicyCenterAmount, cost.StandardAmount)
          }
          cost.updateAmountFields(prorateDate)
          break
      case "Amount":
          if (mci.ActualTermAmount != null) {
            cost.ActualTermAmount = applyAmount(mci.ActualTermAmount, mci.PolicyCenterTermAmount, cost.StandardTermAmount)
            cost.ActualAmount = null
          }
          if (mci.ActualAmount != null) {
            cost.ActualAmount = applyAmount(mci.ActualAmount, mci.PolicyCenterAmount, cost.StandardAmount)
          }
          cost.updateAmountFields(prorateDate)
          break
      case "None":
          break
        default:
        var type = ScriptParameters.MigrationRatingAdjustmentType_Ext
        throw new DisplayableException("unknown migration adjustment type ${type}")
    }
  }

  /**
   * Apply factor
   */
  private function applyFactor(actualAmount: BigDecimal, policyCenterAmount: BigDecimal, standardAmount: BigDecimal): BigDecimal {
    var factor = actualAmount / policyCenterAmount
    var newVal = standardAmount * factor
    if (_LOG.InfoEnabled) {
      var msg = "applyFactor apply ${factor} to standard ${standardAmount} = ${newVal}"
      _LOG.info(_LOG_TAG + msg)
    }
    return newVal
  }

  /**
   * Apply dollar amount
   */
  private function applyAmount(actualAmount: BigDecimal, policyCenterAmount: BigDecimal, standardAmount: BigDecimal): BigDecimal {
    var adjustment = actualAmount - policyCenterAmount
    var newVal = standardAmount + adjustment
    if ((standardAmount > 0) == (newVal > 0)) {
      if (_LOG.InfoEnabled) {
        var msg = "applyAmount apply ${adjustment} to standard ${standardAmount} = ${newVal}"
        _LOG.info(_LOG_TAG + msg)
      }
      return newVal
    } else {
      _LOG.warn("adjustment of ${newVal} would negate premium of ${standardAmount}")
      return standardAmount
    }
  }

  /**
   * Disable migration adjustments?
   */
  private function disableMigrationAdjustment(effDate: Date): boolean {
    var adjustments = PolicyLine.Branch.Policy.MigrationPolicyInfo_Ext.DisableAdjustments
    return adjustments.firstWhere(\adjustment -> adjustment.SliceDate == effDate).Disabled
  }
}
