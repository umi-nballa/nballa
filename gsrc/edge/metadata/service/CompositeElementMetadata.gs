package edge.metadata.service

uses gw.util.Pair

/** Implementation of the composite metadata. */
internal final class CompositeElementMetadata implements IElementMetadata {

  /** Elements to delegate to. */
  private var peers : IElementMetadata[]

  construct(p : IElementMetadata[]) {
    this.peers = p
  }

  override function getMetadata<T>(): List<T> {
    return peers.flatMap( \ elt -> elt.getMetadata<T>()).toList()
  }

  override function getNamedMetadata<T>(name: String): List<T> {
    return peers.flatMap( \ elt -> elt.getNamedMetadata<T>(name)).toList()
  }

  override function getUnnamedMetadata<T>(): List<T> {
    return peers.flatMap( \ elt -> elt.getUnnamedMetadata<T>()).toList()
  }

  override function getAllUnnamedMetadata(): List<Object> {
    return peers.flatMap( \ elt -> elt.getAllUnnamedMetadata()).toList()
  }

  override function getAllNamedMetadata(): List<Pair<String, Object>> {
    return peers.flatMap( \ elt -> elt.getAllNamedMetadata()).toList()
  }
}
