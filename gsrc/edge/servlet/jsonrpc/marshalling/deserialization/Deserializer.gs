package edge.servlet.jsonrpc.marshalling.deserialization

uses org.codehaus.jackson.JsonParser
uses edge.servlet.jsonrpc.marshalling.deserialization.dom.JsonValue

/**
 * Base interface for the deserializers.
 */
interface Deserializer {
  /** Deserializes a value from the DOM.
   */
  public function deserialize(v : JsonValue) : Object
}
