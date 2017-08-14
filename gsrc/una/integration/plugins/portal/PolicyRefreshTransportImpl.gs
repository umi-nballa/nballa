package una.integration.plugins.portal

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
uses dynamic.Dynamic
uses java.lang.Class

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 7/11/17
 * Time: 8:33 AM
 * To change this template use File | Settings | File Templates.
 */
@Export
class PolicyRefreshTransportImpl extends AbstractMessageTransport implements InitializablePlugin {

  public static var DEST_ID : int = 31

  public static final var CREATEPERIOD_MSG : String = "CreatePeriod"
  public static final var CANCELPERIOD_MSG : String = "CancelPeriod"
  public static final var CHANGEPERIOD_MSG : String = "ChangePeriod"
  public static final var ISSUEPERIOD_MSG : String = "IssuePeriod"
  public static final var REINSTATEPERIOD_MSG : String = "ReinstatePeriod"
  public static final var RENEWPERIOD_MSG : String = "RenewPeriod"
  public static final var REWRITEPERIOD_MSG : String = "RewritePeriod"

  private var _userName: String = null
  private var _password: String = null

  override function setParameters(paramMap: Map) {
    _userName = paramMap['username'] as String
    _password = paramMap['password'] as String
  }

  override function send(message: Message, payload: String) {
    var policyPeriod = message.PolicyPeriod
    try {
      if(policyPeriod.Policy.Product.ProductType == ProductType.TC_PERSONAL) {
        sendPersonalPolicyUPSERT(policyPeriod)
      } else if(policyPeriod.Policy.Product.ProductType == ProductType.TC_COMMERCIAL) {
        //TODO send commercialUPSERT
              // GROUP LINE CODES
              //        case "75":
              //        lineNumber = "Businessowners";
              //        break;
              //        case "85":
              //        lineNumber = "Commercial Residential";
              //        break;
      } else {
        // not sure if it is possible to hit this
        message.reportNonRetryableError()
        message.reportError(ErrorCategory.TC_SYSTEM_ERROR, 2)
      }
      message.reportAck()
    } catch(e: Exception) {
      _logger.error("PolicyRefresh Integration Error", e)
      message.ErrorDescription = e.Message
      message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
    }
  }

  public function sendPersonalPolicyUPSERT(policyPeriod: PolicyPeriod) { //message: Message) {

    //var policyPeriod = message.PolicyPeriod

    var service = new wsi.remote.una.portalpolicyservice.policyservice.PolicyService()
    var authHeader = getAuthHeader()

    var policies = new wsi.remote.una.portalpolicyservice.policyservice.types.complex.Policies()
    policies.PersonalPolicy = getPersonalPolicyRequest(policyPeriod)
    policies.PolicyEdition = (policyPeriod.TermNumber?:1 - 1)//Policy Edition is 0 based on the portal side
    policies.PremiumAmt = policyPeriod.TotalPremiumRPT

    policies.CallingCenter = "PC"

    //This billing ingformation is going to be sent from BC
    var billingPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
    var summary = billingPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.TermNumber)
    var billingPolicies = billingPlugin.retrieveBillingPolicies(policyPeriod.Policy.Account.AccountNumber)
    policies.BalanceDue = summary.CurrentOutstanding
    policies.BalanceTotal = summary.TotalBilled
    policies.BalanceDueDate = new XmlDateTime()

    policies.print()

    var response = service.PersonalPolicy_UPSERT(policies, authHeader)
    _logger.debug("Response: {}", response)
    print("Status: "  + response.Status + "\nResult: " + response.Result.PolicyNumber + "\nMessage:${response.Result.Message}")
    if(response == null) {
      var description = "No response recieved from Portal"
      _logger.error("PolicyRefresh Integration Error", description)
      //message.ErrorDescription = description
     // message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
    } else if(response.Status == 0) {
      _logger.debug(response.Result)
    } else {
      _logger.error(response.Error)
      //message.ErrorDescription = response.Error
      // message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
    }
  }

  public function getAuthHeader() : PersonalPolicy_UPSERTHeaders {
    var authHeader = new PersonalPolicy_UPSERTHeaders()
    authHeader.QuoteAuthenticationHeader = new QuoteAuthenticationHeader()
    authHeader.QuoteAuthenticationHeader.Username = _userName
    authHeader.QuoteAuthenticationHeader.Password = _password
    return authHeader
  }

  public function getPersonalPolicyRequest(policyPeriod: PolicyPeriod) : Policies_PersonalPolicy {
    var personalPolicy = new Policies_PersonalPolicy()

    personalPolicy.Policy = new PolicyDetailRequest_Policy(){
        :PolicyNum = policyPeriod.PolicyNumber,
        :Agency = getAgencyDetails(policyPeriod),
        :Cust = getCustomerDetails(policyPeriod),
        :IsGWPolicy = "true",
        :Home = getHome(policyPeriod),
        :BillingInfo = getBillingInfo(policyPeriod),//TODO: Moving to BC
        :Installments = getInstallments(policyPeriod), //TODO: Moving to BC
        :TransRecaps = getTransactionRecaps(policyPeriod),//TODO: Moving to BC
        :PolicyLoan = getPolicyLoans(policyPeriod)
    }

    return personalPolicy
  }

  public function getAgencyDetails(policyPeriod: PolicyPeriod) : Policy_Agency  {

    var agency = policyPeriod.ProducerCodeOfRecord.Organization
    var primaryAddress = agency.Contact.PrimaryAddress

    var agencyDetails = new Policy_Agency()
      {
          :AgentNum = agency.AgenyNumber_Ext,
          :AgentName = agency.Name,
          :Addr = mapAddress(primaryAddress, Agency_Addr),
          :Email = agency.Contact.EmailAddress1
      }

    agencyDetails.PhoneInfo = new ArrayList<Agency_PhoneInfo>()
    if(agency.Contact.WorkPhone != null) {
      agencyDetails.PhoneInfo.add( new Agency_PhoneInfo() { :PhoneNum = agency.Contact.WorkPhone, :PhoneTypeCd= PhoneType.TC_WORK.Code })
    }
    if(agency.Contact.FaxPhone != null) {
      agencyDetails.PhoneInfo.add( new Agency_PhoneInfo() { :PhoneNum = agency.Contact.FaxPhone, :PhoneTypeCd= PhoneType.TC_FAX.Code })
    }

    return agencyDetails
  }

  public function getCustomerDetails(policyPeriod: PolicyPeriod) : List<Policy_Cust> {

    var primaryNamedInsured = policyPeriod.PrimaryNamedInsured.ContactDenorm
    var primaryAddress = primaryNamedInsured.PrimaryAddress

    var customerList = new ArrayList<Policy_Cust>()
        {
            new Policy_Cust()
                {
                    :Addr = mapAddress(primaryAddress, Cust_Addr),
                    //:CoApplFirstName = policyPeriod., //TODO: what does this map to?
                    :Company = primaryNamedInsured.ContactCompany.Name,
                    :EffDt = policyPeriod.PeriodStart.XmlDateTime.toString(),
                    :Email = primaryNamedInsured.EmailAddress1,
                    :ExpDt = policyPeriod.PeriodEnd.XmlDateTime.toString(),
                    :GroupLine = policyPeriod.Policy.Product.Name,
                    :GroupLineCode = getGroupLineCode(policyPeriod),
                    :Name = primaryNamedInsured.Name,
                    :PhoneInfo = new ArrayList<Cust_PhoneInfo>(),
                    :RatingState = policyPeriod.PolicyAddress.State?.Description,
                    :RatingStateCode = policyPeriod.PolicyAddress.State?.Code,
                    :Status = policyPeriod.Status.Code,
                    :Term = policyPeriod.TermNumber?.toString()
                }
        }

    if(primaryNamedInsured.HomePhone != null) {
      customerList.first().PhoneInfo.add( new Cust_PhoneInfo() { :PhoneNum = primaryNamedInsured.HomePhone, :PhoneTypeCd= PhoneType.TC_WORK.Code  })
    }
    if(primaryNamedInsured.WorkPhone != null) {
      customerList.first().PhoneInfo.add( new Cust_PhoneInfo() { :PhoneNum = primaryNamedInsured.WorkPhone, :PhoneTypeCd= PhoneType.TC_WORK.Code  })
    }
    if(primaryNamedInsured.FaxPhone != null) {
      customerList.first().PhoneInfo.add( new Cust_PhoneInfo() { :PhoneNum = primaryNamedInsured.FaxPhone, :PhoneTypeCd= PhoneType.TC_FAX.Code  })
    }

    return customerList
  }

  public function getGroupLineCode(policyPeriod: PolicyPeriod): String {
    var groupLine = ""
    if(policyPeriod.Policy.Product.ProductType == ProductType.TC_PERSONAL) {

      if(HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)) {
        groupLine = "24" //"Homeowners"; (HO3, HO4, HO6)
        if(policyPeriod.HomeownersLine_HOE.BaseState == Jurisdiction.TC_TX) {
          groupLine = "23" //"Homeowners - TX"; (HOA, HOB, HCONB)
        }
      }  else if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)){

        if(HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)){
          groupLine = "21" //"Dwelling Fire - TX"; (TDP1, TDP2 TDP3)
        } else if (HOPolicyType_HOE.TC_DP3_EXT == policyPeriod.HomeownersLine_HOE.HOPolicyType and policyPeriod.HomeownersLine_HOE.BaseState == Jurisdiction.TC_FL ) {
          groupLine = "22" //"Rental Dwelling Fire"; (DP3 florida only)
        } else {
          groupLine = "19" //"Dwelling Fire"
        }
      }
    } else { //commercial
      if(policyPeriod.BP7LineExists or policyPeriod.BOPLineExists){
        groupLine = "75"
      } else if(policyPeriod.CPLineExists) {
        groupLine = "85"
      }
    }
    return groupLine
  }

  //TODO: Move to BC
  public function getBillingInfo(policyPeriod: PolicyPeriod): ArrayList<Policy_BillingInfo> {
    return new ArrayList<Policy_BillingInfo>() {
        new Policy_BillingInfo(){
            :BalDue = "200", :BillType = "Direct Bill", :LastPaymentAmt="100", :LastPaymentDt = "11/11/2020", :PayType = "Insured", :PrevBalDue = "0", :TotalPremPaid = "100", :TotalTermPrem = "300"
        },
        new Policy_BillingInfo(){
            :BalDue = "1000", :BillType = "Direct Bill", :LastPaymentAmt="100", :LastPaymentDt = "11/11/2020", :PayType = "Insured", :PrevBalDue = "0", :TotalPremPaid = "100", :TotalTermPrem = "300"
        }
    }
  }

  //TODO: Move to BC
  public function getInstallments(policyPeriod: PolicyPeriod): Policy_Installments {
    return new Policy_Installments(){
        : Installment = new ArrayList<Installments_Installment>(){
            new Installments_Installment()
                {
                    : InstallNum = "1", : InstallStatus = "CN", : InstallDt = "2020-11-11", : InstallAmt = "100", : InstallAmtDue = "200", : InstallTransCd = "INS"
                },
            new Installments_Installment()
                {
                    : InstallNum = "2", : InstallStatus = "CN", : InstallDt = "2020-11-11", : InstallAmt = "100", : InstallAmtDue = "200", : InstallTransCd = "INS"
                },
            new Installments_Installment()
                {
                    : InstallNum = "3", : InstallStatus = "CN", : InstallDt = "2020-11-11", : InstallAmt = "100", : InstallAmtDue = "200", : InstallTransCd = "INS"
                }
        }
    }
  }

  //TODO: Move to BC
  public function getTransactionRecaps(policyPeriod: PolicyPeriod): Policy_TransRecaps {
    return new Policy_TransRecaps()
    {
        :TransRecap = new ArrayList<TransRecaps_TransRecap>()
          {
            new TransRecaps_TransRecap()
            {
                :AmtPd = "100", :BalanceDue = "200", :CarryDt = "2020-11-11", :Cash = "100", :CurrAct = "CP", :EffDt = "2020-11-11", :EnteredDt = "2020-11-11", :Comments = "jfkaslfjaskfjs"
            },
            new TransRecaps_TransRecap()
            {
                :AmtPd = "100", :BalanceDue = "200", :CarryDt = "2020-11-11", :Cash = "100", :CurrAct = "CP", :EffDt = "2020-11-11", :EnteredDt = "2020-11-11", :Comments = "jfkaslfjaskfjs"
            }
          }
    }
  }

  public function getPolicyLoans(policyPeriod: PolicyPeriod): ArrayList<Policy_PolicyLoan> {
    var additionalInterests = policyPeriod.DwellingAdditionalInterests.where( \ ai -> typekey.AdditionalInterestType.TF_MORTGAGEE_EXT.TypeKeys.contains(ai.AdditionalInterestType))
    var loans = new ArrayList<Policy_PolicyLoan>()

    additionalInterests.each( \ loan ->  {
      loans.add(new Policy_PolicyLoan()
          {
              :LoanName = loan.PolicyAddlInterest.DisplayName, :LoanName2 = loan.PolicyAddlInterest.DBAs?.first()?.DisplayName, :LoanNum = loan.ContractNumber, :LoanType = loan.AdditionalInterestType.Code,
              :Addr = mapAddress(loan.PolicyAddlInterest.ContactDenorm.PrimaryAddress, PolicyLoan_Addr)
          }
      )
    })
    return loans
  }

  public function getHome(policyPeriod: PolicyPeriod): Policy_Home {
    var line = policyPeriod.HomeownersLine_HOE
    var dwelling = line.Dwelling

    var home = new Policy_Home(){
        : Props = new Home_Props()
            {
                : Prop = new ArrayList<Props_Prop>()
                    {
                        new Props_Prop(){
                            :ConstructType = dwelling.ConstructionType.Code,
                            :Form = "3",// TODO:  Need mapping
                            :FtToHydrant = dwelling.HOLocation.DistanceToFireHydrant?.toString(),
                            :HeatYr = dwelling.HeatingUpgradeDate?.toString(),
                            :LossFree = "4",// TODO:  Need mapping
                            :MilesToFireDept = dwelling.HOLocation.DistanceToFireStation?.toString(),
                            //:NumApts = "0",TODO:Number of Apartments
                            :NumFamilies =  "1",// TODO:  Need mapping
                            //:NumRooms = "0", //TODO: Number of Rooms
                            :NumStories = dwelling.NumberStoriesOrOverride?.Code,
                            :NumUnits = dwelling.UnitsNumber?.Code,
                            :Occupancy = dwelling.Occupancy?.Code,
                            :PlumbingYr = dwelling.PlumbingUpgradeDate?.toString(),
                            :ProtectClass = dwelling.HOLocation.protectionClassOrOverride,
                            :RatePlan = "S",// TODO:  Need mapping
                            :ReplaceCost = dwelling.ReplacementCost?.toString(),// TODO:  Need mapping
                            :RoofType = dwelling.RoofTypeOrOverride?.Code,
                            :RoofYr = dwelling.RoofingUpgradeDate?.toString(),
                            :Territory = dwelling.HOLocation.territoryCodeOrOverride,
                            :TotalSqFt = dwelling.SquareFootageOrOverride,
                            :UnitNum = "1",// TODO: Need mapping
                            :UserLineCode = "24",
                            :WiringYr = dwelling.ElectricalSystemUpgradeDate?.toString(),
                            :YrBuilt = dwelling.YearBuiltOrOverride?.toString(),
                            //:HurricaneDollar = "4580",// TODO: Need mapping

                            : Coverage = new ArrayList<Prop_Coverage>() {
                                //new Prop_Coverage() { : AllPerilDeduct = "1000", : CovALimit = "2000", : CovAPrem = "22", : HurricaneDeduct = "2"},
                                //new Prop_Coverage() { : AllPerilDeduct = "1000", : FloodDWLimit = "5000", : FloodDWPrem = "2200", : HurricaneDeduct = "2"}
                            },
                            : ItemNotes = new Prop_ItemNotes() { : Note = new ArrayList<ItemNotes_Note>() },
                            : LossHist = new ArrayList<Prop_LossHist>() {
                                new Prop_LossHist() { : LossAmt = "433", : LossDt = "2017-11-11", : LossType = "CLM", : PaidClaim = "C"}
                            },
                            :Addr = mapAddress(policyPeriod.PolicyAddress.Address, Prop_Addr)

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
        //TODO: Move to CC
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

    //  Add Notes
    var notes = policyPeriod.Policy.Account.Notes
    notes.each( \ note -> home.Props.Prop.first().ItemNotes.Note.add(new ItemNotes_Note() { : EnteredDt = note.AuthoringDate, : Remarks = note.Body, : Title = note.Subject, : UserId = note.Author.DisplayName }))

    //home.Props.Prop.first().Coverage.add( new Prop_Coverage() { : CovALimit = dwelling.DwellingLimitCovTerm.DisplayValue, : CovAPrem = dwelling.DwellingLimitCovTerm, : HurricaneDeduct = "2"})

    var covALimit = dwelling.DwellingLimitCovTerm.Value
    var covBLimit = dwelling.OtherStructuresLimitCovTerm.Value
    var covCLimit = dwelling.PersonalPropertyLimitCovTerm.Value
//
//    //you can add enhancement properties to the below to make them prettier and re-usable like the ones above
//    var covDLimit = (HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(line.HOPolicyType)) ? dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : dwelling.DPDW_FairRentalValue_Ext.DPDW_FairRentalValue_ExtTerm.Value
//    var covELimit = (HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(line.HOPolicyType)) ? line.DPLI_Personal_Liability_HOE.DPLI_LiabilityLimit_HOETerm.Value : line.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value
//    var covFLimit = (HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(line.HOPolicyType)) ? line.DPLI_Med_Pay_HOE.DPLI_MedPay_Limit_HOETerm.Value : line.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value

    var covList = line.CoveragesFromCoverable.where( \ elt -> line.hasCoverageConditionOrExclusion(elt.PatternCode)).toList()
    covList.addAll(dwelling.CoveragesFromCoverable.where( \ elt -> dwelling.hasCoverageConditionOrExclusion(elt.PatternCode)).toList())
    //dwelling.VersionList.Coverages.where( \ c -> c.AllVersions.first().CoverageCategory.Code.equals("HODW_SectionI_HOE")).flatMap(\ c -> c.Costs).flatMap(\ c -> c.AllVersions).toList()
    //dwelling.VersionList.Coverages.flatMap(\ c -> c.Costs).flatMap(\ c -> c.AllVersions).toList()
    print("Section I")
    covList.where( \ elt -> elt.CoverageCategory.Code.equals("HODW_SectionI_HOE")).each( \ cov -> {
      var costModelList = una.pageprocess.QuoteScreenPCFController.getCostModels(cov)
      costModelList.each( \ costModel ->
        {
          var propCov: Prop_Coverage = null
          print("${costModel.Coverage.Pattern.Name} :: ${costModel.LimitDisplayValue ?: costModel.LimitValue} :: ${costModel.PremiumDisplayValue}")

          if(costModel.Coverage.PatternCode  ==  "HODW_Dwelling_Cov_HOE" || costModel.Coverage.PatternCode  == "DPDW_Dwelling_Cov_HOE") {
            propCov = new Prop_Coverage() { : CovALimit = costModel.LimitValue, : CovAPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HODW_Other_Structures_HOE" || costModel.Coverage.PatternCode  == "DPDW_Other_Structures_HOE") {
            propCov = new Prop_Coverage() { : CovBLimit = costModel.LimitValue, : CovBPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HODW_Loss_Of_Use_HOE" || costModel.Coverage.PatternCode  == "DPDW_FairRentalValue_Ext") {
            propCov = new Prop_Coverage() { : CovCLimit = costModel.LimitValue, : CovCPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HODW_SectionI_Ded_HOE") {
            costModel.Coverage.CovTerms.each( \ term -> {
              if(term.PatternCode.equals("HODW_AllPeril_HOE_Ext")){
                propCov = new Prop_Coverage() { :AllPerilDeduct = term.DisplayValue }
              } else if(term.PatternCode.equals("HODW_Hurricane_Ded_HOE")) {
                propCov = new Prop_Coverage() { :HurricaneDeduct = term.DisplayValue }
              }
            })
          }




          if(propCov != null) {
            home.Props.Prop.first().Coverage.add(propCov)
          }
        })
    })
    print("Section II")
    covList.where( \ elt -> elt.CoverageCategory.Code.equals("HODW_SectionII_HOE")).each( \ cov -> {
        var costModelList = una.pageprocess.QuoteScreenPCFController.getCostModels(cov)
        costModelList.each( \ costModel -> {
            print("${costModel.Coverage.Pattern.Name} :: ${costModel.LimitDisplayValue ?: costModel.LimitValue} :: ${costModel.PremiumDisplayValue}")
        })
    })


//    var section2 = line.VersionList.HOLineCoverages.where( \ c -> c.AllVersions.first().CoverageCategory.Code.equals("HODW_SectionII_HOE")).flatMap(\ c -> c.Costs).flatMap(\ c -> c.AllVersions).toList()
//    section2.each( \ cov -> {
//      var costModelList = una.pageprocess.QuoteScreenPCFController.getCostModels(cov.Coverage)
//      costModelList.each( \ costModel ->
//      {
//        print("${costModel.Coverage.PatternCode } :: ${costModel.LimitDisplayValue} :: ${costModel.PremiumDisplayValue}")
//
//      })
//    })

//    policyPeriod.AllCoverables*.CoveragesFromCoverable.each( \ coverage -> {
        //home.Props.Prop.first().Coverage.add(//new Prop_Coverage() { : AllPerilDeduct = coverage."1000", : CovALimit = "2000", : CovAPrem = "22", : HurricaneDeduct = "2"}))

//      var coverageDTO = new UNACoverageDTO()
//      coverageDTO.Code = coverage.PatternCode
//
//      if(coverage.Scheduled){
//        coverageDTO.ScheduledItems = getScheduledItemDTOs(coverage)
//      }else{
//        coverage.CovTerms.each( \ covTerm -> {
//          var covTermDTO = new UNACoverageTermDTO()
//          covTermDTO.Code = covTerm.PatternCode
//          covTermDTO.Value = covTerm.ValueAsString
//        })
//      }
//    })


    return home
  }

  /**
   *
   */
  private function mapAddress(address: Address,  clazz: Type): Dynamic  {

    var addrToMap: Dynamic = clazz.TypeInfo.getConstructor({}).Constructor.newInstance({})
    addrToMap.Addr1 = address.AddressLine1
    addrToMap.Addr2 = address.AddressLine2
    addrToMap.UnitNo = address.AddressLine3
    addrToMap.City = address.City
    addrToMap.County = address.County
    addrToMap.Country = address.Country.Description
    addrToMap.State = address.State.Code
    addrToMap.Zip = address.PostalCode
    addrToMap.AddrTypeCd = address.AddressType.Code
    return addrToMap
  }

}