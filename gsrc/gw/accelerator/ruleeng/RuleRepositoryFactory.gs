package gw.accelerator.ruleeng

uses java.lang.IllegalStateException

/**
 * A factory for creating instances of {@link IRuleRepository}.
 */
class RuleRepositoryFactory {
  /**
   * What type of repository would you like to create?
   */
  enum RuleRepository {
    /** A database-backed repository. */
    Database(displaykey.Accelerator.RulesFramework.Repository.DatabaseRuleRepository),
    /** A file-backed repository. Not yet implemented. */
//    File(displaykey.Accelerator.RulesFramework.Repository.FileBackedRuleRepository)

    var _displayName : String as readonly Label

    private construct(displayName : String) {
      _displayName = displayName
    }
  }

  @Param("repoType", "The type of repository to obtain")
  @Returns("A rule repository of the requested type")
  static function getInstance(repoType : RuleRepository) : IRuleRepository {
    switch (repoType) {
      case Database:
        return new DatabaseRuleRepository()

//      case File:
//        return new FileBackedRuleRepository()

      default:
        throw new IllegalStateException("Unsupported repository type " + repoType)
    }
  }
}