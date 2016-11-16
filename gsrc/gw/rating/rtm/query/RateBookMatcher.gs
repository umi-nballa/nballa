package gw.rating.rtm.query

uses gw.plugin.Plugins
uses gw.plugin.rateflow.IImpactTestingPlugin
uses gw.rating.flow.util.QueryUtils

uses java.lang.IllegalArgumentException
uses java.util.Date

/**
 * Perform a match on a <code>RateBook</code> based on its attributes
 */
@Export
class RateBookMatcher {

  var _policyLine : String
  var _uwCompany : UWCompany
  var _jurisdiction : Jurisdiction
  var _offering : String

  /**
   * Construct a new <code>RateBookMatcher</code>
   *
   * @param uwCompany <code>UWCompany</code> to match against the <code>RateBook</code>s (can be null)
   * @param jurisdiction <code>Jurisdiction</code> to match against the <code>RateBook</code>s (can be null)
   * @param offering offering to match against the <code>RateBook</code>s (can be null)
   */
  construct(uwCompany : UWCompany, jurisdiction : Jurisdiction, offering : String) {
    this._uwCompany = uwCompany
    this._jurisdiction = jurisdiction
    this._offering = offering
  }

  /**
   * Construct a new <code>RateBookMatcher</code>
   *
   * @param policyLine policy line to match against the <code>RateBook</code>s (can be null)
   * @param jurisdiction <code>Jurisdiction</code> to match against the <code>RateBook</code>s (can be null)
   * @param uwCompany <code>UWCompany</code> to match against the <code>RateBook</code>s (can be null)
   * @param offering offering to match against the <code>RateBook</code>s (can be null)
   */
  construct(policyLine : String, jurisdiction : Jurisdiction, uwCompany : UWCompany, offering : String) {
    this._policyLine = policyLine
    this._uwCompany = uwCompany
    this._jurisdiction = jurisdiction
    this._offering = offering
  }

  /**
   * Filter the list of <code>RateBook</code>s based on the values of this matcher
   *
   * @param books list of candidate <code>RateBook</code>s
   *
   * @return a filtered list of <code>RateBook</code>s
   */
  function filter(books : List<RateBook>) : List<RateBook> {
    return books.where(\ book ->
      book.BookJurisdiction ==_jurisdiction and
      book.BookOffering == _offering and
      book.UWCompany == _uwCompany and
      book.PolicyLine == _policyLine)
  }

  /**
   * Query for <code>RateBook</code>s based on some filter parameters to be used by the matchers
   *
   * @param filter a <code>RateBookQueryFilter</code> that holds filter definition to use
   * for retrieving <code>RateBook</code>s
   *
   * @return list of <code>RateBook</code>s that match the filter
   */
  static function getBooksFor(filter : RateBookQueryFilter) : List<RateBook> {
    var alternateRatebooks : java.util.List<entity.ImpactTestingRateBook> = {}
    
    if (Plugins.isEnabled(IImpactTestingPlugin)) {
      alternateRatebooks = Plugins.get(IImpactTestingPlugin).AlternateRatebooks
    }

    if (alternateRatebooks.HasElements) {
      // If impact testing is active, use an alternate set of ratebooks
      return alternateRatebooks.map(\ rb -> rb.RateBook).where(\rb -> rb.PolicyLine == filter.PolicyLine)
    } else {
      // Otherwise (normal case) we select ratebooks by dates and status.          
      return QueryUtils.getRateBooksForLine(filter.PolicyLine)
        .where(\ b -> effDate(filter, b) <= filter.QueryRefDate
                  //TODO this code is commented out to fix local developers seeing missing routines etc on existing policy quotes
                  //and b.LastStatusChangeDate <= filter.OriginalRateDate
                  and (not filter.MatchGroup or b.BookGroup == filter.BookGroup)
                  and statusLevelsAbove(filter.MinimumRatingLevel).contains(b.Status)
                  and (b.ExpirationDate > filter.QueryRefDate or b.ExpirationDate == null))
    }
  }
 
  private static function effDate(filter : RateBookQueryFilter, book : RateBook) : Date {
    return filter.RenewalJob ? book.RenewalEffectiveDate : book.EffectiveDate
  }

  private static function statusLevelsAbove(minimalStatusLevel : RateBookStatus) : RateBookStatus[] {
    checkNotNull(minimalStatusLevel)
    return RateBookStatus.getTypeKeys(false).where( \ status -> status.Priority >= minimalStatusLevel.Priority).toArray<RateBookStatus>(new RateBookStatus[0])
  }

  private static function checkNotNull(minimalStatusLevel : RateBookStatus) {
    if (minimalStatusLevel == null) {
      throw new IllegalArgumentException("minimum rating level cannot be null")
    }
  }

  public override function hashCode() : int {
    var result = 1
    result = result * 31 + (_policyLine == null ? 0 : _policyLine.hashCode())
    result = result * 37 + (_offering == null ? 0 : _offering.hashCode())
    result = result * 41 + (_uwCompany == null ? 0 : _uwCompany.hashCode())
    result = result * 43 + (_jurisdiction == null ? 0 : _jurisdiction.hashCode())
    return result
  }

  override function equals(o : Object) : boolean {
    if (o === this) return true

    if ((o typeis RateBookMatcher)) {
      return this._policyLine == o._policyLine and
             this._jurisdiction == o._jurisdiction and
             this._uwCompany == o._uwCompany and
             this._offering == o._offering
    }

    return false
  }

}