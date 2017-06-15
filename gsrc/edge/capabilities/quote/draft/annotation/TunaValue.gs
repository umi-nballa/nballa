package edge.capabilities.quote.draft.annotation

uses gw.lang.reflect.features.PropertyReference
uses gw.lang.reflect.IType
uses gw.lang.annotation.AnnotationUsage
uses java.lang.IllegalArgumentException
uses gw.lang.reflect.features.IPropertyReference

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

  property get ValueType() : IType {
    return _valueProp.PropertyInfo.FeatureType
  }

  property get ValuePropertyName(): String {
    return _valueProp.PropertyInfo.Name
  }

  property get MatchLevelPropertyName(): String {
    return _matchLevelProp.PropertyInfo.Name
  }

  property get IsOverriddenPropertyName(): String {
    return _isOverriddenProp.PropertyInfo.Name
  }

  property get OverrideValuePropertyName(): String {
    return _overrideValueProp.PropertyInfo.Name
  }

}