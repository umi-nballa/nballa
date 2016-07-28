package gwservices.pc.dm.gx.base.account

enhancement AccountEnhancement: entity.Account {
  /**
   * Retrieve all history for account
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

  /**
   * Necessary to fix verify all error
   */
  property get DocumentsList(): List<Document> {
    return this.Documents.toList()
  }
}
