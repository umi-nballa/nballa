package gw.accelerator.ruleeng

uses gw.pl.persistence.core.Bundle

/**
 * This interface defines a repository that stores Rule_Ext instances.
 */
interface IRuleRepository {
  /**
   * This method is called before editing a rule.
   */
  @Param("rule", "The rule being edited")
  @Returns("The updated rule")
  function editRule(rule : Rule_Ext) : Rule_Ext

  /**
   * Adds a rule to the repository.
   */
  @Param("rule", "The rule to add to the repository")
  function addRule(rule : Rule_Ext)

  /**
   * Bulk delete method.
   */
  @Param("rules", "The rules to remove from the repository")
  function deleteRules(rules : List<Rule_Ext>)

  /**
   * Deletes a rule from the repository.
   */
  @Param("rule", "The rule to remove from the repository")
  function deleteRule(rule : Rule_Ext)

  /**
   * Called in the beforeCommit() method of the rule editor page.
   */
  function beforeCommit(rule : Rule_Ext)

  /**
   * Returns a bundle for use in managing rule instances. For example, a
   * file-backed repository would add its rules to a private bundle to ensure
   * that they don't get committed to the database.
   */
  @Returns("The bundle used by this repository")
  property get Bundle() : Bundle

  /**
   * Returns a list containing all rules in the repository.
   */
  @Returns("All rules in the repository")
  function findAllRules() : List<Rule_Ext>
}