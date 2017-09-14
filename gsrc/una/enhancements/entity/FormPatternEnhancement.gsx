package una.enhancements.entity

uses java.util.Date
uses java.text.SimpleDateFormat

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 8/18/17
 * Time: 10:19 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement FormPatternEnhancement : entity.FormPattern {

  property get EditionAsDate(): Date {

    var editionDate : Date = null

    if(this.Edition != null) {
        editionDate = new SimpleDateFormat("MMyy").parse(this.Edition.replaceAll(" ", ""))
    }
    return editionDate
  }

}
