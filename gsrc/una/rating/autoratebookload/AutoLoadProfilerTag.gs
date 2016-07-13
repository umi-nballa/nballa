package una.rating.autoratebookload

uses gw.api.profiler.ProfilerTag

abstract class AutoLoadProfilerTag {

  public static final var AUTO_LOAD        : ProfilerTag = new ProfilerTag("AutomaticRateBookLoader")
  public static final var DELETE_RATE_BOOK : ProfilerTag = new ProfilerTag("DeleteRateBook")
  public static final var LOAD_RATE_BOOK   : ProfilerTag = new ProfilerTag("LoadRateBook")

  private construct() {
  }

}
