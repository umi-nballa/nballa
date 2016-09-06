package gw.webservice.pc.pc800.productmodel

uses gw.xml.ws.annotation.WsiExportable
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/18/16
 * Time: 8:44 AM
 * To change this template use File | Settings | File Templates.
 */

@Export
@WsiExportable("http://guidewire.com/pc/ws/gw/webservice/pc/pc800/productmodel/PolicyTypeEnum")
enum PolicyTypeEnum {
 HO3("HomeownersLine_HOE"),
 HO4("HomeownersLine_HOE"),
 HO6("HomeownersLine_HOE"),
 DP3_Ext("HomeownersLine_HOE"),
 HOA_Ext("HomeownersLine_HOE"),
 HOB_Ext("HomeownersLine_HOE"),
 HCONB_Ext("HomeownersLine_HOE"),
 TDP1_Ext("HomeownersLine_HOE"),
 TDP2_Ext("HomeownersLine_HOE"),
 TDP3_Ext("HomeownersLine_HOE"),
 LPP_Ext("HomeownersLine_HOE"),
 BA("BusinessAutoLine"),
 garage("BusinessAutoLine"),
 motor("BusinessAutoLine"),
 BAphysdam("BusinessAutoLine")

  private construct(policyLinePatternCode : String){
    this.POLICY_LINE_PATTERNCODE = policyLinePatternCode
  }

  private final var POLICY_LINE_PATTERNCODE : String
}