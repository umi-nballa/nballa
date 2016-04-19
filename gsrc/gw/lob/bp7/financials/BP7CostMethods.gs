package gw.lob.bp7.financials

@Export
interface BP7CostMethods {
  property get Coverage() : Coverage
  property get OwningCoverable() : Coverable
  property get CostQualifier() : BP7Qualifier
}