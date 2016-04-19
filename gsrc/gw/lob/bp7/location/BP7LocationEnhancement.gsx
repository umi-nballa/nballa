package gw.lob.bp7.location

uses gw.api.web.job.JobWizardHelper

enhancement BP7LocationEnhancement : entity.BP7Location {
  function createAndAddBuilding(helper : JobWizardHelper = null) : BP7Building {
    var building = this.addNewLineSpecificBuilding() as BP7Building
        
    building.createCoveragesConditionsAndExclusions()
    building.initializeAutoNumberSequences()
    building.defaultPropertyType()
    
    building.updateDependentFields(null, helper)
    building.bp7sync(helper)
    return building
  }

  function isLocationMoneySecuritiesCoverageAvailable() : boolean {
    return !this.Line.BP7NamedPerilsExists
  }

  function addlInsdBldgOwnersAvailable() : boolean {
    return not this.Buildings.hasMatch( \ building -> building.BP7LossPayableExists)
  }

  function apartmentBuildingsExistence() : ExistenceType {
    var locationAddedOnApartmentBuildingsTenantsAutosSchedule = this.Line.BP7ApartmentBuildingsTenantsAutosExists
        && this.Line.BP7ApartmentBuildingsTenantsAutos.ScheduledItems.hasMatch( \ schedItem -> schedItem.Location == this)

    return locationAddedOnApartmentBuildingsTenantsAutosSchedule ? ExistenceType.TC_REQUIRED : ExistenceType.TC_ELECTABLE
  }

  function restaurantsExistence(): ExistenceType {
    return this.Line.BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaExists &&
        this.Line.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia.ScheduledItems.hasMatch(\item -> item.Location == this)
        ? ExistenceType.TC_REQUIRED : ExistenceType.TC_ELECTABLE
  }
}
