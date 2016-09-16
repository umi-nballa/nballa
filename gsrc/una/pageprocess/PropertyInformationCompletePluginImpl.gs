package una.pageprocess

uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses java.lang.Exception

/**
 * This Class is  for calling  one of the TUNA Service GetPropertyInformationComplete
 * Created By: ptheegala
 * Created On: 6/1/16
 *
 */
class PropertyInformationCompletePluginImpl {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  construct() {
  }

  //Instance call for TUNAGATEWAY

  property get TUNAGateway(): TunaInterface {
    return _TUNAGateway
  }

  public function getPropertyInformationComplete(productSelection: ProductSelection, account: Account, policyPeriod: PolicyPeriod)
  {
    try {
      if (productSelection.ProductCode == "Homeowners"){
        var _address: AddressDTO = new AddressDTO()
        logger.info("Account Number..." + account.AccountNumber)
         for (location in account.AccountLocations) {
          logger.info("Primary Location:" + location.Primary + "Address Scrubbed: " + location.addressScrub_Ext)
          if (location.Primary && location.addressScrub_Ext){
            logger.info("Address.." + location.AddressLine1 + ".. " + location.City + " .." + location.State.DisplayName + " .." + location.PostalCode + " ...." + location.Primary)
            _address.AddressLine1 = location.AddressLine1
            _address.State = location.State.DisplayName
            _address.City = location.City
            _address.PostalCode = location.PostalCode
            _address.Country = location.Country.DisplayName

            var finalRes = TUNAGateway.fetchPropertyInformationComplete(_address)
            gw.transaction.Transaction.runWithNewBundle(\bun -> {
              policyPeriod = bun.add(policyPeriod)
              policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = 2007
              policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber = typekey.NumberOfStories_HOE.TC_4
              policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode = "BL"
              policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typekey.ConstructionType_HOE.TC_S
              policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage = 1200
              policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typekey.RoofType.TC_FIBERCEMENT
              policyPeriod.HomeownersLine_HOE.Dwelling.RoofTypeDescription = "TILC"
              policyPeriod.HomeownersLine_HOE.Dwelling.WindClass = typekey.WindRating.TC_SUPERIOR
            })
          }
        }
      }
    } catch (exp: Exception)
    {
      throw new gw.api.util.DisplayableException ("Scrubb the address Properly")
    }
  }
}