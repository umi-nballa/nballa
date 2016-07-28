package gwservices.pc.dm.gx.shared.product

uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.api.productmodel.ModifierPatternBaseLookup

class ModiferPopulator extends BaseEntityPopulator<Modifier, KeyableBean> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
    // no initialization necessary for coverage
  }

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): Modifier {
    if (parent typeis Modifiable) {
      var patternCode = findElement(Modifier#PatternCode, model).SimpleValue.GosuValue as String
      var modPattern = ModifierPatternBaseLookup.getByCode(patternCode)
      if (modPattern == null) {
        throw new DataMigrationNonFatalException(CODE.INVALID_MODIFIER, patternCode)
      }
      var modifier = parent.getModifier(patternCode)
      if (modifier == null) {
        throw new DataMigrationNonFatalException(CODE.MISSING_MODIFIER, patternCode)
      }
      return modifier
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_PARENT, typeof(parent) as String)
  }
}
