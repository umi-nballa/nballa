package edge.capabilities.quote.draft.annotation

uses gw.lang.reflect.features.PropertyReference
uses gw.lang.annotation.AnnotationUsage

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 6/5/17
 * Time: 3:04 PM
 *
 *
 * This annotation is used to map TunaValueDTOs. Any property that is of Type <code>TunaValueDTO</code> should
 * be annotated with this.
 */

@AnnotationUsage(gw.lang.annotation.UsageTarget.PropertyTarget, gw.lang.annotation.UsageModifier.One)
class TunaValue implements IAnnotation {

  var _valueProp: PropertyReference as ValuePropertyReference
  var _matchLevelProp: PropertyReference as MatchLevelPropertyReference
  var _isOverriddenProp: PropertyReference as IsOverriddenPropertyReference
  var _overrideValueProp: PropertyReference as OverrideValuePropertyReference
  var _childNodePropertyRefs: PropertyReference[] as ChildNodePropRefs

 /**
   *
   * @Param valuePropertyReference - The Field that the Tuna Value maps to.
   * @Param tunaMatchLvlPropertyReference - The Field that the TunaMatchLevel maps to.
   * @Param isOverriddenPropertyReference - The Field that the Tuna Value IsOverridden maps to.
   * @Param overriddenValuePropertyReference - The Field that the Tuna Override value maps to.
  */
  construct(valuePropertyReference: PropertyReference, tunaMatchLvlPropertyReference: PropertyReference, isOverriddenPropertyReference: PropertyReference, overriddenValuePropertyReference: PropertyReference) {
    this._valueProp = valuePropertyReference
    this._matchLevelProp = tunaMatchLvlPropertyReference
    this._isOverriddenProp = isOverriddenPropertyReference
    this._overrideValueProp = overriddenValuePropertyReference
  }

  /**
   *
   * @Param valuePropertyReference - The Field that the Tuna Value maps to.
   * @Param tunaMatchLvlPropertyReference - The Field that the TunaMatchLevel maps to.
   * @Param isOverriddenPropertyReference - The Field that the Tuna Value IsOverridden maps to.
   * @Param overriddenValuePropertyReference - The Field that the Tuna Override value maps to.
   */
  construct(valuePropertyReference: PropertyReference, tunaMatchLvlPropertyReference: PropertyReference, isOverriddenPropertyReference: PropertyReference, overriddenValuePropertyReference: PropertyReference, childPropertyReferences: PropertyReference[]) {
    this._valueProp = valuePropertyReference
    this._matchLevelProp = tunaMatchLvlPropertyReference
    this._isOverriddenProp = isOverriddenPropertyReference
    this._overrideValueProp = overriddenValuePropertyReference
    this._childNodePropertyRefs = childPropertyReferences
  }
}