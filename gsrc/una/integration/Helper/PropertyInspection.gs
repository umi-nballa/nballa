package una.integration.Helper

uses gw.api.database.Query
uses una.logging.UnaLoggerCategory
uses una.model.PropertyInspectionData
uses java.util.Date
uses una.integration.mapping.FileIntegrationMapping
uses java.text.SimpleDateFormat
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses gw.api.util.DateUtil

/**
 * This is the helper class for property inspections which will insert the data into integration database
 * Created by : AChandrashekar on Date: 09/30/16
 */
class PropertyInspection {
  final static  var LOGGER = UnaLoggerCategory.INTEGRATION

  function inserttoIntegrationDB(policyNumber: String) {
    LOGGER.debug("Entering inserttoIntegrationDB to Insert data into DB")
    var policyPeriod:PolicyPeriod=null;
    var account:Account=null;
    var sdf = new SimpleDateFormat("yyyyMMdd")

    if(policyNumber != null && policyNumber.HasContent) {
      policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().AtMostOneRow;
    }


    if(policyPeriod!=null && policyPeriod.TermNumber==1){
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      var  propertyInspectionData= new PropertyInspectionData()

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

      propertyInspectionData.PriorCarrier="not yet configured in PC"
      propertyInspectionData.EffDate=policyPeriod.PolicyStartDate
      propertyInspectionData.PriorExp="not yet configured in PC"
      propertyInspectionData.CreditScore=policyPeriod.CreditInfoExt.CreditReport.CreditScore
      propertyInspectionData.ChargableLoss="not yet configured in PC"
      propertyInspectionData.AnyLoss=policyPeriod.LocationRisks.Count
      propertyInspectionData.WindHailLoss="not yet configured in PC"
      propertyInspectionData.Form=policyPeriod.Lines.DisplayName.first()
      propertyInspectionData.HomeAge=policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt
      propertyInspectionData.RoofAge="not yet configured in PC"
      propertyInspectionData.Construction=policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.DisplayName
      propertyInspectionData.YearBuilt=policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt
      propertyInspectionData.PPC=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode
      propertyInspectionData.SqFeet=policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext
      propertyInspectionData.FireLineScore=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHaz_Ext
      propertyInspectionData.SHIA=policyPeriod.HomeownersLine_HOE.HOLocation.OverrideFirelineSHIA_Ext
      propertyInspectionData.InspecttedYears=null
      propertyInspectionData.CovALimit=policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("HO0442"))) {
        propertyInspectionData.HO0442="Yes"
      } else{
        propertyInspectionData.HO0442=null
      }
      if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("UI106"))){
        propertyInspectionData.UI106="Yes"
      } else{
        propertyInspectionData.UI106=null
      }
      if(policyPeriod.Forms.hasMatch( \ form -> form.DisplayName.equalsIgnoreCase("DP176X"))){
        propertyInspectionData.DP176X="Yes"
      } else{
        propertyInspectionData.DP176X=null
      }
      if(policyPeriod.HomeownersLine_HOE.Dwelling.SwimmingPoolExists){
        propertyInspectionData.Pool="not yet configured in PC"
      }else{
        propertyInspectionData.Pool=null
      }
      if(policyPeriod.HomeownersLine_HOE.Dwelling.Foundation.Code=="stiltsPilings_Ext") {
        propertyInspectionData.Stilts= "Yes"
      } else{
        propertyInspectionData.Stilts=null
      }

      if(policyPeriod.HomeownersLine_HOE.Dwelling.FireplaceOrWoodStoveExists){
        propertyInspectionData.Woodburner="Yes"
      } else{
        propertyInspectionData.Woodburner=null
      }
      propertyInspectionData.ISO360Value=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360ValueID_Ext
      propertyInspectionData.FirelineOverride=policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext
      propertyInspectionData.ManualEntry=null
      propertyInspectionData.Appendix=null
      propertyInspectionData.RoofShape=policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext.Code
      propertyInspectionData.RoofTypeDesc=policyPeriod.HomeownersLine_HOE.Dwelling.RoofType.Description
      propertyInspectionData.ConstructionDesc=policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.Description
      propertyInspectionData.NumUnit=policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber
      propertyInspectionData.NumStories=policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber.DisplayName

      var outboundEntityDAO = new IntegrationBaseDAO(FileIntegrationMapping.PropertyInspectionNewBusiness)
      propertyInspectionData.Status = ProcessStatus.UnProcessed
      propertyInspectionData.CreateUser = this.IntrinsicType.RelativeName
      propertyInspectionData.UpdateUser = propertyInspectionData.CreateUser
      propertyInspectionData.RetryCount = 0
      propertyInspectionData.UpdateTime=propertyInspectionData.UpdateTime
      outboundEntityDAO.insert(propertyInspectionData)
      LOGGER.debug("Exiting inserttoIntegrationDB to Insert data into DB")
      policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_INSPECTIONORDERED, \ -> displaykey.Web.InspectionScore.Event.Msg)
    }
  }
}