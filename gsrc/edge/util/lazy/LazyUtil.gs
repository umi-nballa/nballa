package edge.util.lazy

/** Utilities used to work with lazy values. */
class LazyUtil {
  /** Creates a thread-unsafe lazy value. */
  public static function theadUnsafe<T>(b() : T) : LazyValue<T> {
    return new ThreadUnsafeLazyValue<T>(b)
  }
}
