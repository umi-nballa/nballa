package una.integration.una.integration.portal

uses una.integration.UnaIntTestBase
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.*

uses una.integration.framework.messaging.AbstractMessageTransport
uses gw.plugin.InitializablePlugin
uses java.util.Map
uses java.util.ArrayList
uses wsi.remote.una.portalpolicyservice.policyservice.types.complex.Addr
uses wsi.remote.una.portalpolicyservice.policyservice.elements.QuoteAuthenticationHeader
uses wsi.remote.una.portalpolicyservice.policyservice.types.complex.PolicyDetailRequest
uses wsi.remote.una.portalpolicyservice.policyservice.types.complex.Policies
uses wsi.remote.una.portalpolicyservice.policyservice.soapheaders.PersonalPolicy_UPSERTHeaders
uses gw.xml.date.XmlDateTime
uses wsi.remote.una.portalpolicyservice.policyservice.types.complex.Installment
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 7/19/17
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicyRefreshTransportTest extends UnaIntTestBase {

  /**
   * This method is used to initialize the test data common for all the tests in this class
   */
  override function beforeClass() {
  super.beforeClass()


  }

  /**
   * This method is used to free up of resources initialized in the beforeClass() method
   */
  override function afterClass() {


  super.afterClass()
  }



  /**
   * This method tests address scrub service
   */
  function testPropertyInformationScrubOnly() {


  }

  public function getAgencyDetails(policyPeriod: PolicyPeriod) : Policy_Agency  {
          return new Policy_Agency()
              {
                  : AgentName = "Michael G. Scott",
                  : AgentNum = "83379",
                  : SubAgentName = "",
                  : BranchName = "",
                  : Email = "uim@uihna.com",
                  : Addr = new Agency_Addr()
                      {
                          : Addr1 = "123 Main St", : AddrTypeCd = "MailingAddress", : City = "Sarasota", : State = "Florida", : Zip = "11111"
                      },
                  : PhoneInfo = new ArrayList<Agency_PhoneInfo>()
                      {
                          new Agency_PhoneInfo()
                              {
                                  : PhoneNum = "1234567890", : PhoneTypeCd = "Work"
                              }
                      }
              }
  }

  private function getCustomerDetails(policyPeriod: PolicyPeriod) : List<Policy_Cust> {
        return new ArrayList<Policy_Cust>()
            {
                new Policy_Cust()
                    {
                        : CompanionAcctDisc = "0", : Company = "Universal N.A.", : CompanyCode = "02", : EffDt = "2019-11-11", : ExpDt = "2020-11-11", : GroupLine = "Homeowners",
                        : GroupLineCode = "24", : Name = "Jane Doe", : ProgramCode = "4", : RatingState = "Florida", : RatingStateCode = "FL", : Status = "Inforce", : Term = "12 Months",
                        : Email = "tester@uihna.com", : Name2 = "John D Doe", : CoApplFirstName = "", : RenewalType = "", : NextBillAct = "", : NextBillActDt = "", : NextPolicyAct = "", : NextPolicyActDt = "",
                        : Addr = new Cust_Addr()
                            {
                                : Addr1 = "101 Paramount Dr", : Addr2 = "PO Box 12", : AddrTypeCd = "MailingAddress", : City = "Sarasota", : County = "Sarasota", : State = "Florida", : Zip = "11111", : UnitNo = "2", : Country = "United States"
                            },
                        : PhoneInfo = new ArrayList<Cust_PhoneInfo>()
                            {
                                new Cust_PhoneInfo()
                                    {
                                        : PhoneNum = "5555555555", : PhoneTypeCd = "Home"
                                    },
                                new Cust_PhoneInfo() {
                                    : PhoneNum = "1234567890", : PhoneTypeCd = "Work"
                                }
                            }
                    }
            }

  }


  private function getBillingInfo(policyPeriod: PolicyPeriod): ArrayList<Policy_BillingInfo> {
      return new ArrayList<Policy_BillingInfo>()
          {
            new Policy_BillingInfo()
                {
                  :BalDue = "200", :BillType = "Direct Bill", :LastPaymentAmt="100", :LastPaymentDt = "11/11/2020", :PayType = "Insured", :PrevBalDue = "0", :TotalPremPaid = "100", :TotalTermPrem = "300"
                },
            new Policy_BillingInfo()
                {
                  :BalDue = "1000", :BillType = "Direct Bill", :LastPaymentAmt="100", :LastPaymentDt = "11/11/2020", :PayType = "Insured", :PrevBalDue = "0", :TotalPremPaid = "100", :TotalTermPrem = "300"
                }
          }
  }


  public function getHome(policyPeriod: PolicyPeriod): Policy_Home {
    var line = policyPeriod.LatestPeriod.HomeownersLine_HOE
    var dwelling = line.Dwelling

    var home = new Policy_Home(){
    : Props = new Home_Props()
  {
    : Prop = new ArrayList<Props_Prop>()
      {
          new Props_Prop(){
    :ConstructType = dwelling.ConstructionType.Code,
    :Form = "3",
    :FtToHydrant = dwelling.HOLocation.DistanceToFireHydrant.toString(),
    :HeatYr = "01/01/2014",
    :LossFree = "4",
    :MilesToFireDept = "4",
    :NumApts = "0",
    :NumFamilies = "1",
    :NumRooms = "0",
    :NumStories = "1",
    :NumUnits = "1",
    :Occupancy = "O",
    :PlumbingYr = "01/01/2014",
    :ProtectClass = "04",
    :RatePlan = "S",
    :ReplaceCost = "200000",
    :RoofType = "Asphalt/Composition Shingles (Adhesive/Epoxy)",
    :RoofYr = "01/01/2014",
    :Territory = "711",
    :TotalSqFt = "2154",
    :UnitNum = "1",
    :UserLineCode = "24",
    :WiringYr = "01/01/2014",
    :YrBuilt = "2014",
    :HurricaneDollar = "4580",

    : Coverage = new ArrayList<Prop_Coverage>() {
        new Prop_Coverage() { : AllPerilDeduct = "1000", : CovALimit = "2000", : CovAPrem = "22", : HurricaneDeduct = "2"},
    new Prop_Coverage() { : AllPerilDeduct = "1000", : FloodDWLimit = "5000", : FloodDWPrem = "2200", : HurricaneDeduct = "2"}
  },
    : ItemNotes = new Prop_ItemNotes() {
    : Note = new ArrayList<ItemNotes_Note>() {
        new ItemNotes_Note() { : EnteredDt = "2017-11-11", : Remarks = "jdfalksdjflasjflaksjdflksjd", : Title = "Test Note", : UserId = "MGSCOTT" }
  }
  },
    : LossHist = new ArrayList<Prop_LossHist>() {
        new Prop_LossHist() { : LossAmt = "433", : LossDt = "2017-11-11", : LossType = "CLM", : PaidClaim = "C"}
  },
    : Addr = new Prop_Addr()
  {
    : Addr1 = "123 Main St", : Addr2 = "43 Blvd", : AddrTypeCd = "PropertyAddress", : City = "Sarasota", : County = "Sarasota", : State = "Florida", : Zip = "34232", : UnitNo = "1",
    : Comments = "", :Country = "United States", : Latitude = "", : Longitude = "", : PostDirection = "", : PreDirection = "", : StreetName = "", : StreetNumber = "", : Type = ""
  }


  }
  }
  },
  :Loan = new ArrayList<Home_Loan>()
  {
  new Home_Loan()
  {
  :LoanName = "Personal Loan", :LoanNum = "123FF48", :LoanType = "Mortgagee", :OrigNum = "222222",
  :Addr = new Loan_Addr()
  {
  :Addr1 = "djfdjfdf", :AddrTypeCd = "MailingAddress", :City = "Orange", :County = "Orange", :State = "Florida", :Zip = "11111"
  },
  :PhoneInfo = new Loan_PhoneInfo()
  {
  :PhoneNum = "5555555555", :PhoneTypeCd = "Work"
  }
  },
  new Home_Loan()
  {
  :LoanName = "Personal Loan", :LoanNum = "123FF48", :LoanType = "Mortgagee", :OrigNum = "222222",
  :Addr = new Loan_Addr()
  {
  :Addr1 = "djfdjfdf", :AddrTypeCd = "MailingAddress", :City = "Orange", :County = "Orange", :State = "Florida", :Zip = "11111"
  },
  :PhoneInfo = new Loan_PhoneInfo()
  {
  :PhoneNum = "5555555555", :PhoneTypeCd = "Work"
  }
  }
  },
  :Endorsements = new Home_Endorsements()
  {
  : Endorsement = new ArrayList<Endorsements_Endorsement>()
  {
  new Endorsements_Endorsement()
  {
  : Description = "Sample Endorsement 1", : EditionDt = "0404", : EndNum = "432", : ItemNum = "2", : Limit = "0", : Premium = "200"
  },
  new Endorsements_Endorsement()
  {
  : Description = "Sample Endorsement 2", : EditionDt = "0404", : EndNum = "432", : ItemNum = "2", : Limit = "0", : Premium = "200"
  },
  new Endorsements_Endorsement()
  {
  : Description = "Sample Endorsement 3", : EditionDt = "0404", : EndNum = "432", : ItemNum = "2", : Limit = "0", : Premium = "200"
  }
  }
  },
  :Claims = new Home_Claims()
  {
  :Claim = new ArrayList<Claims_Claim>()
  {
  new Claims_Claim()
  {
  :ClaimNum = "23FEEE5849", :LossDt = "2017-11-11", :LossPd = "300", :ReportedDt = "2017-11-11", :Status = "Closed"
  },
  new Claims_Claim()
  {
  :ClaimNum = "23FEEE5840", :LossDt = "2017-11-11", :LossPd = "300", :ReportedDt = "2017-11-11", :Status = "Closed"
  }
  }
  }
  }
  return home
  }
}
