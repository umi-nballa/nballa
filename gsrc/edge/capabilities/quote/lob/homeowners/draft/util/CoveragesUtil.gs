package edge.capabilities.quote.lob.homeowners.draft.util

uses edge.capabilities.policy.coverages.UNACoverageDTO
uses edge.capabilities.policy.coverages.UNAScheduledItemDTO
uses edge.capabilities.policy.coverages.UNACoverageTermDTO
uses gw.api.domain.Clause
uses java.util.ArrayList
uses edge.capabilities.address.dto.AddressDTO

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 5/26/17
 * Time: 12:11 PM
 * To change this template use File | Settings | File Templates.
 */
final class CoveragesUtil {

  public static function fillBaseProperties(period : PolicyPeriod) : UNACoverageDTO[]{
    var results : List<UNACoverageDTO> = {}

    period.AllCoverables*.CoveragesFromCoverable.each( \ coverage -> {
      var coverageDTO = new UNACoverageDTO()
      coverageDTO.Code = coverage.PatternCode

      if(coverage.Scheduled){
        coverageDTO.ScheduledItems = getScheduledItemDTOs(coverage)
      }else{
        var coveragesTerms : List<UNACoverageTermDTO> = {}

        coverage.CovTerms.each( \ covTerm -> {
          var covTermDTO = new UNACoverageTermDTO()
          covTermDTO.Code = covTerm.PatternCode
          covTermDTO.Value = covTerm.ValueAsString
          coveragesTerms.add(covTermDTO)
        })

        coverageDTO.CoverageTerms = coveragesTerms
      }

      results.add(coverageDTO)
    })

    return results
  }

  public static function updateFrom(period : PolicyPeriod, coverageDTOs : UNACoverageDTO[]){
    coverageDTOs?.each( \ coverageDTO -> {
      var entityCov = getOrCreateCoverageConditionOrExclusion(coverageDTO.Code, period) as Coverage

      updateCoverageTerms(coverageDTO, entityCov)
      updateScheduledItems(coverageDTO, entityCov)
    })

    removeCoverages(coverageDTOs, period)
  }

  private static function getScheduledItemDTOs(coverage : Coverage) : List<UNAScheduledItemDTO>{
    var results = new ArrayList<UNAScheduledItemDTO>()

    var scheduledItems = getSortedScheduledItemsForCoverage(coverage)

    scheduledItems.each( \ scheduledItemEntity -> {
      results.add(toScheduledItemDTO(scheduledItemEntity))
    })

    return results
  }

  private static function toScheduledItemDTO(scheduledItem : gw.pl.persistence.core.Bean) : UNAScheduledItemDTO{
    var result = new UNAScheduledItemDTO()

    switch(scheduledItem.IntrinsicType.RelativeName){
      case "ScheduledItem_HOE":
          var scheduledPPItem = scheduledItem as ScheduledItem_HOE
          result.Value = scheduledPPItem.ExposureValue
          result.ScheduleTypeCode = scheduledPPItem.ScheduleType.Code
          result.Description = scheduledPPItem.Description
          break
      case "CoveredLocation_HOE":
          var scheduledLocationItem = scheduledItem as CoveredLocation_HOE
          result.NumberOfFamilies = scheduledLocationItem.NumberOfFamilies
          result.Address = new AddressDTO()
          result.Address.AddressLine1 = scheduledLocationItem.PolicyLocation.AddressLine1
          result.Address.City = scheduledLocationItem.PolicyLocation.City
          result.Address.State = scheduledLocationItem.PolicyLocation.State
          result.Address.PostalCode = scheduledLocationItem.PolicyLocation.PostalCode
          result.Address.Country = scheduledLocationItem.PolicyLocation.Country
          result.Address.AddressType = scheduledLocationItem.PolicyLocation.AddressType
          break
      case "HOscheduleItem_HOE_Ext":
          var scheduledWatercraft = scheduledItem as HOscheduleItem_HOE_Ext
          result.Name = scheduledWatercraft.watercraftName
          result.WatercraftTypeCode = scheduledWatercraft.watercraftType.Code
          result.OverallLengthTypeCode = scheduledWatercraft.overallLength.Code
          result.SpeedRatingTypeCode = scheduledWatercraft.speedRating.Code
          result.HorsePowerTypeCode = scheduledWatercraft.horsepower.Code
          result.MotorDescription = scheduledWatercraft.MotorADesc
          break
    }

    return result
  }

  private static function getOrCreateCoverageConditionOrExclusion(clausePattern: String, period: PolicyPeriod) : Clause{
    var result : Clause

    var currentClause = period.AllExclusionsConditionsAndCoverages.firstWhere( \ clause -> clause.Pattern.CodeIdentifier.equalsIgnoreCase(clausePattern))

    if(currentClause != null){
      result = currentClause
    }else{
      result = period.getOwningCoverable(clausePattern, period).createCoverageConditionOrExclusion(clausePattern)
    }

    return result
  }

  public static function initCoverages(period : PolicyPeriod){
    period.AllCoverables?.each( \ coverable -> {
      if(!coverable.InitialCoveragesCreated){
        coverable.createCoverages()
      }

      if(!coverable.InitialConditionsCreated){
        coverable.createConditions()
      }

      if(!coverable.InitialExclusionsCreated){
        coverable.createExclusions()
      }
    })
  }

  private static function updateCoverageTerms(dtoCoverage : UNACoverageDTO, entityCoverage : Coverage){
    dtoCoverage.CoverageTerms?.each( \ dtoCovTerm -> {
      var entityCovTerm = entityCoverage.CovTerms.firstWhere( \ term -> term.Pattern.CodeIdentifier?.equalsIgnoreCase(dtoCovTerm.Code))
      entityCovTerm?.setValueFromString(dtoCovTerm.Value)
    })
  }

  private static function updateScheduledItems(dtoCoverage : UNACoverageDTO, entityCoverage : Coverage){
    //adding and removing scheduled items is dependent on item count and lists maintaining order.
    //this is the simplest way to implement and would need to change to include IDs on either PC or Portal
    //if the ordered list rule is broken
    if(entityCoverage.Scheduled){
      var entityScheduledItems = getSortedScheduledItemsForCoverage(entityCoverage)
      var dtoScheduledItemsCount = dtoCoverage.ScheduledItems.Count
      var entityScheduledItemsCount = entityScheduledItems.Count

      if(dtoScheduledItemsCount > entityScheduledItemsCount){
        for(i in entityScheduledItemsCount..dtoScheduledItemsCount - 1){
          addScheduledItem(entityCoverage, dtoCoverage.ScheduledItems[i])
        }
      }else if(dtoScheduledItemsCount < entityScheduledItemsCount){
        for(i in dtoScheduledItemsCount..entityScheduledItemsCount - 1){
          removeScheduledItem(entityScheduledItems[i], entityCoverage)
        }
      }

      entityScheduledItems = getSortedScheduledItemsForCoverage(entityCoverage)

      dtoCoverage.ScheduledItems?.eachWithIndex( \ scheduledItemDTO, i -> {
        updateScheduledItem(entityCoverage, entityScheduledItems[i], scheduledItemDTO)
      })
    }
  }

  private static function removeCoverages(coverageDTOs: UNACoverageDTO[], period: PolicyPeriod){
    if(coverageDTOs.HasElements){
      var coveragesToRemove = period.AllCoverables.CoveragesFromCoverable.where( \ coverage -> !coverageDTOs*.Code.fastList().containsIgnoreCase(coverage.PatternCode))
      coveragesToRemove.each( \ coverage -> coverage.OwningCoverable.removeCoverageFromCoverable(coverage))
    }
  }

  private static function addScheduledItem(entityCoverage : Coverage, scheduledItemDTO : UNAScheduledItemDTO) : gw.pl.persistence.core.Bean{
    var result : gw.pl.persistence.core.Bean

    switch(entityCoverage.Pattern.CodeIdentifier){
      case "HODW_ScheduledProperty_HOE":
        result = new ScheduledItem_HOE(entityCoverage.PolicyLine.Branch)
        (entityCoverage as DwellingCov_HOE).addScheduledItem(result as ScheduledItem_HOE)
        break
      case "HOSL_WatercraftLiabilityCov_HOE_Ext":
      case "HOSL_OutboardMotorsWatercraft_HOE_Ext":
        result = new HOscheduleItem_HOE_Ext(entityCoverage.PolicyLine.Branch)
        (entityCoverage as HomeownersLineCov_HOE).addScheduledItem(result as HOscheduleItem_HOE_Ext)
        break
      case "HOLI_AddResidenceRentedtoOthers_HOE":
        result = new CoveredLocation_HOE(entityCoverage.PolicyLine.Branch)

        var accountLocation = entityCoverage.PolicyLine.Branch.Policy.Account.newLocation()
        accountLocation.AddressLine1 = scheduledItemDTO.Address.AddressLine1
        accountLocation.City = scheduledItemDTO.Address.City
        accountLocation.State = scheduledItemDTO.Address.State
        accountLocation.PostalCode = scheduledItemDTO.Address.PostalCode
        accountLocation.Country = scheduledItemDTO.Address.Country
        accountLocation.AddressType = scheduledItemDTO.Address.AddressType

        (result as CoveredLocation_HOE).PolicyLocation = entityCoverage.PolicyLine.Branch.newLocation(accountLocation)
        (entityCoverage as HomeownersLineCov_HOE).addCoveredLocation(result as CoveredLocation_HOE)
        break
      default:

    }

    return result
  }

  private static function removeScheduledItem(bean : gw.pl.persistence.core.Bean, entityCoverage : Coverage){
    switch(bean.IntrinsicType.RelativeName){
      case "ScheduledItem_HOE":
        (entityCoverage as DwellingCov_HOE).removeFromScheduledItems(bean as ScheduledItem_HOE)
        break
      case "CoveredLocation_HOE":
        (entityCoverage as HomeownersLineCov_HOE).removeCoveredLocation(bean as CoveredLocation_HOE)
        break
      case "HOscheduleItem_HOE_Ext":
        (entityCoverage as HomeownersLineCov_HOE).removeFromScheduledItem_Ext(bean as HOscheduleItem_HOE_Ext)
        break
      default:
        break
    }
  }

  private static function updateScheduledItem(entityCoverage : Coverage, scheduledItem : gw.pl.persistence.core.Bean, scheduledItemDTO : UNAScheduledItemDTO){

    switch(entityCoverage.PatternCode){
      case "HODW_ScheduledProperty_HOE":
        var scheduledPPItem = scheduledItem as ScheduledItem_HOE
        scheduledPPItem.ScheduleType = ScheduleType_HOE.get(scheduledItemDTO.ScheduleTypeCode)
        scheduledPPItem.Description = scheduledItemDTO.Description
        scheduledPPItem.ExposureValue = scheduledItemDTO.Value
        break
      case "HOSL_WatercraftLiabilityCov_HOE_Ext":
      case "HOSL_OutboardMotorsWatercraft_HOE_Ext":
        var scheduledWatercraft = scheduledItem as HOscheduleItem_HOE_Ext
        scheduledWatercraft.watercraftName = scheduledItemDTO.Name
        scheduledWatercraft.watercraftType = scheduledItemDTO.WatercraftTypeCode
        scheduledWatercraft.overallLength = scheduledItemDTO.OverallLengthTypeCode
        scheduledWatercraft.speedRating = scheduledItemDTO.SpeedRatingTypeCode
        scheduledWatercraft.horsepower = scheduledItemDTO.HorsePowerTypeCode

        if(entityCoverage.PatternCode == "HOSL_OutboardMotorsWatercraft_HOE_Ext"){
          scheduledWatercraft.fromDate = scheduledItemDTO.FromDate
          scheduledWatercraft.toDate = scheduledItemDTO.ToDate
        }

        if(entityCoverage.PatternCode == "HOSL_WatercraftLiabilityCov_HOE_Ext"){
          scheduledWatercraft.MotorADesc = scheduledItemDTO.MotorDescription
        }
        break
      case "HOLI_AddResidenceRentedtoOthers_HOE":
        var scheduledLocationItem = scheduledItem as CoveredLocation_HOE
        scheduledLocationItem.NumberOfFamilies = scheduledItemDTO.NumberOfFamilies
        scheduledLocationItem.PolicyLocation.AddressLine1 = scheduledItemDTO.Address.AddressLine1
        scheduledLocationItem.PolicyLocation.City = scheduledItemDTO.Address.City
        scheduledLocationItem.PolicyLocation.State = scheduledItemDTO.Address.State
        scheduledLocationItem.PolicyLocation.PostalCode = scheduledItemDTO.Address.PostalCode
        scheduledLocationItem.PolicyLocation.Country = scheduledItemDTO.Address.Country
        scheduledLocationItem.PolicyLocation.AddressType = scheduledItemDTO.Address.AddressType
        break
    }
  }

  private static function getSortedScheduledItemsForCoverage(coverage : Coverage) : List<gw.pl.persistence.core.Bean>{
    var result : List<gw.pl.persistence.core.Bean>

    switch(coverage.PatternCode){
      case "HODW_ScheduledProperty_HOE":
        result = (coverage as DwellingCov_HOE).ScheduledItems.orderBy(\ item -> item.ItemNumber)
        break
      case "HOLI_AddResidenceRentedtoOthers_HOE":
        result = (coverage as HomeownersLineCov_HOE).CoveredLocations.orderBy(\ location -> location.LocationNumber)
        break
      case "HOSL_WatercraftLiabilityCov_HOE_Ext":
      case "HOSL_OutboardMotorsWatercraft_HOE_Ext":
        result = (coverage as HomeownersLineCov_HOE).scheduledItem_Ext.orderBy(\ item -> item.ItemNum)
        break
      default:
        break
    }

    return result
  }
}