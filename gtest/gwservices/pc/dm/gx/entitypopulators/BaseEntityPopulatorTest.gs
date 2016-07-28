package gwservices.pc.dm.gx.entitypopulators

uses gw.pl.currency.MonetaryAmount
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Forms_Entry
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyTerm
uses org.easymock.EasyMock

class BaseEntityPopulatorTest extends EntityPopulatorTestBase {
  function testOneToOneFindEntity() {
    var termPopulator = getPopulator(PolicyPeriod_PolicyTerm)
    var policyPeriod = mockKeyableBean("pc:123", entity.PolicyPeriod)
    var policyTerm = mockKeyableBean("pc:456", entity.PolicyTerm)
    policyPeriod.setFieldValue("PolicyTerm", policyTerm)
    var model = new PolicyPeriod_PolicyTerm()
    model.PublicID = "pc:456"
    var foundTerm = termPopulator.findEntity(model, policyPeriod, mockBundle())
    assertNotNull("term is null", foundTerm)
    assertEquals("incorrect entity returned", foundTerm, policyTerm)
    model.PublicID = "pc:789"
    foundTerm = termPopulator.findEntity(model, policyPeriod, mockBundle())
    assertNotNull("onetoone not found with inconsistent ID", foundTerm)
  }

  function testStandardFindChild() {
    var formPopulator = getPopulator(PolicyPeriod_Forms_Entry)
    var policyPeriod = mockKeyableBean("pc:123", entity.PolicyPeriod)
    var form = mockKeyableBean("pc:456", entity.Form)
    policyPeriod.setFieldValue("Forms", {form} as Form[])
    var model = new PolicyPeriod_Forms_Entry()
    model.PublicID = "pc:456"
    var foundForm = formPopulator.findEntity(model, policyPeriod, mockBundle())
    assertNotNull("form not returned", foundForm)
  }

  function testBasedOnFindChild() {
    var formPopulator = getPopulator(PolicyPeriod_Forms_Entry)
    var policyPeriod = mockKeyableBean("pc:123", entity.PolicyPeriod)
    var basedOnform = mockKeyableBean("pc:456", entity.Form)
    var form = mockEffDated("pc:789", entity.Form, basedOnform)
    policyPeriod.setFieldValue("Forms", {form} as Form[])
    var model = new PolicyPeriod_Forms_Entry()
    model.PublicID = "pc:101112"
    model.BasedOn.PublicID = "pc:456"
    var foundForm = formPopulator.findEntity(model, policyPeriod, mockBundle())
    assertNotNull("form not returned", foundForm)
  }

  function testSimplePopulation() {
    var periodPopulator = getPopulator(PolicyPeriod_PolicyTerm)
    var policyPeriod = mockKeyableBean("pc:123", entity.PolicyPeriod)
    var model = new PolicyPeriod()
    model.AssignedRisk = true
    var deposit = new MonetaryAmount("150 usd")
    model.DepositCollected = deposit
    periodPopulator.populate(model, policyPeriod)
    assertTrue("assigned risk not set to true", policyPeriod.getFieldValue("AssignedRisk") as boolean)
    assertEquals("wrong deposit amount", policyPeriod.getFieldValue("DepositCollected"), deposit)
  }
}