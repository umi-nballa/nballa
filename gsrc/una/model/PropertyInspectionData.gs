package una.model

uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses java.util.Date
uses java.lang.Integer

/**
 * Created for Property Inspections  Mapping
 * Created By: AChandrashekar on Date: 8/11/16 - Time: 6:10 AM
 */
class PropertyInspectionData extends OutboundFileData{

  var retrieve_Date : Date as Retrieve_Date
  var A00_Pnum : String as A00_Pnum
  var A06_Edition : String as A06_Edition
  var state : String as State
  var county : String as County
  var lob : String as LOB
  var propTransaction : String as PropTransaction
  var agentCode : String as AgentCode
  var agentName : String as AgentName
  var agentPhone : String as AgentPhone
  var agentFax : String as AgentFax
  var insuredName : String as InsuredName
  var insuredPhoneNumber : String as InsuredPhoneNumber
  var mailingStreet : String as MailingStreet
  var mailingCity : String as MailingCity
  var mailingState : String as MailingState
  var mailingZip : String as MailingZip
  var locationStreet : String as LocationStreet
  var locationCity : String as LocationCity
  var locationState : String as LocationState
  var locationZip : String as LocationZip
  var locationCounty : String as LocationCounty
  var priorCarrier : String as PriorCarrier
  var effDate : Date as EffDate
  var priorExp : DateTime as PriorExp
  var creditScore : String as CreditScore
  // Count of ChargableLoss as Yes
  var chargableLoss : String as ChargableLoss
  var anyLoss : String as AnyLoss
  var windHailLoss : String as WindHailLoss
  var form : String as Form
  var homeAge : Integer as HomeAge
  var roofAge : Integer as RoofAge
  var construction : String as Construction
  var yearBuilt : Integer as YearBuilt
  var ppc : String as PPC
  var sqFeet : Integer as SqFeet
  var fireLineScore : String as FireLineScore
  var shia : String as SHIA
  var inspecttedYears : String as InspecttedYears
  var covALimit : String as CovALimit
  var HO0442 : String as HO0442
  var UI106  : String as UI106
  var DP176X : String as DP176X
  var pool : String as Pool
  var stilts : String as Stilts
  var woodburner : String as Woodburner
  var ISO360Value : String as ISO360Value
  var firelineOverride : String as FirelineOverride
  var manualEntry : String as ManualEntry
  var roofShape : String as  RoofShape
  var roofTypeDesc : String as RoofTypeDesc
  var constructionDesc : String as ConstructionDesc
  var numUnit : Integer as NumUnit
  var numStories : String as NumStories
  var mailingLine2 : String as MailingLine2
  var locationLine2 : String as LocationLine2
  var appendix : String as Appendix
  var reportOne : String as ReportOne
  var reportTwo : String as ReportTwo
  var reportThree : String as ReportThree
  var reportFour : String as ReportFour
  var reportFive : String as ReportFive
  var reportSix : String as  ReportSix
  var reportSeven : String as ReportSeven
  var reportEight : String as ReportEight
  var roofType : String as RoofType

}