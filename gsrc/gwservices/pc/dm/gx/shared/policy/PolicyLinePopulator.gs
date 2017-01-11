package gwservices.pc.dm.gx.shared.policy

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Lines_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.lob.cpp.ui.CPPLineSelectionCheckboxWrapper
uses gw.api.productmodel.PolicyLinePattern
uses gw.api.productmodel.PolicyLinePatternLookup

class PolicyLinePopulator extends BaseEntityPopulator<PolicyLine, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): PolicyLine {

    var isGLLineExists : Boolean
    var policyLine : PolicyLine
    if (model typeis PolicyPeriod_Lines_Entry) {

      switch(model.Subtype){
        case typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE :
            policyLine = Branch.HomeownersLine_HOE
        break;
        case typekey.PolicyLine.TC_BP7BUSINESSOWNERSLINE :
            if(Branch.BP7Line.BP7Locations.Count > 0)
              Branch.BP7Line.BP7Locations.each( \ elt -> elt.remove())
            policyLine = Branch.BP7Line
        break;
        case typekey.PolicyLine.TC_COMMERCIALPROPERTYLINE :
            if (Branch.CPLine.CPLocations.Count > 0)
              Branch.CPLine.CPLocations.each( \ elt -> elt.remove())
            policyLine =  Branch.CPLine
        break;
        case typekey.PolicyLine.TC_GENERALLIABILITYLINE :
            isGLLineExists=true
            policyLine =  Branch.GLLine
        break;
        default :
          throw new DataMigrationNonFatalException(CODE.INVALID_POLICY_LINE, model.Subtype as String)
      }
      if(!isGLLineExists){
        var policyLinePattern : PolicyLinePattern
        policyLinePattern = PolicyLinePatternLookup.getAll().atMostOneWhere( \ plt -> plt.CodeIdentifier.equalsIgnoreCase("GLLine"))
        var cpp = new CPPLineSelectionCheckboxWrapper(policyLinePattern, Branch)
        cpp.Value = false
      }
      return policyLine
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }
}