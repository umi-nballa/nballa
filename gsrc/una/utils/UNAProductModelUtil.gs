package una.utils

uses java.util.Map
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: TVang                                                                                      ,
 * Date: 4/24/17
 * Time: 10:44 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAProductModelUtil {
  public static final var DWELLING_UW_QUESTIONS_DISPLAY_ORDER_DP : Map<String, Integer> = {
    "TotalNumberOfRentalUnitsUnderCommonOwnership" -> 1,
    "IsPremisesUsedForResidentialPurposes" -> 2,
    "HasFloodCoverageInPlace" -> 3,
    "WhatTypeOfFuelTanksIfAny" -> 4,
    "TypeOfFuel" -> 5,
    "FuelIfOther" -> 6,
    "DoesFuelTankMeetBuildingCodes" -> 7,
    "FuelTankCapacity" -> 8,
    "ClosestDistanceTankToDwelling" -> 9,
    "HasSwimmingPoolOrHottub" -> 10,
    "PrimaryProtectionForPoolHottub" -> 11,
    "SwimmingPoolHasSlide" -> 12,
    "DoesSwimmingPoolHaveAllProtectiveRequiredEquipment" -> 13,
    "ConductsBusinessFromInsuredLocation" -> 14,
    "IsDwellingUsedForHomeSharingTradingExchange" -> 15,
    "IsBusinessConductedAtInsuredLocation_DF" -> 16,
    "WhatTypeOfBusiness_DF" -> 17,
    "IsBusinessPolicyInPlace_DF" -> 18,
    "NameOfBusiness" -> 19,
    "AverageNumOfAcceptedPeopleOnPremises" -> 20,
    "SquareFeetForBusiness" -> 21,
    "EquipmentSuppliesInventoryKeptAtLocation" -> 22,
    "PropertyHasStructuresConstructedOverWater" -> 23,
    "AnyWindowsWithBarsWithNoQuickReleaseMechanism" -> 24,
    "AreTenantsAllowedToDoExtremeSports_DF" -> 25,
    "TenantKeepsBitingAnimals_DF" -> 26,
    "TenantOwnsAggressiveDog_DF" -> 27,
    "IsThereAnyMoldDamage" -> 28,
    "HasMoldBeenProfessionallyRemoved" -> 29,
    "IsThereALocalPropertyManager" -> 30,
    "DoesDwellingReceivePublicUtility" -> 31,
    "IsDwellingBuiltOnSteepHillside" -> 32,
    "IsDwellingLocatedWithin1000ftSaltwater" -> 33,
    "IsTenantAllowedToOperateATV" -> 34,
    "IsThePremisesUnderConstruction_DF" -> 35,
    "IsDwellingForSale_DF" -> 36,
    "IsTheDwellingBeingPurchasedUnderForeclosure" -> 37,
    "IsPremisesUsedAsGroupHome" -> 38
  }

  public static final enum DwellingUWQuestionCodes{
    TOTAL_RENTAL_UNITS_COMMON_OWNERSHIP_DF("TotalNumberOfRentalUnitsUnderCommonOwnership"),
    IS_DWELLING_USED_FOR_HOME_SHARING("IsDwellingUsedForHomeSharingTradingExchange"),
    UNOCCUPIED_OVER_9_MONTHS_HO("IsPropertyUnoccupiedForMoreThan9ConsecutiveMonths"),
    FUEL_TANKS_IF_ANY("WhatTypeOfFuelTanksIfAny"),
    TYPE_OF_FUEL("TypeOfFuel"),
    FUEL_IF_OTHER("FuelIfOther"),
    FUEL_TANK_CODE_COMPLIANT("DoesFuelTankMeetBuildingCodes"),
    FUEL_TANK_CAPACITY("FuelTankCapacity"),
    CLOSEST_DISTANCE_TO_FUEL_TANK("ClosestDistanceTankToDwelling"),
    PRIMARY_SWIMMING_POOL_PROTECTION("PrimaryProtectionForPoolHottub"),
    HAS_SWIMMING_POOL("HasSwimmingPoolOrHottub"),
    SWIMMING_POOL_HAS_SLIDE("SwimmingPoolHasSlide"),
    HAS_FLOOD_COVERAGE_DF("HasFloodCoverageInPlace"),
    PROPERTY_CONSTRUCTED_OVER_WATER("PropertyHasStructuresConstructedOverWater"),
    TYPE_OF_BUSINESS_HO("TypeOfBusinessConducted"),
    TYPE_OF_BUSINESS_DF("WhatTypeOfBusiness_DF"),
    CONDUCTS_BUSINESS_HO("ConductsBusinessFromInsuredLocation"),
    CONDUCTS_BUSINESS_DF("IsBusinessConductedAtInsuredLocation_DF"),
    HAS_BUSINESS_POLICY_HO("HasBusinessPolicyInPlaceHO"),
    HAS_BUSINESS_POLICY_DF("IsBusinessPolicyInPlace_DF"),
    OWNS_AGGRESSIVE_DOG_HO("DoesApplicantOwnAggressiveDog"),
    OWNS_AGGRESSIVE_DOG_DF("TenantOwnsAggressiveDog_DF"),
    OPERATES_DAYCARE_PER_FLORIDA_STATUTE_HO("DoesApplicantOperateDaycareFLStatute"),
    IS_DAYCARE_REGISTERED_HO("IsDaycareRegistered"),
    NAME_OF_BUSINESS("NameOfBusiness"),
    AVERAGE_NUM_CLIENTS("AverageNumOfAcceptedPeopleOnPremises"),
    SQUARE_FEET_BUSINESS("SquareFeetForBusiness"),
    INVENTORY_KEPT_AT_LOCATION("EquipmentSuppliesInventoryKeptAtLocation"),
    HAS_TRAMPOLINE_ETC_HO("HasTrampolineOrExtremeSportingApparatus"),
    HAS_TRAMPOLINE_ETC_DF("AreTenantsAllowedToDoExtremeSports_DF"),
    OWNS_BITING_ANIMALS_HO("DoesApplicantOwnBitingAnimals"),
    TENANT_KEEPS_BITING_ANIMALS_DF("TenantKeepsBitingAnimals_DF"),
    HAS_BARS_NO_QUICK_RELEASE("AnyWindowsWithBarsWithNoQuickReleaseMechanism"),
    HAS_MOLD_DAMAGE("IsThereAnyMoldDamage"),
    MOLD_DAMAGE_REMEDIATED("HasMoldBeenProfessionallyRemoved"),
    IS_USED_AS_GROUP_HOME("IsPremisesUsedAsGroupHome"),
    HAS_ATV_HO("DoesAnyoneOwnATV"), HAS_ATV_DF("IsTenantAllowedToOperateATV"),
    WILL_BE_UNDER_CONSTRUCTION_HO("WillDwellingBeUnderConstruction30DaysAFterEffDate"),
    WILL_BE_UNDER_CONSTRUCTION_DF("IsThePremisesUnderConstruction_DF"),
    IS_BEING_RENOVATED_HO("IsDwellingUndergoingRenovation"),
    USED_EXCLUSIVELY_FOR_RESIDENTIAL_PURPOSES_DF("IsPremisesUsedForResidentialPurposes"),
    HAS_LOCAL_PROPERTY_MANAGER_DF("IsThereALocalPropertyManager"),
    RECEIVES_PUBLIC_UTILITY_SERVICE_DF("DoesDwellingReceivePublicUtility"),
    BUILT_ON_STEEP_HILLSIDE_DF("IsDwellingBuiltOnSteepHillside"),
    LOCATED_1000FT_SALTWATER_DF("IsDwellingLocatedWithin1000ftSaltwater"),
    IS_DWELLING_FOR_SALE_DF("IsDwellingForSale_DF"),
    IS_DWELLING_PURCHASED_UNDER_FORECLOSURE("IsTheDwellingBeingPurchasedUnderForeclosure"),
    HAS_COMMERCIAL_LIABILITY_INS_HO ("HasCommercialDaycareLiabilityInsurance"),
    USED_FOR_RESIDENTIAL_PURPOSES_DF("IsPremisesUsedForResidentialPurposes"),
    DOES_SWIMMING_POOL_MEET_REGULATIONS("DoesSwimmingPoolHaveAllProtectiveRequiredEquipment"),

    private var _code : String

    private construct(code : String){
      this._code = code
    }

    property get QuestionCode() : String{
      return _code
    }
  }
}