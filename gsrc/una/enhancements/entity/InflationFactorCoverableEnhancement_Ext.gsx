package una.enhancements.entity

uses java.math.BigDecimal
uses gw.api.domain.covterm.DirectCovTerm
uses una.config.ConfigParamsUtil
uses una.logging.UnaLoggerCategory
uses una.systables.UNASystemTableQueryUtil
uses java.util.Map
uses gw.api.domain.covterm.OptionCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/9/16
 * Time: 10:53 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement InflationFactorCoverableEnhancement_Ext: entity.Coverable {

  public function applyInflationFactor(){
    var inflationFactor = InflationFactor

    if(inflationFactor != null){
      InflationFactorEligibleCovTerms?.each( \ covTerm -> {
        covTerm.Value *= inflationFactor
        covTerm.round(ROUND_NEAREST)
      })
    }
  }

  private property get InflationFactor() : BigDecimal{
    var result : String
    var inflationFactorEntities = {entity.CPBuilding, entity.BP7Building, entity.Dwelling_HOE}

    if(inflationFactorEntities.contains(this.IntrinsicType)){
      switch(this.PolicyLine.Branch.Policy.ProductCode){
        case "CommercialPackage":
            result = (this.getCoverage("CPBldgCov").getCovTerm("CPBldgCovAutoIncrease") as OptionCovTerm).Value + 1
            break
        case "Homeowners":
            result = getInflationFactorFromTable()
            break
        case "BP7BusinessOwners":
            result = (this.getCoverage("BP7Structure").getCovTerm("BP7AutomaticIncreasePct1") as OptionCovTerm).Value + 1
            break
        default:
          break
      }
    }

    return result?.toBigDecimal()
  }

  private property get InflationFactorEligibleCovTerms() : List<DirectCovTerm>{
    var covTermPatterns = ConfigParamsUtil.getList(TC_InflationFactorApplicableCovTerms, this.PolicyLine.BaseState, PrimaryInflationFactor)

    if(!covTermPatterns.HasElements){
      covTermPatterns = ConfigParamsUtil.getList(TC_InflationFactorApplicableCovTerms, this.PolicyLine.BaseState, SecondaryInflationFactorFilter)
    }

    return this.CoveragesFromCoverable*.CovTerms.whereTypeIs(DirectCovTerm)?.where( \ covTerm -> covTermPatterns.contains(covTerm.PatternCode))
  }

  private function getFactor(argumentMap : Map<String, Object>) : String{
    return UNASystemTableQueryUtil.query(InflationFactorLookup_Ext, argumentMap, true).atMostOne()
  }

  private function getInflationFactorFromTable() : BigDecimal{
    var result : BigDecimal

    var inflationLocation = InflationLocation
    var stateProperty = "State"
    var cityProperty = "City"
    var zipProperty = "ZipCode"
    var state = inflationLocation.State
    var city = inflationLocation.City
    var zip = inflationLocation.PostalCode

    var primaryMatch = getFactor({stateProperty -> state,cityProperty -> city,zipProperty -> zip})
    var secondaryMatch = getFactor({stateProperty -> state, cityProperty -> null, zipProperty -> zip})
    var defaultMatch = getFactor({stateProperty -> state, cityProperty -> null, zipProperty -> "99999"})

    if(inflationLocation != null){
      if(primaryMatch != null){
        result = primaryMatch
      }else if(secondaryMatch != null){
        result = secondaryMatch
      }else if(defaultMatch != null){
        result = defaultMatch
      }
    }

    return result
  }

  private property get PrimaryInflationFactor() : String{
    var result : String

    switch(typeof this){
      case Dwelling_HOE:
          result = this.HOPolicyType.Code + this.ResidenceType.Code
          break
      case BP7Building:
          result = this.Branch.Policy.ProductCode
          break
      case CPBuilding:
          result = this.Branch.Policy.ProductCode
          break
        default:
        //do nothing
    }

    return result
  }

  private property get SecondaryInflationFactorFilter() : String{
    var result : String

    if(this typeis Dwelling_HOE){
      result = this.HOPolicyType.Code
    }

    return result
  }

  private property get InflationLocation() : PolicyLocation{
    var result : PolicyLocation

    switch(typeof this){
      case Dwelling_HOE:
        result = this.HOLocation.PolicyLocation
        break
      case BP7Building:
        result = this.Building.PolicyLocation
        break
      case CPBuilding:
        result = this.Building.PolicyLocation
        break
      default:
        if(UnaLoggerCategory.UNA_SYS_TABLES.DebugEnabled){
          UnaLoggerCategory.UNA_SYS_TABLES.debug("No inflation factor applies to coverable of type ${typeof coverable}.")
        }
    }

    return result
  }
}
