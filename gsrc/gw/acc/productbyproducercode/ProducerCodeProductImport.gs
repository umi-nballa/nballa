package gw.acc.productbyproducercode

uses gw.api.web.WebFile
uses gw.api.productmodel.Product
uses java.util.Scanner
uses java.lang.Exception
uses gw.api.database.Query
uses gw.api.util.DisplayableException
uses com.guidewire.pc.system.dependency.PCDependencies
uses gw.api.system.PCLoggerCategory
uses java.lang.StringBuilder
uses java.util.ArrayList
uses java.util.Date
uses java.text.DateFormat
uses java.text.SimpleDateFormat
uses java.lang.IllegalStateException

/**
 * Use this class and methods to import producer code - product relationships into the system
 */
class ProducerCodeProductImport {



  /**
   * Loads producer code product relationships from a csv file
   * @Param CSV File
   */
  static function importFromACSVFile(theFile : WebFile) : StringBuilder{

    var theScanner : Scanner = new Scanner(theFile.InputStream)
    var theDelimiter : String = ","
    var line : String //csv line being read
    var lineValues : String[] //will contain [producerCode, product]
    var lineNumber : int = 1 //the line number being read
    var producerCode : ProducerCode //the producer Code in the line
    var _product : Product //the product in the line
    var _effectiveDate : Date // the effective date
    var _expirationDate : Date // the expiration date
    var _jurisdiction : Jurisdiction // the jurisdiction
    var existingRelationship : boolean //true if the producer code - product relationship already exists in the system
    var log = new StringBuilder() //log to show in the UI
    var addedProducerCodeProductRelationships =  new ArrayList<ProducerCodeProduct_Ext>() //added producer code - product relationships

    try{ 
      while (theScanner.hasNextLine()) {
        line = theScanner.nextLine()
        //skip the headers in the csv file
        if (lineNumber > 1) {
            existingRelationship = false
            lineValues = line.split(theDelimiter)
            producerCode = Query.make(ProducerCode).compare("Code", Equals, lineValues[0]?.toString()).select().AtMostOneRow
            _product = PCDependencies.getProductModel().getPattern(lineValues[1], Product)
            var  _dateFormatter : DateFormat = new SimpleDateFormat("MM/dd/yyyy");
            var __effectiveDateString = lineValues[2]
            var __expirationDateString = lineValues[3]
            var __jurisdictionString = lineValues[4]
            _effectiveDate = _dateFormatter.parse(__effectiveDateString)
            _expirationDate = _dateFormatter.parse(__expirationDateString)
            if(_expirationDate < _effectiveDate){
              throw new DisplayableException("Expiration Date Cannot Be Less Than Effective Date")
            }
            _jurisdiction = typekey.Jurisdiction.get(__jurisdictionString)
             PCLoggerCategory.IMPORT.info("producerCode:" +producerCode + "_product.Code" +_product.Code)
             //log.append("producerCode:" +producerCode + "_product.Code" +_product.Code)
            //check if this producer already has this product associated
            if (producerCode != null and _product.Code != null){
                  existingRelationship = Query.make(ProducerCodeProduct_Ext).compare("ProductCode", Equals, _product.Code).compare("ProducerCode", Equals, producerCode).compare("EffectiveDateExt", Equals, _effectiveDate).compare("ExpirationDateExt", Equals, _expirationDate).compare("JurisdictionExt", Equals, _jurisdiction).select().AtMostOneRow != null or
                      //this is needed because everything is done in done bundle. In the database we don't have the objects that are going to be inserted so we need to check in memory
                      addedProducerCodeProductRelationships.hasMatch( \ relationship -> relationship.ProducerCode == producerCode and relationship.ProductCode == _product.Code and relationship.EffectiveDateExt == _effectiveDate and relationship.ExpirationDateExt == _expirationDate and relationship.JurisdictionExt == _jurisdiction)
            }
            PCLoggerCategory.IMPORT.info("existingRelationship:" + existingRelationship)
            //if this producer already has the product associated write to the log file and skip it
            if (existingRelationship){
              PCLoggerCategory.IMPORT.info("WARNING Producer Code - Product not added: " + lineValues[0] + " " + lineValues[1] + " already exist")
              log.append("WARNING Producer Code - Product not added: " + lineValues[0] + " " + lineValues[1] + " already exist \n")
            }
            //if it is new create the relationship in the system
            else if(not existingRelationship and producerCode != null and _product.Code != null){
                  //Create the relationship and add it to the list of added relationships
                  addedProducerCodeProductRelationships.add(producerCode.addProductWithResult(_product,_effectiveDate,_expirationDate,_jurisdiction))
                  PCLoggerCategory.IMPORT.info("Producer Code - Product relationship sucessfully added: " + producerCode + " " + _product.Code)
                  log.append("Producer Code - Product relationship sucessfully added: " + producerCode + " " + _product.Code + "\n")
            }
            //the producer code or the product doesn't exist, skip it
            else{
                  PCLoggerCategory.IMPORT.info("WARNING Producer Code - Product not added: " + lineValues[0] + " or " + lineValues[1] + " doesn't exist")
                  log.append("WARNING Producer Code - Product not added: " + lineValues[0] + " or " + lineValues[1] + " doesn't exist \n")
            }
         }
         lineNumber++
      }
    }          
    catch(ex: Exception) {
            PCLoggerCategory.IMPORT.info("Error loading file: " + theFile + "\n" + ex)
            log.append("Error loading file: " + theFile + "\n" + ex)
            throw new DisplayableException(displaykey.Accelerator.ProductByProducerCode.Web.Admin.Error.File.FailedImportFile + "|" + ex.Message)
    }
    return log
   }
   
}
