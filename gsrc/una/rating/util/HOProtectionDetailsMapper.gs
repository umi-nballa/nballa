package una.rating.util
/**
 * Created with IntelliJ IDEA.
 * User: proy
 * Date: 2/14/17
 * Time: 3:35 PM
 * To change this template use File | Settings | File Templates.
 */
class HOProtectionDetailsMapper {

  static final var NO_PROTECTIVE_DEVICE : String = "No Protective Devices"
  static final var SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_BURGLAR_ALARM_TO_CNTL_STN : String = "Smoke or Fire Alarm + Fire Extinguisher + Dead Bolts + Burglar alarm reporting to Central Station"
  static final var SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_CMPLT_BURGLAR_ALARM : String = "Smoke or Fire Alarm + Fire Extinguisher + Dead Bolts + Complete Burglar Alarm"
  static final var SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_CMPLT_HOME_SPRINKLER_SYSTEM : String = "Smoke or Fire Alarm + Fire Extinguisher + Dead Bolts + Complete home sprinkler system"
  static final var SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_FIRE_ALARM_TO_CNTL_STN : String = "Smoke or Fire Alarm + Fire Extinguisher + Dead Bolts + Fire alarm reporting to Central Station"
  static final var SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT : String = "Smoke or Fire Alarm + Fire Extinguisher + Dead Bolts"
  static final var BURGLAR_ALARM_TO_CNTL_STN_PLUS_FIRE_ALARM_TO_CNTL_STN : String = "Burglar alarm reporting to Central Station + Fire alarm reporting to Central Station"
  static final var BURGLAR_ALARM_TO_CNTL_STN_PLUS_CMPLT_HOME_SPRINKLER_SYSTEM : String = "Burglar alarm reporting to Central Station + Complete home sprinkler systems"
  static final var BURGLAR_ALARM_TO_CNTL_STN : String = "Burglar alarm reporting to Central Station"
  static final var CMPLT_BURGLAR_ALARM : String = "Complete Burglar Alarm"
  static final var CMPLT_HOME_SPRINKLER_SYSTEM : String = "Complete home sprinkler system"
  static final var FIRE_ALARM_TO_CNTL_STN : String = "Fire alarm reporting to Central Station"
  static final var SMOKE_OR_FIRE_ALARM : String = "Smoke or Fire Alarm"


  static function getProtectionDetails(dwelling : Dwelling_HOE, state: Jurisdiction): String {
    var protectionDetails = NO_PROTECTIVE_DEVICE

    var localFireAlarm : boolean = false
    var fireAlarmReportFireStn : boolean = false
    var fireAlarmReportPoliceStn : boolean = false
    var fireAlarmReportCntlStn : boolean = false

    var fireExtinguishers : boolean = false
    var deadbolts : boolean = false

    var completeLocalBurglarAlarm : boolean = false
    var burglarAlarmReportPoliceStn : boolean = false
    var burglarAlarmReportCntlStn : boolean = false

    var localSmokeAlarm : boolean = false
    var smokeAlarmOnAllFloors : boolean = false

    var completeHomeSprinklerSystem : boolean = false
    var automaticSprinklerSystem : boolean = false

    var gatedCommunity : boolean = false

    if(dwelling?.DwellingProtectionDetails?.FireAlarm){
        localFireAlarm = true
    }
    if(dwelling?.DwellingProtectionDetails?.FireAlarmReportFireStn){
        fireAlarmReportFireStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.FireAlarmReportPoliceStn){
       fireAlarmReportPoliceStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.FireAlarmReportCntlStn){
      fireAlarmReportCntlStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.FireExtinguishers){
      fireExtinguishers = true
    }
    if(dwelling?.DwellingProtectionDetails?.Deadbolts){
      deadbolts = true
    }
    if(dwelling?.DwellingProtectionDetails?.BurglarAlarm){
      completeLocalBurglarAlarm = true
    }
    if(dwelling?.DwellingProtectionDetails?.BurglarAlarmReportPoliceStn){
      burglarAlarmReportPoliceStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.BurglarAlarmReportCntlStn){
      burglarAlarmReportCntlStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.SmokeAlarm){
      localSmokeAlarm = true
    }
    if(dwelling?.DwellingProtectionDetails?.SprinklerSystemAllAreas){
      completeHomeSprinklerSystem = true
    }
    if(dwelling?.DwellingProtectionDetails?.AutomaticSprinkler){
      automaticSprinklerSystem = true
    }
    if(dwelling?.DwellingProtectionDetails?.GatedCommunity){
      gatedCommunity = true
    }

    switch(state){
      case TC_NV:
           protectionDetails = extractProtectionDetails(localFireAlarm, localSmokeAlarm, fireExtinguishers, deadbolts, burglarAlarmReportCntlStn,
               fireAlarmReportCntlStn, completeLocalBurglarAlarm, completeHomeSprinklerSystem)
           return protectionDetails
      case TC_AZ:
          protectionDetails = extractProtectionDetails(localFireAlarm, localSmokeAlarm, fireExtinguishers, deadbolts, burglarAlarmReportCntlStn,
              fireAlarmReportCntlStn, completeLocalBurglarAlarm, completeHomeSprinklerSystem)
          return protectionDetails
    }
    return protectionDetails
  }

  private static function extractProtectionDetails(localFireAlarm : boolean, localSmokeAlarm : boolean, fireExtinguishers : boolean, deadbolts :
      boolean, burglarAlarmReportCntlStn : boolean, fireAlarmReportCntlStn : boolean, completeLocalBurglarAlarm : boolean, completeHomeSprinklerSystem : boolean) : String {

        if((localFireAlarm or localSmokeAlarm) and fireExtinguishers and deadbolts and burglarAlarmReportCntlStn){
        return SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_BURGLAR_ALARM_TO_CNTL_STN
        } else if((localFireAlarm or localSmokeAlarm) and fireExtinguishers and deadbolts and fireAlarmReportCntlStn){
        return SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_FIRE_ALARM_TO_CNTL_STN
        } else if((localFireAlarm or localSmokeAlarm) and fireExtinguishers and deadbolts and completeLocalBurglarAlarm){
        return SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_CMPLT_BURGLAR_ALARM
        } else if((localFireAlarm or localSmokeAlarm) and fireExtinguishers and deadbolts and completeHomeSprinklerSystem){
        return SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT_PLUS_CMPLT_HOME_SPRINKLER_SYSTEM
        } else if((localFireAlarm or localSmokeAlarm) and fireExtinguishers and deadbolts){
        return SMOKE_OR_FIRE_ALARM_PLUS_FIRE_EXT_PLUS_DEADBOLT
        } else if(burglarAlarmReportCntlStn and fireAlarmReportCntlStn){
        return BURGLAR_ALARM_TO_CNTL_STN_PLUS_FIRE_ALARM_TO_CNTL_STN
        } else if(burglarAlarmReportCntlStn and completeHomeSprinklerSystem){
        return BURGLAR_ALARM_TO_CNTL_STN_PLUS_CMPLT_HOME_SPRINKLER_SYSTEM
        } else if(localFireAlarm or localSmokeAlarm){
        return SMOKE_OR_FIRE_ALARM
        } else if(completeLocalBurglarAlarm){
        return CMPLT_BURGLAR_ALARM
        } else if(burglarAlarmReportCntlStn){
        return BURGLAR_ALARM_TO_CNTL_STN
        } else if(fireAlarmReportCntlStn){
        return FIRE_ALARM_TO_CNTL_STN
        } else if(completeHomeSprinklerSystem){
        return CMPLT_HOME_SPRINKLER_SYSTEM
        } else
        return NO_PROTECTIVE_DEVICE
  }
}