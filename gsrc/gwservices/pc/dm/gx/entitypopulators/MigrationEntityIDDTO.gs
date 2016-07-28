package gwservices.pc.dm.gx.entitypopulators

uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem

/**
 * Data transfer object for migration entity IDs
 */
class MigrationEntityIDDTO {
  private var _entityID: String as readonly EntityID
  private var _basedOnEntityID: String as readonly BasedOnEntityID
  private var _entityType: IType as readonly EntityType
  private var _modelType: IType as readonly XMLModelType
  private var _propertyName: String as readonly PropertyName
  construct(entityID: String, entityType: String) {
    this._entityID = entityID
    this._entityType = parseType(entityType)
  }

  construct(entityID: String, entityType: String, modelType: String, propertyName: String) {
    this(entityID, entityType)
    this._modelType = parseType(modelType)
    this._propertyName = propertyName
  }

  construct(entity: KeyableBean) {
    this._entityType = entity.IntrinsicType
    this._entityID = entity.PublicID
    if (entity typeis EffDated) {
      this._basedOnEntityID = entity.BasedOnUntyped.PublicID
    }
  }

  construct(entity: KeyableBean, modelType: IType, propertyName: String) {
    this(entity)
    this._modelType = modelType
    this._propertyName = propertyName
  }

  override function hashCode(): int {
    return EntityType?.hashCode() + (BasedOnEntityID != null ? BasedOnEntityID?.hashCode() : EntityID?.hashCode())
  }

  override function equals(mei: Object): boolean {
    if (mei typeis MigrationEntityIDDTO) {
      var equalBasedOn = mei.BasedOnEntityID == this.EntityID or this.BasedOnEntityID == mei.EntityID
      return mei.EntityType == this.EntityType and (mei.EntityID == this.EntityID or equalBasedOn)
    } else {
      return false
    }
  }

  override function toString(): String {
    var msg = "EntityType ${EntityType}, EntityID ${EntityID}, BasedOnEntityID ${BasedOnEntityID}, "
    msg += "XMLModelType ${XMLModelType}, PropertyName ${PropertyName}"
    return msg
  }

  private final function parseType(type: String): IType {
    return type.HasContent ? TypeSystem.getByFullName(type) : null
  }
}