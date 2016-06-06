package gw.account

uses org.apache.commons.lang.StringUtils
uses java.lang.StringBuffer
uses gw.api.name.NameLocaleSettings
uses gw.api.name.PersonNameFields

enhancement AccountSummaryEnhancement : AccountSummary {
  
  public property get AbbreviatedAccountHolderName() : String {
    return StringUtils.abbreviate(this.getAccountHolderName(), 20)
  }

  public property get AccountFullName_Ext() : String {
    var name : String
    var contact = this.Account.AccountHolderContact
    if (contact typeis Person){
      var sb = new StringBuffer()
      //var pName = name as PersonNameFields
      var delimiter = " "
      if (contact.Prefix != null) {sb.append(contact.Prefix)
        sb.append(delimiter)
      }
      if (contact.FirstName !=null ) {sb.append(contact.FirstName)
        sb.append(delimiter)
      }
      if (contact.MiddleName !=null ) { sb.append(contact.MiddleName)
        sb.append(delimiter)
      }
      if (contact.LastName !=null ) { sb.append(contact.LastName)
        sb.append(delimiter)
      }
      if (contact.Suffix !=null ) {  sb.append(contact.Suffix)
      }
      name = sb.toString()
    } else {
        name = this.AccountHolderName
    }
      return name
  }
}
