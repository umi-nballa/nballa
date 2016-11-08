package edge.capabilities.gpa.job

uses edge.di.annotations.ForAllGwNodes
uses edge.capabilities.gpa.job.dto.UWIssueDTO

class DefaultUWIssuePlugin implements IUWIssuePlugin {

  @ForAllGwNodes
  construct() {
  }

  override function toDTO(aUWIssue: UWIssue): UWIssueDTO {
    final var dto = new UWIssueDTO()
    dto.ShortDescription = aUWIssue.ShortDescription
    dto.LongDescription = aUWIssue.LongDescription
    return dto
  }

  override function toDTOArray(uwIssues: UWIssue[]): UWIssueDTO[] {
    if(uwIssues != null && uwIssues.HasElements){
      return uwIssues.map( \ uwIssue -> toDTO(uwIssue))
    }

    return new UWIssueDTO[]{}
  }
}
