<%@ params(filename: String, documentType: String, mimeType: String, source: String, keywords: onbase.api.services.implementations.wsp.util.KeywordAdaptor)
%>>>>>Self Configuring Tagged DIP<<<<
BEGIN:
>>DocTypeName:GW - SYS - ARCHIVED DOCUMENT
>>DocDate:${ new java.text.SimpleDateFormat("MM/dd/yyyy").format(new java.util.Date()) }
>>FileName:${filename}
mimetype:${mimeType}
Document Type:${documentType}
Claim Number:${keywords.ClaimNumber ?: ""}
Contact ID:${keywords.ContactID ?: ""}
Contact Name:${keywords.ContactName ?: ""}
Matter ID:${keywords.MatterID ?: ""}
Document Id For Revision:${keywords.DocumentIdForRevision ?: ""}
Matter Name:${keywords.MatterName ?: ""}
GW Description:${keywords.Description ?: ""}
GW File Name: ${keywords.FileName ?: ""}
Account Number: ${keywords.AccountNumber ?: ""}
Job Number: ${keywords.JobNumber ?: ""}
Policy Number: ${keywords.PolicyNumber ?: ""}
Producer ID: ${keywords.ProducerID ?: ""}
Source: ${source}
Status: ${keywords.Status ?: ""}
User: ${keywords.User ?: ""}
Recipient: ${keywords.Recipient ?: ""}
Async Document ID: ${keywords.AysncDocumentID ?: ""}
<% if (keywords.ClaimSecurityRole != null) {
  var index = 0
  foreach (role in keywords.ClaimSecurityRole.split(",")) { %>
Claim Security Role: ${role}
<%  index++
  }
} %>
<% if (keywords.ActivityID != null) { %>
GW Link Type: ${onbase.api.Settings.DocumentLinkType.activityid}
GW Link ID: ${keywords.ActivityID}
<% } %>
<% if (keywords.CheckID != null) { %>
GW Link Type: ${onbase.api.Settings.DocumentLinkType.checkid}
GW Link ID: ${keywords.CheckID}
<% } %>
<% if (keywords.ReserveID != null) { %>
GW Link Type: ${onbase.api.Settings.DocumentLinkType.reserveid}
GW Link ID: ${keywords.ReserveID}
<% } %>
<% if (keywords.ExposureID != null) { %>
GW Link Type: ${onbase.api.Settings.DocumentLinkType.exposureid}
GW Link ID: ${keywords.ExposureID}
<% } %>
END:
