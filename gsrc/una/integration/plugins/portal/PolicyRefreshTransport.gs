package una.integration.plugins.portal

uses dynamic.Dynamic
uses gw.api.util.TypecodeMapper
uses gw.plugin.InitializablePlugin
uses gw.xml.date.XmlDateTime
uses una.integration.framework.messaging.AbstractMessageTransport
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Agency_Addr
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Agency_PhoneInfo
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Claims_Claim
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Cust_Addr
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Cust_PhoneInfo
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Endorsements_Endorsement
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Home_Claims
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Home_Endorsements
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Home_Loan
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Home_Props
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.ItemNotes_Note
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Policies_PersonalPolicy
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.PolicyDetailRequest_Policy
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.PolicyLoan_Addr
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Policy_Agency
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Policy_Cust
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Policy_Home
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Policy_PolicyLoan
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Prop_Addr
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Prop_Coverage
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Prop_ItemNotes
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Prop_LossHist
uses wsi.remote.una.portalpolicyservice.policyservice.anonymous.elements.Props_Prop
uses wsi.remote.una.portalpolicyservice.policyservice.elements.QuoteAuthenticationHeader
uses wsi.remote.una.portalpolicyservice.policyservice.soapheaders.PersonalPolicy_UPSERTHeaders

uses java.lang.Exception
uses java.lang.Integer
uses java.math.BigDecimal
uses java.util.ArrayList
uses java.util.Map

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 7/11/17
 * Time: 8:33 AM
 * To change this template use File | Settings | File Templates.
 */
@Export
class PolicyRefreshTransport extends AbstractMessageTransport implements InitializablePlugin {

    public static var DEST_ID: int = 31

    public static final var REFRESH_MSG: String = "PolicyRefreshChange"

    private var _userName: String = null

    private var _password: String = null

    override function setParameters(paramMap: Map) {
        _userName = paramMap['username'] as String
        _password = paramMap['password'] as String
    }

    override function send(message: Message, payload: String) {
        var policyPeriod = message.PolicyPeriod

        try {
            if (policyPeriod.Policy.Product.ProductType == ProductType.TC_PERSONAL) {
                sendPersonalPolicyUPSERT(message)
            } else if (policyPeriod.Policy.Product.ProductType == ProductType.TC_COMMERCIAL) {
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
        } catch (e: Exception) {
            _logger.error("PolicyRefresh Integration Error", e)
            message.ErrorDescription = e.Message
            message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
        }
    }

    public  function sendPersonalPolicyUPSERT( message: Message) {
        _logger.debug("Sending personal policy UPSERT request...")
        var policyPeriod = message.PolicyPeriod

        var service = new wsi.remote.una.portalpolicyservice.policyservice.PolicyService()
        var authHeader = getAuthHeader()

        var policies = new wsi.remote.una.portalpolicyservice.policyservice.types.complex.Policies()
        policies.PersonalPolicy = getPersonalPolicyRequest(policyPeriod)
        policies.PolicyEdition = (policyPeriod.TermNumber?:1) - 1 //Policy Edition is 0 based on the portal side
        policies.PremiumAmt = policyPeriod.TotalPremiumRPT
        policies.BalanceTotal = new BigDecimal("0")
        policies.BalanceDue = new BigDecimal("0")
        policies.BalanceDueDate = new XmlDateTime()
        policies.LegacyPolicyNumber = policyPeriod.LegacyPolicyNumber_Ext?: ""
        policies.CallingCenter = "PC"
        //policies.print()

        var response = service.PersonalPolicy_UPSERT(policies, authHeader)
        _logger.debug("Status: ${response.Status} Result: ${response.Result.PolicyNumber} Portal PolicyID:${response.Result.PolicyID} Message:${response.Result.Message}")

        if (response == null) {
            var description = "No response recieved from Portal"
            _logger.error("PolicyRefresh Integration Error", description)
            message.ErrorDescription = description
            message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
        } else if (response.Status == 0) {
            message.reportAck()
        } else {
            _logger.error(response.Error)
            message.ErrorDescription = response.Error
            message.reportError(ErrorCategory.TC_SYSTEM_ERROR)
        }
    }

    public function getAuthHeader(): PersonalPolicy_UPSERTHeaders {
        var authHeader = new PersonalPolicy_UPSERTHeaders()
        authHeader.QuoteAuthenticationHeader = new QuoteAuthenticationHeader()
        authHeader.QuoteAuthenticationHeader.Username = _userName
        authHeader.QuoteAuthenticationHeader.Password = _password
        return authHeader
    }

    public function getPersonalPolicyRequest(policyPeriod: PolicyPeriod): Policies_PersonalPolicy {
        var personalPolicy = new Policies_PersonalPolicy()

        personalPolicy.Policy = new PolicyDetailRequest_Policy(){
            : PolicyNum = policyPeriod.PolicyNumber,
            : Agency = getAgencyDetails(policyPeriod),
            : Cust = getCustomerDetails(policyPeriod),
            : IsGWPolicy = "true",
            : Home = getHome(policyPeriod),
            : PolicyLoan = getAdditionalInterests(policyPeriod)
        }

        return personalPolicy
    }

    public function getAgencyDetails(policyPeriod: PolicyPeriod): Policy_Agency {
        var agency = policyPeriod.ProducerCodeOfRecord.Organization
        var primaryAddress = agency.Contact.PrimaryAddress

        var agencyDetails = new Policy_Agency()
            {
                : AgentNum = policyPeriod.EffectiveDatedFields.ProducerCode.Code,
                : AgentName = agency.Name,
                : Addr = mapAddress(primaryAddress, Agency_Addr, false),
                : Email = agency.Contact.EmailAddress1,
                : SubAgentName = ""
            }

        agencyDetails.PhoneInfo = new ArrayList<Agency_PhoneInfo>()
        if (agency.Contact.WorkPhone != null) {
            agencyDetails.PhoneInfo.add(new Agency_PhoneInfo() { : PhoneNum = agency.Contact.WorkPhone, : PhoneTypeCd = PhoneType.TC_WORK.Code })
        }
        if (agency.Contact.FaxPhone != null) {
            agencyDetails.PhoneInfo.add(new Agency_PhoneInfo() { : PhoneNum = agency.Contact.FaxPhone, : PhoneTypeCd = PhoneType.TC_FAX.Code })
        }

        return agencyDetails
    }

    public function getCustomerDetails(policyPeriod: PolicyPeriod): List<Policy_Cust> {
        var primaryNamedInsured = policyPeriod.PrimaryNamedInsured.ContactDenorm
        var primaryNamedInsuredName = ""

        if (policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact typeis Company) {
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
                        : Addr = mapAddress(primaryAddress, Cust_Addr, false),
                        : Company = policyPeriod.PolicyAddress.State == typekey.State.TC_FL ?
                            "Universal Insurance Company of North America" : "Universal North American Insurance Company",
                        : CompanyCode = policyPeriod.PolicyAddress.State == typekey.State.TC_FL ? "02" : "01",
                        : EffDt = policyPeriod.PeriodStart.XmlDateTime.toString(),
                        : Email = primaryNamedInsured.EmailAddress1,
                        : ExpDt = policyPeriod.PeriodEnd.XmlDateTime,
                        : GroupLine = policyPeriod.Policy.Product.Name,
                        : GroupLineCode = getGroupLineCode(policyPeriod),
                        : Name = primaryNamedInsuredName,
                        : Name2 = additionalNamedInsuredContacts?.first()?.DisplayName,
                        : NextBillAct = "P",
                        : NextBillActDt = "08/30/2017",
                        : PhoneInfo = new ArrayList<Cust_PhoneInfo>(),
                        : RatingState = policyPeriod.PolicyAddress.State?.Description,
                        : RatingStateCode = policyPeriod.PolicyAddress.State?.Code,
                        : Status = policyPeriod.UNAPortalPeriodDisplayStatus,
                        : Term = ((policyPeriod.TermNumber?:1) - 1).toString()
                    }
            }

        if (primaryNamedInsured.HomePhone != null) {
            customerList.first().PhoneInfo.add(new Cust_PhoneInfo() { : PhoneNum = primaryNamedInsured.HomePhone, : PhoneTypeCd = PhoneType.TC_WORK.Code  })
        }
        if (primaryNamedInsured.WorkPhone != null) {
            customerList.first().PhoneInfo.add(new Cust_PhoneInfo() { : PhoneNum = primaryNamedInsured.WorkPhone, : PhoneTypeCd = PhoneType.TC_WORK.Code  })
        }
        if (primaryNamedInsured.FaxPhone != null) {
            customerList.first().PhoneInfo.add(new Cust_PhoneInfo() { : PhoneNum = primaryNamedInsured.FaxPhone, : PhoneTypeCd = PhoneType.TC_FAX.Code  })
        }

        return customerList
    }

    public function getGroupLineCode(policyPeriod: PolicyPeriod): String {
        var groupLineCode = ""
        if (policyPeriod.Policy.Product.ProductType == ProductType.TC_PERSONAL) {

            if (HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)) {
                groupLineCode = "24"
                //"Homeowners"; (HO3, HO4, HO6)
                if (policyPeriod.HomeownersLine_HOE.BaseState == Jurisdiction.TC_TX) {
                    groupLineCode = "23"
                    //"Homeowners - TX"; (HOA, HOB, HCONB)
                }
            } else if (HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)){

                if (HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(policyPeriod.HomeownersLine_HOE.HOPolicyType)) {
                    groupLineCode = "21"
                    //"Dwelling Fire - TX"; (TDP1, TDP2 TDP3)
                } else if (HOPolicyType_HOE.TC_DP3_EXT == policyPeriod.HomeownersLine_HOE.HOPolicyType and policyPeriod.HomeownersLine_HOE.BaseState == Jurisdiction.TC_FL) {
                    groupLineCode = "22"
                    //"Rental Dwelling Fire"; (DP3 florida only)
                } else {
                    groupLineCode = "19"
                    //"Dwelling Fire"
                }
            }
        } else {
            //commercial
            if (policyPeriod.BP7LineExists or policyPeriod.BOPLineExists) {
                groupLineCode = "75"
            } else if (policyPeriod.CPLineExists) {
                groupLineCode = "85"
            }
        }
        return groupLineCode
    }

    public function getAdditionalInterests(policyPeriod: PolicyPeriod): ArrayList<Policy_PolicyLoan> {
        var mortgagees = policyPeriod.DwellingAdditionalInterests.where(\ai -> typekey.AdditionalInterestType.TF_MORTGAGEE_EXT.TypeKeys.contains(ai.AdditionalInterestType))
        var loans = new ArrayList<Policy_PolicyLoan>()

        mortgagees.each(\loan -> {
            loans.add(new Policy_PolicyLoan()
                {
                    : LoanName = loan.PolicyAddlInterest.DisplayName, : LoanNum = loan.ContractNumber, : LoanType = loan.AdditionalInterestType.Description,
                    : Addr = mapAddress(loan.PolicyAddlInterest.ContactDenorm.PrimaryAddress, PolicyLoan_Addr, false)
                }
            )
        })

        var additionalInsuredContacts = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlInsured)

        additionalInsuredContacts.each(\contact -> {
            loans.add(new Policy_PolicyLoan()
                {
                    : LoanName = contact typeis Company ? contact.DisplayName : contact.FirstName + " " + contact.LastName,
                    : LoanType = contact.PolicyAdditionalInsuredDetails.AdditionalInsuredType?.first().DisplayName,
                    : Addr = mapAddress(contact.ContactDenorm.PrimaryAddress, PolicyLoan_Addr, false)
                }
            )
        })

        var additionalNamedInsuredContacts = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)

        additionalNamedInsuredContacts.each(\contact -> {
            loans.add(new Policy_PolicyLoan()
                {
                    : LoanName = contact.ContactDenorm typeis Company ? contact.DisplayName : contact.FirstName + " " + contact.LastName,
                    : LoanType = contact.ContactRelationship_Ext.Description,
                    : Addr = mapAddress(contact.ContactDenorm.PrimaryAddress, PolicyLoan_Addr, false)
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

        var coveragesList = line.CoveragesFromCoverable.where(\elt -> line.hasCoverageConditionOrExclusion(elt.PatternCode)).toList()
        coveragesList.addAll(dwelling.CoveragesFromCoverable.where(\elt -> dwelling.hasCoverageConditionOrExclusion(elt.PatternCode)).toList())

        var home = new Policy_Home(){
            : Props = new Home_Props()
                {
                    : Prop = new ArrayList<Props_Prop>()
                        {
                            new Props_Prop(){
                                : ConstructType = dwelling.ConstructionType?.DisplayName,
                                : Form = mapPolicyTypeToForm(line.HOPolicyType),
                                : FtToHydrant = dwelling.HOLocation.DistanceToFireHydrant?.toString(),
                                : HeatYr = dwelling.HeatingUpgradeDate?.toString(),
                                //:LossFree = "4",// NOT USED
                                : MilesToFireDept = dwelling.HOLocation.DistanceToFireStation?.toString(),
                                //:NumApts = "0",//NOT USED
                                //:NumFamilies =  1,// NOT USED
                                //:NumRooms = "0", //NOT USED
                                : NumStories = getAliasByTypeCode(typeCodeMapper, typekey.NumberOfStories_HOE, mappingNamespace, dwelling.NumberStoriesOrOverride),
                                : NumUnits = convertUnitsNumber(dwelling.UnitsNumber),
                                : Occupancy = dwelling.Occupancy?.DisplayName,
                                : PlumbingYr = dwelling.PlumbingUpgradeDate?.toString(),
                                : ProtectClass = dwelling.HOLocation.protectionClassOrOverride?.toString(),
                                //:RatePlan = "S",// NOT USED
                                : ReplaceCost = dwelling.CoverageAEstRepCostValue_Ext,
                                : RoofType = dwelling.RoofTypeOrOverride?.Code,
                                : RoofYr = dwelling.RoofingUpgradeDate?.toString(),
                                : Territory = dwelling.HOLocation.territoryCodeOrOverride?.toString(),
                                : TotalSqFt = dwelling.SquareFootageOrOverride,
                                : UnitNum = "1", // TODO: Need mapping
                                : UserLineCode = getGroupLineCode(policyPeriod),
                                : WiringYr = dwelling.ElectricalSystemUpgradeDate?.toString(),
                                : YrBuilt = dwelling.YearBuiltOrOverride?.toString(),
                                : NSDed = "",
                                : NSDollar = "",
                                : EQDed = "",
                                : EQDollar = "",
                                : WHDollar = "",
                                : HurricaneDollar = "989898900", // TODO: Dependent on DE2608
                                : Coverage = getCoverages(coveragesList, dwelling),
                                : ItemNotes = getNotes(policyPeriod),
                                : LossHist = new ArrayList<Prop_LossHist>() {},
                                : Addr = mapAddress(policyPeriod.PolicyAddress.Address, Prop_Addr, true)
                            }
                        }
                },
            : Loan = new ArrayList<Home_Loan>() {}, //Leaving this  empty, the Portal team said it is not used - CLM - 08/16/2017
            : Endorsements = getEndorsements(policyPeriod, coveragesList)
        }

        //Add NamedStorm deductible
        if (dwelling.HODW_SectionI_Ded_HOE.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
            //if gt 0 and LT 1, multiple by COVA for $AMOUNT else is Dollar amt per shane
            home.Props.Prop.first().NSDed = dwelling.HODW_SectionI_Ded_HOE.HODW_NamedStrom_Ded_HOE_ExtTerm.ValueAsString
            home.Props.Prop.first().NSDollar = "999999" //term.ValueAsString
        }

        //Add Wind/Hail deductible
        if (dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm){
            home.Props.Prop.first().WHDollar = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.ValueAsString
        }

        // Get EQ Deductible
        var eqDed = coveragesList.where(\elt -> elt.CoverageCategory.Code.equals("HODW_Optional_HOE"))?.where(\cov -> cov.PatternCode.equals("HODW_Earthquake_HOE"))?.CovTerms
            ?.where(\term -> term.PatternCode.equals("HODW_EarthquakeDed_HOE"))

        eqDed?.each(\ded -> {
            home.Props.Prop.first().EQDed = ded.ValueAsString
            home.Props.Prop.first().EQDollar = "999999"
        })

        return home
    }

    private function getCoverages(coverages: List<Coverage>, dwelling: Dwelling_HOE) : ArrayList<Prop_Coverage> {
        var propCoverages = new ArrayList<Prop_Coverage>() {}

        coverages.where(\elt -> elt.CoverageCategory.Code.equals("HODW_SectionI_HOE")).each(\cov -> {
            var costModelList = una.pageprocess.QuoteScreenPCFController.getCostModels(cov)
            costModelList.each(\costModel ->
            {
                var propCov: Prop_Coverage = null
                if (costModel.Coverage.PatternCode == "HODW_Dwelling_Cov_HOE" || costModel.Coverage.PatternCode == "DPDW_Dwelling_Cov_HOE") {
                    propCov = new Prop_Coverage() { : CovALimit = costModel.LimitValue?.intValue(), : CovAPrem = costModel.Premium }
                } else if (costModel.Coverage.PatternCode == "HODW_Other_Structures_HOE" || costModel.Coverage.PatternCode == "DPDW_Other_Structures_HOE") {
                    propCov = new Prop_Coverage() { : CovBLimit = costModel.LimitValue?.intValue(), : CovBPrem = costModel.Premium }
                } else if (costModel.Coverage.PatternCode == "HODW_Personal_Property_HOE" || costModel.Coverage.PatternCode == "DPDW_Personal_Property_HOE") {
                    propCov = new Prop_Coverage() { : CovCLimit = costModel.LimitValue?.intValue(), : CovCPrem = costModel.Premium }
                } else if (costModel.Coverage.PatternCode == "HODW_Loss_Of_Use_HOE" || costModel.Coverage.PatternCode == "DPDW_FairRentalValue_Ext") {
                    propCov = new Prop_Coverage() { : CovDLimit = costModel.LimitValue?.intValue(), : CovDPrem = costModel.Premium }
                }
                if (propCov != null) {
                    propCoverages.add(propCov)
                }
            })
        })

        //Add Hurricane Deductible
        if (dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm) {
            propCoverages.add(new Prop_Coverage() { : HurricaneDeduct = dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.ValueAsString })
        }
        //Add AllPerils/AOP deductible
        if (dwelling.HODW_SectionI_Ded_HOE.HasHODW_OtherPerils_Ded_HOETerm or dwelling.HODW_SectionI_Ded_HOE.HasHODW_AllPeril_HOE_ExtTerm){
           propCoverages.add(new Prop_Coverage() { : AllPerilDeduct = dwelling.AllPerilsOrAllOtherPerilsCovTerm.ValueAsString })
        }

        // Section II Coverages
        coverages.where(\elt -> elt.CoverageCategory.Code.equals("HODW_SectionII_HOE")).each(\cov -> {
            var costModelList = una.pageprocess.QuoteScreenPCFController.getCostModels(cov)
            costModelList.each(\costModel -> {
                var propCov: Prop_Coverage = null

                if (costModel.Coverage.PatternCode == "HOLI_Personal_Liability_HOE" || costModel.Coverage.PatternCode == "DPLI_Personal_Liability_HOE") {
                    propCov = new Prop_Coverage() { : CovELimit = costModel.LimitValue?.intValue(), : CovEPrem = costModel.Premium?.toString() }
                } else if (costModel.Coverage.PatternCode == "HOLI_Med_Pay_HOE" || costModel.Coverage.PatternCode == "DPLI_Med_Pay_HOE") {
                    propCov = new Prop_Coverage() { : CovFLimit = costModel.LimitValue?.intValue(), : CovFPrem = costModel.Premium?.toString() }
                }
                if (propCov != null) {
                   propCoverages.add(propCov)
                }
            })
        })

        return propCoverages
    }

    private function getEndorsements(policyPeriod: PolicyPeriod, coverages: List<Coverage>): Home_Endorsements {

        var endorsements = new Home_Endorsements() { : Endorsement = new ArrayList<Endorsements_Endorsement>() }

        policyPeriod.Forms.each(\form -> {
            var limit = "0"
            var premium = "0"
            form.FormAssociations.first()
            var clausePatternId = form.Pattern.ClausePattern?.CodeIdentifier
            if (clausePatternId != null) {
                var costModel = coverages.where(\elt -> elt.Pattern.CodeIdentifier == clausePatternId).map(\elt -> una.pageprocess.QuoteScreenPCFController.getCostModels(elt)).first()?.first()
                if (costModel != null) {
                    limit = costModel.LimitValue?.intValue()
                    premium = costModel.Premium
                }
            }

            endorsements.Endorsement.add( new Endorsements_Endorsement()
                {
                    : Description = form.FormDescription,
                    : EditionDt = form.Pattern.Edition.replaceAll(" ", ""),
                    : EndNum = form.FormNumber,
                    : ItemNum = "0",
                    : Limit = limit,
                    : Premium = premium
                })
        })

        return endorsements
    }

    private function getNotes(policyPeriod: PolicyPeriod): Prop_ItemNotes {

        var noteList = new Prop_ItemNotes() { : Note = new ArrayList<ItemNotes_Note>() }

        var notes = policyPeriod.Policy.Account.Notes
        notes.each(\note -> noteList.Note.add(new ItemNotes_Note() { : EnteredDt = note.AuthoringDate.XmlDateTime.toString(), : Remarks = note.Body, : Title = note.Subject, : UserId = note.Author.DisplayName }))

        return noteList
    }

    private function getLossHistory(policyPeriod: PolicyPeriod):  ArrayList<Prop_LossHist> {
        var lossHistory = new ArrayList<Prop_LossHist>()

        policyPeriod.HomeownersLine_HOE.HOPriorLosses_Ext.each(\priorLoss -> {

            lossHistory.add(new Prop_LossHist() {
                : LossAmt = priorLoss.ClaimPayment?.sum(\claimPayment -> claimPayment.ClaimAmount),
                : LossDt = priorLoss.ClaimDate?.toString(),
                : LossType = priorLoss.ClaimType.Code.toString(),
                : PaidClaim = (priorLoss.ClaimPayment?.hasMatch(\pay -> pay.ClaimAmount > 0) and priorLoss.PaymentDate != null)
            })
        })

        return lossHistory
    }

    private function getAliasByTypeCode(mapper: TypecodeMapper, typeList: String, namespace: String, code: String): String {
        var aliases = mapper.getAliasesByInternalCode(typeList, namespace, code)
        return aliases.Count != 0 ? aliases[0] : null
    }

    private function mapPolicyTypeToForm(policyType: HOPolicyType_HOE): String {
        var form = ""

        switch (policyType) {
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
    private function mapAddress(address: Address, clazz: Type, isRiskAddress: boolean): Dynamic {
        var addrToMap: Dynamic = clazz.TypeInfo.getConstructor({}).Constructor.newInstance({})
        addrToMap.Addr1 = address.AddressLine1
        addrToMap.Addr2 = address.AddressLine2
        addrToMap.UnitNo = address.AddressLine3
        addrToMap.City = address.City
        addrToMap.County = address.County
        addrToMap.Country = address.Country.Description
        addrToMap.State = address.State.Description
        addrToMap.Zip = address.PostalCode
        addrToMap.AddrTypeCd = isRiskAddress ? "PropertyAddress" : "MailingAddress"
        return addrToMap
    }

    private function convertUnitsNumber(unitsNum: typekey.NumUnits_HOE): Integer {
        var convertedUnitsNum: Integer

        switch (unitsNum) {
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