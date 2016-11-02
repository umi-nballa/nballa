package edge.capabilities.gpa.job.cancellation

uses edge.PlatformSupport.TranslateUtil
uses edge.capabilities.gpa.job.cancellation.dto.CancellationDTO
uses edge.di.annotations.ForAllGwNodes
uses java.lang.IllegalArgumentException
uses java.lang.Exception
uses java.util.Date
uses edge.PlatformSupport.Bundle

class DefaultCancellationPlugin implements ICancellationPlugin {

  @ForAllGwNodes
  construct(){}

  override function startCancellation(aPolicy: Policy, dto: CancellationDTO): Cancellation {
    if(aPolicy == null){
      throw new IllegalArgumentException("Policy must not be null.")
    }
    final var canStartCancellation = aPolicy.canStartCancellation(dto.EffectiveDate)

    if(canStartCancellation == null){
      var aCancellation = new Cancellation()
      updateCancellation(aCancellation, dto)
      aCancellation.startJob(aPolicy, dto.EffectiveDate, dto.CancellationRefundMethod)

      return aCancellation
    }

    throw new Exception(
        TranslateUtil.translate("Web.Cancellation.Error.CannotStart", {canStartCancellation})
    )
  }

  override function updateCancellation(aCancellation: Cancellation, dto: CancellationDTO) {
    aCancellation.Source = dto.CancellationSource
    aCancellation.Description = dto.Description
    aCancellation.CancelReasonCode = dto.CancelReasonCode
  }

  override function getValidRefundMethods(policy: Policy, dto : CancellationDTO): CalculationMethod[] {
    final var aCancellation = createTempCancellation(dto)
    final var methods = aCancellation.findValidRefundMethods(policy.LatestPeriod.PolicyStartDate)

    final var bundle = Bundle.getCurrent()
    bundle.delete(aCancellation)

    return methods
  }

  override function getEffectiveDateForCancellation(policy: Policy, dto : CancellationDTO): Date {
    final var aCancellation = createTempCancellation(dto)
    final var effectiveDate = aCancellation.getDefaultEffectiveDate(policy.LatestPeriod, dto.CancellationRefundMethod)
    final var bundle = Bundle.getCurrent()
    bundle.delete(aCancellation)

    return effectiveDate
  }

  protected function createTempCancellation(dto : CancellationDTO) : Cancellation{
    final var aCancellation = new Cancellation()
    aCancellation.Source = dto.CancellationSource
    aCancellation.CancelReasonCode = dto.CancelReasonCode

    return aCancellation
  }
}
