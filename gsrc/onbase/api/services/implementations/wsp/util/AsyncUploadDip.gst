<%@ params(filename: String, documentType: String, mimeType: String, source: String, keywords: onbase.api.services.implementations.wsp.util.KeywordAdaptor)
%>>>>>Self Configuring Tagged DIP<<<<
BEGIN:
>>DocTypeName:OnBase Document
>>DocDate:${ new java.text.SimpleDateFormat("MM/dd/yyyy").format(new java.util.Date()) }
>>FileName:${filename}
MIME Type:${mimeType}

Policy Number: ${keywords.PolicyNumber ?: ""}

END: