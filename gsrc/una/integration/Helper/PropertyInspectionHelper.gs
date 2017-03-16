package una.integration.Helper

uses gw.api.database.Query
uses una.logging.UnaLoggerCategory
uses una.model.PropertyInspectionData
uses una.integration.mapping.FileIntegrationMapping
uses java.text.SimpleDateFormat
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses gw.api.util.DateUtil
uses java.lang.Integer
uses java.util.Date
uses java.util.HashMap
uses java.math.BigDecimal

/**
 * This is the helper class for property inspections which will insert the data into integration database
 * Created by : AChandrashekar on Date: 09/30/16
 */
class PropertyInspectionHelper {
  final static  var LOGGER = UnaLoggerCategory.INTEGRATION
  final static var YES = "Yes"
  final static var NO = "No"
  final static var NEW_BUSINESS = "New Submission"
  var CLASS_NAME=PropertyInspectionHelper.Type.DeclarationsCompiled

  /**
   * Inserts the data into Integration DB
   * @param policyNumber policy Number
   * @param reportData map which contains the data related to Property Inspections
   */
  function insertToIntegrationDB(policyNumber: String, reportData: HashMap<String, String>) {
    LOGGER.debug("Entering inserttoIntegrationDB() method of : "+CLASS_NAME)
    var policyPeriod:PolicyPeriod=null;
    var account:Account=null;
    var sdf = new SimpleDateFormat("yyyyMMdd")
    var currentDateYear = DateUtil.currentDate().YearOfDate
    var windORHailLosses = {"wind", "hail"}

    if(policyNumber != null && policyNumber.HasContent) {
      policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().last()
    }

    if(policyPeriod!=null){
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      var  propertyInspectionData= new PropertyInspectionData()
      var priorPolicies=policyPeriod.Policy.PriorPolicies
      var yearBuilt = "" as Integer
      propertyInspectionData.Retrieve_Date= "" as Date
      propertyInspectionData.A00_Pnum=policyPeriod.PolicyNumber
      propertyInspectionData.A06_Edition=policyPeriod.PolicyTerm.DisplayName

      propertyInspectionData.State=policyPeriod.PrimaryLocation.State.Code
      propertyInspectionData.County=policyPeriod.PrimaryLocation.County
      propertyInspectionData.LOB=policyPeriod.Lines*.DisplayName.first()
      propertyInspectionData.PropTransaction= NEW_BUSINESS

      propertyInspectionData.AgentCode=policyPeriod.ProducerOfRecord.AgenyNumber_Ext
      propertyInspectionData.AgentName=policyPeriod.ProducerOfRecord.Name
      propertyInspectionData.AgentPhone=policyPeriod.ProducerOfRecord.Contact.PrimaryPhoneValue
      propertyInspectionData.AgentFax=policyPeriod.ProducerOfRecord.Contact.FaxPhone

      propertyInspectionData.InsuredName=policyPeriod.PrimaryInsuredName
      propertyInspectionData.InsuredPhoneNumber=policyPeriod.NamedInsureds.first().ContactDenorm.PrimaryPhoneValue

      propertyInspectionData.MailingStreet=policyPeriod.PrimaryLocation.AddressLine1
      propertyInspectionData.MailingLine2=policyPeriod.PrimaryLocation.AddressLine2
      propertyInspectionData.MailingCity=policyPeriod.PrimaryLocation.City
      propertyInspectionData.MailingState=policyPeriod.PrimaryLocation.State.Code
      propertyInspectionData.MailingZip=policyPeriod.PrimaryLocation.PostalCode

      var dwelling_hoe = policyPeriod.HomeownersLine_HOE.Dwelling
      propertyInspectionData.LocationStreet= dwelling_hoe.HOLocation.PolicyLocation.AddressLine1
      propertyInspectionData.LocationLine2= dwelling_hoe.HOLocation.PolicyLocation.AddressLine2
      propertyInspectionData.LocationCity= dwelling_hoe.HOLocation.PolicyLocation.City
      propertyInspectionData.LocationState= dwelling_hoe.HOLocation.PolicyLocation.State.Code
      propertyInspectionData.LocationZip= dwelling_hoe.HOLocation.PolicyLocation.PostalCode
      propertyInspectionData.LocationCounty= dwelling_hoe.HOLocation.PolicyLocation.County

      propertyInspectionData.PriorCarrier=priorPolicies.sortByDescending(\elt->elt.CarrierType).first().CarrierType.DisplayName
      propertyInspectionData.EffDate=policyPeriod.PolicyStartDate
      propertyInspectionData.PriorExp=priorPolicies.sortByDescending(\ elt -> elt.ExpirationDate).first().ExpirationDate
      propertyInspectionData.CreditScore=policyPeriod.CreditInfoExt.CreditReport.CreditScore

      //Need to Check on this
      var priorLosses = Query.make(HOPriorLoss_Ext).compare(HOPriorLoss_Ext#HomeownersLineID, Equals ,policyPeriod.PublicID).select().toList()
      propertyInspectionData.ChargableLoss= (priorLosses?.countWhere( \ cp -> cp.ClaimPayment.hasMatch( \ elt1 -> elt1.Chargeable=="Yes"))) as String
      propertyInspectionData.AnyLoss= (policyPeriod.LocationRisks?.Count) as String

      var windOrHailLossCount = 0
      priorLosses.each( \ priorLoss ->{
        priorLoss.ClaimPayment.each( \ cp -> {
          if(windORHailLosses.contains(cp.LossCause_Ext.Code)){
             windOrHailLossCount += 1
          }
        })
      } )
      propertyInspectionData.WindHailLoss = windOrHailLossCount as String
      propertyInspectionData.Form=policyPeriod.Lines*.DisplayName?.first()

      if(dwelling_hoe.OverrideYearbuilt_Ext){
        propertyInspectionData.HomeAge=currentDateYear- dwelling_hoe.YearBuiltOverridden_Ext
      } else{
        propertyInspectionData.HomeAge=currentDateYear- dwelling_hoe.YearBuilt
      }

      // Year Built ::
      if(dwelling_hoe.OverrideYearbuilt_Ext){
        propertyInspectionData.YearBuilt= dwelling_hoe.YearBuiltOverridden_Ext
        yearBuilt= dwelling_hoe.YearBuiltOverridden_Ext
      } else{
        propertyInspectionData.YearBuilt= dwelling_hoe.YearBuilt
        yearBuilt= dwelling_hoe.YearBuilt
      }


      if((currentDateYear - yearBuilt)>20 ) {
        if(dwelling_hoe.RoofingUpgrade){
         propertyInspectionData.RoofAge= dwelling_hoe.RoofingUpgradeDate
        }
        else{
          propertyInspectionData.RoofAge=yearBuilt
        }
      } else{
        propertyInspectionData.RoofAge=yearBuilt
      }

      if(dwelling_hoe.OverrideRoofType_Ext) {
        propertyInspectionData.RoofType = dwelling_hoe.RoofingMaterialOverridden_Ext.Code
        propertyInspectionData.RoofTypeDesc= dwelling_hoe.RoofingMaterialOverridden_Ext.Description
      } else{
        propertyInspectionData.RoofType = dwelling_hoe.RoofType.Code
        propertyInspectionData.RoofTypeDesc= dwelling_hoe.RoofType.Description
      }

      // Construction ::
      if(dwelling_hoe.OverrideConstructionType_Ext){
        propertyInspectionData.Construction= dwelling_hoe.ConstTypeOverridden_Ext.Code
        propertyInspectionData.ConstructionDesc= dwelling_hoe.ConstTypeOverridden_Ext.Description
      } else{
        propertyInspectionData.Construction= dwelling_hoe.ConstructionType.Code
        propertyInspectionData.ConstructionDesc= dwelling_hoe.ConstructionType.Description
      }

      // PPC  ::
      if(dwelling_hoe.HOLocation.OverrideDwellingPCCode_Ext){
        propertyInspectionData.PPC= dwelling_hoe.HOLocation.DwellingPCCodeOverridden_Ext.Code
      } else{
        propertyInspectionData.PPC= dwelling_hoe.HOLocation.DwellingProtectionClasscode
      }

      // Square Feet
      propertyInspectionData.SqFeet=(dwelling_hoe.OverrideTotalSqFtVal_Ext) ?
                                    (dwelling_hoe.TotalSqFtValOverridden_Ext) as Integer  :
                                     dwelling_hoe.SquareFootage_Ext

      if(dwelling_hoe.HOLocation.OverrideFirelineAdjHaz_Ext){
        propertyInspectionData.FireLineScore= dwelling_hoe.HOLocation.FirelineAdjHazOverridden_Ext
        propertyInspectionData.FirelineOverride= YES
      } else{
        propertyInspectionData.FireLineScore= dwelling_hoe.HOLocation.FirelineAdjHaz_Ext
        propertyInspectionData.FirelineOverride= NO
      }

      propertyInspectionData.SHIA=(dwelling_hoe.HOLocation.OverrideFirelineSHIA_Ext) ?
                                   dwelling_hoe.HOLocation.FirelineSHIAOverridden_Ext :
                                   policyPeriod.HomeownersLine_HOE.HOLocation.FirelineSHIA_Ext

      propertyInspectionData.InspecttedYears=null

      if(dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value!=null){
        propertyInspectionData.CovALimit= dwelling_hoe.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value as String
      }else{
        propertyInspectionData.CovALimit = dwelling_hoe.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value  as String
      }

      //TODO :: Forms are not yet delivered on Config Team
      propertyInspectionData.HO0442 = (policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("HO0442"))) ? YES : null

      propertyInspectionData.UI106=(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("UI106"))) ? YES : null

      propertyInspectionData.DP176X= (policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("DP176X"))) ? YES : null

      propertyInspectionData.Pool = dwelling_hoe.HOUWQuestions.swimmingpool ? YES : null

      if(dwelling_hoe.Foundation.Code?.equalsIgnoreCase(FoundationType_HOE.TC_STILTSPILINGS_EXT.Code)
      || dwelling_hoe.Foundation.Code?.equalsIgnoreCase(FoundationType_HOE.TC_POSTPIERBEAMOPEN_EXT.Code)
      || dwelling_hoe.Foundation.Code?.equalsIgnoreCase(FoundationType_HOE.TC_POSTPIERBEAMENCLOSED_EXT.Code)){
        propertyInspectionData.Stilts = "YES"
      }else{
        propertyInspectionData.Stilts = null
      }

      propertyInspectionData.Woodburner= dwelling_hoe.HeatSrcWoodBurningStove ? YES : null

      if(dwelling_hoe.HOLocation.OverrideISO360_Ext){
        propertyInspectionData.ISO360Value= dwelling_hoe.HOLocation.ISO360Overridden_Ext
      }else{
        propertyInspectionData.ISO360Value= dwelling_hoe.HOLocation.ISO360ValueID_Ext
      }

      propertyInspectionData.ManualEntry=null
      propertyInspectionData.Appendix=null

      if(dwelling_hoe.OverrideRoofShape_Ext){
        propertyInspectionData.RoofShape= dwelling_hoe.RoofShapeOverridden_Ext.Code
      }else{
        propertyInspectionData.RoofShape= dwelling_hoe.RoofShape_Ext.Code
      }

      propertyInspectionData.NumUnit= dwelling_hoe.NumberofRoofLayers_Ext

      if(dwelling_hoe.OverrideStoriesNumber_Ext){
        propertyInspectionData.NumStories= dwelling_hoe.NoofStoriesOverridden_Ext.Code
      } else{
        propertyInspectionData.NumStories= dwelling_hoe.StoriesNumber.Code
      }
      var outboundEntityDAO = new IntegrationBaseDAO(FileIntegrationMapping.PropertyInspectionNewBusiness)
      propertyInspectionData.Status = ProcessStatus.UnProcessed
      propertyInspectionData.CreateUser = this.IntrinsicType.RelativeName
      propertyInspectionData.UpdateUser = propertyInspectionData.CreateUser
      propertyInspectionData.ReportOne = reportData.get("reportOne").size >0 ? reportData.get("reportOne") : null
      propertyInspectionData.ReportTwo = reportData.get("reportTwo").size >0 ? reportData.get("reportTwo") : null
      propertyInspectionData.ReportThree = reportData.get("reportThree").size > 0 ? reportData.get("reportThree") : null
      propertyInspectionData.ReportFour = reportData.get("reportFour").size > 0 ? reportData.get("reportFour") : null
      propertyInspectionData.ReportFive = reportData.get("reportFive").size > 0 ? reportData.get("reportFive") : null
      propertyInspectionData.ReportSix = null
      propertyInspectionData.ReportSeven = null
      propertyInspectionData.ReportEight = null
      propertyInspectionData.RetryCount = 0
      propertyInspectionData.UpdateTime=propertyInspectionData.UpdateTime
      outboundEntityDAO.insert(propertyInspectionData)
      LOGGER.debug("Exiting inserttoIntegrationDB() method of "+CLASS_NAME)

    }
  }
}