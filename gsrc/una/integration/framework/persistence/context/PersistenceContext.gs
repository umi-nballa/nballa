package una.integration.framework.persistence.context

uses org.springframework.jdbc.datasource.DataSourceTransactionManager
uses org.springframework.transaction.TransactionStatus
uses org.springframework.transaction.support.DefaultTransactionDefinition
uses org.springframework.transaction.support.TransactionCallbackWithoutResult
uses org.springframework.transaction.support.TransactionTemplate
uses una.integration.framework.util.DIContextHelper
uses una.logging.UnaLoggerCategory

/**
 * This class provides transaction capabilities for a block of code to be executed in a database transaction.
 * Created By: vtadi on 5/18/2016
 */
class PersistenceContext {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var BEAN_TRANSACTION_MANAGER = "transactionManager"
  var transactionTemplate : TransactionTemplate

  /**
   * Initializing the transactionTemplate
   */
  private construct() {
    var transactionManager = DIContextHelper.getBean(BEAN_TRANSACTION_MANAGER) as DataSourceTransactionManager
    transactionTemplate = new(transactionManager)
    transactionTemplate.setPropagationBehavior(DefaultTransactionDefinition.PROPAGATION_REQUIRED)
    _logger.debug("PersistenceContext is initialized")
  }

  /**
   * This function enables executing a block of code with in a new database transaction.
   */
  static function runWithNewTransaction(myCallBack():void){
    _logger.debug("Entering the function 'runWithNewTransaction' of PersistenceContext")
    var context = new PersistenceContext()
    context.transactionTemplate.execute(new TransactionCallbackWithoutResult(){
      override function doInTransactionWithoutResult(status: TransactionStatus) {
        myCallBack()
      }
    })
    _logger.debug("Exiting the function 'runWithNewTransaction' of PersistenceContext")
  }

}