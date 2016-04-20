package gw.lob.bp7.location.coverages

enhancement BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItemEnhancement: productmodel.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItem {
  function isLimitAvailable() : boolean {
    return this.BP7OptionTerm.OptionValue == "OptionA"
  }
}
