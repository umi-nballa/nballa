package gw.exportimport.resolver

uses entity.KeyableBean
uses gw.exportimport.CellData
uses gw.exportimport.ExportImportUtil
uses gw.exportimport.validation.ImportValidationResult

uses java.lang.Double
uses java.lang.Float
uses java.lang.IllegalArgumentException
uses java.lang.Integer
uses java.lang.Number
uses java.lang.Long
uses java.lang.Object
uses java.lang.Short
uses java.lang.String
uses java.math.BigDecimal
uses java.text.ParseException
uses gw.exportimport.ColumnInfo
uses gw.exportimport.ImportMetaData
uses java.util.Map

/**
 * A {@link ColumnDataResolver} utilizing iterative reflection to resolve the dotted bean path.
 */
@ReadOnly
class SimpleColumnDataResolver extends AbstractColumnDataResolver<Object> {

  construct(aColumnInfo : ColumnInfo) {
    super(aColumnInfo)
  }

  override function calculateCellValue(bean : KeyableBean, cellData : CellData, metaData : ImportMetaData,
                                       dependentData : Map<String, Object>) : Object {
    var log = metaData.ValidationResult
    var data : Object = cellData.Data
    var typeOfProperty = cellData.ColumnInfo.ColumnType
    if (typeOfProperty typeis Type<java.lang.Number>){// && cellData.Data!=null && cellData.Data.trim()!="") {
      //print("Entered number data resolver *********************** field " + data+ " typeofproperty is " + typeOfProperty)
      try {
        data = convertNumberToType(convertLocalizedDataToNumber(cellData.Data, metaData.LanguageType), typeOfProperty)
      } catch (ex : ParseException) {
        var issue = cellData.createIssue(displaykey.Import.Validation.Errors.InvalidNumber(cellData.Data, typeOfProperty))
        log.flagField(bean.ID, issue)
        fail()
      }
    }
    if(typeOfProperty typeis Type<java.lang.Boolean> && data!=null){
      //print("Entered boolean data resolver ********************** field " + data + " typeofproperty is " + typeOfProperty)
      return Boolean.valueOf(data.toString())
    }

    //print("Not Number or Boolean , data is  " + data + "   , type of property is " + typeOfProperty)
    return data
  }

  private function convertLocalizedDataToNumber(data : String, languageType : LanguageType) : Number {
    var locale = guessAtLocaleFromLanguage(languageType)
    if(data!=null && data.trim()!="")
      return locale.NumberFormat.parseJavaNumberFormat(data)
    else
      return null//locale.NumberFormat.parseJavaNumberFormat("0")
  }

  private function convertNumberToType(number : Number, numberType : Type) : Object {
    if (numberType typeis Type<Short>) {
      return number as Short
    }
    if (numberType typeis Type<Integer>) {
      return number as Integer
    }
    if (numberType typeis Type<Long>) {
      return number as Long
    }
    if (numberType typeis Type<Float>) {
      return number as Float
    }
    if (numberType typeis Type<Double>) {
      return number
    }
    if (numberType typeis Type<BigDecimal>) {
      return BigDecimal.valueOf(number)
    }
    throw new IllegalArgumentException("Could not parse number type <${numberType}>")
  }

}