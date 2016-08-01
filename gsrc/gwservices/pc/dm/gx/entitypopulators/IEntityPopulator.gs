package gwservices.pc.dm.gx.entitypopulators

uses gw.lang.reflect.IType
uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement

/**
 * Entity populator functionality
 */
interface IEntityPopulator<C, P> {
  /**
   * Initialize the populator
   */
  function initialize(xmlType: ITypeInfo)

  /**
   * Validation function. Perform any XML model review here
   */
  function validate(model: XmlElement)

  /**
   * Retrieve the child property name
   */
  function getPropertyName(model: XmlElement, parent: P): String

  /**
   * Find an existing entity.
   * @return entity or null if not found
   */
  function findEntity(model: XmlElement, parent: P, bundle: Bundle): C

  /**
   * Create a new instance of the entity
   */
  function create(model: XmlElement, parent: P, bundle: Bundle): C

  /**
   * Sort children for population
   */
  function sortChildrenForPopulation(children: List <XmlElement>): List <XmlElement>

  /**
   * Populate the entity
   */
  function populate(model: XmlElement, entity: C)

  /**
   * Add the entity to a parent
   */
  function addToParent(parent: P, child: C, name: String, childModel: XmlElement)

  /**
   * Finish updating the entity
   */
  function finish(model: XmlElement, parent: P, child: C)

  /**
   * Remove an entity
   */
  function remove(parent: P, child: C, bundle: Bundle)

  /**
   * Find and remove an entity
   */
  function findAndRemove(parent: P, publicId: String, propertyName: String, entityType: IType, bundle: Bundle)
}