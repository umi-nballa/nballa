package gw.lob.common.displayable

uses gw.lang.reflect.IPropertyInfo
uses gw.datatype.annotation.DataType
uses java.lang.Integer
uses gw.validation.PCValidationContext
uses gw.api.diff.DiffProperty
uses gw.api.web.job.JobWizardHelper

interface Displayable<T> {
  property get PropertyInfo() : IPropertyInfo

  property get Visible() : boolean
  property get Required() : boolean
  property get Label() : String
  property get Editable() : boolean
  property get Available() : boolean
  property get ValueRange() : List<T>

  property get Value() : T
  property set Value(newValue : T)

  @DataType("integer")
  property get IntegerValue() : Integer
  @DataType("integer")
  property set IntegerValue(newValue : Integer)

  property get ValidValue() : T
  property get ShowConfirmMessage() : boolean
  property get ConfirmMessage() : String
  property get ValidateExpression() : String

  function update()
  function validate(valContext : PCValidationContext)
  function shouldSuppressOOSConflict(diffItem : DiffProperty) : boolean
  function onChange(wizard : JobWizardHelper)
}