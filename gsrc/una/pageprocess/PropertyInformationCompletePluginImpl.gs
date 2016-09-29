package una.pageprocess

uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses java.lang.Exception
uses java.lang.Integer

/**
 * This Class is  for calling  one of the TUNA Service GetPropertyInformationComplete
 * Created By: ptheegala
 * Created On: 6/1/16
 *
 */
class PropertyInformationCompletePluginImpl {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var HO_LOB = "Homeowners"
  final static var YEAR_BUILT = "YearBuilt"
  final static var STORIES_NUMBER = "NumberOfStories"
  final static var CONSTRUCTION_TYPE = "TypeOfConstruction"
  final static var SQUARE_FOOTAGE = "TotalSquareFootage"
  final static var ROOF_TYPE = "RoofType"
  final static var ROOF_COVER = "RoofCover"
  final static var WIND_POOL = "WindPool"
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
      if (productSelection.ProductCode == HO_LOB){
        var _address= new AddressDTO()
        logger.info("Account Number..." + account.AccountNumber)
        for (location in account.AccountLocations) {
          logger.info("Primary Location:" + location.Primary + "Address Scrubbed: " + location.AddressScrub_Ext)
          if (location.Primary && location.AddressScrub_Ext){
            logger.info("Address.." + location.AddressLine1 + ".. " + location.City + " .." + location.State.DisplayName + " .." + location.PostalCode + " ...." + location.Primary)
            _address.AddressLine1 = location.AddressLine1
            _address.State = location.State.DisplayName
            _address.City = location.City
            _address.PostalCode = location.PostalCode
            _address.Country = location.Country.DisplayName

            var finalRes = TUNAGateway.fetchPropertyInformationComplete(_address)

            gw.transaction.Transaction.runWithNewBundle(\bun -> {

              var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
              policyPeriod = bun.add(policyPeriod)
              if (null != finalRes.Datums && finalRes.Datums.size() > 0) {
                for (dwell in finalRes.Datums) {

                  if (dwell.ID == YEAR_BUILT)
                    policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = (dwell.Value) as Integer

                  if (dwell.ID == STORIES_NUMBER)
                    policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber = typecodeMapper.getInternalCodeByAlias("NumberOfStories_HOE", "tuna", dwell.Value)

                  if (dwell.ID == CONSTRUCTION_TYPE)
                    policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna", dwell.Value)

                  if (dwell.ID == SQUARE_FOOTAGE)
                    policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext = (dwell.Value) as Integer

                  if (dwell.ID == ROOF_TYPE)
                    policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna", dwell.Value)

                  if (dwell.ID == ROOF_COVER)  //mapping to material
                    policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna", dwell.Value)

                  if (dwell.ID == WIND_POOL)
                    policyPeriod.HomeownersLine_HOE.Dwelling.PropertyCovByStateWndstorm_Ext = (dwell.Value) as Boolean

                }
              }
            })
          }
        }
      }
    } catch (exp: Exception)
    {
      logger.error("TunaGateway : Dwelling Construction Information " + " : StackTrace = ", exp)
      //throw new gw.api.util.DisplayableException ("Scrubb the address Properly")
    }
  }
}