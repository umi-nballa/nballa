package edge.capabilities.gpa.job.submission

uses edge.capabilities.gpa.job.submission.dto.NewSubmissionDTO
uses edge.capabilities.gpa.job.submission.dto.ProductSelectionDTO
uses gw.api.util.StateJurisdictionMappingUtil
uses java.lang.Iterable
uses edge.di.annotations.ForAllGwNodes
uses java.util.Date
uses edge.capabilities.gpa.job.submission.dto.SubmissionDTO
uses edge.capabilities.gpa.job.DefaultJobPlugin
uses edge.capabilities.gpa.policy.IPolicyPlugin
uses edge.capabilities.gpa.job.IUWIssuePlugin
uses edge.capabilities.gpa.job.dto.UWIssueDTO

class DefaultSubmissionPlugin implements ISubmissionPlugin {

  var _policyPlugin : IPolicyPlugin
  var _uwIssuePlugin : IUWIssuePlugin

  @ForAllGwNodes
  construct(aPolicyPlugin : IPolicyPlugin, aUWIssuePlugin : IUWIssuePlugin) {
    this._policyPlugin = aPolicyPlugin
    this._uwIssuePlugin = aUWIssuePlugin
  }

  override function toDTO(aSubmission: Submission): SubmissionDTO {
    final var dto = new SubmissionDTO()
    DefaultJobPlugin.fillBaseProperties(dto, aSubmission)
    dto.JobNumber = aSubmission.JobNumber
    dto.Policy = _policyPlugin.policyBaseDetailsToDTO(aSubmission.Policy)
    dto.StatusCode = aSubmission.Policy.LatestPeriod.Status
    dto.CanUserView = perm.Submission.view(aSubmission)

    var authProfiles = User.util.CurrentUser.UWAuthorityProfiles
    var uwIssues = aSubmission.SelectedVersion.UWIssuesActiveOnly.viewableToUserWithProfiles(authProfiles)
    dto.UnderwritingIssues = _uwIssuePlugin.toDTOArray(uwIssues)

    return dto
  }

  override function toDTOArray(submissions: Submission[]): SubmissionDTO[] {
    if(submissions != null && submissions.HasElements){
      return submissions.map( \ submission -> toDTO(submission))
    }

    return new SubmissionDTO[]{}
  }

  override function createSubmission(anAccount: Account, dto: NewSubmissionDTO): Submission {
    final var producerCode : ProducerCode = gw.api.database.Query.make(ProducerCode).compare("Code", Equals, dto.ProducerCode).select().AtMostOneRow
    var state = anAccount.AccountHolderContact.PrimaryAddress.State
    final var producerSelection = createProducerSelection(producerCode, dto.EffectiveDate, state)

    final var productSelection = createProductSelection(dto.ProductCode)

    // create submission
    final var submission = productSelection.createSubmission(anAccount, producerSelection)

    final var branch = submission.LatestPeriod

    /* We work on custom period and create offerings only during quoting. */
    branch.Offering = null

    branch.UWCompany = branch.getUWCompaniesForStates(false).first()

    // Set the branch name so that we can identify the quote in the portal.  Maps to quote type enum values
    branch.BranchName =typekey.RatingStyle.TC_QUICKQUOTE  //"CUSTOM"

    branch.SubmissionProcess.beginEditing()

    return submission
  }

  override function getAvailableProducts(anAccount : Account, dto: NewSubmissionDTO): ProductSelectionDTO[] {
    final var _producerCode = gw.api.database.Query.make(ProducerCode).compare("Code", Equals, dto.ProducerCode).select().AtMostOneRow
    final var _state = State.get(dto.State.getCode())

    final var policyProductRoot = new PolicyProductRoot() {
        : ProducerCode = _producerCode,
        : Producer = _producerCode.Organization,
        : Account = anAccount,
        : State = StateJurisdictionMappingUtil.getJurisdictionMappingForState(_state),
        : EffDate = dto.EffectiveDate
    }

    final var availableProducts = anAccount.getAvailableProducts(policyProductRoot)

    return productSelectionsToDTOs(availableProducts)
  }

  public static function productSelectionToDTO(aProductSelection : ProductSelection) : ProductSelectionDTO{
    final var dto = new ProductSelectionDTO()
    dto.ProductCode = aProductSelection.Product.Code
    dto.ProductName = aProductSelection.Product.DisplayName
    dto.Status = aProductSelection.ProductSelectionStatus.DisplayName
    dto.IsRiskReserved = aProductSelection.ProductSelectionStatus == ProductSelectionStatus.TC_RISKRESERVED

    return dto
  }

  public static function productSelectionsToDTOs(productSelections: Iterable<ProductSelection>): ProductSelectionDTO[] {
    if (productSelections == null || !productSelections.HasElements){
      return null
    }

    final var dtos = new ProductSelectionDTO[productSelections.Count]

    productSelections.eachWithIndex(\aProductSelection, i -> {
      dtos[i] = productSelectionToDTO(aProductSelection)
    })

    return dtos
  }

  protected function createProducerSelection(aProducerCode : ProducerCode, effectiveDate : Date, aState : typekey.State) : ProducerSelection{
    final var producerSelection = new ProducerSelection()
    producerSelection.Producer = aProducerCode.Organization
    producerSelection.ProducerCode = aProducerCode
    producerSelection.DefaultPPEffDate = effectiveDate
    producerSelection.State = aState.Categories.firstWhere(\ t -> t typeis Jurisdiction) as Jurisdiction

    return producerSelection
  }

  protected function createProductSelection(productCode: String): ProductSelection {
    final var productSelection = new ProductSelection()
    productSelection.ProductCode = productCode

    productSelection.ProductSelectionStatus = ProductSelectionStatus.TC_AVAILABLE

    return productSelection
  }

  override function getUWIssuesForSubmission(aSubmission: Submission): UWIssueDTO[] {
    var authProfiles = User.util.CurrentUser.UWAuthorityProfiles
    var uwIssues = aSubmission.SelectedVersion.UWIssuesActiveOnly.viewableToUserWithProfiles(authProfiles)
    return _uwIssuePlugin.toDTOArray(uwIssues)
  }
}
