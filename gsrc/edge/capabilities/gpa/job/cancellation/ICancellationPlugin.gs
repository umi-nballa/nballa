package edge.capabilities.gpa.job.cancellation

uses edge.capabilities.gpa.job.cancellation.dto.CancellationDTO
uses java.util.Date

interface ICancellationPlugin {

  public function startCancellation(aPolicy : Policy, dto : CancellationDTO) : Cancellation
  public function updateCancellation(aCancellation : Cancellation, dto : CancellationDTO)
  public function getValidRefundMethods(policy: Policy, dto : CancellationDTO): CalculationMethod[]
  public function getEffectiveDateForCancellation(policy: Policy, dto : CancellationDTO): Date
}
