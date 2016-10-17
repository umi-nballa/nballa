package una.enhancements.entity

uses java.lang.StringBuffer
uses gw.api.name.ContactNameFields
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 10/14/16
 * Time: 12:07 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement ContactEnhancement_Ext : entity.Contact {

  public function getMiddleName() : String {
    if(this typeis Person){
      return this.MiddleName
    }
    return null
  }
  public property get AccountFullName_Ext() : String {
    var name : String
    var formattedName : String
    var contact : ContactNameFields

    if (this typeis Person){
      var sb = new StringBuffer()
      //var pName = name as PersonNameFields
      var delimiter = " "
      if (this.Prefix != null) {sb.append(this.Prefix)
        sb.append(delimiter)
      }
      if (this.FirstName !=null ) {sb.append(this.FirstName)
        sb.append(delimiter)
      }
      if (this.MiddleName !=null ) { sb.append(this.MiddleName)
        sb.append(delimiter)
      }
      if (this.LastName !=null ) { sb.append(this.LastName)
        sb.append(delimiter)
      }
      if (this.Suffix !=null ) {  sb.append(this.Suffix)
      }
      name = sb.toString()
    } else {
      name = this.Name
      /*contact = new PersonNameFieldsImpl() {
          :LastName = this.LastName,
          :FirstName = this.FirstName,
          :Suffix = this.Suffix,
          :MiddleName = this.MiddleName,
          :Particle = this.Particle*/

    }
    return name
  }
  // uim-svallabhapurapu, Contact story card hide field for AI and Ainterest roles
  property get isDobRequired() : boolean {
    if(this typeis Person) {
      for(ac in this.AccountContacts.where( \ elt -> elt.hasRole(typekey.AccountContactRole.TC_ADDITIONALINTEREST) or elt.hasRole(typekey.AccountContactRole.TC_ADDITIONALINSURED))){
        if(ac.Contact == this){
          return false
        }
      }
    }
    return true
  }

}
