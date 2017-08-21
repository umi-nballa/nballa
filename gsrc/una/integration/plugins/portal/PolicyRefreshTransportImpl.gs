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
uses java.text.SimpleDateFormat

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
    policies.PolicyEdition = (policyPeriod.TermNumber?:1) - 1//Policy Edition is 0 based on the portal side
    policies.PremiumAmt = policyPeriod.TotalPremiumRPT
    policies.BalanceTotal = "0"
    policies.BalanceDue = "0"
    policies.BalanceDueDate = new XmlDateTime()

    policies.CallingCenter = "PC"

    policies.print()

    var response = service.PersonalPolicy_UPSERT(policies, authHeader)
    _logger.debug("Response: {}", response)
    print("Status: "  + response.Status + "\nResult: " + response.Result.PolicyNumber + "\nPolicyID:${response.Result.PolicyID}\nMessage:${response.Result.Message}")

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
//        :BillingInfo = getBillingInfo(policyPeriod),//TODO: Moving to BC
//        :Installments = getInstallments(policyPeriod), //TODO: Moving to BC
//        :TransRecaps = getTransactionRecaps(policyPeriod),//TODO: Moving to BC
        :PolicyLoan = getPolicyLoans(policyPeriod)
    }

    return personalPolicy
  }

  public function getAgencyDetails(policyPeriod: PolicyPeriod) : Policy_Agency  {

    var agency = policyPeriod.ProducerCodeOfRecord.Organization
    var primaryAddress = agency.Contact.PrimaryAddress

    var agencyDetails = new Policy_Agency()
      {
          :AgentNum = "89999",// policyPeriod.EffectiveDatedFields.ProducerCode,//agency.AgenyNumber_Ext,
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
                    :Term = ((policyPeriod.TermNumber?:1) - 1).toString()
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
    var groupLineCode = ""
    if(policyPeriod.Policy.Product.ProductType == ProductType.TC_PERSONAL) {

      if(HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)) {
        groupLineCode = "24" //"Homeowners"; (HO3, HO4, HO6)
        if(policyPeriod.HomeownersLine_HOE.BaseState == Jurisdiction.TC_TX) {
          groupLineCode = "23" //"Homeowners - TX"; (HOA, HOB, HCONB)
        }
      }  else if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)){

        if(HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)){
          groupLineCode = "21" //"Dwelling Fire - TX"; (TDP1, TDP2 TDP3)
        } else if (HOPolicyType_HOE.TC_DP3_EXT == policyPeriod.HomeownersLine_HOE.HOPolicyType and policyPeriod.HomeownersLine_HOE.BaseState == Jurisdiction.TC_FL ) {
          groupLineCode = "22" //"Rental Dwelling Fire"; (DP3 florida only)
        } else {
          groupLineCode = "19" //"Dwelling Fire"
        }
      }
    } else { //commercial
      if(policyPeriod.BP7LineExists or policyPeriod.BOPLineExists){
        groupLineCode = "75"
      } else if(policyPeriod.CPLineExists) {
        groupLineCode = "85"
      }
    }
    return groupLineCode
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
                            :HurricaneDollar = "NOCALC",// TODO: Dependent on DE2608

                            : Coverage = new ArrayList<Prop_Coverage>() {
                            },
                            : ItemNotes = new Prop_ItemNotes() { : Note = new ArrayList<ItemNotes_Note>() },
                            : LossHist = new ArrayList<Prop_LossHist>() {
                                //new Prop_LossHist() { : LossAmt = "433", : LossDt = "2017-11-11", : LossType = "CLM", : PaidClaim = "C"}
                            },
                            :Addr = mapAddress(policyPeriod.PolicyAddress.Address, Prop_Addr)

                        }
                    }
            },
        :Loan = new ArrayList<Home_Loan>() { //Leaving this  empty, the Portal team said it is not used - CLM - 08/16/2017
        },
        :Endorsements = new Home_Endorsements() { : Endorsement = new ArrayList<Endorsements_Endorsement>() },
        //TODO: Move to CC
        :Claims = new Home_Claims()
            {
              :Claim = new ArrayList<Claims_Claim>()
                  {
//                      new Claims_Claim()
//                          {
//                             :ClaimNum = "23FEEE5849", :LossDt = "2017-11-11", :LossPd = "300", :ReportedDt = "2017-11-11", :Status = "Closed"
//                          },
//                      new Claims_Claim()
//                          {
//                              :ClaimNum = "23FEEE5840", :LossDt = "2017-11-11", :LossPd = "300", :ReportedDt = "2017-11-11", :Status = "Closed"
//                          }
                  }
            }
    }

    //  Add Notes
    var notes = policyPeriod.Policy.Account.Notes
    notes.each( \ note -> home.Props.Prop.first().ItemNotes.Note.add(new ItemNotes_Note() { : EnteredDt = note.AuthoringDate?.toString(), : Remarks = note.Body, : Title = note.Subject, : UserId = note.Author.DisplayName }))

    var covList = line.CoveragesFromCoverable.where( \ elt -> line.hasCoverageConditionOrExclusion(elt.PatternCode)).toList()
    covList.addAll(dwelling.CoveragesFromCoverable.where( \ elt -> dwelling.hasCoverageConditionOrExclusion(elt.PatternCode)).toList())

    print("Section I")
    covList.where( \ elt -> elt.CoverageCategory.Code.equals("HODW_SectionI_HOE")).each( \ cov -> {
      var costModelList = una.pageprocess.QuoteScreenPCFController.getCostModels(cov)
      costModelList.each( \ costModel ->
        {
          var propCov: Prop_Coverage = null
          print("${costModel.Coverage.PatternCode} :: ${costModel.Coverage.Pattern.Name} :: ${costModel.LimitDisplayValue ?: costModel.LimitValue} :: ${costModel.PremiumDisplayValue}")

          if(costModel.Coverage.PatternCode  ==  "HODW_Dwelling_Cov_HOE" || costModel.Coverage.PatternCode  == "DPDW_Dwelling_Cov_HOE") {
            propCov = new Prop_Coverage() { : CovALimit = costModel.LimitValue, : CovAPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HODW_Other_Structures_HOE" || costModel.Coverage.PatternCode  == "DPDW_Other_Structures_HOE") {
            propCov = new Prop_Coverage() { : CovBLimit = costModel.LimitValue, : CovBPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HODW_Personal_Property_HOE" || costModel.Coverage.PatternCode  == "DPDW_Personal_Property_HOE") {
            propCov = new Prop_Coverage() { : CovCLimit = costModel.LimitValue, : CovCPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HODW_Loss_Of_Use_HOE" || costModel.Coverage.PatternCode  == "DPDW_FairRentalValue_Ext") {
            propCov = new Prop_Coverage() { : CovDLimit = costModel.LimitValue, : CovDPrem = costModel.Premium }

          }
          else if(costModel.Coverage.PatternCode  ==  "HODW_SectionI_Ded_HOE") {
            costModel.Coverage.CovTerms.each( \ term -> {
              print("${term.PatternCode} :: ${term.Pattern.Name} :: ${term.DisplayValue}")
              if(term.PatternCode.equals("HODW_OtherPerils_Ded_HOE")){ //HODW_AllPeril_HOE_Ext
                propCov = new Prop_Coverage() { :AllPerilDeduct = term.ValueAsString }
              } else if(term.PatternCode.equals("HODW_Hurricane_Ded_HOE")) {
                propCov = new Prop_Coverage() { :HurricaneDeduct = term.ValueAsString }
              }
              if(propCov != null) {
                home.Props.Prop.first().Coverage.add(propCov)
              }
               propCov = null
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
          var propCov: Prop_Coverage = null
          print("${costModel.Coverage.PatternCode} :: ${costModel.Coverage.Pattern.Name} :: ${costModel.LimitDisplayValue ?: costModel.LimitValue} :: ${costModel.PremiumDisplayValue}")

          if(costModel.Coverage.PatternCode  ==  "HOLI_Personal_Liability_HOE" || costModel.Coverage.PatternCode  == "DPLI_Personal_Liability_HOE") {
            propCov = new Prop_Coverage() { : CovELimit = costModel.LimitValue, : CovEPrem = costModel.Premium }

          } else if(costModel.Coverage.PatternCode  ==  "HOLI_Med_Pay_HOE" || costModel.Coverage.PatternCode  == "DPLI_Med_Pay_HOE") {
            propCov = new Prop_Coverage() { : CovFLimit = costModel.LimitValue, : CovFPrem = costModel.Premium }

          }
          if(propCov != null) {
            home.Props.Prop.first().Coverage.add(propCov)
          }
        })
    })


    policyPeriod.Forms.each( \ form -> {
      print("${form.Pattern.Code} :: ${form.Pattern.FormDescription} :: ${form.Pattern.ClausePattern} ")

      //var addCosts = una.pageprocess.QuoteScreenPCFController.getAdditionalCoverageCosts(dwelling)
      //addCosts.each( \ elt -> form.Pattern.ClausePattern })

      var endorsement =  new Endorsements_Endorsement()
          {
              : Description = form.FormDescription, : EditionDt = form.Pattern.EditionAsDate, : EndNum = "0", : ItemNum = "0", : Limit = "0", : Premium = "0"
          }

      home.Endorsements.Endorsement.add(endorsement)
    })

    policyPeriod.HomeownersLine_HOE.HOPriorLosses_Ext.each( \ priorLoss -> {

      var lossAmt = priorLoss.ClaimPayment?.sum( \ claimPayment -> claimPayment.ClaimAmount)

      var lossHist = new Prop_LossHist() {
          : LossAmt = lossAmt != null ? lossAmt.toString() : "",
          : LossDt = priorLoss.ClaimDate,
          : LossType = priorLoss.ClaimType.Code.toString(),
          : PaidClaim = priorLoss.ClaimPayment?.countWhere( \ pay -> typekey.Status_Ext.TC_CLOSED.equals(pay.ClaimDisposition_Ext.Code) and pay.ClaimAmount > 0)
      }

      home.Props.Prop.first().LossHist.add(lossHist)
    })


   //home.Endorsements.Endorsement.
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