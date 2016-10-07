package onbase.api
/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   03/09/2015 - Daniel Q. Yu
 *     * Initial implementation.
 * 
 *   04/29/2015 - Daniel Q. Yu
 *     * Modified for GW 7 compatibility.
 *     
 *   09/18/2015 - Daniel Q. Yu
 *     * Modified colName to match with latest WSP configuration.
 *
 *   03/23/2016 - Daniel Q. Yu
 *     * Moved keyword enum from KeywordAdaptor to here.
 *     * Added new keyword asyncdocumentid.
 *
 *   05/09/2016 - Tori Brenneison
 *     * Added source keyword to KeywordMap.
 *
 *   05/17/2016 - Anirudh Mohan
 *          Added documenthandle keyword to KeywordMap.
 *
 *   06/09/2016 - Anirudh Mohan
 *          * Added documentidforrevision keyword
 *          * Removed relateddocumenthandle keyword
 *
 *
 */
/**
 * This is an enum for keyword mapping between GW & OnBase.
 */
public enum KeywordMap {
  accountid("Account Number"),
  claimid("Claim Number"),
  policyid("Policy Number"),
  contactid("Contact ID"),
  contactname("Contact Name"),
  insured("Insured Name"),
  exposureid("Exposure ID"),
  exposurename("Exposure Name"),
  matterid("Matter ID"),
  mattername("Matter Name"),
  activityid("Activity ID"),
  checkid("Check ID"),
  reserveid("Reserve ID"),
  jobnumber("Job Number"),
  producerid("Producer ID"),
  linktype("GW Link Type"),
  linkvalue("GW Link ID"),
  status("Status"),
  filename("GW File Name"),
  mimetype("Mime Type"),
  description("GW Description"),
  documenttype("Document Type"),
  documentidforrevision("Document Id For Revision"),
  recipient("Recipient"),
  user("User"),
  claimsecurityrole("Claim Security Role"),
  asyncdocumentid("Async Document ID"),
  source("Source");

  private construct(kwName : String) {
    obName = kwName
    colName = kwName.replaceAll(" ", "").replaceAll("#", "")
  }

  private var obName : String as OnBaseName;
  private var colName : String as OnBaseColumnName
}
