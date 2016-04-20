package gw.lob.bp7.location.coverages

enhancement BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentEnhancement : productmodel.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipment {
  function optionBSelected() : boolean {
    return this.ScheduledItems*.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItem*.BP7OptionTerm*.OptionValue.contains("OptionB")
  }
}
