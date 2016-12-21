<%
uses onbase.api.services.datamodels.InsuredName
%>
<%@ params(filename: String, documentType: String, mimeType: String, source: String, keywords: onbase.api.services.implementations.wsp.util.KeywordAdaptor)
%>>>>>Self Configuring Tagged DIP<<<<
BEGIN:
>>DocTypeName: GW - SYS - Archive Document
>>DocDate: ${ new java.text.SimpleDateFormat("MM/dd/yyyy").format(new java.util.Date()) }
>>FileTypeNum: 16
>>FileName: ${filename}
MIME Type: ${mimeType}
Subtype: ${keywords.Subtype ?: ""}
Description: ${keywords.Description ?: ""}
Policy Number: ${keywords.PolicyNumber ?: ""}
<%for(var primaryInsured in keywords.PrimaryNamedInsureds) { %>
Primary Insured First Name: ${primaryInsured.FirstName ?: ""}
Primary Insured Last Name: ${primaryInsured.LastName ?: ""}
Primary Insured Middle Name: ${primaryInsured.MiddleName ?: ""}
<%}%>
<%for(var additionalInsured in keywords.AdditionalNamedInsureds) { %>
Additional Insured First Name: ${additionalInsured.FirstName ?: ""}
Additional Insured Last Name: ${additionalInsured.LastName ?: ""}
Additional Insured Middle Name: ${additionalInsured.MiddleName ?: ""}
<%}%>
Product Name: ${keywords.ProductName ?: ""}
Policy Type: ${keywords.PolicyType ?: ""}
Policy Effective Date: ${keywords.PolicyEffectiveDate?.HasContent ? DipDateFormatter.convertFormat(keywords.PolicyEffectiveDate) : ""}
Policy Expiration Date: ${keywords.PolicyExpirationDate?.HasContent ? DipDateFormatter.convertFormat(keywords.PolicyExpirationDate) : ""}
Term: ${keywords.Term ?: ""}
Agency Code: ${keywords.AgencyCode ?: ""}
Legacy Policy Number: ${keywords.LegacyPolicyNumber ?: ""}
Issue Date: ${keywords.IssueDate?.HasContent ? DipDateFormatter.convertFormat(keywords.IssueDate) : ""}
Transaction Effective Date: ${keywords.TransactionEffectiveDate?.HasContent ? DipDateFormatter.convertFormat(keywords.TransactionEffectiveDate) : ""}
OnBase Document Type: ${keywords.OnBaseDocumentType ?: ""}
END: