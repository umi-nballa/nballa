package onbase.api.services.interfaces

uses onbase.api.services.datamodels.Keyword
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 12/15/16
 * Time: 10:33 AM
 * To change this template use File | Settings | File Templates.
 */
interface CreateUnityFormInterface {

  /**
   * Create Unity form.
   *
   * @param unityFormName The unity form name.
   * @param keywords The list of keywords for this query.
   *
   * @return A unity form
   */
  public function createUnityForm(unityFormName: String, keywords: List <Keyword>): String
}