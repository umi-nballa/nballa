package onbase.api.services.datamodels

uses gw.entity.TypeKey
uses onbase.api.KeywordMap

uses java.util.ArrayList

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   08/12/2016 - Anirudh Mohan
 *     * Replaced with new Bulk Keyword Update implementation
 */

/**
 * Generic request object for update keywords services.
 */
class UpdateKeywordsRequest {

  /** Available keyword actions */
  public static enum ActionType {
    ADD, DELETE
  }

  private static final var _documentFieldsToCheck = {
   // 'Name' -> KeywordMap.filename,
    'Description' -> KeywordMap.description,
    //'MimeType' -> KeywordMap.mimetype,
    'Author' -> KeywordMap.user//,
    //'Recipient' -> KeywordMap.recipient,
   // 'Status' -> KeywordMap.status,
    //'Type' -> KeywordMap.documenttype
  }



  var _userId : String as UserID
  /** The list of documents to be updated. */
  var _docs: List <String> as  readonly DocumentHandles = new ArrayList<String>()
  /** The list of actions. */
  var _actions: List <KeywordAction> as readonly Actions = new ArrayList<KeywordAction>()

  /**
   * Insert any update action into the actions list.
   *
   * This function provides an option for inserting update parameters as strings for flexibility. Prefer
   * the KeywordMap alternative where possible.
   *
   * @param actionType type of update
   * @param name keyword name
   * @param value keyword value
   */
  public function addUpdateAction(actionType : ActionType, name : String, value : String) {
    var action = new KeywordAction(actionType, name, value)
    _actions.add(action)
  }

  /**
   * Replace an existing keyword value with a new value.
   *
   * Note that replace doesn't currently exist as a single action, so this is implemented with an add followed by a
   * delete. This function ignores null and empty keyword values.
   *
   * @param keyword OnBase keyword to update
   * @param value keyword value
   */
  public function replaceKeywordValue(keyword : KeywordMap, oldValue : String, newValue : String) {
    if (oldValue.HasContent) {
      addUpdateAction(ActionType.DELETE, keyword.OnBaseName, oldValue)
    }

    if (newValue.HasContent) {
      addUpdateAction(ActionType.ADD, keyword.OnBaseName, newValue)
    }
  }

  /**
   * Convenience function for the common situation of creation an update request from a modified document entity.
   *
   * @param document the document that has been changed
   */
  public static function fromDocument(document : Document) : UpdateKeywordsRequest {

    var updateRequest = new UpdateKeywordsRequest() { :UserID = User.util.CurrentUser.DisplayName }
    updateRequest.DocumentHandles.add(document.DocUID)

    foreach (field in _documentFieldsToCheck.Keys) {
      var keyword = _documentFieldsToCheck[field]

      if (document.isFieldChanged(field)) {
        var newValue = convertFieldValue(document.getFieldValue(field))
        var oldValue = convertFieldValue(document.getOriginalValue(field))

        updateRequest.replaceKeywordValue(keyword, oldValue, newValue)
      }
    }

    return updateRequest
  }

  /**
   * Convert an entity field value to a keyword value that can be used for keyword update.
   *
   * @param value field value to convert
   */
  private static function convertFieldValue(value : Object) : String {

    // Type keys require special treatment as the "code" value should be stored in the keyword in order to function
    // correctly in multi-language environments.
    if (value typeis TypeKey) {
      return value.Code
    }

    return value?.toString()
  }


  /** Individual keyword action to be applied during update. */
  public static class KeywordAction {
    final var _actionType: ActionType as Action
    final var _name: String as KeywordName
    final var _value: String as KeywordValue

    construct(actionType : ActionType, name : String, value : String) {
      _actionType = actionType
      _name = name
      _value = value
    }
  }
}
