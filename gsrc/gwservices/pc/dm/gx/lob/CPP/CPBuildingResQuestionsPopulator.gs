package gwservices.pc.dm.gx.lob.CPP

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
//uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_ResQuestions

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 2:43 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingResQuestionsPopulator extends BaseEntityPopulator<CPResQuest_Ext, KeyableBean>{

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPResQuest_Ext{
   // if (model typeis CPBuilding_ResQuestions) {
      var cpResQuest = new CPResQuest_Ext(Branch)
      return cpResQuest
  //  }
   // return null
  }
}