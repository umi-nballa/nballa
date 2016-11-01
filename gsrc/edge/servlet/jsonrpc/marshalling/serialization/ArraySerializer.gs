package edge.servlet.jsonrpc.marshalling.serialization

uses org.codehaus.jackson.JsonGenerator

/** Serializer for the array. */
internal final class ArraySerializer implements Serializer {

  /** Serializer for an array element. */
  private var elementSerializer : Serializer

  construct(es : Serializer) {
    this.elementSerializer = es
  }

  override function writeValue(writer: JsonGenerator, object: Object) {
    final var arr = object as Object[]
    writer.writeStartArray()
    var i = 0
    while (i < arr.length) {
      elementSerializer.writeValue(writer, arr[i])
      i += 1
    }
    writer.writeEndArray()
  }
}
