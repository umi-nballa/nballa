package gw.lob.bp7.utils

class BP7UIDisplayUtil {

  static function rangeInputEditable<T>(value : T, validValues : List<T>) : boolean {
    return 
      validValues != null and (
      validValues.Count > 1 or 
      (validValues.Count == 1 and value != validValues.first()))
  }

}
