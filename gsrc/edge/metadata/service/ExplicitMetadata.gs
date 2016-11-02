package edge.metadata.service

uses gw.util.Pair
uses java.util.Collections
uses java.util.Arrays

/**
 * Explicit implementation of the metadata (based on the list of objects).
 */
internal final class ExplicitMetadata implements IElementMetadata {

  /** List of metadata objects. */
  private var objects : Object[]
  construct(o: Object[]) {
    this.objects = o
  }

  override function getMetadata<T>(): List<T> {
    return getUnnamedMetadata()
  }

  override function getNamedMetadata<T>(name: String): List<T> {
    return Collections.emptyList()
  }

  override function getUnnamedMetadata<T>(): List<T> {
    return objects.where( \ elt -> elt typeis T).map( \ elt -> elt as T).toList()
  }

  override function getAllUnnamedMetadata(): List<Object> {
    return Arrays.asList(objects)
  }

  override function getAllNamedMetadata(): List<Pair<String, Object>> {
    return Collections.emptyList()
  }
}
