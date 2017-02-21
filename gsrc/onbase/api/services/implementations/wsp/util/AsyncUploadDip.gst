<%@ params(filename: String, documentType: String, mimeType: String, source: String, keywords: onbase.api.services.implementations.wsp.util.KeywordAdaptor)
%>>>>>Self Configuring Tagged DIP<<<<
BEGIN:
>>DocTypeName: GW - SYS - Archive Document
>>DocDate:${ new java.text.SimpleDateFormat("MM/dd/yyyy").format(new java.util.Date()) }
>>FileName:${filename}
MIME Type:${mimeType}
AsyncDocumentID:${keywords.AysncDocumentID ?: ""}
${onbase.api.KeywordMap.subtype.OnBaseName}:${keywords.Subtype ?: ""}
${onbase.api.KeywordMap.description.OnBaseName}:${keywords.Description ?: ""}
${onbase.api.KeywordMap.policynumber.OnBaseName}:${keywords.PolicyNumber ?: ""}
<%for(var primaryInsured in keywords.PrimaryNamedInsureds) { %>
${onbase.api.KeywordMap.primaryinsured.OnBaseName} First Name:${primaryInsured.FirstName ?: ""}
${onbase.api.KeywordMap.primaryinsured.OnBaseName} Last Name:${primaryInsured.LastName ?: ""}
${onbase.api.KeywordMap.primaryinsured.OnBaseName} Middle Name:${primaryInsured.MiddleName ?: ""}
<%}%>
<%for(var additionalInsured in keywords.AdditionalNamedInsureds) { %>
${onbase.api.KeywordMap.additionalinsured.OnBaseName} First Name:${additionalInsured.FirstName ?: ""}
${onbase.api.KeywordMap.additionalinsured.OnBaseName} Last Name:${additionalInsured.LastName ?: ""}
${onbase.api.KeywordMap.additionalinsured.OnBaseName} Middle Name:${additionalInsured.MiddleName ?: ""}
<%}%>
${onbase.api.KeywordMap.productname.OnBaseName}:${keywords.ProductName ?: ""}
${onbase.api.KeywordMap.policytype.OnBaseName}:${keywords.PolicyType ?: ""}
${onbase.api.KeywordMap.policyeffectivedate.OnBaseName}:${keywords.PolicyEffectiveDate?.HasContent ? DipDateFormatter.convertFormat(keywords.PolicyEffectiveDate) : ""}
${onbase.api.KeywordMap.policyexpirationdate.OnBaseName}:${keywords.PolicyExpirationDate?.HasContent ? DipDateFormatter.convertFormat(keywords.PolicyExpirationDate) : ""}
${onbase.api.KeywordMap.term.OnBaseName}:${keywords.Term ?: ""}
${onbase.api.KeywordMap.agencycode.OnBaseName}:${keywords.AgencyCode ?: ""}
${onbase.api.KeywordMap.legacypolicynumber.OnBaseName}:${keywords.LegacyPolicyNumber ?: ""}
${onbase.api.KeywordMap.issuedate.OnBaseName}:${keywords.IssueDate?.HasContent ? DipDateFormatter.convertFormat(keywords.IssueDate) : ""}
${onbase.api.KeywordMap.transactioneffectivedate.OnBaseName}:${keywords.TransactionEffectiveDate?.HasContent ? DipDateFormatter.convertFormat(keywords.TransactionEffectiveDate) : ""}
${onbase.api.KeywordMap.onbasedocumenttype.OnBaseName}:${keywords.OnBaseDocumentType ?: ""}
END: