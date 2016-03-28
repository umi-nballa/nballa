package gw.api.databuilder.common


uses gw.api.databuilder.BuilderContext
uses gw.entity.IEntityType
uses gw.pl.persistence.core.Bundle

class BuilderContextReuseEntity implements BuilderContext {
  var _parent : KeyableBean
  var _entity : KeyableBean
  var _bundle : Bundle

  construct(parent : KeyableBean, entity : KeyableBean, bundle_ : Bundle) {
    _parent = parent
    _entity = entity
    _bundle = bundle_
  }

  override property get Bundle() : Bundle {
    return _bundle
  }

  override property get ParentBean() : KeyableBean {
    return _parent
  }

  override function createBean(entity : IEntityType) : KeyableBean {
    return _entity
  }
}
