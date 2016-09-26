package una.integration.creditreport.testutil
uses typekey.UWCompanyCode
uses typekey.State
uses typekey.CreditStatusExt
uses typekey.Jurisdiction
uses java.lang.String

uses java.util.Date


class AccountFactory {

  public static var FirstNameArray : String[] = {"Ray", "BRYON", "CYNTHIA", "SHARON", "Erica", "Dave", "Mike", "Bill", "Will", "Cormac"}
  public static var MiddleNameArray : String[] = {null, null, "D", "HOLLY", "Newton", "Biancola", "Jackson", "Moran", "Dune", "Bell"}  
  public static var LastNameArray : String[] = {"Newton", "BIANCOLA", "LINDSEY", "COPPOLA", "Newton", "Biancola", "Jackson", "Moran", "Dune", "Bell"}  
  public static var AddressLine1Array : String[] = {"1253 Paloma Ave", "2700 LEEDS LANE", "767 COAL MINE RD", "12679 FAIR CREST C", "1253 Paloma Ave", "1 Energy Drive", "1199 Walnut Street", "4040 Elmwood Ave", "846 Yount Lane", "Elm Street"}
  public static var AddressLine2Array : String[] = {"Floor 0000", "APT 1B", null, "UNIT 75-30", null, null, null, null, null}
  public static var AddressCityArray : String[] = {"Arcadia", "CHARLOTTESVILLE", "STRASBURG", "FAIRFAX", "Santa Barbara", "Santa Monica", "San Jose", "San Carlos", "San Luis", "Foster City"}
  public static var AddressStateArray : typekey.State[] = {typekey.State.TC_CA, typekey.State.TC_VI, typekey.State.TC_VA, typekey.State.TC_VA, null, null, null, null, null, null}
  public static var AddressZipArray : String[] = {"91007", "22901", "226574917", "220333889", "95002", "96003", "97004", "98005", "99006", "96700"}
  public static var CreditScoreArray : String[] = {"300", "350", "723", "572", "500", "550", "600", "650", "700", "850"}
  public static var IsuredSocialSecurityNumberArray : String[] = {"000000000", "111111111", "222222222", "333333333", "444444444", "555555555", "666666666", "777777777", "888888888", "999999999"}
  public static var StatusCodeArray : typekey.CreditStatusExt[] = { typekey.CreditStatusExt.TC_CREDIT_RECEIVED,
                                                                    typekey.CreditStatusExt.TC_CREDIT_RECEIVED_WITH_REASON_ENTRY,
                                                                    typekey.CreditStatusExt.TC_ERROR,
                                                                    typekey.CreditStatusExt.TC_NO_HIT,
                                                                    typekey.CreditStatusExt.TC_NO_SCORE,
                                                                    typekey.CreditStatusExt.TC_NOT_ORDERED}
  public static var date : Date=new Date()
  public static var lob : String='HomeownersLine'
  public static var product : String='Homeowners'
  public static var uwCponpanyCode : typekey.UWCompanyCode=typekey.UWCompanyCode.TC_02
  public static var jurisdictionCode : typekey.Jurisdiction=typekey.Jurisdiction.TC_FL
  public static var StatusDescription : String="GW"
  public static var CreditBureau : String="Experian"
  public static var folderID : String="100"
  public static var gender : String[]={"Male", "Female"}
}
