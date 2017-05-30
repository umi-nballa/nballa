package edge.capabilities.quote.lob.homeowners

uses edge.di.annotations.InjectableNode
uses edge.capabilities.quote.lob.ILobMetadataPlugin

class HoMetadataPlugin implements ILobMetadataPlugin {
  @InjectableNode
  construct() {
  }


  override function getQuestionSetCodes(): String[] {
    return { "HO_PreQual_Ext" }//"HOGAGenericPreQual_HOE" }
  }
}
