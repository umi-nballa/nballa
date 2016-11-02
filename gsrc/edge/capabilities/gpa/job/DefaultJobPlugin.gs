package edge.capabilities.gpa.job

uses edge.capabilities.gpa.job.dto.JobDTO
uses edge.capabilities.gpa.policy.IPolicyPeriodPlugin
uses edge.di.annotations.ForAllGwNodes
uses java.util.ArrayList
uses java.util.HashSet
uses edge.capabilities.gpa.policy.IPolicyPlugin

class DefaultJobPlugin implements IJobPlugin {

  var _policyPlugin : IPolicyPlugin
  var _policyPeriodPlugin : IPolicyPeriodPlugin

  @ForAllGwNodes
  construct(aPolicyPlugin : IPolicyPlugin, aPolicyPeriodPlugin : IPolicyPeriodPlugin){
    this._policyPlugin = aPolicyPlugin
    this._policyPeriodPlugin = aPolicyPeriodPlugin
  }
  override function toDTO(aJob: Job): JobDTO {
    final var dto = new JobDTO()
    fillBaseProperties(dto, aJob)
    final var currentUser : User = User.util.CurrentUser
    dto.CanUserView = currentUser.canView(aJob)
    dto.Policy = _policyPlugin.toDTO(aJob.Policy)
    dto.LatestPeriod = _policyPeriodPlugin.toDTO(aJob.LatestPeriod)

    return dto
  }

  override function toDTOArray(jobs: Job[]): JobDTO[] {
    if(jobs != null && jobs.HasElements){
      return jobs.map( \ aJob -> toDTO(aJob))
    }

    return new JobDTO[]{}
  }

  public static function fillBaseProperties(dto: JobDTO, aJob: Job) {
    dto.PublicID = aJob.PublicID
    dto.DisplayType = aJob.DisplayType
    dto.Status = aJob.DisplayStatus
    dto.CloseDate = aJob.CloseDate
    dto.CreateTime = aJob.CreateTime
    dto.JobNumber = aJob.JobNumber
    dto.Type = aJob.Subtype
    dto.CreatedByMe = aJob.CreateUser == User.util.CurrentUser
  }

  override function getOpenJobsByJobTypeForCurrentUser(jobType: typekey.Job): JobDTO[] {
    final var currentUser : User = User.util.CurrentUser
    final var producerCodes = currentUser.UserProducerCodes*.ProducerCode
    final var accounts = new HashSet<Account>()
    final var openJobs = new HashSet<Job>()

    producerCodes.each( \ code -> {
      final var accProdCodes = gw.api.database.Query.make(AccountProducerCode).compare("ProducerCode", Equals, code).select()
      if(accProdCodes.HasElements){
        accProdCodes.each( \ accProducerCode -> accounts.add(accProducerCode.Account))
      }
    })

    accounts.each( \ account -> {
      var accountJobs = account.getAllJobs(false, jobType, null, currentUser)
      accountJobs.each( \ aJob -> openJobs.add(aJob))
    })


    return toDTOArray(openJobs.toTypedArray())
  }
}
