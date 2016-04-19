package gw.lob.bp7

enhancement BP7ClassificationCovEnhancement : entity.BP7ClassificationCov {
  property get InBlanket() : boolean {
    return this.Blanket != null
  }
}
