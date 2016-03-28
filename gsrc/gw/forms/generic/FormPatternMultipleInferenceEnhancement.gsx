package gw.forms.generic

uses gw.entity.TypeKey
uses gw.entity.ITypeList

enhancement FormPatternMultipleInferenceEnhancement : entity.FormPattern {
  property get CoverableTypeKeysRef() : TypeKey[] {
    if (this.CoverableTypeRef != null and this.CoverableTypeListRef != null and this.CoverableTypeKeys.HasElements) {
      return this.CoverableTypeKeys.map( \ key -> (this.CoverableTypeListRef.FeatureType as ITypeList).getTypeKey(key.Code))
    } else {
      return null
    }
  }

  property set CoverableTypeKeysRef(keys : TypeKey[]) {
    this.clearCoverableTypeKeys()
    if (keys.HasElements) {
      keys.each( \ key -> {
        this.addToCoverableTypeKeys(new FormPatternTypeKey(){
          : FormPattern = this,
          : Code = key.Code
        })
      })
    }
  }

  function clearCoverableTypeKeys() {
    this.CoverableTypeKeys.each(\ w -> this.removeFromCoverableTypeKeys(w))
  }
}
