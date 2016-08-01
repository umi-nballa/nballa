package gwservices.pc.dm.gx.entitypopulators

uses gw.entity.IEntityType
uses gw.lang.reflect.IMethodInfo
uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem
uses gw.pl.persistence.core.Bundle
uses gw.testharness.ServerTest
uses gw.testharness.TestBase
uses org.easymock.EasyMock

uses java.lang.Class
uses java.util.HashMap

/**
 * Share functionality for entity populator tests
 */
@ServerTest
class EntityPopulatorTestBase extends TestBase {
  /** Popualator retrieve function */
  private static var _popFunc: IMethodInfo
  /** Populator instance */
  private static var _populatorUtil: EntityPopulatorUtil
  override function beforeClass() {
    var utilFunctions = EntityPopulatorUtil.Type.TypeInfo.DeclaredMethods
    _popFunc = utilFunctions.firstWhere(\dm -> dm.DisplayName == "getPopulator")
    _populatorUtil = new EntityPopulatorUtil(new Registry())
  }

  /**
   * Get a populator instance
   */
  protected function getPopulator(type: IType): IEntityPopulator {
    return _popFunc.CallHandler.handleCall(_populatorUtil, {type}) as IEntityPopulator
  }

  /**
   * Get mocked KeyableBean
   */
  protected function mockKeyableBean<T extends KeyableBean>(publicId: String, type: Class<T>): T {
    var mock = createBaseMock(publicId, type)
    EasyMock.replay({mock})
    return mock
  }

  /**
   * Get mocked effective dated entity
   */
  protected function mockEffDated<T extends EffDated>(publicId: String, type: Class<T>, basedOn: T): T {
    var mock = createBaseMock(publicId, type)
    EasyMock.expect(mock.getBasedOnUntyped()).andReturn(basedOn).anyTimes()
    EasyMock.replay({mock})
    return mock
  }

  /**
   * Create a mock bundle
   */
  protected function mockBundle(): Bundle {
    var mock = EasyMock.createNiceMock(Bundle)
    EasyMock.expect(mock.InsertedBeans).andReturn({}).anyTimes()
    mock.add(EasyMock.anyObject())
    EasyMock.expectLastCall().andAnswer(\-> {
      return EasyMock.getCurrentArguments()[0]
    }).anyTimes()
    EasyMock.replay({mock})
    return mock
  }

  /**
   * Shared mock functionality
   */
  private function createBaseMock<T extends KeyableBean>(publicId: String, type: Class<T>): T {
    var mock: T = EasyMock.createNiceMock(type)
    var resultMap = new HashMap()
    EasyMock.expect(mock.getPublicID()).andReturn(publicId).anyTimes()
    EasyMock.expect(mock.getIntrinsicType()).andReturn(TypeSystem.get(type) as IEntityType).anyTimes()
    mock.setFieldValue(EasyMock.anyObject(), EasyMock.anyObject())
    EasyMock.expectLastCall().andAnswer(\-> {
      resultMap.put(EasyMock.getCurrentArguments()[0], EasyMock.getCurrentArguments()[1])
      return null
    }).anyTimes()
    mock.getFieldValue(EasyMock.anyObject())
    EasyMock.expectLastCall().andAnswer(\-> {
      return resultMap.get(EasyMock.getCurrentArguments()[0])
    }).anyTimes()
    return mock
  }
}