package gwservices.pc.dm.batch

uses java.lang.Integer
uses java.math.BigDecimal

/**
 * Statistics information from the migration process
 */
class StatisticsRecord {
  private var _entityName: String as EntityName
  private var _fieldName: String as FieldName
  private var _fieldStrValue: String as StringValue
  private var _fieldBooleanValue: Boolean as BooleanValue
  private var _fieldDecimalValue: BigDecimal as BigDecimalValue
  private var _fieldIntValue: Integer as IntegerValue
}