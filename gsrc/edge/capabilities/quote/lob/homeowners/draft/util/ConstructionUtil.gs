package edge.capabilities.quote.lob.homeowners.draft.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.lob.homeowners.draft.dto.ConstructionDTO

/**
 * Utilities used to work with OOTB construction screen (building materials, wind class, etc...)
 */
final class ConstructionUtil {
  construct() {
    throw new UnsupportedOperationException("This is an utility class.")
  }


  /**
   * Fills Guidewire-provided properties on the dto.
   */
  public static function fillBaseProperties(dto : ConstructionDTO, data : Dwelling_HOE) {
    dto.YearBuilt = data.YearBuilt
    dto.StoriesNumber = data.StoriesNumber

    /* Compatibility check, this could be a submission filled by an operator. Portal submissions should have garage
     * field set to an appropriate value.
     */
    if (data.Garage != null) {
      dto.HasGarage = data.Garage != typekey.GarageType_HOE.TC_NONE
    }

    dto.ConstructionType = data.ConstructionType
    if (data.ConstructionType == typekey.ConstructionType_HOE.TC_OTHER) {
      dto.ConstructionTypeDescription = data.ConstructionTypeDescription
    }


    dto.RoofType = data.RoofType
    if (data.RoofType == typekey.RoofType.TC_OTHER) {
      dto.RoofTypeDescription = data.RoofTypeDescription
    }
    dto.RoofUpgradeExists = data.RoofingUpgrade
    if (data.RoofingUpgrade) {
      dto.RoofUpgradeYear = data.RoofingUpgradeDate
    }


    dto.FoundationType = data.Foundation


    dto.PrimaryHeatingType = data.PrimaryHeating
  /*  if (data.PrimaryHeating == typekey.HeatingType_HOE.TC_NONE_EXT) {   //TC_OTHER --Portal
      dto.PrimaryHeatingTypeDescription = data.PrimaryHeatingDescription
    }*/
    /* Value is true per spec saying that default value have to be true. */
    dto.SecondaryHeatingExists = data.SecondaryHeatingExists == null ? true : data.SecondaryHeatingExists
    dto.HeatingUpgradeExists = data.HeatingUpgrade
    if (data.HeatingUpgrade) {
      dto.HeatingUpgradeYear = data.HeatingUpgradeDate
    }


    dto.PlumbingType = data.PlumbingType
    if (data.PlumbingType == typekey.PlumbingType_HOE.TC_OTHER) {
      dto.PlumbingTypeDescription = data.PlumbingTypeDescription
    }
    dto.PlumbingUpgradeExists = data.PlumbingUpgrade
    if (dto.PlumbingUpgradeExists) {
      dto.PlumbingUpgradeYear = data.PlumbingUpgradeDate
    }


    dto.WiringType = data.WiringType
    if (data.WiringType == typekey.WiringType_HOE.TC_OTHER) {
      dto.WiringTypeDescription = data.WiringTypeDescription
    }
    dto.WiringUpgradeExists = data.ElectricalSystemUpgrade
    if (data.ElectricalSystemUpgrade) {
      dto.WiringUpgradeYear = data.ElectricalSystemUpgradeDate
    }


    dto.ElectricalType = data.ElectricalType
    /*if (data.ElectricalType == typekey.BreakerType_HOE.TC_OTHER) {  --poratl
      dto.ElectricalTypeDescription = data.ElectricalTypeDescription
    }*/
  }


  /**
   * Updates base construction properties on the data if <code>dto</code> is not <code>null</code>.
   * If <code>dto</code> is <code>null</code> this method does nothing.
   */
  public static function updateFrom(data : Dwelling_HOE, dto : ConstructionDTO) {
    if (dto == null) {
      return
    }

    data.YearBuilt = dto.YearBuilt
    data.StoriesNumber = dto.StoriesNumber

    if (dto.HasGarage) {
      /* Set field to TC_ATTACHED only if garage is set to "none" or undefined.
       * Garage value could be set by an operator/agent and it is not good to reset it to "One attached garage" here.
       * User still could switch to "no garage/have garage" and reset this value, but we do not want user to
       * reset this field without explicit intent to change it (by updating unrelated part of the object graph).
       */
      if (data.Garage == null || data.Garage == typekey.GarageType_HOE.TC_NONE) {
        data.Garage = typekey.GarageType_HOE.TC_ATTACHED_1
      }
    } else {
      data.Garage = typekey.GarageType_HOE.TC_NONE
    }

    data.ConstructionType = dto.ConstructionType
    if (dto.ConstructionType == typekey.ConstructionType_HOE.TC_OTHER) {
      data.ConstructionTypeDescription = dto.ConstructionTypeDescription
    }


    data.RoofType = dto.RoofType
    if (dto.RoofType == typekey.RoofType.TC_OTHER) {
      data.RoofTypeDescription = dto.RoofTypeDescription
    }
    data.RoofingUpgrade = dto.RoofUpgradeExists
    if (dto.RoofUpgradeExists) {
      data.RoofingUpgradeDate = dto.RoofUpgradeYear
    }


    data.Foundation = dto.FoundationType


    data.PrimaryHeating = dto.PrimaryHeatingType
   /* switch (dto.PrimaryHeatingType) {
      *//*case typekey.HeatingType_HOE.TC_NONE_EXT://TC_OTHER   --Portal
          data.PrimaryHeatingDescription = dto.PrimaryHeatingTypeDescription
          break*//*
      case typekey.HeatingType_HOE.TC_PORTABLEOIL_EXT: //TC_HEATINGOIL   --Portal
          *//*
           * Update heating type but only if it is not set before.
           * Oil parameters could be changed by a call-center operator or other agent staff. We should not change that
           * values. However, we could set them initially (when they are not set).
           *//*
          if (data.PrimaryHeatingFuelTankLocation == null) {
            data.PrimaryHeatingFuelTankLocation = typekey.FuelTankLocationType_HOE.TC_OBG
          }
          if (data.PrimaryHeatingFuelLineLocation == null) {
            data.PrimaryHeatingFuelLineLocation = typekey.FuelLineLocationType_HOE.TC_UNDER
          }
          break
    }*/

    data.SecondaryHeatingExists = dto.SecondaryHeatingExists
    data.HeatingUpgrade = dto.HeatingUpgradeExists
    if (dto.HeatingUpgradeExists) {
      data.HeatingUpgradeDate = dto.HeatingUpgradeYear
    }


    data.PlumbingType = dto.PlumbingType
    if (dto.PlumbingType == typekey.PlumbingType_HOE.TC_OTHER) {
      data.PlumbingTypeDescription = dto.PlumbingTypeDescription
    }
    data.PlumbingUpgrade = dto.PlumbingUpgradeExists
    if (dto.PlumbingUpgradeExists) {
      data.PlumbingUpgradeDate = dto.PlumbingUpgradeYear
    }


    data.WiringType = dto.WiringType
    if (data.WiringType == typekey.WiringType_HOE.TC_OTHER) {
      data.WiringTypeDescription = dto.WiringTypeDescription
    }
    data.ElectricalSystemUpgrade = dto.WiringUpgradeExists
    if (dto.WiringUpgradeExists) {
      data.ElectricalSystemUpgradeDate = dto.WiringUpgradeYear
    }


    data.ElectricalType = dto.ElectricalType
   /* if (dto.ElectricalType == typekey.BreakerType_HOE.TC_CIRCUITBREAKER) {  //TC_OTHER --Portal
      data.ElectricalTypeDescription = dto.ElectricalTypeDescription
    }*/

    data.beforeSavingDwellingConstructionPage()
  }
}
