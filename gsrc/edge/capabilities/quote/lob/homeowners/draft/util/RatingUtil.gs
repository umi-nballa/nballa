package edge.capabilities.quote.lob.homeowners.draft.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.lob.homeowners.draft.dto.RatingDTO

/**
 * Utilities used to work with OOTB rating screen (fire extinguishers, exotic animals, etc...)
 */
final class RatingUtil {
  construct() {
    throw new UnsupportedOperationException("This is an utility class.")
  }

  /**
   * Fills Guidewire-provided properties on the dto.
   */
  public static function fillBaseProperties(dto: RatingDTO, data: Dwelling_HOE) {
    /* REQUIRED FIELDS */    // --portal
    dto.FireExtinguishers = data.DwellingProtectionDetails.FireExtinguishers

    dto.BurglarAlarm = data.DwellingProtectionDetails.BurglarAlarm
    if (data.DwellingProtectionDetails.BurglarAlarm) {
      dto.BurglarAlarmType = data.DwellingProtectionDetails.BurglarAlarmType
    }

    dto.FireAlarm = data.DwellingProtectionDetails.FireAlarm;

    dto.SmokeAlarm = data.DwellingProtectionDetails.SmokeAlarm
    if (data.DwellingProtectionDetails.SmokeAlarm) {
      dto.SmokeAlarmOnAllFloors = data.DwellingProtectionDetails.SmokeAlarmOnAllFloors
    }

    dto.Deadbolts = data.DwellingProtectionDetails.Deadbolts;
    if (data.DwellingProtectionDetails.Deadbolts) {
      dto.DeadboltsNumber = 1;
    }

    dto.VisibleToNeighbors = data.DwellingProtectionDetails.VisibleToNeighbors

    dto.SprinklerSystemType = typekey.SprinklerSystemType_HOE.TC_FULL

    /* OPTIONAL FIELDS */
    dto.RoomerBoarders = data.RoomerBoarders
    if (data.RoomerBoarders) {
      dto.RoomerBoardersNumber = data.RoomerBoardersNumber
    }

    dto.UnitsNumber = data.UnitsNumber

    dto.FireplaceOrWoodStoveExists = data.FireplaceOrWoodStoveExists
    if (data.FireplaceOrWoodStoveExists) {
      dto.FireplaceOrWoodStovesNumber = data.FireplaceOrWoodStovesNumber
    }

    dto.SwimmingPoolExists = data.SwimmingPoolExists
    if (data.SwimmingPoolExists) {
      dto.SwimmingPoolFencing = data.SwimmingPoolFencing
      dto.SwimmingPoolDivingBoard = data.SwimmingPoolDivingBoard
    }

    dto.TrampolineExists = data.TrampolineExists
    if (data.TrampolineExists) {
      dto.TrampolineSafetyNet = data.TrampolineSafetyNet
    }

    /** Flooding */
    dto.KnownWaterLeakage = data.KnownWaterLeakage
    if (data.KnownWaterLeakage) {
      dto.KnownWaterLeakageDescription = data.KnownWaterLeakageDescription
    }
  }

  /**
   * Updates base rating properties on the data if <code>dto</code> is not <code>null</code>.
   * If <code>dto</code> is <code>null</code> this method does nothing.
   */
  public static function updateFrom(data: Dwelling_HOE, dto: RatingDTO) {
    if (dto == null) {
      return
    }

   /* *//* REQUIRED FIELDS *//*
    data.FireExtinguishers = dto.FireExtinguishers

    data.BurglarAlarm = dto.BurglarAlarm
    if (dto.BurglarAlarm) {
      data.BurglarAlarmType = dto.BurglarAlarmType
    }

    data.FireAlarm = dto.FireAlarm

    data.SmokeAlarm = dto.SmokeAlarm
    if (dto.SmokeAlarm) {
      data.SmokeAlarmOnAllFloors = dto.SmokeAlarmOnAllFloors
    }

    data.Deadbolts = dto.Deadbolts;
    if (dto.Deadbolts) {
      data.DeadboltsNumber = 1;
    }

    data.VisibleToNeighbors = dto.VisibleToNeighbors

    data.SprinklerSystemType = dto.SprinklerSystemType*/

    /* OPTIONAL FIELDS */
    data.RoomerBoarders = dto.RoomerBoarders
    if (dto.RoomerBoarders) {
      data.RoomerBoardersNumber = dto.RoomerBoardersNumber
    }

    data.UnitsNumber = dto.UnitsNumber

    data.FireplaceOrWoodStoveExists = dto.FireplaceOrWoodStoveExists
    if (dto.FireplaceOrWoodStoveExists) {
      data.FireplaceOrWoodStovesNumber = dto.FireplaceOrWoodStovesNumber
    }

    data.SwimmingPoolExists = dto.SwimmingPoolExists
    if (dto.SwimmingPoolExists) {
      data.SwimmingPoolFencing = dto.SwimmingPoolFencing
      data.SwimmingPoolDivingBoard = dto.SwimmingPoolDivingBoard
    }

    data.TrampolineExists = dto.TrampolineExists
    if (dto.TrampolineExists) {
      data.TrampolineSafetyNet = dto.TrampolineSafetyNet
    }

    data.TrampolineExists = dto.TrampolineExists
    if (dto.TrampolineExists) {
      data.TrampolineSafetyNet = dto.TrampolineSafetyNet
    }

    /** Flooding */
    data.KnownWaterLeakage = dto.KnownWaterLeakage
    if (dto.KnownWaterLeakage) {
      data.KnownWaterLeakageDescription = dto.KnownWaterLeakageDescription
    }

    data.beforeSavingDwellingPage()
  }
}
