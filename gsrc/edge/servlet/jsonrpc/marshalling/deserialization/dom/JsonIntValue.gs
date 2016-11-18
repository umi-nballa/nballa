package edge.servlet.jsonrpc.marshalling.deserialization.dom

uses gw.api.util.Logger

uses java.math.BigInteger
uses java.math.BigDecimal
uses java.lang.Integer

/**
 * Integer value in the source.
 */
final class JsonIntValue extends JsonValue {
  private static final var LOGGER = Logger.forCategory(JsonIntValue.Type.QName)

  private var _v : int;

  internal construct(v : int) {
    super("int")
    this._v = v
  }

  override public function asInt() : int {
    return _v
  }

  override public function asLong() : long {
    return _v
  }

  override public function asBigInteger() : BigInteger {
    return BigInteger.valueOf(_v)
  }

  override public function asBigDecimal() : BigDecimal {
    return BigInteger.valueOf(_v)
  }

  override public function asFloat() : float {
    return _v
  }

  override public function asDouble(): double {
    return _v
  }

  override function asNativeValue(): Object {
    return _v
  }


  override public function asString(): String {
    LOGGER.warn("Implicit conversion from number to string")
    return Integer.toString(_v)
  }
}
