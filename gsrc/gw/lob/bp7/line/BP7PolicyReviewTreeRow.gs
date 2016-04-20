package gw.lob.bp7.line
uses gw.api.domain.Clause
uses gw.api.domain.covterm.CovTerm
uses java.util.LinkedHashMap
uses gw.lob.bp7.blanket.BP7Blanketable

abstract class BP7PolicyReviewTreeRow {

  var _startCollapsed : boolean as StartCollapsed = false
  var _description : String as Description = ""
  var _value : String as Value = ""
  var _isTitle : boolean as IsTitle = false
  var _isSubTitle : boolean as IsSubTitle = false
  var _children : List<BP7PolicyReviewTreeRow> as Children = {}

  function addChildRow(childRow : BP7PolicyReviewTreeRow) {
    Children.add(childRow)
  }

  function createCoverableRows(coverable : Coverable) {
    var clauseMapper : LinkedHashMap<String, Clause[]> = {
      displaykey.Web.Policy.BP7.Coverages  -> coverable.CoveragesFromCoverable,
      displaykey.Web.Policy.BP7.Exclusions -> coverable.ExclusionsFromCoverable,
      displaykey.Web.Policy.BP7.Conditions -> coverable.ConditionsFromCoverable
    }

    clauseMapper.eachKeyAndValue(\ clauseHeader, clauses -> {
      addChildRow(new BP7ClauseGroupTreeRow(clauseHeader, clauses.toList()))
    })
  }

  abstract function createChildren()

  ////////////////////////////////////////////////

  static class BP7LineTreeRow extends BP7PolicyReviewTreeRow {
    var _line: BP7BusinessOwnersLine
    construct(line : BP7BusinessOwnersLine) {
      Description = displaykey.Web.Policy.BP7.BusinessOwners
      IsTitle = true
      _line = line

      createChildren()
    }

    final override function createChildren() {
      createCoverableRows(_line)

      _line.BP7Locations.sort( \ loc1, loc2 -> loc1.DisplayName < loc2.DisplayName).each(\ loc -> {
        var row = new BP7LocationTreeRow(loc)
        addChildRow(row)
      })

      _line.Blankets.sortBy( \ blkt -> blkt.BlanketNumber).each( \ blkt -> {
        var row = new BP7BlanketTreeRow(blkt)
        addChildRow(row)
      })
    }
  }
  
  static class BP7BlanketTreeRow extends BP7PolicyReviewTreeRow {
    var _blanket : BP7Blanket

    construct(blanket : BP7Blanket) {
      Description = displaykey.Web.Policy.BP7.Blanket.BlanketType(blanket.DisplayName)
      IsTitle = true
      Value = blanket.TotalLimitDisplay
      _blanket = blanket

      createChildren()
    }

    final override function createChildren() {
      _blanket.BlanketedCoverages.each(\ coverage -> {
        addChildRow(new BP7BlanketedCoverageTreeRow(coverage))
      })
    }
  }

  static class BP7BlanketedCoverageTreeRow extends BP7PolicyReviewTreeRow {
    construct(coverage : BP7Blanketable) {
      Description = coverage.CoveragePath + ", " + coverage.CoverageDescription
    }

    override function createChildren() {
    }
  }

  static class BP7LocationTreeRow extends BP7PolicyReviewTreeRow {
    var _location : BP7Location
    construct(location: BP7Location) {
      Description = location.DisplayName
      IsTitle = true
      _location = location

      createChildren()
    }

    final override function createChildren() {
      createCoverableRows(_location)

      _location.Buildings.sort( \ bldg1, bldg2 -> bldg1.DisplayName < bldg2.DisplayName).each(\ building -> {
        var row = new BP7BuildingTreeRow(building)
        addChildRow(row)
      })
    }
  }
  
  static class BP7BuildingTreeRow extends BP7PolicyReviewTreeRow {
    var _building : BP7Building
    construct(building: BP7Building) {
      Description = building.DisplayName
      IsTitle = true
      _building = building

      createChildren()
    }

    final override function createChildren() {
      createCoverableRows(_building)

      _building.Classifications.sort( \ clsn1, clsn2 -> clsn1.DisplayName < clsn2.DisplayName).each(\ classification -> {
        var row = new BP7ClassificationTreeRow(classification)
        addChildRow(row)
      })
    }
  }

  static class BP7ClassificationTreeRow extends BP7PolicyReviewTreeRow {
    var _classification : BP7Classification
    construct(classification: BP7Classification) {
      Description = classification.DisplayName
      IsTitle = true
      _classification = classification

      createChildren()
    }

    final override function createChildren() {
      createCoverableRows(_classification)
    }
  }

  static class BP7ClauseGroupTreeRow extends BP7PolicyReviewTreeRow {
    var _clauses : List<Clause>

    construct(groupName : String, clauses : List<Clause>) {
      StartCollapsed = groupName != displaykey.Web.Policy.BP7.Coverages
      Description = groupName
      IsSubTitle = true
      _clauses = clauses

      createChildren()
    }
    
    final override function createChildren() {
      _clauses.each(\ clause -> {
        var row = new BP7ClauseTreeRow(clause)
        addChildRow(row)
      })
    }
  }

  static class BP7ClauseTreeRow extends BP7PolicyReviewTreeRow {
    var _clause: Clause
    construct(clause : Clause) {
      Description = clause.Pattern.DisplayName
      _clause = clause

      createChildren()
    }

    final override function createChildren() {
      _clause.CovTerms.each(\ term -> {
        var coverageRow = new BP7TermTreeRow(term)
        addChildRow(coverageRow)  
      })
    }
  }

  static class BP7TermTreeRow extends BP7PolicyReviewTreeRow {
    construct(term : CovTerm) {
      Description = term.DisplayName
      Value = term.DisplayValue
    }

    override function createChildren() {
    }
  }
}
