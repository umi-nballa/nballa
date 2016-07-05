package una.logging

uses gw.api.system.PCLoggerCategory
uses gw.pl.logging.Logger

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 4/23/16
 * Time: 9:50 AM
 */

class UnaLoggerCategory extends PCLoggerCategory {
  public static final var UNA_SECURITY : Logger = createLogger("UniversalSecurity");
  public static final var UNA_INTEGRATION : Logger = createLogger("UniversalIntegration");
  public static final var UNA_INTEGRATION_PAYLOAD : Logger = createLogger("UniversalntegrationPayload");
  public static final var UNA_BUSINESSEVENT : Logger = createLogger("UniversalBusinessEvent");
  public static final var UNA_TIMER : Logger = createLogger("UniversalTimer");
  public static final var UNA_DATAMAPPER : Logger = createLogger("UniversalDataMapper");
  public static final var UNA_PCFRULES : Logger = createLogger("UniversalPCFandRules");
  public static final var UNA_TESTFRAMEWORK : Logger = createLogger("UniversalTestFramework");
  public static final var UNA_METRICS : Logger = createLogger("UniversalMetrics");
  public static final var UNA_RATING : Logger = createLogger("UniversalRating");
  public static function load() : void {
  }
}