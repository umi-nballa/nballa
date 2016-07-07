package una.rating.autoratebookload

uses java.lang.RuntimeException

/**
 * Signal the end of SAX parsing of the Exported Rate Book XML data by throwing this exception,
 * containing the gathered data, to exit SAX parsing long before the end of the XML file.
 */
class SufficientRateBookDataFound extends RuntimeException {

  var _rateBookProperties : RateBookProperties as readonly RateBookProperties

  protected construct(rateBookPropertiesIn : RateBookProperties) {
    _rateBookProperties = rateBookPropertiesIn
  }

}
