package edge.capabilities.policy.lob.homeowners

uses edge.capabilities.policy.lob.homeowners.dto.HoPolicyExtensionDTO
uses edge.capabilities.policy.lob.ILobPolicyPlugin
uses edge.capabilities.policy.lob.util.PolicyLineUtil
uses edge.capabilities.policy.dto.CoverageDTO
uses edge.di.annotations.InjectableNode
uses edge.capabilities.currency.dto.AmountDTO
uses una.pageprocess.QuoteScreenPCFController

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 4/7/17
 * Time: 9:11 AM
 * To change this template use File | Settings | File Templates.
 */
class HoPolicyPlugin implements ILobPolicyPlugin <HoPolicyExtensionDTO> {

  @InjectableNode
  construct() {
  }

  override function getPolicyLineInfo(period: PolicyPeriod): HoPolicyExtensionDTO {
    final var res = new HoPolicyExtensionDTO()

    if(period.HomeownersLine_HOEExists) {
      final var line = period.HomeownersLine_HOE
      PolicyLineUtil.fillBaseProperties(res, line)
      res.TaxesAndSurcharges = AmountDTO.fromMonetaryAmount(period.AllCosts.TaxSurcharges.AmountSum(period.PreferredSettlementCurrency))
      res.TotalCost = AmountDTO.fromMonetaryAmount(period.TotalCostRPT)

      //QuoteScreenPCFController.getCostModels()

//      var covs = convertToDTO(line.Dwelling.Coverages)
//      covs.toList().addAll(convertToDTO(line.HOLineCoverages))
//      res.CoverageDTOs = covs
    }
    return res;
  }

  public static function convertToDTO(coverages : Coverage[]) : CoverageDTO[] {
    return coverages.map(\ cov -> PolicyLineUtil.createBaseCoverage(cov, costsOf(cov)))
  }

  /**
   * Finds costs for the homeowners-based coverage.
   */
  public static function costsOf(coverage : Coverage) : Cost[] {
    if (coverage typeis HomeownersLineCov_HOE) {
      return coverage.Costs
    }
    return new Cost[0]
  }
}