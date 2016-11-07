package edge.capabilities.policy.lob.dto

uses java.util.Map
uses java.util.HashMap
uses edge.jsonmapper.JsonProperty

class PolicyLobDataDTO {

  protected var lobExtensions : Map<typekey.PolicyLine, PolicyLineBaseDTO> = new HashMap<typekey.PolicyLine, PolicyLineBaseDTO>()

}
