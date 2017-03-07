package gw.lob.ho
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 10:11 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement HOLocationEnhancement_Ext : entity.HOLocation_HOE
{

  property get protectionClassOrOverride(): typekey.ProtectionClassCode_Ext
  {
    if(this.OverrideDwellingPCCode_Ext && this.DwellingPCCodeOverridden_Ext!=null)
      return this.DwellingPCCodeOverridden_Ext
    else
      return this.DwellingProtectionClasscode
  }



  property get territoryCodeOrOverride(): String
  {
    if(this.OverrideTerritoryCode_Ext && this.TerritoryCodeOverridden_Ext!=null)
      return this.TerritoryCodeOverridden_Ext
    else
      return this.TerritoryCodeTunaReturned_Ext
  }

  property get FirelineAdjustedHazardScoreOrOverride():typekey.HOAdjustedHazardScore_Ext
  {
    if(this.OverrideFirelineAdjHaz_Ext && this.FirelineAdjHazOverridden_Ext!=null)
      return this.FirelineAdjHazOverridden_Ext
    else
      return this.FirelineAdjHaz_Ext
  }

  property get FirelineSHIAorOverride():String
  {
    if(this.OverrideFirelineSHIA_Ext && this.FirelineSHIAOverridden_Ext!=null)
      return this.FirelineSHIAOverridden_Ext
    else
      return this.FirelineSHIA_Ext
  }

}
