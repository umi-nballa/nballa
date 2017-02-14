package gw.accelerator.ruleeng

uses java.util.Collection
uses java.util.ArrayList
uses gw.api.util.DisplayableException

/**
 * Adds utility methods for manipulating the vehicle types associated with the
 * rule.
 */
enhancement ValidationRule_ExtEnhancement : entity.ValidationRule_Ext {
  @Param("vehicleTypes", "The selection state for each vehicle type")
  function updateVehicleTypes(vehicleTypes : Collection<VehicleTypeSelection>) {
    // Initialize a map of no-longer-selected entities
    var toRemove = this.VehicleTypes.mapToKeyAndValue(
        \ entry -> entry.VehicleType,
        \ entry -> entry
    )

    var hasMatch = false
    for (var entry in vehicleTypes.where(\ vt -> vt.Selected)) {
      hasMatch = true
      // If this vehicle type isn't already selected, add it
      if (toRemove.remove(entry.VehicleType) == null) {
        this.addToVehicleTypes(new ValidationRuleVehType_Ext() {
            :VehicleType = entry.VehicleType
        })
      }
    }

    // Ensure that at least one is selected
    if (!hasMatch) {
      throw new DisplayableException(
          displaykey.Accelerator.RulesFramework.ValidationRule_Ext.VehicleTypeRequired
      )
    }
    // Remove anything that isn't still selected
    toRemove.Values*.remove()
  }

  @Returns("A list containing the selected status of every vehicle type")
  property get SelectedVehicleTypes() : List<VehicleTypeSelection> {
    var vehTypeList = new ArrayList<VehicleTypeSelection>()

    var selected = this.VehicleTypes.map(\ vt -> vt.VehicleType).toSet()

    for (vehType in typekey.VehicleType.getTypeKeys(false)) {
      var selection = new VehicleTypeSelection() {
          :VehicleType = vehType,
          // For a new rule, selected will be empty.
          // Initially, all vehicle types are selected.
          :Selected = selected.Empty or selected.contains(vehType)
      }
      vehTypeList.add(selection)
    }

    return vehTypeList
  }
}
