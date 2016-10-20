package gwservices.pc.dm.gx.lob.CPP

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_CommercialPropertyLine_CPLocations_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 9/29/16
 * Time: 8:05 AM
 * To change this template use File | Settings | File Templates.
 */
class CPLocationPopluator extends BaseEntityPopulator<CPLocation, KeyableBean> {

   override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPLocation{
       if (model typeis PolicyLine_Entity_CommercialPropertyLine_CPLocations_Entry) {
            var cploc = new CPLocation(Branch)
            if(parent typeis CommercialPropertyLine)
               cploc.CPLine = parent
            return cploc
       }
     return null
   }

}