package onbase.pcfutil
uses onbase.api.services.datamodels.Keyword
uses onbase.api.Settings
uses onbase.api.KeywordMap
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: csandham
 * Date: 11/17/16
 * Time: 9:17 PM
 * To change this template use File | Settings | File Templates.
 */
class FileUploadUtility {

  /**
      Creates a new Unity Form in OnBase and returns the URL for it.

      @param account the Account entity to create the Unity form URL for
   */
  public static function WebServiceBasedUnityFormCreation(account: Account): String{

    var url = ""
    var policy = account.Policies.first()

    if(policy != null) {
      url = WebServiceBasedUnityFormCreation(policy.LatestPeriod)
    } else {
      //Add values to send to the unity form here. The names correspond to the ids of the fields on the Unity Form.
      var keywords = new ArrayList<Keyword>()
      keywords.add(new Keyword(KeywordMap.accountnumber.Name, account.AccountNumber))
      url = CreateUnityForm(keywords)
    }

    return url
  }

  /**
    Creates a new Unity Form in OnBase and returns the URL for it.

    @param policyPeriod the PolicyPeriod entity to create the Unity form URL for
  */
  public static function WebServiceBasedUnityFormCreation(policyPeriod: PolicyPeriod): String{
    //Add values to send to the unity form here. The names correspond to the ids of the fields on the Unity Form.
    var keywords = new ArrayList<Keyword>()
    keywords.add(new Keyword(KeywordMap.policynumber.Name, policyPeriod.PolicyNumber))
    keywords.add(new Keyword(KeywordMap.accountnumber.Name, policyPeriod.Policy.Account.AccountNumber))

    return CreateUnityForm(keywords)
  }

  /**
      Creates a new Unity Form in OnBase and returns the URL for it.

      @param keywords a List of Keywords to use to create the Unity form
   */
  private static function CreateUnityForm(keywords : List<Keyword>) : String {
    var service = new onbase.api.services.ServicesManager()
    keywords.add(new Keyword("documenttype", "Policy Document"))
    var docId = service.createUnityForm("Upload-UnityForm", keywords)
    var retrieval = new onbase.api.application.DocumentRetrieval();
    var url = retrieval.getDocumentWebURL(docId, Settings.OnBaseWebClientType.HTML)

    return url
  }

}