package gw.api.databuilder
uses gw.job.JobProcessValidator
uses gw.job.JobProcessUWIssueEvaluator

enhancement LOBJobProcessEnhancement : gw.job.JobProcess {

  function noValidationQuote() {
    doSkippingValidation(\ -> this.requestQuote())
  }
  
  
  function noValidationBind() {
    doSkippingValidation(\ -> this.bind())
  }
  
  private function doSkippingValidation(action()) {
    var prevValidator = this.JobProcessValidator
    try {
      this.JobProcessValidator = JobProcessValidator.NO_OP_VALIDATOR
      action()
    } finally {
      this.JobProcessValidator = prevValidator
    }  
  }

  function requestQuoteWithoutUWIssues() {
    doSkippingEvaluation(\ -> this.requestQuote())
  }

  private function doSkippingEvaluation(action()) {
    var prevEvaluator = this.JobProcessEvaluator
    try {
      this.JobProcessEvaluator = JobProcessUWIssueEvaluator.NO_OP_EVALUATOR
      action()
    } finally {
      this.JobProcessEvaluator = prevEvaluator
    }  
  }
}