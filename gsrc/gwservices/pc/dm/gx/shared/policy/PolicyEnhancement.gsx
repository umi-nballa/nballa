package gwservices.pc.dm.gx.shared.policy

enhancement PolicyEnhancement: entity.Policy {
  /**
   * Retrieve All Histories of the Policy
   */
  property get AllHistory(): List <History> {
    var historySearch = new gw.history.HistorySearchCriteria(){: RelatedItem = this}
    var results = historySearch.performSearch()
    return results.Empty ? null : results.toList()
  }

  /**
   * Necessary to fix verify all error
   */
  property get AllOpenActivitiesList(): List<Activity> {
    return this.AllOpenActivities.toList()
  }
}
