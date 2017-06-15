package edge.capabilities.quote.lob.homeowners.draft.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.lob.homeowners.draft.dto.ConstructionDTO
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses gw.lang.reflect.IPropertyInfo

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

    mapTunaFields(data, dto, TO)
    mapFieldsWithAdditionalLogic(data, dto, TO)


    dto.ElectricalType = data.ElectricalType
    /*if (data.ElectricalType == typekey.BreakerType_HOE.TC_OTHER) {  --poratl
      dto.ElectricalTypeDescription = data.ElectricalTypeDescription
    }*/

    dto.EligibleForWindStormCov = data.PropertyCovByStateWndstorm_Ext

    dto.FloorLocation = data.FloorLocation_Ext

    dto.FoundationHeight = data.FoundationHeight_Ext
    dto.FoundationMaterial = data.FoundationMaterial_Ext

    dto.FoundationType = data.Foundation
    if (data.Foundation == typekey.FoundationType_HOE.TC_OTHER) {
      dto.FoundationTypeDescription = data.FoundationTypeOther_Ext
    }

    /* Compatibility check, this could be a submission filled by an operator. Portal submissions should have garage
     * field set to an appropriate value.
     */
    if (data.Garage != null) {
      dto.HasGarage = data.Garage != typekey.GarageType_HOE.TC_NONE
    }

    dto.HasHeatSrcCentralElectric = data.HeatSrcCentralElectric
    dto.HasHeatSrcCentralNaturalGas = data.HeatSrcCentralNaturalGas
    dto.HasHeatSrcCentralPropane = data.HeatSrcCentralPropane
    dto.HasHeatSrcCentralOther = data.HeatSrcCentralOther
    dto.HasHeatSrcFireplace = data.HeatSrcFireplace
    dto.HasHeatSrcPortableAllFuelTypes = data.HeatSrcPortableAllFuelTypes
    dto.HasHeatSrcWoodBurningStove = data.HeatSrcWoodBurningStove

    dto.NumberOfAmps = data.NumberofAmps_Ext
    dto.NumberOfRoofLayers = data.NumberofRoofLayers_Ext

    dto.PanelManufacturer = data.PanelManufacturer_Ext
    dto.PrimaryHeatingType = data.PrimaryHeating
  /*  if (data.PrimaryHeating == typekey.HeatingType_HOE.TC_NONE_EXT) {   //TC_OTHER --Portal
      dto.PrimaryHeatingTypeDescription = data.PrimaryHeatingDescription
    }*/

    dto.RoofSlope = data.RoofSlope_Ext
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

    dto.UpstairsLaundrySurcharge = data.UpstairsLndrySurcharge_Ext
    dto.WiringType = data.WiringType
    if (data.WiringType == typekey.WiringType_HOE.TC_OTHER) {
      dto.WiringTypeDescription = data.WiringTypeDescription
    }
    dto.WiringUpgradeExists = data.ElectricalSystemUpgrade
    if (data.ElectricalSystemUpgrade) {
      dto.WiringUpgradeYear = data.ElectricalSystemUpgradeDate
    }

  }


  /**
   * Updates base construction properties on the data if <code>dto</code> is not <code>null</code>.
   * If <code>dto</code> is <code>null</code> this method does nothing.
   */
  public static function updateFrom(data : Dwelling_HOE, dto : ConstructionDTO) {
    if (dto == null) {
      return
    }

    mapTunaFields(data, dto, FROM)
    mapFieldsWithAdditionalLogic(data, dto, FROM)

    data.ElectricalSystemUpgrade = dto.WiringUpgradeExists
    if (dto.WiringUpgradeExists) {
      data.ElectricalSystemUpgradeDate = dto.WiringUpgradeYear
    }


    data.ElectricalType = dto.ElectricalType
    /* if (dto.ElectricalType == typekey.BreakerType_HOE.TC_CIRCUITBREAKER) {  //TC_OTHER --Portal
       data.ElectricalTypeDescription = dto.ElectricalTypeDescription
     }*/
    data.PropertyCovByStateWndstorm_Ext = dto.EligibleForWindStormCov


    data.FloorLocation_Ext = dto.FloorLocation
    data.Foundation = dto.FoundationType
    if (data.Foundation == typekey.FoundationType_HOE.TC_OTHER) {
      data.FoundationTypeOther_Ext = dto.FoundationTypeDescription
    }



    //Has Garage
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

    data.HeatSrcCentralElectric = dto.HasHeatSrcCentralElectric
    data.HeatSrcCentralNaturalGas = dto.HasHeatSrcCentralNaturalGas
    data.HeatSrcCentralPropane = dto.HasHeatSrcCentralPropane
    data.HeatSrcCentralOther = dto.HasHeatSrcCentralOther
    data.HeatSrcFireplace = dto.HasHeatSrcFireplace
    data.HeatSrcPortableAllFuelTypes = dto.HasHeatSrcPortableAllFuelTypes
    data.HeatSrcWoodBurningStove = dto.HasHeatSrcWoodBurningStove

    data.NumberofAmps_Ext = dto.NumberOfAmps
    data.NumberofRoofLayers_Ext = dto.NumberOfRoofLayers
    data.PanelManufacturer_Ext = dto.PanelManufacturer

    data.PlumbingType = dto.PlumbingType
    if (dto.PlumbingType == typekey.PlumbingType_HOE.TC_OTHER) {
      data.PlumbingTypeDescription = dto.PlumbingTypeDescription
    }
    data.PlumbingUpgrade = dto.PlumbingUpgradeExists
    if (dto.PlumbingUpgradeExists) {
      data.PlumbingUpgradeDate = dto.PlumbingUpgradeYear
    }

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


    data.RoofSlope_Ext = dto.RoofSlope

    data.RoofingUpgrade = dto.RoofUpgradeExists
    if (dto.RoofUpgradeExists) {
      data.RoofingUpgradeDate = dto.RoofUpgradeYear
    }

    data.SecondaryHeatingExists = dto.SecondaryHeatingExists
    data.HeatingUpgrade = dto.HeatingUpgradeExists
    if (dto.HeatingUpgradeExists) {
      data.HeatingUpgradeDate = dto.HeatingUpgradeYear
    }

    data.UpstairsLndrySurcharge_Ext = dto.UpstairsLaundrySurcharge
    data.WiringType = dto.WiringType
    if (data.WiringType == typekey.WiringType_HOE.TC_OTHER) {
      data.WiringTypeDescription = dto.WiringTypeDescription
    }

    data.YearBuilt = dto.YearBuilt

    data.beforeSavingDwellingConstructionPage()
  }

  private static function mapTunaFields(data : Dwelling_HOE, dto : ConstructionDTO, direction: MapDTODirection) {
    ConstructionDTO.TypeInfo.Properties.where( \ pInfo -> pInfo.FeatureType == TunaValueDTO.Type).each( \ propInfo -> mapTunaValue(data, dto, propInfo, direction))
  }

  private static function mapTunaValue(data : Dwelling_HOE, dto : ConstructionDTO, tunaDtoProp: IPropertyInfo, direction: MapDTODirection) {
    if(MapDTODirection.FROM.equals(direction) && dto != null) {
      var tunaDTO = tunaDtoProp.Accessor.getValue(dto) as TunaValueDTO
      if(tunaDTO != null) {
        tunaDTO.initialize(tunaDtoProp)
        tunaDTO.setValuesOnEntity(data)
      }
    }  else {
      var tunaDTO = new TunaValueDTO(tunaDtoProp)
      tunaDTO.getValuesFromEntity(data)
      tunaDtoProp.Accessor.setValue(dto, tunaDTO)
    }
  }

  private static function mapFieldsWithAdditionalLogic(data: Dwelling_HOE, dto: ConstructionDTO, direction: MapDTODirection) {
    mapConstructionType(data, dto, direction)
    mapRoofType(data, dto, direction)
    mapExteriorWallFinish(data,dto, direction)
  }

  private static function mapConstructionType(data : Dwelling_HOE, dto : ConstructionDTO, direction: MapDTODirection){
    if(MapDTODirection.FROM.equals(direction)) {
      if (dto.ConstructionType.ValueOrOverrideValue == typekey.ConstructionType_HOE.TC_OTHER) {
        data.ConstructionTypeOther= dto.ConstructionTypeDescription
      }
      if (dto.ConstructionTypeFloor2.ValueOrOverrideValue == typekey.ConstructionType_HOE.TC_OTHER) {
        data.ConstructionTypeLevel2Other = dto.ConstructionTypeLevel2Description
      }
    } else {
      if (data.ConstructionType == typekey.ConstructionType_HOE.TC_OTHER) {
        dto.ConstructionTypeDescription = data.ConstructionTypeOther
      }
      if (data.ConstructionTypeL2_Ext == typekey.ConstructionType_HOE.TC_OTHER) {
        dto.ConstructionTypeLevel2Description = data.ConstructionTypeLevel2Other
      }
    }
  }

  private static function mapExteriorWallFinish(data : Dwelling_HOE, dto : ConstructionDTO, direction: MapDTODirection) {

    if(MapDTODirection.FROM.equals(direction)) {
      if (dto.ExteriorWallFinish.ValueOrOverrideValue == typekey.ExteriorWallFinish_Ext.TC_OTHER) {
        data.ExteriorWallFinishOther = dto.ExteriorWallFinishDescription
      }
      if (dto.ExteriorWallFinishLevel1.ValueOrOverrideValue == typekey.ExteriorWallFinish_Ext.TC_OTHER) {
        data.ExteriorWallFinishLevel1Other = dto.ExteriorWallFinishLevel1Description
      }
      if (dto.ExteriorWallFinishLevel2.ValueOrOverrideValue == typekey.ExteriorWallFinish_Ext.TC_OTHER) {
        data.ExteriorWallFinishLevel2Other = dto.ExteriorWallFinishLevel2Description
      }
    } else {
      if (data.ExteriorWallFinish_Ext == typekey.ExteriorWallFinish_Ext.TC_OTHER) {
        dto.ExteriorWallFinishDescription = data.ExteriorWallFinishOther
      }
      if (data.ExteriorWallFinishL1_Ext == typekey.ExteriorWallFinish_Ext.TC_OTHER) {
        dto.ExteriorWallFinishLevel1Description= data.ExteriorWallFinishLevel1Other
      }
      if (data.ExteriorWallFinishL2_Ext == typekey.ExteriorWallFinish_Ext.TC_OTHER) {
        dto.ExteriorWallFinishLevel2Description= data.ExteriorWallFinishLevel2Other
      }
    }
  }

  private static function mapRoofType(data : Dwelling_HOE, dto : ConstructionDTO, direction: MapDTODirection){
    if(MapDTODirection.FROM.equals(direction) && dto.RoofType != null) {
      if (dto.RoofType.ValueOrOverrideValue == typekey.RoofType.TC_OTHER) {
        data.RoofTypeDescription = dto.RoofTypeDescription
      }
    } else {
      if (data.RoofType == typekey.RoofType.TC_OTHER) {
        dto.RoofTypeDescription = data.RoofTypeDescription
      }
    }
  }


  private enum MapDTODirection {
    TO(),
    FROM()
  }

}
