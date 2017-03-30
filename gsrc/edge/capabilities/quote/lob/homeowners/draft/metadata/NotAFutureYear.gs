package edge.capabilities.quote.lob.homeowners.draft.metadata

uses edge.metadata.annotation.IMetaFactory
uses edge.aspects.validation.dto.ValidationRuleDTO
uses edge.el.Expr
uses gw.api.util.DateUtil
uses edge.aspects.validation.Validation

/**
 * Marker for the date which should not be in a future.
 */
final class NotAFutureYear implements IMetaFactory {
  override function getState(): Object {
    final var currentDate = Expr.call(DateUtil#currentDate(), {})
    final var currentYear = Expr.call(DateUtil#getYear(), {currentDate})
    return new ValidationRuleDTO(
      Expr.isNot(Expr.greaterThan(Validation.VALUE, currentYear)),
      Expr.translate("Edge.Web.Api.Model.AfterYear.AfterCurrentYear", {})
    )
  }
}
