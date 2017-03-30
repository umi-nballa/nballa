package edge.capabilities.quote.lob.homeowners.draft.metadata

uses edge.el.dto.ExpressionDTO
uses edge.el.Expr
uses edge.aspects.validation.Validation
uses edge.metadata.annotation.IMetaMultiFactory
uses edge.aspects.validation.dto.ValidationRuleDTO
uses edge.aspects.validation.annotations.Year

/**
 * Information about upgrade year of one house system.
 */
final class UpgradeYear implements IMetaMultiFactory {
  /** Expression denoting that an upgrade year should be set. */
  private var _upgradePresent: ExpressionDTO

  /** Marks this field as an "upgrade year" based on the "upgrade is present" property. */
  construct(upgradeProperty: String) {
    this._upgradePresent =
        Expr.eq(
            Expr.getProperty(upgradeProperty, Validation.PARENT),
                true
        )
  }

  override function getState(): Object[] {
    final var yearBuilt = Expr.getProperty("YearBuilt", Validation.PARENT)
    return {
      Validation.requiredWhen(_upgradePresent),
      new ValidationRuleDTO(
        Expr.isNot(Expr.greaterThan(yearBuilt, Validation.VALUE)),
        Expr.translate("Edge.Web.Api.Model.AfterYear.AfterBuildYear", {yearBuilt})
      ),
      new Year().getState() ,
      new NotAFutureYear().getState()
    }
  }
}
