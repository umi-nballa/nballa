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

}
