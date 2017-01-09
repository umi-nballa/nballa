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

/**
 * This is the helper class for property inspections which will insert the data into integration database
 * Created by : AChandrashekar on Date: 09/30/16
 */
class PropertyInspection {
  final static  var LOGGER = UnaLoggerCategory.INTEGRATION
  final static var YES = "Yes"
  final static var NO = "No"
  function inserttoIntegrationDB(policyNumber: String, description : String) {
    LOGGER.debug("Entering inserttoIntegrationDB to Insert data into DB")
    var policyPeriod:PolicyPeriod=null;
    var account:Account=null;
    var sdf = new SimpleDateFormat("yyyyMMdd")
    var currentDateYear = DateUtil.currentDate().YearOfDate

    if(policyNumber != null && policyNumber.HasContent) {
      policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().AtMostOneRow;
    }


    if(policyPeriod!=null && policyPeriod.TermNumber==1){
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      var  propertyInspectionData= new PropertyInspectionData()
      var priorPolicies=policyPeriod.Policy.PriorPolicies
      var yearBuilt : Integer = ""
      propertyInspectionData.Retrieve_Date=""
      propertyInspectionData.A00_Pnum=policyPeriod.PolicyNumber
      propertyInspectionData.A06_Edition=policyPeriod.PolicyTerm.DisplayName

      propertyInspectionData.State=policyPeriod.PolicyLocations.State.first()
      propertyInspectionData.County=policyPeriod.PolicyLocations.County.first()
      propertyInspectionData.LOB=policyPeriod.Lines.DisplayName.first()
      propertyInspectionData.PropTransaction="New Submission"

      propertyInspectionData.AgentCode=policyPeriod.ProducerOfRecord.AgenyNumber_Ext
      propertyInspectionData.AgentName=policyPeriod.ProducerOfRecord.Name
      propertyInspectionData.AgentPhone=policyPeriod.ProducerOfRecord.Contact.PrimaryPhoneValue
      propertyInspectionData.AgentFax=policyPeriod.ProducerOfRecord.Contact.FaxPhone

      propertyInspectionData.InsuredName=policyPeriod.PrimaryInsuredName
      propertyInspectionData.InsuredPhoneNumber=policyPeriod.NamedInsureds.first().ContactDenorm.PrimaryPhoneValue

      propertyInspectionData.MailingStreet=policyPeriod.PrimaryLocation.AddressLine1
      propertyInspectionData.MailingLine2=policyPeriod.PrimaryLocation.AddressLine2
      propertyInspectionData.MailingCity=policyPeriod.PrimaryLocation.City
      propertyInspectionData.MailingState=policyPeriod.PrimaryLocation.State
      propertyInspectionData.MailingZip=policyPeriod.PrimaryLocation.PostalCode

      propertyInspectionData.LocationStreet=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine1
      propertyInspectionData.LocationLine2=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2
      propertyInspectionData.LocationCity= policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City
      propertyInspectionData.LocationState=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State
      propertyInspectionData.LocationZip=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode
      propertyInspectionData.LocationCounty=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.County

      propertyInspectionData.PriorCarrier=priorPolicies.sortByDescending(\elt->elt.CarrierType).first().CarrierType.DisplayName
      propertyInspectionData.EffDate=policyPeriod.PolicyStartDate
      propertyInspectionData.PriorExp=priorPolicies.sortByDescending(\ elt -> elt.ExpirationDate).first().ExpirationDate
      propertyInspectionData.CreditScore=policyPeriod.CreditInfoExt.CreditReport.CreditScore

      //Need to Check on this
      var priorloss= Query.make(PriorLoss_Ext).compare(PriorLoss_Ext#PolicyNum, Equals, policyNumber).select()
      propertyInspectionData.ChargableLoss=priorloss?.countWhere( \ cp -> cp.ClaimPayment.hasMatch( \ elt1 -> elt1.Chargeable=="Yes"))
      propertyInspectionData.AnyLoss=policyPeriod.LocationRisks?.Count
      propertyInspectionData.WindHailLoss="not yet configured in PC"
      propertyInspectionData.Form=policyPeriod.Lines?.DisplayName?.first()

      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideYearbuilt_Ext){
        propertyInspectionData.HomeAge=currentDateYear-policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext
      } else{
        propertyInspectionData.HomeAge=currentDateYear-policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt
      }

      // Year Built ::
      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideYearbuilt_Ext){
        propertyInspectionData.YearBuilt=policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext
        yearBuilt= policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext
      } else{
        propertyInspectionData.YearBuilt=policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt
        yearBuilt= policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt
      }


      // Need Clarifications on this
      if((DateUtil.currentDate().YearOfDate - yearBuilt)>20 ) {
        if(policyPeriod.HomeownersLine_HOE.Dwelling.RoofingUpgrade){
         propertyInspectionData.RoofAge=policyPeriod.HomeownersLine_HOE.Dwelling.RoofingUpgradeDate
        }
        else{
          propertyInspectionData.RoofAge=yearBuilt
        }
      } else{
        propertyInspectionData.RoofAge=yearBuilt
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideRoofType_Ext) {
        propertyInspectionData.RoofType = policyPeriod.HomeownersLine_HOE.Dwelling.RoofingMaterialOverridden_Ext
        propertyInspectionData.RoofTypeDesc=policyPeriod.HomeownersLine_HOE.Dwelling.RoofingMaterialOverridden_Ext.Description
      } else{
        propertyInspectionData.RoofType = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType
        propertyInspectionData.RoofTypeDesc=policyPeriod.HomeownersLine_HOE.Dwelling.RoofType.Description
      }

      // Construction ::
      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideConstructionType_Ext){
        propertyInspectionData.Construction=policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext.Code
        propertyInspectionData.ConstructionDesc=policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext.Description
      } else{
        propertyInspectionData.Construction=policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.Code
        propertyInspectionData.ConstructionDesc=policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.Description
      }



      // PPC  ::
      if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideDwellingPCCode_Ext){
        propertyInspectionData.PPC=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingPCCodeOverridden_Ext
      } else{
        propertyInspectionData.PPC=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode
      }

      // Square Feet
      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideTotalSqFtVal_Ext){
        propertyInspectionData.SqFeet=policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValOverridden_Ext
      }else{
        propertyInspectionData.SqFeet=policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext){
        propertyInspectionData.FireLineScore= policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext
        propertyInspectionData.FirelineOverride= YES
      } else{
        propertyInspectionData.FireLineScore= policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHaz_Ext
        propertyInspectionData.FirelineOverride= NO
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineSHIA_Ext){
        propertyInspectionData.SHIA=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineSHIAOverridden_Ext
      }  else{
        propertyInspectionData.SHIA=policyPeriod.HomeownersLine_HOE.HOLocation.FirelineSHIA_Ext
      }



      propertyInspectionData.InspecttedYears=null
      propertyInspectionData.CovALimit=policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value


      if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("HO0442"))) {
        propertyInspectionData.HO0442= YES
      } else{
        propertyInspectionData.HO0442=null
      }
      if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("UI106"))){
        propertyInspectionData.UI106= YES
      } else{
        propertyInspectionData.UI106=null
      }
      if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("DP176X"))){
        propertyInspectionData.DP176X= YES
      } else{
        propertyInspectionData.DP176X=null
      }

      // Blocker
      if(policyPeriod.HomeownersLine_HOE.Dwelling.SwimmingPoolExists){
        propertyInspectionData.Pool= YES
      }else{
        propertyInspectionData.Pool=null
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.Foundation.Code?.equalsIgnoreCase(typekey.FoundationType_HOE.TC_STILTSPILINGS_EXT.Code)) {
        propertyInspectionData.Stilts= YES
      } else{
        propertyInspectionData.Stilts=null
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.HeatSrcWoodBurningStove){
        propertyInspectionData.Woodburner= YES
      } else{
        propertyInspectionData.Woodburner=null
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideISO360_Ext){
        propertyInspectionData.ISO360Value=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360Overridden_Ext
      }else{
        propertyInspectionData.ISO360Value=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360ValueID_Ext
      }

      propertyInspectionData.ManualEntry=null
      propertyInspectionData.Appendix=null

      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideRoofShape_Ext){
        propertyInspectionData.RoofShape=policyPeriod.HomeownersLine_HOE.Dwelling.RoofShapeOverridden_Ext?.Code
      }else{
        propertyInspectionData.RoofShape=policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext?.Code
      }


      propertyInspectionData.NumUnit=policyPeriod.HomeownersLine_HOE.Dwelling.NumberofRoofLayers_Ext

      if(policyPeriod.HomeownersLine_HOE.Dwelling.OverrideStoriesNumber_Ext){
        propertyInspectionData.NumStories=policyPeriod.HomeownersLine_HOE.Dwelling.NoOfStoriesOverridden_Ext?.Code
      } else{
        propertyInspectionData.NumStories=policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber?.Code
      }
      var outboundEntityDAO = new IntegrationBaseDAO(FileIntegrationMapping.PropertyInspectionNewBusiness)
      propertyInspectionData.Status = ProcessStatus.UnProcessed
      propertyInspectionData.CreateUser = this.IntrinsicType.RelativeName
      propertyInspectionData.UpdateUser = propertyInspectionData.CreateUser
      propertyInspectionData.ReportOne = description
      propertyInspectionData.ReportTwo = null
      propertyInspectionData.ReportThree = null
      propertyInspectionData.ReportFour = null
      propertyInspectionData.ReportFive = null
      propertyInspectionData.ReportSix = null
      propertyInspectionData.ReportSeven = null
      propertyInspectionData.ReportEight = null
      propertyInspectionData.RetryCount = 0
      propertyInspectionData.UpdateTime=propertyInspectionData.UpdateTime
      outboundEntityDAO.insert(propertyInspectionData)
      LOGGER.debug("Exiting inserttoIntegrationDB to Insert data into DB")
      policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_INSPECTIONORDERED, \ -> displaykey.Web.InspectionScore.Event.Msg)
    }
  }
}