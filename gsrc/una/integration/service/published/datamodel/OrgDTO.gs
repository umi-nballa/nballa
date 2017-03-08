package una.integration.service.published.datamodel

uses gw.xml.ws.annotation.WsiExportable
uses gw.pl.persistence.core.Bundle
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.database.Query

@Export
@WsiExportable("http://guidewire.com/pc/ws/una/integration/service/published/datamodel/OrganizationDTO")
class OrgDTO {

  var _name : String as Name
  var _publicID : String as PublicID

  var _producerStatus : ProducerStatus as ProducerStatus
  var _tier : Tier as Tier
  var _type : BusinessType as Type

  var _agencyNumber : String as AgencyNumber
  var _organizationName : String as OrganizationName
  var _rewardLevel : RewardLevel_Ext as RewardLevel
  var _marketChannelCode : String as MarketChannelCode
  var _marketChannelDesc : String as MarketChannelDesc
  var _useDirectDeposit : boolean as UseDirectDeposit
  var _printInfoOnDec : boolean as PrintInfoOnDec
  var _commissionOnMasterAgent : boolean as CommissionOnMasterAgent
  var _emailCommissionStatement : boolean as EmailCommissionStatement
  var _uwCategoryType : UWCategory_Ext as UWCategoryType
  var _allStateNumber : String as AllStateNumber

  var _primaryContactName : String as PrimaryContactName
  var _primaryAddressLine1 : String as PrimaryAddressLine1
  var _primaryAddressLine2 : String as PrimaryAddressLine2
  var _primaryAddressLine3 : String as PrimaryAddressLine3
  var _primaryCity : String as PrimaryCity
  var _primaryState : String as PrimaryState
  var _primaryZip : String as PrimaryZip

  var _producerCodes : ProdCodeDTO[] as ProducerCodes


}