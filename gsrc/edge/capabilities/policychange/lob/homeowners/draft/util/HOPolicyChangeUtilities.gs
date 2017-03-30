package edge.capabilities.policychange.lob.homeowners.draft.util

uses java.util.HashSet
uses java.util.Set
uses edge.capabilities.policychange.lob.homeowners.draft.dto.ScheduledPropertyDTO
uses java.util.Collections

/**
 * Utilities for the Homeowner's Policy Change.
 */
final class HOPolicyChangeUtilities {

  /**
   * Returns a set of names which occurs more than once in the property description.
   */
  public static function getDuplicatedPropertyDescrs(props : ScheduledPropertyDTO[]) : Set<String> {
    if (props == null) {
      return Collections.emptySet()
    }
    final var names = props.map( \ elt -> elt.Description)
    final var duplicates = new HashSet<String>()
    final var seen = new HashSet<String>()

    for (var name in names) {
      if (!seen.add(name)) {
        duplicates.add(name)
      }
    }

    return duplicates
  }

  /** Checks that the  set is empty. */
  public static function isEmpty(s : Set<String>) : boolean {
    return s.Empty
  }

  /** Checks that value is not in the set. */
  public static function notIn(v : String, s : Set<String>) : boolean {
    return !s.contains(v)
  }
}
