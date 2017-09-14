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
uses java.math.BigDecimal
uses java.lang.Integer
uses gw.api.util.TypecodeMapper
uses java.util.Date
uses edge.util.helper.UserUtil

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 7/11/17
 * Time: 8:33 AM
 * To change this template use File | Settings | File Templates.
 */
@Export
class PolicyRefreshTransport extends AbstractMessageTransport implements InitializablePlugin {

  public static var DEST_ID : int = 31

    public static final var REFRESH_MSG : String = "PolicyRefreshChange"
    public static final var FUTURE_REFRESH_MSG : String = "PolicyRefreshFutureDatedChange"


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
        sendPersonalPolicyUPSERT(message)
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
    } catch(e: Exception) {
      _logger.error("PolicyRefresh Integration Error", e)
      message.ErrorDescription = e.Message
      message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
    }

  }

  public  function sendPersonalPolicyUPSERT(message: Message) { //policyPeriod: PolicyPeriod) { //

    var policyPeriod = message.PolicyPeriod

    var service = new wsi.remote.una.portalpolicyservice.policyservice.PolicyService()
    var authHeader = getAuthHeader()

    var policies = new wsi.remote.una.portalpolicyservice.policyservice.types.complex.Policies()
    policies.PersonalPolicy = getPersonalPolicyRequest(policyPeriod)
    policies.PolicyEdition = (policyPeriod.TermNumber?:1) - 1//Policy Edition is 0 based on the portal side
    policies.PremiumAmt = policyPeriod.TotalPremiumRPT
    policies.BalanceTotal = new BigDecimal("0")
    policies.BalanceDue = new BigDecimal("0")
    policies.BalanceDueDate = new XmlDateTime()

    policies.CallingCenter = "PC"

    policies.print()

    var response = service.PersonalPolicy_UPSERT(policies, authHeader)
    _logger.debug("Response: {}", response)
    print("Status: "  + response.Status + "\nResult: " + response.Result.PolicyNumber + "\nPolicyID:${response.Result.PolicyID}\nMessage:${response.Result.Message}")

    if(response == null) {
      var description = "No response recieved from Portal"
      _logger.error("PolicyRefresh Integration Error", description)
      message.ErrorDescription = description
      message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
    } else if(response.Status == 0) {
      _logger.debug(response.Result)
        message.reportAck()
    } else {
      _logger.error(response.Error)
      message.ErrorDescription = response.Error
      message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
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
        :IsGWPolicy = true,
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
    var primaryNamedInsuredName = ""
      if(policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact typeis Company)  {
         primaryNamedInsuredName = policyPeriod.PrimaryNamedInsured.DisplayName
      } else {
          primaryNamedInsuredName = policyPeriod.PrimaryNamedInsured.FirstName + " " + policyPeriod.PrimaryNamedInsured.LastName
      }

      var primaryAddress = primaryNamedInsured.PrimaryAddress

    var additionalNamedInsuredContacts = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)

    var customerList = new ArrayList<Policy_Cust>()
        {
            new Policy_Cust()
                {
                    :Addr = mapAddress(primaryAddress, Cust_Addr),
                    //:CompanionAcctDisc = new BigDecimal("0"),//remove
                    :Company = primaryNamedInsured.ContactCompany.Name,
                    :EffDt = policyPeriod.PeriodStart.XmlDateTime.toString(),
                    :Email = primaryNamedInsured.EmailAddress1,
                    :ExpDt = policyPeriod.PeriodEnd.XmlDateTime,
                    :GroupLine = policyPeriod.Policy.Product.Name,
                    :GroupLineCode = getGroupLineCode(policyPeriod),
                    :Name = primaryNamedInsuredName,
                    :Name2 = additionalNamedInsuredContacts?.first()?.DisplayName,
                    :NextBillAct = "P",
                    :NextBillActDt = "08/30/2017",
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

  public function getGroupLineCode(policyPeriod: PolicyPeriod): Integer {
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
              :LoanName = loan.PolicyAddlInterest.DisplayName, :LoanNum = loan.ContractNumber, :LoanType = loan.AdditionalInterestType.Description,
              :Addr = mapAddress(loan.PolicyAddlInterest.ContactDenorm.PrimaryAddress, PolicyLoan_Addr)
            }
        )
    })
    return loans
  }

  public function getHome(policyPeriod: PolicyPeriod): Policy_Home {
    var line = policyPeriod.HomeownersLine_HOE
    var dwelling = line.Dwelling

    var typeCodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var mappingNamespace = "tuna"

    var home = new Policy_Home(){
        : Props = new Home_Props()
            {
                : Prop = new ArrayList<Props_Prop>()
                    {
                        new Props_Prop(){
                            :ConstructType = dwelling.ConstructionType?.DisplayName,
                            :Form = mapPolicyTypeToForm(line.HOPolicyType),
                            :FtToHydrant = dwelling.HOLocation.DistanceToFireHydrant?.toString(),
                            :HeatYr = dwelling.HeatingUpgradeDate?.toString(),
                            //:LossFree = "4",// NOT USED
                            :MilesToFireDept = dwelling.HOLocation.DistanceToFireStation?.toString(),
                            //:NumApts = "0",//NOT USED
                            //:NumFamilies =  1,// NOT USED
                            //:NumRooms = "0", //NOT USED
                            :NumStories = getAliasByTypeCode(typeCodeMapper, typekey.NumberOfStories_HOE, mappingNamespace, dwelling.NumberStoriesOrOverride),//2,//dwelling.NumberStoriesOrOverride?.DisplayName,
                            :NumUnits = convertUnitsNumber(dwelling.UnitsNumber),
                            :Occupancy = dwelling.Occupancy?.DisplayName,
                            :PlumbingYr = dwelling.PlumbingUpgradeDate?.toString(),
                            :ProtectClass = dwelling.HOLocation.protectionClassOrOverride?.toString(),
                            //:RatePlan = "S",// NOT USED
                            :ReplaceCost = dwelling.CoverageAEstRepCostValue_Ext,
                            :RoofType = dwelling.RoofTypeOrOverride?.Code,
                            :RoofYr = dwelling.RoofingUpgradeDate?.toString(),
                            :Territory = dwelling.HOLocation.territoryCodeOrOverride?.toString(),
                            :TotalSqFt = dwelling.SquareFootageOrOverride,
                            :UnitNum = "1",// TODO: Need mapping
                            :UserLineCode = getGroupLineCode(policyPeriod),
                            :WiringYr = dwelling.ElectricalSystemUpgradeDate?.toString(),
                            :YrBuilt = dwelling.YearBuiltOrOverride?.toString(),
                            :NSDed = "",
                            :NSDollar = "",
                            :EQDed = "",
                            :EQDollar = "",
                            :WHDollar = "",
                            :HurricaneDollar = "98989890000",// TODO: Dependent on DE2608

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
    notes.each( \ note -> home.Props.Prop.first().ItemNotes.Note.add(new ItemNotes_Note() { : EnteredDt = note.AuthoringDate.XmlDateTime.toString(), : Remarks = note.Body, : Title = note.Subject, : UserId = note.Author.DisplayName }))

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
          if(propCov != null) {
            home.Props.Prop.first().Coverage.add(propCov)
          }
        })
    })

      //Add Hurricane Deductible
      if(dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm) {
        home.Props.Prop.first().Coverage.add(new Prop_Coverage() { :HurricaneDeduct = dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.ValueAsString })
      }
      //Add AllPerils/AOP deductible
      if(dwelling.HODW_SectionI_Ded_HOE.HasHODW_OtherPerils_Ded_HOETerm or dwelling.HODW_SectionI_Ded_HOE.HasHODW_AllPeril_HOE_ExtTerm){
        home.Props.Prop.first().Coverage.add(new Prop_Coverage() { :AllPerilDeduct = dwelling.AllPerilsOrAllOtherPerilsCovTerm.ValueAsString })
      }

      //Add NamedStorm deductible
      if(dwelling.HODW_SectionI_Ded_HOE.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
          //if gt 0 and LT 1 multiple by COVA for $AMOUNT else is DOllar amt
          home.Props.Prop.first().NSDed = dwelling.HODW_SectionI_Ded_HOE.HODW_NamedStrom_Ded_HOE_ExtTerm.ValueAsString
          home.Props.Prop.first().NSDollar = "999999"//term.ValueAsString
      }

      //Add Wind/Hail deductible
      if(dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm){
          home.Props.Prop.first().WHDollar = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.ValueAsString
      }

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

    var slksd = dwelling.OtherStructuresLimitCovTerm
      // Get EQ Deductible


      var eqDed = covList.where( \ elt -> elt.CoverageCategory.Code.equals("HODW_Optional_HOE"))?.where( \ cov -> cov.PatternCode.equals("HODW_Earthquake_HOE"))?.CovTerms
          ?.where(\ term -> term.PatternCode.equals("HODW_EarthquakeDed_HOE"))

      eqDed?.each(\ ded -> {
          home.Props.Prop.first().EQDed = ded.ValueAsString
          home.Props.Prop.first().EQDollar = "999999"
      })



    policyPeriod.Forms.each( \ form -> {
      print("${form.Pattern.Code} :: ${form.Pattern.FormDescription} :: ${form.Pattern.ClausePattern} ")

       var clausePatternId = form.Pattern.ClausePattern?.CodeIdentifier
       if(clausePatternId != null) {
          // var cov = covList.where( \ elt -> elt.Pattern.CodeIdentifier == clausePatternId).map( \ elt -> elt. )
       }

      //var addCosts = una.pageprocess.QuoteScreenPCFController.getAdditionalCoverageCosts(dwelling)
      //addCosts.each( \ elt -> form.Pattern.ClausePattern })

      var endorsement =  new Endorsements_Endorsement()
          {
              : Description = form.FormDescription, : EditionDt = form.Pattern.Edition.replaceAll(" ", ""), : EndNum = form.FormNumber, : ItemNum = "0", : Limit = "0", : Premium = "0"
          }

      home.Endorsements.Endorsement.add(endorsement)
    })

    policyPeriod.HomeownersLine_HOE.HOPriorLosses_Ext.each( \ priorLoss -> {


      var lossAmt = priorLoss.ClaimPayment?.sum( \ claimPayment -> claimPayment.ClaimAmount)

      var lossHist = new Prop_LossHist() {
          : LossAmt = lossAmt,
          : LossDt = priorLoss.ClaimDate?.toString(),
          : LossType = priorLoss.ClaimType.Code.toString(),
          : PaidClaim = (priorLoss.ClaimPayment?.hasMatch( \ pay -> pay.ClaimAmount > 0) and priorLoss.PaymentDate != null)
      }

      home.Props.Prop.first().LossHist.add(lossHist)
    })

    return home
  }

  private function getAliasByTypeCode(mapper: TypecodeMapper, typeList : String, namespace : String, code : String) : String {
    var aliases = mapper.getAliasesByInternalCode(typeList, namespace, code)
    return aliases.Count != 0 ? aliases[0] : null
  }


  private function mapPolicyTypeToForm(policyType: HOPolicyType_HOE): String {
    var form = ""

    switch(policyType) {
        case TC_HO3:
        case TC_DP3_Ext:
        case TC_TDP3_Ext:
        case TC_LPP_Ext:
          form = "3"
          break
        case TC_HO4:
          form = "4"
          break
        case TC_HO6:
          form = "6"
          break
        case TC_HOA_Ext:
            form = "A"
            break
        case TC_HOB_Ext:
            form = "H"
            break
        case TC_HCONB_Ext:
            form = "C"
            break
        case TC_TDP1_Ext:
            form = "H"
            break
        case TC_TDP2_Ext:
            form = "2"
            break
    }

    return form
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

  private function convertUnitsNumber(unitsNum: typekey.NumUnits_HOE): Integer {
    var convertedUnitsNum: Integer

    switch(unitsNum) {
      case NumUnits_HOE.TC_ONE:
        convertedUnitsNum = 1
        break
      case NumUnits_HOE.TC_TWO:
          convertedUnitsNum = 2
          break
      case NumUnits_HOE.TC_THREE:
          convertedUnitsNum = 3
          break
      case NumUnits_HOE.TC_FOUR:
          convertedUnitsNum = 4
          break
      case NumUnits_HOE.TC_FIVETOFIFTEEN:
          convertedUnitsNum = 5
          break
      case NumUnits_HOE.TC_SIXTEEENTOTWENTYFIVE:
          convertedUnitsNum = 16
          break
      case NumUnits_HOE.TC_TWENTYSIXPLUS:
          convertedUnitsNum = 26
          break
      default:
          convertedUnitsNum = 0
          break
    }

    return convertedUnitsNum
  }

  public static function addFutureChange(policyPeriod: PolicyPeriod) {
      var futureChange = new PolicyRefreshFutureChange()
      futureChange.JobNumber = policyPeriod.Job.JobNumber
      futureChange.EffectiveDate = policyPeriod.EditEffectiveDate
      _logger.debug("Creating a new future dated record for ${futureChange.JobNumber} on ${futureChange.EffectiveDate}")
  }

}