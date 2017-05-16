package edge.capabilities.quote.quoting
uses edge.di.annotations.ForAllGwNodes
uses gw.api.util.Logger
uses gw.job.JobProcess
uses gw.job.JobProcessUWIssueEvaluator
uses edge.util.MapUtil
uses java.util.Arrays
uses edge.capabilities.quote.quoting.dto.QuotingDTO
uses edge.capabilities.quote.quoting.dto.QuoteDTO
uses edge.capabilities.quote.lob.ILobQuotingPlugin
uses edge.capabilities.quote.quoting.util.QuoteUtil
uses edge.capabilities.quote.quoting.exception.UnderwritingException
uses gw.api.web.productmodel.ProductModelSyncIssue
uses gw.web.productmodel.ProductModelSyncIssueWrapper
uses edge.capabilities.quote.lob.dto.QuoteLobDataDTO
uses java.lang.Exception

/**
 * Default implementation of quoting plugin.
 */
class DefaultQuotePlugin implements IQuotePlugin {

  private static final var LOGGER = Logger.forCategory(DefaultQuotePlugin.Type.QName)
  
  private var _lobPlugin : ILobQuotingPlugin <QuoteLobDataDTO>
  private var _validationLevelPlugin : IQuoteValidationLevelPlugin


  @ForAllGwNodes
  @Param("lobPlugin", "Line-of-business extension plugin")
  @Param("validationLevelPlugin", "Validation level plugin")
  construct(lobPlugin : ILobQuotingPlugin <QuoteLobDataDTO>, validationLevelPlugin : IQuoteValidationLevelPlugin) {
    this._lobPlugin = lobPlugin
    this._validationLevelPlugin = validationLevelPlugin
  }


  override function quoteAllOfferings(sub : Submission) {
    //createInitialOfferings(sub)
    editPeriod(sub.SelectedVersion)
    doQuote(sub)
  }

  override function quoteBaseOffering(sub : Submission) {
    doQuote(sub)
  }

  override function updateCustomQuote(period: PolicyPeriod, data: QuoteDTO) {
    editPeriod(period)
    _lobPlugin.updateCustomQuote(period, data.Lobs)
    syncSubmissionWithProductModelAndFixIssues(period)
    quoteSinglePeriod(period)
  }


  override function syncCustomQuoteCoverages(period : PolicyPeriod, data : QuoteDTO) {
    editPeriod(period)
    _lobPlugin.updateCustomQuote(period, data.Lobs)
    syncSubmissionWithProductModelAndFixIssues(period)
    //throw an exception if there are any blocking UW issues caused by selection
    checkForBlockingUWIssues(period, UWIssueBlockingPoint.TC_BLOCKSISSUANCE)
  }
  

  
  override public function toDTO(submission : Submission) : QuotingDTO {
    if (submission.ResultingBoundPeriod != null) {
      return fromPeriods({submission.ResultingBoundPeriod})
    }
    
    if (submission.SelectedVersion.Status != PolicyPeriodStatus.TC_QUOTED  && 
        submission.SelectedVersion.Status != PolicyPeriodStatus.TC_QUOTING) {
      return null
    }
    
    return fromPeriods(submission.ActivePeriods)
  }

  override function toQuoteDTO(period : PolicyPeriod) : QuoteDTO {
    final var res = new QuoteDTO()
    if(period.SubmissionProcess?.OutputPremiumOnly == false) {
      QuoteUtil.fillBaseProperties(res, period)
      res.IsCustom = period == QuoteUtil.getBasePeriod(period.Submission)
      res.Lobs = _lobPlugin.getQuoteDetails(period)
    } else{
      QuoteUtil.fillBasePropertyTotalAmount(res, period)
    }
    return res
  }

  private function fromPeriods(periods : PolicyPeriod[]) : QuotingDTO {
    periods.sort(\ p1, p2 -> isPreferred(p1, p2))
    final var res = new QuotingDTO()
    res.OfferedQuotes = periods.map(\p -> toQuoteDTO(p))
    return res
  }
  
  
  
  protected function isPreferred(p1 : PolicyPeriod, p2 : PolicyPeriod) : boolean {
    if (p1.Offering == null && p2.Offering != null) {
      return false
    }
    
    if (p1.Offering != null && p2.Offering == null) {
      return true
    }
    
    return p1.TotalCostRPT < p2.TotalCostRPT
  }


  /**
   * Performs an actual quoting process after all offerings was
   * created or updates.
   */
  protected function doQuote(sub : Submission) {
    fixUnderwritingIssues(sub)
    quotePeriods(sub)
    var noOfQuotedPolicies = sub.ActivePeriods.countWhere(\ p ->
      (p.Status == PolicyPeriodStatus.TC_QUOTING || p.Status == PolicyPeriodStatus.TC_QUOTED))
    if(noOfQuotedPolicies == 0){
      throw new UnderwritingException(){
        :Message = "Unable to create any quote offerings"
      }
    }
  }
  
  
  
  /**
   * Checks for presence of underwriting rules on the submission.
   */
  protected function checkForBlockingUWIssues(period : PolicyPeriod, checkingPoint : UWIssueBlockingPoint) {
    try {
       final var _evaluator = new JobProcessUWIssueEvaluator()
       _evaluator.evaluateAndCheckForBlockingUWIssues(period, checkingPoint)
    } catch (e : java.lang.Exception) {
       LOGGER.info("evaluateAndCheckForBlockingUWIssues ran with exceptions: "+e)
       final var uwIssues = period.UWIssuesActiveOnly
       LOGGER.info("Number of issues blocking ${checkingPoint.Code}: ${uwIssues.length}")
       if (uwIssues != null && uwIssues.Count > 0) {
         LOGGER.info("UWIssues found for submission "+ period.Submission.JobNumber+", setting quote as submit-to-agent.")
         throw new UnderwritingException(e){
           :Message = "UWIssue: underwriting rule exception",
           :Data = 
             MapUtil.groupCollection(
               Arrays.asList(uwIssues), \i ->i.IssueType.Code, \ i -> i.LongDescription)
             .mapValues(\ v -> v.join(";"))
         }
      }
    }
  }

  
  
  /**
   * Get a quote for each period/offering on the submission.
   */
  protected function quotePeriods(submission : Submission) {
    for (period in submission.ActivePeriods) {
      quoteSinglePeriod(period)
    }

       //quoteSinglePeriod(submission.LatestPeriod)
  }
  
  
  
  /**
   *  Quote just the given PolicyPeriod. Our submission is a multi-draft submission so there is more than PolicyPeriod on the submission
   */
  protected function quoteSinglePeriod(period : PolicyPeriod) {
    var proc = period.SubmissionProcess
    period.AllCoverables.each( \ elt -> elt.syncCoverages())
    var cond = proc.canRequestQuote()
    if (cond.Okay){
      try {
        proc.requestQuote(_validationLevelPlugin.getValidationLevel(), RatingStyle.TC_DEFAULT)

      } catch (e : Exception) {
        LOGGER.error("Exception occured while quoting period", e)
        throw new UnderwritingException(e)
      }
    } else {    
      LOGGER.error("Could not quote for the following reasons : " + cond.Message)
      throw new UnderwritingException()
    }
    //throw underwriting exception if there are any blocking UW issues
    checkForBlockingUWIssues(period, UWIssueBlockingPoint.TC_BLOCKSISSUANCE)
  }

  
  
  /**
   * Updates issues in the quote.
   */
  protected function updateUnderwritingIssues(submission : Submission) {
    submission.ActivePeriods.each(\ p -> JobProcess.checkBranchAgainstProductModel(p))
  }
  
  
  /**
   * Clear any underwriting issues
   */ 
  protected function fixUnderwritingIssues(submission : Submission) {
    submission.ActivePeriods.each(\ p -> {
      final var issues = JobProcess.checkBranchAgainstProductModel(p)
      issues.where(\i -> !i.Issue.Fixed).each(\i -> { i.Issue.fixIssue(p) })
    })  
  }
  

  
  /**
   * Sometimes, after fixing product model issues, required variables are left blank. If this is the case quoting will fail.
   * Here, we resync the model after changing a coverage, fix any issues this causes and then select a value for required terms that have been erased.
   * See POR-1465 for original issue.
   */
  private function syncSubmissionWithProductModelAndFixIssues(customPeriod : PolicyPeriod) {
    var issues = JobProcess.checkBranchAgainstProductModel(customPeriod)
    for (i in issues) {
      if (!i.Issue.Fixed && i.Issue typeis ProductModelSyncIssue) {
        var wrapped = ProductModelSyncIssueWrapper.wrapIssue(i.Issue)
        if ( wrapped.Severity == ERROR ) {
          i.Issue.fixIssue(customPeriod)
        }
      }
    }

    // Sets a sensible value for coverage terms cleared by the previous sync
    for (cov in customPeriod.AllCoverables*.CoveragesFromCoverable){
      for (term in cov.CovTerms){
        if (term.Pattern.Required && term.DisplayValue === null){
          if (term typeis gw.api.domain.covterm.OptionCovTerm) {
            term.setOptionValue(term.Pattern.Options.first())
          } else if (term typeis gw.api.domain.covterm.PackageCovTerm ) {
            term.setPackageValue(term.Pattern.getOrderedAvailableValues(term).first())
          } else if (term typeis gw.api.domain.covterm.TypekeyCovTerm) {
            term.Value = term.Pattern.TypeList.getTypeKeys(false).first()
          } else if (term typeis gw.api.domain.covterm.BooleanCovTerm) {
            term.setValue(false)
          }
        }
      }
    }
  }

  /** Creates initial offerings for the submission.
   * This method is called by default Quote implementation for 
   * submissions where "custom quote" is not defined yet.
   */
  protected function createInitialOfferings(sub : Submission) {
    final var base = QuoteUtil.getBasePeriod(sub)

    _lobPlugin.generateVariants(base)

    editPeriod(base)    
  }
  
  /**
   * Starts editing one period.
   */
  protected function editPeriod(period : PolicyPeriod) {
    if (period.Status == PolicyPeriodStatus.TC_QUOTING || 
        period.Status == PolicyPeriodStatus.TC_QUOTED ||
        period.Status == PolicyPeriodStatus.TC_NEW) {
      period.SubmissionProcess.edit()
    }
  }
  
  
  
  /**
   * Checks if required period have a custom quote.
   */
  protected function hasCustomQuote(sub : Submission) : boolean {
    return sub.ActivePeriods.length >= 2
  }

}
