package edge.capabilities.frameworkcapabilities.wizard.dto

uses java.util.Map
uses java.util.HashMap

class ClaimDemoLobDTO {
  protected var lobExtensions : Map<String, IClaimDemoLobExtensionDTO > = new HashMap<String, IClaimDemoLobExtensionDTO>()
}
