package edge.capabilities.quote.lob.homeowners.draft.metadata

uses edge.metadata.annotation.IMetaMultiFactory
uses edge.el.dto.ExpressionDTO
uses edge.el.Expr
uses edge.aspects.validation.Validation

/**
 * Denotes that this field defines a "detailed" representation of some another field. This field should be present only
 * when another field is set to a particular value. Otherwise this field should not be set.
 */
final class DetailOf implements IMetaMultiFactory {

  /** Parent (leading) value. */
  private var _propExpr : ExpressionDTO

  /** Value of the "parent" property indicating that the annotated property should be set. */
  private var _valueExpr : ExpressionDTO


  /** Marks this property as required iff <code>prop</code> parent property is set to a <code>value</code>. */
  construct(prop : String, value : Object) {
    this._propExpr = Expr.getProperty(prop, Validation.PARENT)
    this._valueExpr = Expr.asExpression(value)
  }

  /** Marks this property as required iff <code>prop</code> is set to <code>true</code>. */
  construct(prop: String) {
    this(prop, Boolean.TRUE)
  }

  override function getState(): Object[] {
    return {
      Validation.requiredWhen(Expr.eq(_propExpr, _valueExpr))
    }
  }
}
