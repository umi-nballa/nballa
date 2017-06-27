package edge.capabilities.reports.plugins

uses edge.capabilities.reports.dto.clue.CLUEReportResponseDTO
uses edge.di.annotations.InjectableNode
uses edge.capabilities.reports.dto.ReportRequestDTO
uses edge.capabilities.reports.dto.clue.PriorLossDTO
uses edge.capabilities.reports.dto.clue.ClaimPaymentDTO

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/21/17
 * Time: 1:49 PM
 * To change this template use File | Settings | File Templates.
 */
class CLUEReportOrderingPlugin extends ReportOrderingPlugin<ReportRequestDTO, CLUEReportResponseDTO> {
  @InjectableNode
  construct(){}

  override function orderReport(reportRequest : ReportRequestDTO) : CLUEReportResponseDTO{
    return super.orderReport(reportRequest)
  }

  override function executeReportOrder() {
    una.integration.service.gateway.plugin.GatewayPlugin.makeCLUEGateway().orderClueProperty(PortalJob.LatestPeriod, AccountNumber)
  }

  override function toResponseDTO(): CLUEReportResponseDTO {
    var result = new CLUEReportResponseDTO()
    result.ReportStatus = PortalJob.LatestPeriod.HomeownersLine_HOE.ClueStatus_Ext
    result.PriorLosses = {}

    PortalJob.LatestPeriod.HomeownersLine_HOE.HOPriorLosses_Ext?.each( \ priorLoss -> {
      var priorLossDTO = new PriorLossDTO()
      priorLossDTO.DateOfLoss = priorLoss.ReportedDate
      priorLossDTO.Description = priorLoss.ClaimDesc
      priorLossDTO.CATCode = priorLoss.CatastropheInica
      priorLossDTO.LossLocation = priorLoss.LocationOfLoss
      priorLossDTO.Status = priorLoss.ClaimStatus.Description
      priorLossDTO.ClaimPayments = {}

      priorLoss.ClaimPayment?.each( \ claimPayment -> {
        var claimPaymentDTO = new ClaimPaymentDTO()
        claimPaymentDTO.LossType = claimPayment.ClaimType.Description
        claimPaymentDTO.Amount = claimPayment.ClaimAmount?.doubleValue()
        priorLossDTO.ClaimPayments.add(claimPaymentDTO)
      })

      result.PriorLosses.add(priorLossDTO)
    })

    return result
  }
}