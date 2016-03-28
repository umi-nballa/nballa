package gw.forms.generic

uses java.util.Map
uses java.util.HashMap
uses java.util.Set
uses gw.api.productmodel.ClausePattern
uses gw.forms.FormInferenceContext
uses gw.api.productmodel.ClausePatternLookup
uses gw.xml.XMLNode
uses java.util.TreeMap
uses gw.forms.GenericFormInference
uses gw.forms.FormData
uses gw.admin.FormPatternValidation
uses gw.api.productmodel.PolicyLinePattern
uses java.util.Date
uses gw.api.productmodel.PolicyLinePatternLookup
uses java.util.Comparator
uses java.util.Collections

class MultipleClausesSelectionForm extends FormData implements GenericFormInference {
  protected var _clausePatternsMap : Map<ClausePattern, Coverable[]> as ClausePatternsMap
  var _line : PolicyLine

  protected property get ClausePatternCodes() : String[] {
    return Pattern.FormPatternClauseCodes*.Code
  }

  override property get DisplayName() : String {
    return displaykey.Forms.Generic.MultipleClausesSelectionForm
  }

  override function getLookupDates(context : FormInferenceContext) : Map<Jurisdiction, DateTime> {

    //TODO this function seems to be used to initialize the class-level field values; can we do this in a constructor?
    _line = getLine(context)
    if (_line == null) {
      return Collections.emptyMap()
    }
    _clausePatternsMap = initClausePatterns()

    var map = new HashMap<Jurisdiction, DateTime>()
    for (clausePattern in _clausePatternsMap.Keys) {
      var coverables = _clausePatternsMap.get(clausePattern)
      getLookupDatesForClause(clausePattern, coverables, map)
    }
    return map
  }

  private function initClausePatterns() : Map<ClausePattern, Coverable[]> {
    var patterns = new TreeMap<ClausePattern, Coverable[]>(new ClausePatternComparator())
    Pattern.FormPatternClauseCodes.each( \ clauseCode -> {
      var pattern = ClausePatternLookup.getByPublicID(clauseCode.Code)
      var coverables = _line.AllCoverables.where( \ cov -> cov.getCoverageConditionOrExclusion(pattern) != null)
      patterns.put(pattern, coverables)
    })
    return patterns
  }

  private function getLookupDatesForClause(clausePattern : ClausePattern, coverables : Coverable[],
                                           map : Map<Jurisdiction, DateTime>) {
    for (cov in coverables) {
      var clause = cov.getCoverageConditionOrExclusion(clausePattern)
      if (clause.Pattern.OwningEntityType == _line.Pattern.PolicyLineSubtype as String) {
        for ( coveredState in _line.CoveredStates) {
          map.put(coveredState, getEarliestDate(map.get(coveredState), clause.ReferenceDate))
        }
      } else {
        map.put(cov.CoverableState, getEarliestDate(map.get(cov.CoverableState), clause.ReferenceDate))
      }
    }
  }

  override function populateInferenceData(context: FormInferenceContext, availableStates: Set<Jurisdiction>) {
    for (clausePattern in _clausePatternsMap.Keys) {
      var coverables = _clausePatternsMap.get(clausePattern)
      coverables = populateInferenceDataForClause(clausePattern, coverables, context, availableStates)
      _clausePatternsMap.put(clausePattern, coverables)
    }
  }

  private function populateInferenceDataForClause(clausePattern : ClausePattern, coverables : Coverable[],
                                                  context : FormInferenceContext, availableStates : Set<Jurisdiction>) : Coverable[] {
    for(cov in coverables) {
      var clause = cov.getCoverageConditionOrExclusion(clausePattern)
      if (clause.Pattern.OwningEntityType == _line.Pattern.PolicyLineSubtype as String) {
        coverables = coverables.where(\ c -> availableStates.intersect(_line.CoveredStates.toSet()) != null)
      } else {
        coverables = coverables.where(\ c -> availableStates.contains(c.CoverableState))
      }
    }
    return coverables
  }

  override property get InferredByCurrentData(): boolean {
    for (clausePattern in _clausePatternsMap.Keys) {
      var coverables = _clausePatternsMap.get(clausePattern)
      if(coverables.hasMatch(\ c -> c.hasCoverageConditionOrExclusion(clausePattern))) {
        return true
      }
    }
    return false
  }

  override function addDataForComparisonOrExport(contentNode: XMLNode) {
    //Add the coverables on which the clauses exists
    var allCoverableNode = new XMLNode("Coverables")
    contentNode.addChild(allCoverableNode)
    for (cov in _clausePatternsMap.Values.flatMap( \ elt -> elt.toList())) {
      var clauses = cov.CoveragesConditionsAndExclusionsFromCoverable.where(\clause -> _clausePatternsMap.containsKey(clause.Pattern))
      // Add the coverable and the clause patterns
      var coverableNode = new XMLNode("Coverable")
      allCoverableNode.addChild(coverableNode)
      coverableNode.addChild(createTextNode("FixedId", cov.TypeIDString))
      var clausePatternsNode = new XMLNode("ClausePatterns")
      coverableNode.addChild(clausePatternsNode)
      clauses.each(\clausePattern -> clausePatternsNode.addChild(createTextNode("ClausePattern", clausePattern.Pattern.CodeIdentifier)))
    }
  }

  override function clearCustomFields(formPattern : FormPattern) {
    formPattern.FormPatternClauseCodes.each(\ w -> formPattern.removeFromFormPatternClauseCodes(w))
  }

  override function validateCustomFields(formPattern : FormPattern, validation : FormPatternValidation) {
    if (!formPattern.FormPatternClauseCodes.HasElements) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.MissingRequired(formPattern.DisplayName, "Form Pattern Clause Codes"))
    }
  }

  override property get ValidPolicylines() : List<PolicyLinePattern> {
    return PolicyLinePatternLookup.getAll()
  }

  override property get PolicyLineRequired(): boolean {
    return true
  }

  private function getEarliestDate(d1 : Date, d2 : Date) : Date {
    if (d1 == null) {
      return d2
    } else if (d2 == null) {
      return d1
    } else if (d2.before(d1)) {
      return d2
    } else {
      return d1
    }
  }

  private function formatDateTime(date : Date) : String {
    return gw.api.util.StringUtil.formatDate(date, "yyyy-MM-dd HH:mm:ss.SSS")
  }

  private class ClausePatternComparator implements Comparator<ClausePattern> {
    override function compare(o1: ClausePattern, o2: ClausePattern): int {
      return o1.CodeIdentifier.compareTo(o2.CodeIdentifier)
    }
  }
}