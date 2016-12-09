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
 *   11/10/2016 - Chris Mattox
 *          * Changed all of the keywords
 *
 */
/**
 * This is an enum for keyword mapping between GW & OnBase.
 */
public enum KeywordMap {
  accountnumber("Account Number"),
  user("User"),
  source("Source"),
  activitycode("Activity Code"),
  additionalnamedinsureds("Additional Named Insureds"),
  agencycode("Agency Code"),
  csr("CSR"), //TODO: REMOVE
  description("Description"),
  issuedate("Issue Date"),
  jobdisplayname("Job Display Name"),
  jobid("Job ID"),
  jobnumber("Job Number"),
  legacypolicynumber("Legacy Policy Number"),
  maildate("MAIL date"),
  mailfromaddress("MAIL from address"),
  mailsubject("MAIL subject"),
  mailtoaddress("MAIL to address"),
  namedinsured("Named Insured"),
  onbasedocumenttype("OnBase Document Type"),
  policyeffectivedate("Policy Effective Date"),
  policyexpirationdate("Policy Expiration Date"),
  policynumber("Policy Number"),
  policytype("Policy Type"),
  primarynamedinsureds("Primary Named Insureds"),
  productname("Product Name"),
  receiveddate("Received Date"),
  subtype("Subtype"),
  supressactivity("Supress Activity"),
  term("Term"),
  transactioneffectivedate("Transaction Effective Date"),
  underwriter("Underwriter"),//TODO: REMOVE

 /*Previous values */

  linktype("GW Link Type"),
  linkvalue("GW Link ID"),
  status("Status"),
  filename("GW File Name"),
  mimetype("Mime Type"),
  documenttype("Document Type"),
  documentidforrevision("Document Id For Revision"),
  recipient("Recipient"),
  asyncdocumentid("Async Document ID");

  private construct(kwName : String) {
    obName = kwName
    colName = kwName.replaceAll(" ", "").replaceAll("#", "")
  }

  private var obName : String as OnBaseName;
  private var colName : String as OnBaseColumnName
}
