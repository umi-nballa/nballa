package una.integration.mapping.hpx.common

uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/28/16
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXNoteMapper {

  function createClueMessageNote(note : Note) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimNotesType {
    var claimNote = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimNotesType()
    claimNote.ClaimNoteID = note.ID != null ? note.ID : ""
    claimNote.ClaimNoteSequence = 0
    claimNote.ClaimNoteCode = "ClueResponseMessage"
    claimNote.ClaimNoteSubject = note.Subject != null ? note.Subject : ""
    claimNote.ClaimNoteDesc = note.Body  != null ? note.Body : ""
    return claimNote
  }

  function createClueNarrativeNote(note : Note) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimNotesType {
    var claimNote = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimNotesType()
    claimNote.ClaimNoteID = note.ID != null ? note.ID : ""
    claimNote.ClaimNoteSequence = 0
    claimNote.ClaimNoteCode = "ClueNarrative"
    claimNote.ClaimNoteSubject = note.Subject != null ? note.Subject : ""
    claimNote.ClaimNoteDesc = note.Body  != null ? note.Body : ""
    claimNote.ClaimNoteCreatedOn = note.AuthoringDate != null ? note.AuthoringDate.toString() : ""
    claimNote.ClaimNoteCreatedByRelation = note.NarrativeRelation != null ? note.NarrativeRelation : ""
    claimNote.addChild(new XmlElement("ClaimNoteCreatedBy", createUserAccountOwner(note.Author.Contact.Name)))
    return claimNote
  }

  function createUserAccountOwner(author : String) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimNoteCreatedByType {
    var claimNoteCreatedByType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimNoteCreatedByType()
    var userAccountOwnerType = new wsi.schema.una.hpx.hpx_application_request.types.complex.UserAccountOwnerType()
    userAccountOwnerType.FullName = author != null ? author : ""
    claimNoteCreatedByType.addChild(new XmlElement("UserAccountOwner", userAccountOwnerType))
    return claimNoteCreatedByType
  }

}