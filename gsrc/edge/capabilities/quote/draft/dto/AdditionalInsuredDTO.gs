package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/27/17
 * Time: 4:50 PM
 * To change this template use File | Settings | File Templates.
 */
class AdditionalInsuredDTO extends PolicyContactDTO{
  @JsonProperty
  private var _interestDescription : String as DescriptionOfInterest

  @JsonProperty
  private var _relationshipToPNI : typekey.ContactRelationship_Ext as RelationshipToPrimaryInsured

  @JsonProperty
  private var _dbaName : String as DBAName
}