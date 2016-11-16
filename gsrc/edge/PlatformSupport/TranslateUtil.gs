package edge.PlatformSupport

/**
 * Provides helper functions to retrieve translations.
 */
class TranslateUtil {
  public static function translate(displayKey: String): String {
    return gw.api.domain.DisplayKey.getDisplayKeyValue(displayKey)
  }

  public static function translate(displayKey: String, argValues: Object[]) : String {
    return gw.api.domain.DisplayKey.getDisplayKeyValue(displayKey, argValues)
  }
}
