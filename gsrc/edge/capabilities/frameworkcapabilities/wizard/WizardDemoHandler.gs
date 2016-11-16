package edge.capabilities.frameworkcapabilities.wizard

uses edge.jsonrpc.IRpcHandler
uses edge.di.annotations.InjectableNode
uses edge.capabilities.frameworkcapabilities.wizard.dto.ClaimDemoDTO
uses edge.jsonrpc.annotation.JsonRpcUnauthenticatedMethod
uses edge.capabilities.frameworkcapabilities.wizard.dto.PAClaimDemoExtensionDTO
uses edge.capabilities.frameworkcapabilities.wizard.dto.ClaimDemoLobDTO

/**
 * Demo handler to give example of frontend Flow API.
 */
class WizardDemoHandler implements IRpcHandler {
  @InjectableNode
  construct() {}

  @JsonRpcUnauthenticatedMethod
  public function getClaim(claimNumber : String) : ClaimDemoDTO {
    return new ClaimDemoDTO() { :PublicID = "123456",
        :Step1PropA = "somePropValue",
        :Step1PropB = "someOtherPropValue",
        :ClaimNumber= claimNumber,
        :PolicyType = "PersonalAuto",
        :Lobs = new ClaimDemoLobDTO()
    }
  }


  @JsonRpcUnauthenticatedMethod
  public function createClaim(dto : ClaimDemoDTO) : ClaimDemoDTO {
    //just set public id and claim number
    dto.PublicID =  "123456"
    dto.ClaimNumber =  "123-45-633333"
    dto.Lobs = new ClaimDemoLobDTO()
    return dto
  }


  @JsonRpcUnauthenticatedMethod
  public function saveClaim(dto : ClaimDemoDTO) : ClaimDemoDTO {
    return dto
  }
}
