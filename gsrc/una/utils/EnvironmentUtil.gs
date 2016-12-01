package una.utils

uses java.lang.NullPointerException

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 05/10/2016
 * Time: 1:46 PM
 * simple utility for getting environmental information on policycenter (dev, int, qa, etc.)
 */
class EnvironmentUtil {
  public static final var LOCAL_ENVIRONMENT: String = "local"
  public static final var LOCAL_DEV_ENVIRONMENT: String = "pc_dev"
  public static final var LOCAL_DEVINT_ENVIRONMENT: String = "pc_devint"
  public static final var INT1_ENVIRONMENT: String = "pc_asm"
  public static final var QA_ENVIRONMENT: String = "pc_qa"
  public static final var UAT_ENVIRONMENT: String = "pc_uat"
  public static final var QAT_ENVIRONMENT: String = "pc_qat"
  public static final var PROD_ENVIRONMENT: String = "prd"

  static property get PolicyCenterRuntime(): String {
    //serverutil does not work from gosuscratch pad. Default to local if this fails so unit tests can be run
    try {
      var env = gw.api.system.server.ServerUtil.getEnv()
      return env != null and !env.Empty ? env : "local"
    } catch (e: NullPointerException) {
      return "local"
    }
  }

  static function isProduction(): boolean {
    if (EnvironmentUtil.PolicyCenterRuntime == null || EnvironmentUtil.PolicyCenterRuntime.Empty) {
      return false
    } else if (EnvironmentUtil.PolicyCenterRuntime == PROD_ENVIRONMENT) {
      return true
    } else {
      return false
    }
  }

  static function isLocal(): boolean {
    if (EnvironmentUtil.PolicyCenterRuntime == null || EnvironmentUtil.PolicyCenterRuntime.Empty
        || EnvironmentUtil.PolicyCenterRuntime == LOCAL_ENVIRONMENT
        || EnvironmentUtil.PolicyCenterRuntime == LOCAL_DEV_ENVIRONMENT
        || EnvironmentUtil.PolicyCenterRuntime == LOCAL_DEVINT_ENVIRONMENT) {
      return true
    } else {
      return false
    }
  }

  /**
   * Function to check if the environment is QAT or not
  */
  static function isQAT(): boolean {
    if (EnvironmentUtil.PolicyCenterRuntime == null || EnvironmentUtil.PolicyCenterRuntime.Empty) {
      return false
    } else if (EnvironmentUtil.PolicyCenterRuntime == QAT_ENVIRONMENT) {
      return true
    } else {
      return false
    }
  }
}