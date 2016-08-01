package gwservices.pc.dm.util

uses gw.api.system.PCLoggerCategory
uses org.slf4j.Logger

/**
 * Logging categories
 */
class DMLogger extends PCLoggerCategory {
  private static final var _dm: Logger as readonly General = createLogger(PCLoggerCategory.API, "DataMigration")
  private static final var _fl: Logger as readonly Financials = createLogger(General, "Financials")
  private static final var _gx: Logger as readonly GX = createLogger(General, "GXLogger")
  private static final var _tl: Logger as readonly Test = createLogger(General, "TestLogger")
}
