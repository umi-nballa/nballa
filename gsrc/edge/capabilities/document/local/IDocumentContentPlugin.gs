package edge.capabilities.document.local

uses gw.document.DocumentContentsInfo

/**
 * Plugin used to access document content.
 */
interface IDocumentContentPlugin {
  /**
   * Retrieves document content for given user and document id.
   */
  public function getDocumentContent(id : String) : DocumentContentsInfo
}
