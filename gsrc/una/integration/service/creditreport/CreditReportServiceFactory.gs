package una.integration.service.creditreport

uses una.integration.service.creditreport.mock.CreditReportServiceMock
uses una.integration.service.creditreport.ncf.NCFCreditReportService

/**
 * Factory class to return instance of the class that implements CreditReportServiceInterface
 */
class CreditReportServiceFactory {
  
  /**
   * Instantiates class implementing CreditReportService Interface
   * returns CreditReportServiceStub for purposes of reference implementation
   */
  @Param("source", "Implementation of CreditReportServiceExt to use (web service, mock...)")
  @Returns("Instance of the CreditReportServiceExt to use")
  static function getCreditReportService(source : typekey.CreditReportServiceExt) : ICreditReportService {
    
    var result : ICreditReportService = null
    
    switch(source) {
        case typekey.CreditReportServiceExt.TC_MOCK:
        result=new CreditReportServiceMock()
        break                      
                      
      case typekey.CreditReportServiceExt.TC_NCF:
        result = new NCFCreditReportService()
        break
    }

    return result
  }
}
