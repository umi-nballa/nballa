package onbase.api

uses java.lang.StringBuilder
uses gw.api.util.Logger
uses gw.util.Base64Util
uses org.apache.commons.lang.StringUtils
uses java.util.Map
uses java.util.HashMap
uses java.lang.RuntimeException
uses onbase.api.application.KeywordMapping
uses org.apache.commons.lang.StringEscapeUtils
uses gw.xml.XmlElement

/**
 * AePopUtils - generates xml for pops with Unity Client.
 * 
 * Hyland Build Version: 16.0.0.999
 * 
 *  mfowler - 1.1 - initial AePopUtils
 *
 *  11/13/2015 - Clayton Sandham
 *     * Added more methods for use with template descriptors. Didn't change the contracts of any preexisting methods.
 *	   * Changed the AE Scrape xml to put the field/keyword name in the name property on the scrape xml.
 * 
 */
class AePopUtils {

  private static final var logger = Logger.forCategory("Document.OnBaseDMS")
  
  private static final var AESCRAPEURL = "onbase://ae/xml/?xmlInfo="
  private static final var SCRAPESTART = '<SCRAPE>'
  private static final var SCRAPEEND = '</SCRAPE>'
  private static final var CONTEXTDOCCOMP = '<CONTEXT name="Unity Client - Document Composition" localename="" />'
  private static final var CONTEXTDOCPACKET = '<CONTEXT name="Unity Client - Document Packet Generation" localename="" />'
  private static final var CONTEXTRETRIEVAL = '<CONTEXT name="Unity Client - Retrieval" localename="" />'
  private static final var CONTEXTFOLDER = '<CONTEXT name="Unity Client - Folder Retrieval" localename="" />'
  private static final var CONTEXTCQ = '<CONTEXT name="Unity Client - Custom Query" localename="" />'
  private static final var CONTEXTUNITYFORM = '<CONTEXT name="Unity Client - Unity Form Creation" localename="" />'
  private static final var CONTEXTUPLOAD = '<CONTEXT name="Unity Client - Upload" localename="" />'
  
  private static final var DOCCOMPTEMPLATEID = "templateid";
  private static final var FOLDERUNIQUEID = "folderid";
  private static final var CUSTOMQUERYUNIQUEID = "customequeryid";
  private static final var DOCTYPEID = "doctypeid"

  private static final var UNITYFORMID = "UnityFormID";
  private static final var UNITYFORMNAME = "UnityFormName"

  /**
   * types of currently supported scrap actions.
   */
  public static enum AEPOPENUM {
    Retrieval, DocPacket, DocComp, Folders, CustomQuery, UnityForm, Upload
  }

  /**
   * Base function to generate AE scrape XML
   *
   * @param typeEnum Type of event you want AppEnabler to run
   * @param keywordXml specific keyword scrape XML for that type of action
   * @param idMap a map of specific information for that AppEnabler action
   *
   * @return Scrape Xml that AppEnabler can use.
   */
public static function generateScrapeXml(typeEnum:AEPOPENUM, keywordXml:String, idMap:Map<String, String>) : String{
    var scrapeXml = new StringBuilder()
    scrapeXml.append(SCRAPESTART)
    switch(typeEnum){
      case AEPOPENUM.DocComp:
          scrapeXml.append(CONTEXTDOCCOMP)
          if(idMap == null || StringUtils.trimToNull(idMap.get(DOCCOMPTEMPLATEID)) == null){
            throw new RuntimeException("Missing Argument "+DOCCOMPTEMPLATEID+". Please pass in id of template you wish you compose.")
          }
		  //default scrape xml for doc comp. DestDocTypeID is required and passing 101 expecting it to be overridden by the template.
          scrapeXml.append('<DOCCOMP DestDocTypeID="101" DestDocTypeName="" DisableImportDialog="0" ForceDocType="0" ForcePreview="0" InheritKeywordsFromFields="0" TemplateID="'+idMap.get(DOCCOMPTEMPLATEID)+'" TemplateName="" TemplateSettingsOption="0" />')
          break
      case AEPOPENUM.DocPacket:
          scrapeXml.append(CONTEXTDOCPACKET)
          break
      case AEPOPENUM.Retrieval:
          scrapeXml.append(CONTEXTRETRIEVAL)
          break
      case AEPOPENUM.Folders:
          scrapeXml.append(CONTEXTFOLDER)
          if(idMap == null || StringUtils.trimToNull(idMap.get(FOLDERUNIQUEID)) == null){
            throw new RuntimeException("Missing Argument "+FOLDERUNIQUEID+". Please pass in id of folder you wish to view.")
          }
          scrapeXml.append('<FOLDERTYPE id="'+idMap.get(FOLDERUNIQUEID)+'" name="" />')
          break
      case AEPOPENUM.CustomQuery:
          scrapeXml.append(CONTEXTCQ)
          if(idMap != null && StringUtils.trimToNull(idMap.get(CUSTOMQUERYUNIQUEID)) == null){
            throw new RuntimeException("Missing Argument "+CUSTOMQUERYUNIQUEID+". Please pass in id of custom query you wish to view.")
          }
          scrapeXml.append('<CUSTOMQUERY id="'+ idMap.get(CUSTOMQUERYUNIQUEID) +'" name="" />')
          break
      case AEPOPENUM.UnityForm:
          scrapeXml.append(CONTEXTUNITYFORM)
          if(idMap == null || StringUtils.trimToNull(idMap.get(UNITYFORMID)) == null){
            throw new RuntimeException("Missing Argument "+UNITYFORMID+". Please pass in id of unity form you wish to view.")
          }
          if(idMap == null || StringUtils.trimToNull(idMap.get(UNITYFORMNAME)) == null){
            throw new RuntimeException("Missing Argument "+UNITYFORMNAME+". Please pass in name of unity form you wish to view.")
          }
          var id = idMap.get(UNITYFORMID)
          var name = idMap.get(UNITYFORMNAME)
          scrapeXml.append('<UNITYFORM displayUnityForm="-1" id="${id}" name="${name}" revisionNum="0" />')
          break
      case AEPOPENUM.Upload:
          scrapeXml.append(CONTEXTUPLOAD)
          if( idMap == null || StringUtils.trimToNull(idMap.get(DOCTYPEID)) == null ){
            throw new RuntimeException("Missing Argument " + DOCTYPEID + ". Please pass in default doc type ID to upload" )
          }

          scrapeXml.append('<DOCTYPE id="${idMap.get(DOCTYPEID)}" name="" />')
        break
       default:
          throw new RuntimeException("AEPOP type not found")

    }
    scrapeXml.append(keywordXml)
    scrapeXml.append(SCRAPEEND)

    var scrapeXmlString = scrapeXml.toString()

    if (logger.isDebugEnabled()) {
      logger.debug("scrapeXml is - "+scrapeXmlString)
    }

    return scrapeXmlString;
  }


  /**
   * Generates keyword Scrape Xml from a map of keyword names in which it will get the correct id and the map will contains the values
   *
   * @param dataMap Map of OnBase keyword names and values
   *
   * @return keyword scrape xml
   */
  public static function getKeywordXmlByName(dataMap:HashMap<String, String>) : String{
    var keywordXml = new StringBuilder()
    var mapping = new KeywordMapping()
    var seedID = -1;
    // Get the keyword id for each keyword.
    for (name in dataMap.keySet()) {
     var id = mapping.getKeywordIdFromName(name)
     if(id == "-1"){ //If the keyword doesn't exist in OB, make the id negative and unique.
       id = (seedID) as String
       seedID--
     }
     var value = StringEscapeUtils.escapeXml(dataMap.get(name))
     //build the scrape xml with the ID and the Claim value always passing String dataType="10" since its required and other types will be fine to passed
     keywordXml.append('<KEYWORD id="').append(id).append('" name="' + name + '" value="').append(value).append('" indexonly="0" dataType="10" />')
    }
    //<KEYWORD id="235" name="Insured" value="1234 Main St" indexonly="0" dataType="10" />
    return  keywordXml.toString()
  }

  public static class Field{
    public construct(_name: String, _value: String){
      Name = _name
      Value = _value
    }
    public var Name: String
    public var Value: String
  }

  public static function getKeywordXmlByList(dataList:List<Field>) : String{
    var keywordXml = new StringBuilder()
    var mapping = new KeywordMapping()
    var seedID = -1;
    // Get the keyword id for each keyword.
    for (field in dataList) {
      var id = mapping.getKeywordIdFromName(field.Name)
      if(id == "-1"){ //If the keyword doesn't exist in OB, make the id negative and unique.
        id = (seedID) as String
        seedID--
      }
      var value = StringEscapeUtils.escapeXml(field.Value)
      //build the scrape xml with the ID and the Claim value always passing String dataType="10" since its required and other types will be fine to passed
      keywordXml.append('<KEYWORD id="').append(id).append('" name="' + field.Name + '" value="').append(value).append('" indexonly="0" dataType="10" />')
    }
    //<KEYWORD id="235" name="Insured" value="1234 Main St" indexonly="0" dataType="10" />
    return  keywordXml.toString()
  }


  public static function getKeywordXmlElementByName(dataMap:HashMap<String, String>) : XmlElement{
    var keywordXml = new XmlElement("SCRAPE")
    var mapping = new KeywordMapping()
    var seedID = -1;
    // Get the keyword id for each keyword.
    for (name in dataMap.keySet()) {
      var id = mapping.getKeywordIdFromName(name)
      if(id == "-1"){ //If the keyword doesn't exist in OB, make the id negative and unique.
        id = (seedID) as String
        seedID--
      }
      var value = dataMap.get(name)

      //build the scrape xml with the ID and the Claim value always passing String dataType="10" since its required and other types will be fine to passed
      //keywordXml.append('<KEYWORD id="').append(id).append('" name="' + name + '" value="').append(value).append('" indexonly="0" dataType="10" />')
      var keyword = new XmlElement("KEYWORD")
      keyword.setAttributeValue("id", id)
      keyword.setAttributeValue("name", name)
      keyword.setAttributeValue("value", value)
      keyword.setAttributeValue("indexonly", "0")
      keyword.setAttributeValue("dataType", "10")
      keywordXml.addChild(keyword)
    }

    return  keywordXml
  }

  /**
   * Generates Unity form field scrape xml from a map of field names and the Unity form name and ID.
   *
   * @param formId ID number of the Unity Form
   * @param formName Name of the Unity Form
   * @param fieldMap Fields to include
   *
   * @return field scrape xml
   */
  public static function getUnityFormFieldXml(formId:String, formName:String, fieldMap:HashMap<String,String>) : String {
    var xml = new StringBuilder()

    fieldMap.eachKeyAndValue( \ k, val -> {
      xml.append('<UNITYFORMFIELD name="( ${formName} ) - ${k}" value="${StringEscapeUtils.escapeXml(val)}"' +
                 ' indexonly="0" dataType="10" UnityFormID="${formId}" UnityFormName="${formName}" />')
    })

    return xml.toString();
  }



  /**
   * Generates keyword Scrape Xml for the from Doc Handle keyword
   *
   * @param docId Id of document you want to retrieve
   *
   * @return keyword scrape xml
   */
  public static function getDocIdKeywordXml(docId:String) : String{
    var scrapeXml = new StringBuilder()
    // -6 =  from docId, this results in one result
    scrapeXml.append('<KEYWORD_EX id="-6" name="" value="'+docId+'" indexonly="0" dataType="1" />')
    return scrapeXml.toString()
  }

  /**
   * AppEnabler Base64 with string replace
   *
   * @param xml Scrape XML for encoding
   *
   * @return encoded xml for url
   */
  private static function b64Encode(xml:String) :String{
   //special AE POP base64 replacements
   return  Base64Util.encode(xml.getBytes()).replace("+", "-").replace("/", "_").replace("=", ",")
  }

  /**
   * Url for AEPOP
   *
   * @param scrapeXml AE Scrape XML
   *
   * @return string for AEPOP uri
   */
 public static function getAePopURL(scrapeXml: String) : String{
   var uri = AESCRAPEURL + b64Encode(scrapeXml)
   if (logger.isDebugEnabled()) {
     logger.debug("Encoded Url is - "+uri)
   }
   return uri
 }

  /**
   * The Essentials to create a DocComp Scrape Xml
   *
   * @param keywordXml Keyword scrape xml that will be used to generate the document.
   * @param templateId Id of the OnBase DocComp Template
   *
   * @return DocComp Scrape Xml
   */
  public static function generateDocCompScrapeXml(keywordXml:String, templateId:String) : String{
    var idMap = new HashMap<String, String>()
    idMap.put(DOCCOMPTEMPLATEID, templateId)
    return generateScrapeXml(AEPOPENUM.DocComp,keywordXml,idMap)
  }

  /**
   * The Essentials to create a DocComp url
   *
   * @param keywordXml Keyword scrape xml that will be used to generate the document.
   * @param templateId Id of the OnBase DocComp Template
   *
   * @return AEPOP DocComp URL
   */
  public static function generateDocCompURL(keywordXml:String, templateId:String) : String{

    return  getAePopURL(generateDocCompScrapeXml(keywordXml,templateId))
  }

  /*
   * The Essentials to create a UnityForm Scrape Xml
   *
   * @param fieldXml Field scrape xml that will be used to generate the form
   * @param formId Id of the Unity Form
   * @param formName Name of the Unity Form
   */
  public static function generateUnityFormScrapeXml(fieldXml:String, formId:String, formName:String) : String {
    var idMap = {
      UNITYFORMID -> formId,
      UNITYFORMNAME -> formName
    }
    return generateScrapeXml(AEPOPENUM.UnityForm, fieldXml, idMap)
  }

  /*
   * The Essentials to create a UnityForm url
   *
   * @param fieldXml Field scrape xml that will be used to generate the form
   * @param formId Id of the Unity Form
   * @param formName Name of the Unity Form
   */
  public static function generateUnityFormURL(fieldXml:String, formId:String, formName:String) : String {
    return getAePopURL(generateUnityFormScrapeXml(fieldXml, formId, formName))
  }

  /**
   * The Essentials to create a Folder Retrieval URL
   *
   * @param keywordXml Keyword scrape xml that will be used to generate the document.
   * @param folderId Id of the OnBase Folder
   *
   * @return AEPOP Folder Retrieval URL
   */
  public static function generateFolderURL(keywordXml:String, folderId:String) : String{
    var idMap = new HashMap<String, String>()
    idMap.put(FOLDERUNIQUEID, folderId)
    return getAePopURL(generateScrapeXml(AEPOPENUM.Folders,keywordXml,idMap))
  }

  /**
   * The Essentials to create a Custom Query URL
   *
   * @param keywordXml Keyword scrape xml that will be used to generate the document.
   * @param customQueryId Id of the OnBase Custom Query
   *
   * @return AEPOP Custom Query URL
   */
  public static function generateCustomQueryURL(keywordXml:String, customQueryId:String) : String{
    var idMap = new HashMap<String, String>()
    idMap.put(CUSTOMQUERYUNIQUEID, customQueryId)
    return getAePopURL(generateScrapeXml(AEPOPENUM.CustomQuery,keywordXml,idMap))
  }

  /**
   * The Essentials to create a AE Pop Doc Retrieval URL
   *
   * @param docId Id Of Document that will be displayed
   *
   * @return AEPOP URL for Doc Retrieval
   */
  public static function generateRetrievalUrl(docId: String):String{
    return getAePopURL(generateScrapeXml(AEPOPENUM.Retrieval, getDocIdKeywordXml(docId), null))
  }


  /**
   * The Essentials to create a scrape event for Document Packet Generation
   *
   * @param docId Id Of Document that will be used to find related documents
   *
   * @return scrape event for Document Packet Generation
   */
  public static function generateDocPacketScrapeXml(docId:String):String{
      return generateScrapeXml(AEPOPENUM.DocPacket, getDocIdKeywordXml(docId), null)
  }


  /**
   * Create a unity document upload URL
   *
   * @param docTypeId - the default document type to upload to
   * @param keywordXml - Keywords to set for the upload
   *
   * @return AEPOP URL for Document Upload
   */
  public static function generateUploadUrl( docTypeNum : String, keywordXml : String ) : String {
    return getAePopURL( generateDocUploadXml( docTypeNum, keywordXml ))
  }


  /**
   * Create the AE scrape xml for a document upload
   *
   * @param docTypeId - default document type to upload
   * @param keywordXml - keywords to set for the upload
   *
   * @return AEPOP Scrape XML
   */
  public static function generateDocUploadXml( docTypeNum : String, keywordXml : String ) : String {
    var idMap = new HashMap<String, String>()
    idMap.put(DOCTYPEID, docTypeNum)
    return generateScrapeXml(AEPOPENUM.Upload,keywordXml,idMap)
  }
  
}
