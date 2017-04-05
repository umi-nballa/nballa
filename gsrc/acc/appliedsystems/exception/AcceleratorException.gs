package acc.appliedsystems.exception

uses java.lang.Exception

class AcceleratorException extends Exception{

  construct() {}

  construct(msg:String) {
    super(msg)
  }
}
