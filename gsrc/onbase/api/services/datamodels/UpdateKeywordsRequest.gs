package onbase.api.services.datamodels

uses gw.entity.TypeKey
uses onbase.api.KeywordMap

uses java.util.ArrayList
uses gw.api.web.document.DocumentsHelper
uses gw.api.database.Query
uses gw.api.database.Relop
uses java.util.Date
uses gw.diff.tree.DiffTree
uses java.lang.StringBuilder

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
    'Name' -> KeywordMap.filename,
    'Description' -> KeywordMap.description,
    //'MimeType' -> KeywordMap.mimetype,
    //'Author' -> KeywordMap.user,
    //'Recipient' -> KeywordMap.recipient,
   // 'Status' -> KeywordMap.status,
    'OnBaseDocumentType' -> KeywordMap.onbasedocumenttype,
    'OnBaseDocumentSubtype' -> KeywordMap.subtype
  }



  var _userId : String as UserID
  var _policyNumber : String as PolicyNumber
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
   * Convenience function for the common situation of creation an update request from a modified policyPeriod entity
   *
   * @param policyPeriod the PolicyPeriod that has been changed
   */
  public static function fromPolicyPeriod(policyPeriod : PolicyPeriod) : UpdateKeywordsRequest {

    var updateRequest = new UpdateKeywordsRequest() { :UserID = User.util.CurrentUser.DisplayName, :PolicyNumber = policyPeriod.PolicyNumber }

    if(policyPeriod != null) {
      var keywordChanged = false

      var basedOnPeriod = policyPeriod.BasedOn

      //Check for primary insured name change
      var newPrimaryNamedInsured = policyPeriod.PrimaryNamedInsured
      var oldPrimaryNamedInsured = basedOnPeriod.PrimaryNamedInsured
      if(!newPrimaryNamedInsured.DisplayName.equalsIgnoreCase(oldPrimaryNamedInsured.DisplayName)) {
        keywordChanged = true
        var nameValueSB = new StringBuilder()
        nameValueSB.append("Primary Insured First Name|").append(policyPeriod.PrimaryNamedInsured.FirstName?:"")
        nameValueSB.append(",Primary Insured Middle Name|").append(policyPeriod.PrimaryNamedInsured.MiddleName?:"")
        nameValueSB.append(",Primary Insured Last Name|").append(policyPeriod.PrimaryNamedInsured.LastName?:"")
        updateRequest.addUpdateAction(ActionType.ADD, KeywordMap.primaryinsured.OnBaseName, nameValueSB.toString())
      }

      //Check for product name change
      if(!policyPeriod.Policy.Product.DisplayName.equals(basedOnPeriod.Policy.Product.DisplayName)) {
        keywordChanged = true
        updateRequest.replaceKeywordValue(KeywordMap.productname, basedOnPeriod.Policy.Product.DisplayName, policyPeriod.Policy.Product.DisplayName)
      }

      //Check for additional insured name changes
      var newAddtnlInsureds = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)
      var oldAddtnlInsureds = basedOnPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)
      var addedOrChangedInsureds = findInsuredDiffs(newAddtnlInsureds, oldAddtnlInsureds)
      if(newAddtnlInsureds.Count != oldAddtnlInsureds.Count or !addedOrChangedInsureds.IsEmpty) {
        keywordChanged = true

        for(additionalInsured in addedOrChangedInsureds) {
          var nameValueSB = new StringBuilder()
          nameValueSB.append("Additional Insured First Name|").append(additionalInsured.FirstName?:"")
          nameValueSB.append(",Additional Insured Middle Name|").append(additionalInsured.MiddleName?:"")
          nameValueSB.append(",Additional Insured Last Name|").append(additionalInsured.LastName?:"")
          updateRequest.addUpdateAction(ActionType.ADD, KeywordMap.additionalinsured.OnBaseName, nameValueSB.toString())
        }
      }

      var newIssueDate = policyPeriod.Policy.IssueDate
      var oldIssueDate = basedOnPeriod.Policy.IssueDate

      if(newIssueDate.compareTo(oldIssueDate) != 0) {
        keywordChanged = true
        updateRequest.addUpdateAction(ActionType.ADD, KeywordMap.issuedate.OnBaseName, newIssueDate)
      }

      var newLegacyPolicyNumber = policyPeriod.LegacyPolicyNumber_Ext?: ""
      var oldLegacyPolicyNumber = basedOnPeriod.LegacyPolicyNumber_Ext?: ""

      if(!newLegacyPolicyNumber.equalsIgnoreCase(oldLegacyPolicyNumber)) {
        keywordChanged = true
        updateRequest.addUpdateAction(ActionType.ADD, KeywordMap.legacypolicynumber.OnBaseName, newLegacyPolicyNumber)
      }
    }
    return updateRequest
  }

  private static function findInsuredDiffs(insuredsOnNewPeriod: PolicyAddlNamedInsured[], insuredsOnOldPeriod: PolicyAddlNamedInsured[]) : PolicyAddlNamedInsured[]{
    var diffs = new ArrayList<PolicyAddlNamedInsured>()

    for(newIns in insuredsOnNewPeriod) {
      var newNotInOld = insuredsOnOldPeriod.firstWhere( \ old -> old.DisplayName.equalsIgnoreCase(newIns.DisplayName))
      if(newNotInOld == null) {
        diffs.add(newIns)
      }
    }

    return diffs
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
