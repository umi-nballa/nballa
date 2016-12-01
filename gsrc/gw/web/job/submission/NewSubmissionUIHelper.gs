package gw.web.job.submission

uses gw.api.web.job.submission.SubmissionUtil
uses gw.api.util.DisplayableException
uses pcf.SubmissionManager
uses gw.api.util.JurisdictionMappingUtil
uses pcf.JobForward
uses java.util.ArrayList

@Export
class NewSubmissionUIHelper {

  var _currentLocation : pcf.NewSubmission

  construct(currentLocation : pcf.NewSubmission) {
    _currentLocation = currentLocation

  }

  function initializeProducerSelection(acct : Account) : ProducerSelection
  {
    var rtn = NewSubmissionUtil.getOrCreateProducerSelection(acct)
    SubmissionUtil.validateForSubmission(rtn)
    return rtn
  }

  function changedProducer(acct : Account, selectionOfProducer: ProducerSelection)
  {
    var producerCodeRange = selectionOfProducer.getRangeOfActiveProducerCodesForCurrentUser() as ProducerCode[]
    if( producerCodeRange.Count == 1 )
    {
      selectionOfProducer.ProducerCode = producerCodeRange[0]
    }
    else
    {
      selectionOfProducer.ProducerCode = null
    }
    refreshProductOffers(acct, selectionOfProducer)
  }

  function refreshProductOffers(acct : Account, selectionOfProducer: ProducerSelection)
  {
    if(!una.pageprocess.SubmissionWizardHelper.canAllowSubmission(acct)){
      throw new gw.api.util.DisplayableException(displaykey.Web.SubmissionManagerLV.AlreadyAPolicyExists)
    }
    if (selectionOfProducer.Account <> acct) {
      selectionOfProducer.Account = acct
      //selectionOfProducer.State =   JurisdictionMappingUtil.getJurisdiction(acct.AccountHolderContact.PrimaryAddress)
      checkActStateExistsWithProducer(selectionOfProducer)
    }
    var productOffers = performNameClearance(acct, selectionOfProducer)
    gw.api.web.PebblesUtil.invalidateIterators(_currentLocation, ProductSelection )
  }

  function performNameClearance(acct: Account, selectionOfProducer: ProducerSelection) : ProductSelection[]
  {
    isProducerStatesEmpty(selectionOfProducer)
    //if(!una.pageprocess.SubmissionWizardHelper.canAllowSubmission(acct)){
      //throw new gw.api.util.DisplayableException(displaykey.Web.SubmissionManagerLV.AlreadyAPolicyExists)
    //}
    if(selectionOfProducer.Producer!=null && selectionOfProducer.DefaultPPEffDate == null) {
      //throw new gw.api.util.DisplayableException(displaykey.Web.SubmissionManagerLV.DefaultPPEffDateRequired)
    }
    if( canPerformNameClearance(acct, selectionOfProducer) )
    {
      var offers = acct.getAvailableProducts(selectionOfProducer.SubmissionPolicyProductRoot) as ProductSelection[]
      for (offer in offers)
      {
        offer.NumToCreate = 0
      }
      return offers
    }
    else
    {
      return null
    }
  }

  function checkActStateExistsWithProducer(theProducerSelection : ProducerSelection) : Jurisdiction {
    var whatProducerHad = theProducerSelection.State
    theProducerSelection.State = null
    for(aGrpRegion in theProducerSelection.Producer.RootGroup.Regions){
      var aState = typekey.Jurisdiction.get(aGrpRegion.Region.getRegionZones(typekey.ZoneType.TC_STATE).first().Code)
      if(whatProducerHad != null && whatProducerHad.Code.equalsIgnoreCase(aState.Code)){
        theProducerSelection.State = aState
      }
    }
    return theProducerSelection.State
  }

  function isProducerStatesEmpty(theProducerSelection: ProducerSelection) : boolean {
    var res = false
    var prefix = ""
    var baseState = theProducerSelection.State
    for(aGrpRegion in theProducerSelection.Producer.RootGroup.Regions){
      if(aGrpRegion.Region.getRegionZones(typekey.ZoneType.TC_STATE).length > 0){
        res = true
      }
    }
    if(theProducerSelection.DefaultPPEffDate == null){
      prefix = displaykey.Web.SubmissionManagerLV.DefaultPPEffDateRequired + "|"
    }
    if(theProducerSelection.Producer != null && (!isForeignCountry(theProducerSelection) && baseState == null) && res == false){
      throw new gw.api.util.DisplayableException(prefix + displaykey.Web.SubmissionManagerLV.NoActiveStates)
    } else if(theProducerSelection.Producer != null && (!isForeignCountry(theProducerSelection) && baseState == null) && res == true){
      throw new gw.api.util.DisplayableException(prefix + displaykey.Web.SubmissionManagerLV.DefaultBaseStateRequired)
    }
    return res
  }

  function isForeignCountry(theProducerSelection: ProducerSelection) : boolean {
    //var theExcludeList = new ArrayList<String>() {typekey.Country.TC_US.Code, typekey.Country.TC_AU.Code,typekey.Country.TC_CA.Code}
    var theExcludeList = new ArrayList<String>() {typekey.Country.TC_US.Code}
    var res = false
    if(!theExcludeList.hasMatch( \ elt1 -> elt1.equalsIgnoreCase(theProducerSelection.Account.AccountHolderContact.Country.Code))){
      res = true
    }
    return res
  }

  function orgGroupRegionsToJurisdictions(theProducerSelection: ProducerSelection) : Jurisdiction[] {
    var grpRegions = theProducerSelection.Producer.RootGroup.Regions
    var theStates = new ArrayList<Jurisdiction>()
    for(aGrpRegion in grpRegions){
      var aState = typekey.Jurisdiction.get(aGrpRegion.Region.getRegionZones(typekey.ZoneType.TC_STATE).first().Code)
      theStates.add(aState)
    }
    return (theStates.toArray(new Jurisdiction[theStates.size()]))
  }

  function canPerformNameClearance(acct: Account, selectionOfProducer: ProducerSelection) : boolean
  {
    return acct != null && perm.Account.newSubmission(acct) &&
        selectionOfProducer.Producer != null && selectionOfProducer.ProducerCode != null
          //&& una.pageprocess.SubmissionWizardHelper.canAllowSubmission(acct)
  }

  function createMultipleSubmissions( offers : ProductSelection[] , acct: Account, selectionOfProducer: ProducerSelection, typeOfQuote: QuoteType)
  {
    SubmissionUtil.setLastProducerSelection( selectionOfProducer )
    var submissions = SubmissionUtil.createSubmissions( offers, acct, selectionOfProducer, typeOfQuote )
    if( submissions.Count == 0 )
    {
      throw new DisplayableException( displaykey.Web.ProductOffers.NoSubmissionsCreated )
    }
    SubmissionManager.go( submissions[0].Policy.Account )
  }

  function isDefaultPPEffDatePopulated(producerSelection : ProducerSelection): boolean {
    if( producerSelection.Producer != null && producerSelection.DefaultPPEffDate == null ) {
      throw new gw.api.util.DisplayableException(displaykey.Web.SubmissionManagerLV.DefaultPPEffDateRequired)
    }
    return true
  }

  static function createOneSubmission( offer : ProductSelection, producerSelection : ProducerSelection, account : Account, quoteType : QuoteType )
  {
    if( producerSelection.DefaultPPEffDate == null ) {
      throw new gw.api.util.DisplayableException(displaykey.Web.SubmissionManagerLV.DefaultPPEffDateRequired)
    }
    var availOffer = account.getAvailableProduct( producerSelection.SubmissionPolicyProductRoot, offer.Product )
    if( availOffer == null )
    {
      throw new gw.api.util.DisplayableException( displaykey.Web.SubmissionManagerLV.UnavailableProduct( offer.Product ) )
    }
    if( producerSelection.ProducerCode == null )
    {
      throw new gw.api.util.DisplayableException( displaykey.Web.SubmissionManagerLV.ProducerCodeRequired )
    }
    if (producerSelection.State == null) {
      throw new gw.api.util.DisplayableException( displaykey.Web.SubmissionManagerLV.BaseStateRequired)
    }

    SubmissionUtil.setLastProducerSelection( producerSelection )
    offer.NumToCreate = 1
    var submission = SubmissionUtil.createSubmission( offer, account, producerSelection, quoteType )
    // For one new submission - go straight to Submission view
    var policyPeriod = submission.LatestPeriod
    gw.transaction.Transaction.runWithNewBundle( \ bun -> {
      policyPeriod = bun.add( policyPeriod )
      policyPeriod.BaseState = producerSelection.State
      policyPeriod.SubmissionProcess.beginEditing()
      //removed the GL Line from main menu at the initial view for Commercial Package
      policyPeriod.removeGlLine()
    } )

    JobForward.go(submission, policyPeriod)
  }

  static function makeNumberRange( max : int ) : java.util.List<java.lang.Integer>
  {
    var result = new java.util.ArrayList<java.lang.Integer>()
    var count = 0
    while( count <= max )
    {
      result.add( count )
      count = count + 1
    }
    return result
  }
}