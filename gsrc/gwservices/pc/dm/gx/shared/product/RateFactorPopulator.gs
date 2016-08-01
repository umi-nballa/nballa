package gwservices.pc.dm.gx.shared.product

uses gw.api.productmodel.RateFactorPattern
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.api.productmodel.RateFactorPatternLookup

class RateFactorPopulator extends BaseEntityPopulator<RateFactor, Modifier> {
  override function create(model: XmlElement, parent: Modifier, bundle: Bundle): RateFactor {
    /*if (model typeis PAModifier_PARateFactors_Entry) {
      var patternCode = RateFactorPatternLookup.getByCode(model.PatternCode)
      if (patternCode == null) {
        throw new DataMigrationNonFatalException(CODE.INVALID_RATE_FACTOR, model.PatternCode)
      }
      var rateFactor = super.create(model, parent, bundle) as RateFactor
      parent.addToRateFactors(rateFactor)
      rateFactor.setPattern(patternCode)
      return rateFactor
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
    }*/
    return null
  }
}