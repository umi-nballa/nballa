package gw.lob.bp7.line.coverages

enhancement BP7LimitedFungiBacteriaCovEnhancement : productmodel.BP7LimitedFungiBacteriaCov {
  function limitedFungiBacteriaCovTermAvailable() : boolean {
    return not this.BP7SeparatePremisesLocationsOptionTerm.Value
  }
}
