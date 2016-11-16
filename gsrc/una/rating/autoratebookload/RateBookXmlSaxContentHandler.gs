package una.rating.autoratebookload

uses gw.api.productmodel.PolicyLinePatternLookup
uses org.xml.sax.Attributes
uses org.xml.sax.helpers.DefaultHandler

uses java.io.File
uses java.lang.StringBuilder
uses java.text.SimpleDateFormat
uses java.util.Date

/**
 * Parse Exported Rate Book XML, expected to be in roughly this format:
 *
 * <pre>
 * &lt;?xml version="1.0"?&gt;
 * &lt;import xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.guidewire.com/cc/import/cc_import.xsd"&gt;
 *   &lt;RateBook public-id="pc:401"&gt;
 *     &lt;BookCode&gt;FMG_LIAB&lt;/BookCode&gt;
 *     &lt;BookDesc/&gt;
 *     &lt;BookDesc_L10N_ARRAY/&gt;
 *     &lt;BookEdition&gt;1&lt;/BookEdition&gt;
 *     &lt;BookJurisdiction/&gt;
 *     &lt;BookName&gt;FMG Liability&lt;/BookName&gt;
 *     &lt;BookName_L10N_ARRAY/&gt;
 *     &lt;BookOffering/&gt;
 *     &lt;EffectiveDate&gt;2012-01-01 00:00:00.000&lt;/EffectiveDate&gt;
 *     &lt;ExpirationDate/&gt;
 *     &lt;LastStatusChangeDate&gt;2012-09-06 18:27:31.993&lt;/LastStatusChangeDate&gt;
 *     &lt;PolicyLine&gt;LIABLine&lt;/PolicyLine&gt;
 *     &lt;RateBookCalcRoutines/&gt;
 *     &lt;RateTables&gt;
 *       &lt;RateTable public-id="pc:801"&gt;
 *         ...
 *         &lt;RateBook public-id="pc:401"/&gt;
 *       &lt;/RateTable&gt;
 *       ...
 *     &lt;/RateTables&gt;
 *     &lt;RenewalEffectiveDate&gt;2012-01-01 00:00:00.000&lt;/RenewalEffectiveDate&gt;
 *     &lt;Status&gt;Stage&lt;/Status&gt;
 *     &lt;UWCompany/&gt;
 *   &lt;/RateBook&gt;
 *   ...
 * &lt;/import&gt;
 * </pre>
 */
class RateBookXmlSaxContentHandler extends DefaultHandler {
  public static final var RATE_BOOK_DATE_TIME_FORMAT: String = "yyyy-MM-dd HH:mm:ss.SSS"
  var _parsingState = 0
  // See switch statement, below, for the states.
  var _rateBookNestingLevel = 0
  // We have to parse all the way to the end of the *FIRST* <RateBook> Element we find.
  var _elementContents = new StringBuilder()
  // Text contents of the current XML Element.
  var _properties = new RateBookProperties()
  // Results of file parsing are accumulated in this object.
  final var dateParser = new SimpleDateFormat(RATE_BOOK_DATE_TIME_FORMAT)
  protected construct(fileIn: File) {
    _properties.JavaFile = fileIn
  }

  /**
   * At the <b>first</b> XML Element we find, determin if this is an <ERROR> XML document
   * (or a proper <RATABASECALC> response document).  If the first XML Element is <b>not</b>
   * "<ERROR>", then we throw the 'IsNotJavaAdaptorErrorMessage' exception, to abort the SAX
   * XML processing, and to indicate to the calling function (above) that this is <b>not</b>
   * an <ERROR> XML document.
   */
  override function startElement(namespaceURI: String, localName: String, qualifiedName: String, atts: Attributes)
  {
    switch (_parsingState) {

      case 0:
          if (localName == "import") {
            _parsingState = 1
            // Saw "<import ...>" element.
          } else {
            throw "Unexpected root element: " + localName
          }
          break

      case 1:
          if (localName == "RateBook") {
            _parsingState = 2
            // Saw "<RateBook ...>" element.
            _rateBookNestingLevel = 1
          } else {
            throw new NonRateBookGuidewireImportFileException("Unexpected first element after root: " + localName)
          }
          break

      case 2:
          if (localName == "RateBook") {
            _rateBookNestingLevel++
          }
          break

        default:
        throw "Not expecting to get into state " + _parsingState + " while parsing Rate Book XML."
    }

    // Clear contents, to accumulate text from here to the end tag.
    _elementContents.setLength(0)
  }

  /**
   * At each end Element, set the appropriate field, used to build the final DisplayableException,
   * RatabaseJavaAdaptorErrorException.  At the final "</ERROR>" end Element, build and throw the
   * exception.
   */
  override function endElement(namespaceURI: String, localName: String, qualifiedName: String)
  {
    if (localName == "RateBook") {
      // When we get to the end of the first RateBook Element...
      _rateBookNestingLevel--
      if (_rateBookNestingLevel < 1) {
        // ...exit to the calling code with the accumulated data (in a RateBookProperties object).
        throw new SufficientRateBookDataFound(_properties)
      }
    } else {
      // At the end of each of these property Elements, capture the appropriate property value:
      var elementContents = _elementContents.toString()
      switch (localName) {
        case "BookCode": _properties.BookCode = elementContents;                              break
        case "BookName": _properties.BookName = elementContents;                              break
        case "BookDesc": _properties.BookDesc = elementContents;                              break
        case "BookEdition": _properties.BookEdition = elementContents as int;                       break
        case "PolicyLine": _properties.PolicyLine = PolicyLinePatternLookup.getByCode(elementContents);break
        case "Status": _properties.Status = RateBookStatus.get(elementContents);          break
        case "EffectiveDate": _properties.EffectiveDate = parseDate(elementContents);                   break
        case "ExpirationDate": _properties.ExpirationDate = parseDate(elementContents);                   break
        case "LastStatusChangeDate": _properties.LastStatusChangeDate = parseDate(elementContents);                   break
        case "RenewalEffectiveDate": _properties.RenewalEffectiveDate = parseDate(elementContents);                   break
      }
      _elementContents.setLength(0)
    }
  }

  private function parseDate(dateString: String): Date {
    if (dateString == "") {
      return null
    } else {
      return dateParser.parse(dateString)
    }
  }

  /**
   * Accumulate text until we get to the end XML Element.
   */
  override function characters(ch: char[], start: int, len: int) {
    _elementContents.append(ch, start, len)
  }
}
