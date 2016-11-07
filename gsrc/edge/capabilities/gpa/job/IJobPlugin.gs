package edge.capabilities.gpa.job

uses edge.capabilities.gpa.job.dto.JobDTO

interface IJobPlugin {

  public function toDTO(aJob : Job) : JobDTO
  public function toDTOArray(jobs : Job[]) : JobDTO[]
  public function getOpenJobsByJobTypeForCurrentUser(jobType : typekey.Job) : JobDTO[]
}
