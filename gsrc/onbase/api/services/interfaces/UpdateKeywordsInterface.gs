package onbase.api.services.interfaces

uses onbase.api.services.datamodels.UpdateKeywordsRequest

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/13/2015 - Daniel Q. Yu
 *     * Initial implementation.
 *
 *   09/22/2016 - Duane Littleton
 *     * Move userId into the UpdateKeywordsRequest data model
 */
/**
 * Interface to call OnBase Update Keywords service.
 */
interface UpdateKeywordsInterface {
  /**
   * Update OnBase documents keyword values.
   *
   * @param ukRequest The update keyword request object.
   */
  public function updateKeywords(ukRequest: UpdateKeywordsRequest)
}
