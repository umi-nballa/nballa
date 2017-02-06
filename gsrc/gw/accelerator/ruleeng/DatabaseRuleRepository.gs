package gw.accelerator.ruleeng

uses gw.transaction.Transaction

uses java.util.List
uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle

/**
 * This implementation of the rule repository manages rules in the Rule_Ext
 * system table.
 */
class DatabaseRuleRepository implements IRuleRepository {
  @Param("rule", "Rule that was selected for edit")
  override function editRule(rule : Rule_Ext) : Rule_Ext {
    // No action required
    return rule
  }

  /**
   * Deletes the given rules from the database.
   */
  @Param("selectedRules", "The rules to remove")
  override function deleteRules(selectedRules : List<Rule_Ext>) {
    Transaction.runWithNewBundle (\ bundle -> {
      for (rule in selectedRules) {
        bundle.add(rule).remove()
      }
    })
  }

  /**
   * Deletes a single rule from the database.
   */
  @Param("rule", "The rule to remove")
  override function deleteRule(rule : Rule_Ext) {
    if (Transaction.Current.ReadOnly) {
      Transaction.runWithNewBundle(\bundle -> {
        bundle.add(rule).remove()
      })
    } else {
      Transaction.Current.add(rule).remove()
      Transaction.getCurrent().commit()
    }
  }

  /**
   * Creates a new rule in the database (or adds it to the current bundle for
   * later commit).
   */
  @Param("rule", "The newly-created rule")
  override function addRule(rule : Rule_Ext) {
    if (Transaction.Current.ReadOnly) {
      Transaction.runWithNewBundle(\ bundle -> {
        bundle.add(rule)
      })
    } else {
      Transaction.Current.add(rule)
    }
  }

  override function beforeCommit(rule : Rule_Ext) {
    // Nothing to do
  }

  override function findAllRules() : List<Rule_Ext> {
    return Query.make(Rule_Ext).select().toList()
  }

  override property get Bundle() : Bundle {
    return Transaction.Current
  }
}
