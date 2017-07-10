package edge.capabilities.quote.lob.homeowners.draft.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.lob.homeowners.draft.dto.ConstructionDTO
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses gw.lang.reflect.IPropertyInfo
uses edge.capabilities.quote.draft.dto.BaseTunaValueUtil
uses gw.lang.reflect.IType

/**
 * Utilities used to work with OOTB construction screen (building materials, wind class, etc...)
 */
final class ConstructionUtil extends BaseTunaValueUtil {


  construct() {
    throw new UnsupportedOperationException("This is an utility class.")
  }

  /**
   * Fills Guidewire-provided properties on the dto.
   */
  public static function fillBaseProperties(dto : ConstructionDTO, data : Dwelling_HOE) {

    mapTunaFields(data, dto, ConstructionDTO, TO)
    mapFieldsWithAdditionalLogic(data, dto, TO)

    dto.DoorStrength = data.DoorStrength_Ext
    dto.ElectricalType = data.ElectricalType
    /*if (data.ElectricalType == typekey.BreakerType_HOE.TC_OTHER) {  --poratl
      dto.ElectricalTypeDescription = data.ElectricalTypeDescription
    }*/

    dto.EligibleForWindStormCov = data.PropertyCovByStateWndstorm_Ext
    dto.FBCWindSpeed = data.FBCWindSpeed_Ext
    dto.FloorLocation = data.FloorLocation_Ext

    dto.FoundationHeight = data.FoundationHeight_Ext
    dto.FoundationMaterial = data.FoundationMaterial_Ext
    dto.FoundationProtected = data.SubstantialBarrierDebris_Ext
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

    dto.HailResistantRoofCredit = data.HailResistantRoofCredit_Ext
    dto.HasHeatSrcCentralElectric = data.HeatSrcCentralElectric
    dto.HasHeatSrcCentralNaturalGas = data.HeatSrcCentralNaturalGas
    dto.HasHeatSrcCentralPropane = data.HeatSrcCentralPropane
    dto.HasHeatSrcCentralOther = data.HeatSrcCentralOther
    dto.HasHeatSrcFireplace = data.HeatSrcFireplace
    dto.HasHeatSrcPortableAllFuelTypes = data.HeatSrcPortableAllFuelTypes
    dto.HasHeatSrcWoodBurningStove = data.HeatSrcWoodBurningStove

    dto.HasWindMitForm = data.WindMitigation_Ext

    dto.HeatingUpgradeExists = data.HeatingUpgrade
    if (data.HeatingUpgrade) {
      dto.HeatingUpgradeYear = data.HeatingUpgradeDate
    }

    dto.InternalPressureDesign = data.InternalPressureDsgn_Ext
    dto.NumberOfAmps = data.NumberofAmps_Ext
    dto.NumberOfRoofLayers = data.NumberofRoofLayers_Ext
    dto.OpeningProtection = data.OpeningProtection_Ext
    dto.PanelManufacturer = data.PanelManufacturer_Ext
    dto.PrimaryHeatingType = data.PrimaryHeating
  /*  if (data.PrimaryHeating == typekey.HeatingType_HOE.TC_NONE_EXT) {   //TC_OTHER --Portal
      dto.PrimaryHeatingTypeDescription = data.PrimaryHeatingDescription
    }*/

    dto.PlumbingType = data.PlumbingType
    if (data.PlumbingType == typekey.PlumbingType_HOE.TC_OTHER) {
      dto.PlumbingTypeDescription = data.PlumbingTypeDescription
    }
    dto.PlumbingUpgradeExists = data.PlumbingUpgrade
    if (dto.PlumbingUpgradeExists) {
      dto.PlumbingUpgradeYear = data.PlumbingUpgradeDate
    }

    dto.PropertyContainsAsbestos = data.BldgThatContainAsbestos_Ext
    dto.RoofCover = data.RoofCover_Ext
    dto.RoofDeckAttachment = data.RoofDeckAttachment_Ext
    dto.RoofDecking = data.RoofDecking_Ext

    dto.RoofSlope = data.RoofSlope_Ext
    dto.RoofWallConnection = data.RoofWallConnection_Ext
    /* Value is true per spec saying that default value have to be true. */
    dto.SecondaryHeatingExists = data.SecondaryHeatingExists == null ? true : data.SecondaryHeatingExists
    dto.SecondaryWaterResistance = data.SecondaryWaterResis_Ext
    dto.SupplementalHeatingSurcharge = data.SupplHeatingSurcharge_Ext
    dto.Terrain = data.Terrain_Ext
    dto.UpstairsLaundrySurcharge = data.UpstairsLndrySurcharge_Ext
    dto.WindBorneDebrisRegion = data.WindBorneDebrisRegion_Ext
    dto.WindSpeedOfDesign = data.WindSpeedOfDesign_Ext
    dto.WindStormHurricaneHailExclusion = data.WHurricaneHailExclusion_Ext

    dto.WiringType = data.WiringType
    if (data.WiringType == typekey.WiringType_HOE.TC_OTHER) {
      dto.WiringTypeDescription = data.WiringTypeDescription
    }
    dto.WiringUpgradeExists = data.ElectricalSystemUpgrade
    if (data.ElectricalSystemUpgrade) {
      dto.WiringUpgradeYear = data.ElectricalSystemUpgradeDate
    }


    dto.YearBuilt = data.YearBuilt
  }

  /**
   * Updates base construction properties on the data if <code>dto</code> is not <code>null</code>.
   * If <code>dto</code> is <code>null</code> this method does nothing.
   */
  public static function updateFrom(data : Dwelling_HOE, dto : ConstructionDTO) {
    if (dto == null) {
      return
    }

    // Map values for all Tuna fields
    mapTunaFields(data, dto, ConstructionDTO, FROM)
    // Handle additional logic go tuna related fields
    mapFieldsWithAdditionalLogic(data, dto, FROM)

    data.DoorStrength_Ext = dto.DoorStrength
    data.ElectricalSystemUpgrade = dto.WiringUpgradeExists
    if (dto.WiringUpgradeExists) {
      data.ElectricalSystemUpgradeDate = dto.WiringUpgradeYear
    }

    data.ElectricalType = dto.ElectricalType
    /* if (dto.ElectricalType == typekey.BreakerType_HOE.TC_CIRCUITBREAKER) {  //TC_OTHER --Portal
       data.ElectricalTypeDescription = dto.ElectricalTypeDescription
     }*/

    data.FBCWindSpeed_Ext = dto.FBCWindSpeed
    data.FloorLocation_Ext = dto.FloorLocation

    data.FoundationHeight_Ext =  dto.FoundationHeight
    data.FoundationMaterial_Ext = dto.FoundationMaterial

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

    data.HailResistantRoofCredit_Ext = dto.HailResistantRoofCredit
    data.HeatSrcCentralElectric = dto.HasHeatSrcCentralElectric
    data.HeatSrcCentralNaturalGas = dto.HasHeatSrcCentralNaturalGas
    data.HeatSrcCentralPropane = dto.HasHeatSrcCentralPropane
    data.HeatSrcCentralOther = dto.HasHeatSrcCentralOther
    data.HeatSrcFireplace = dto.HasHeatSrcFireplace
    data.HeatSrcPortableAllFuelTypes = dto.HasHeatSrcPortableAllFuelTypes
    data.HeatSrcWoodBurningStove = dto.HasHeatSrcWoodBurningStove

    data.HeatingUpgrade = dto.HeatingUpgradeExists
    if (dto.HeatingUpgradeExists) {
      data.HeatingUpgradeDate = dto.HeatingUpgradeYear
    }

    data.InternalPressureDsgn_Ext = dto.InternalPressureDesign


    data.NumberofAmps_Ext = dto.NumberOfAmps
    data.NumberofRoofLayers_Ext = dto.NumberOfRoofLayers
    data.OpeningProtection_Ext = dto.OpeningProtection
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
    data.BldgThatContainAsbestos_Ext = dto.PropertyContainsAsbestos
    data.PropertyCovByStateWndstorm_Ext = dto.EligibleForWindStormCov
    data.RoofCover_Ext = dto.RoofCover
    data.RoofDeckAttachment_Ext = dto.RoofDeckAttachment
    data.RoofDecking_Ext = dto.RoofDecking

    data.RoofSlope_Ext = dto.RoofSlope

    data.RoofingUpgrade = dto.RoofUpgradeExists
    if (dto.RoofUpgradeExists) {
      data.RoofingUpgradeDate = dto.RoofUpgradeYear
    }

    data.RoofWallConnection_Ext = dto.RoofWallConnection
    data.SecondaryHeatingExists = dto.SecondaryHeatingExists
    data.SecondaryWaterResis_Ext = dto.SecondaryWaterResistance
    data.SubstantialBarrierDebris_Ext = dto.FoundationProtected
    data.SupplHeatingSurcharge_Ext = dto.SupplementalHeatingSurcharge
    data.Terrain_Ext = dto.Terrain
    data.UpstairsLndrySurcharge_Ext = dto.UpstairsLaundrySurcharge

    data.WHurricaneHailExclusion_Ext = dto.WindStormHurricaneHailExclusion
    data.WindBorneDebrisRegion_Ext = dto.WindBorneDebrisRegion
    data.WindMitigation_Ext = dto.HasWindMitForm
    data.WindSpeedOfDesign_Ext = dto.WindSpeedOfDesign

    data.WiringType = dto.WiringType
    if (data.WiringType == typekey.WiringType_HOE.TC_OTHER) {
      data.WiringTypeDescription = dto.WiringTypeDescription
    }


    data.YearBuilt = dto.YearBuilt

    data.beforeSavingDwellingConstructionPage()
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



}
