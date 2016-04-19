package gw.lob.bp7

enhancement BP7BuildingCovEnhancement : entity.BP7BuildingCov {
  property get InBlanket() : boolean {
    return this.Blanket != null
  }
}
