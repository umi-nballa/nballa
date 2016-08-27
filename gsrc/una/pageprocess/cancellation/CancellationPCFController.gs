package una.pageprocess.cancellation

uses java.util.Date
uses java.lang.StringBuilder
uses java.lang.System
uses gw.job.CancellationLeadTimeCalculator

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/26/16
 * Time: 1:21 PM
 * To change this template use File | Settings | File Templates.
 */
class CancellationPCFController {
  private var _cancellation : Cancellation
  private var _policyPeriod : PolicyPeriod
  private var _reasonDetailRange : List<CancelReasonDetailType>
  private var _reasonCodeRange : List<ReasonCode>
  private var _suppressPrint : boolean
  private var _numberOfDaysNotice : int
  private var _effectiveDate : Date

  construct(cancellation : Cancellation, policyPeriod : PolicyPeriod){
    this._cancellation = cancellation
    this._policyPeriod = policyPeriod

    if(this._policyPeriod.Cancellation == this._cancellation){
      _effectiveDate = _policyPeriod.EditEffectiveDate
    }

    _reasonDetailRange = {}
  }

  /** PCF PROPERTIES  */

  property get NumberOfDaysNotice() : int {
    return (CancellationLetterMailDate < _effectiveDate) ? _numberOfDaysNotice : 0
  }

  property get ReasonDetailRange() : java.util.List<typekey.CancelReasonDetailType> {
    return _reasonDetailRange
  }

  property get CancellationLetterMailDate() : Date{
    if(this._cancellation.CancelLetterMailDate == null){
      this._cancellation.CancelLetterMailDate = java.util.Date.CurrentDate.addDays(1)
                                                .orNextBusinessDay(_policyPeriod.ProducerCodeOfRecord.Address) //this should be next available business day - not just add business days
    }

    if(_effectiveDate !=  null){
      this._numberOfDaysNotice = this._cancellation.CancelLetterMailDate?.daysBetween(_effectiveDate)
    }

    return this._cancellation.CancelLetterMailDate
  }

  property set CancellationLetterMailDate(date : Date){
    this._cancellation.CancelLetterMailDate = date.orNextBusinessDay(this._policyPeriod.ProducerCodeOfRecord.Address)
  }

  property get CumulativeReasonDetailsDescription() : String{
    var result = new StringBuilder()

    if(this._cancellation.CancelReasonCode != null){
      result.append(this._cancellation.CancelReasonCode)
            .append(System.lineSeparator())
    }

    this._cancellation.CancelReasonDetails?.each( \ elt -> {
      if(elt.Description != null){
        result.append(elt.Description)
              .append(System.lineSeparator())
      }
    })

    this._cancellation.CancellationDescription = result.toString()

    return this._cancellation.CancellationDescription
  }

  property set CumulativeReasonDetailsDescription(value : String){
    _cancellation.CancellationDescription = value
  }

  property get CancellationRefundMethod() : typekey.CalculationMethod{
    return typekey.CalculationMethod.TC_PRORATA
  }

  /**PCF Functions**/

  public function areCancelReasonDetailsVisible() : boolean{
    return _cancellation.CancelReasonCode != null
       and typekey.CancelReasonDetailType.getTypeKeys(false).where( \ elt -> elt.hasCategory(_cancellation.CancelReasonCode)).HasElements
       and _policyPeriod.HomeownersLine_HOEExists
  }

  public function getCancelReasonCodes(reasonCodes : ReasonCode[]) : List<ReasonCode>{
    var availableCodes : List<ReasonCode> = {}

    if(_cancellation.Source != null){
      if(_policyPeriod.HomeownersLine_HOEExists){
        availableCodes = ReasonCode.TF_PERSONALLINESREASONCODETYPES.TypeKeys.copy()
      }else if(_policyPeriod.Lines.hasMatch( \ lob -> lob typeis BP7BusinessOwnersLine or lob typeis entity.CommercialPropertyLine)){
        availableCodes = ReasonCode.TF_COMMERCIALLINESREASONCODES.TypeKeys.copy()
      }
      var sourceTypecodes = Reasoncode.getTypeKeys(false).where( \ elt -> elt.hasCategory(_cancellation.Source))

      availableCodes = availableCodes.intersect(sourceTypecodes).toList()

      if(isInUWPeriod()){
        availableCodes?.removeWhere( \ code -> code == TC_RISKCHANGE)//risk change is the only reason code that is specific to outside the uw period
      }else{
        availableCodes.removeWhere( \ code -> ReasonCode.TF_DISCOVERYPERIODTYPES.TypeKeys.contains(code))//remove codes that are specific to uw period
      }
    }

    return availableCodes?.sortBy(\ reasonCode -> reasonCode.DisplayName)
  }

  public function onChangeReasonCode(reasonCode : ReasonCode, effectiveDate : Date){
    if(reasonCode != null){
      updateReasonDetailsRange(reasonCode)
      _effectiveDate = effectiveDate
      _cancellation.CancelReasonDetails
                   ?.where( \ elt -> !elt.Code?.hasCategory(reasonCode))
                   ?.each( \ elt -> {elt.Description = null
                                     elt?.remove()})
    }
  }

  public function onChangeCancelEffectiveDate(effectiveDate : Date){
    if(effectiveDate != null ){
      _effectiveDate = gw.api.job.EffectiveDateCalculator.instance().getCancellationEffectiveDate(effectiveDate, _cancellation.SelectedVersion, _cancellation, CancellationRefundMethod)
    }

    if(_cancellation.CancelLetterMailDate != null) {
      this._numberOfDaysNotice = _cancellation.CancelLetterMailDate.daysBetween(_effectiveDate)
    }
  }

  public function onChangeMailDate(mailDate : Date){
    _cancellation.CancelLetterMailDate = mailDate

    if(mailDate != null and _effectiveDate != null){
      this._numberOfDaysNotice = _cancellation.CancelLetterMailDate.daysBetween(_effectiveDate)
    }

    updateReasonDetailsRange(_cancellation.CancelReasonCode)
  }

  public function onChangeReasonDetailCode(reasonDetail : CancelReasonDetail){
    reasonDetail.Description = reasonDetail.Code.Description
  }

  public function isReasonDescriptionEditable() : boolean{
    return _policyPeriod.Lines.hasMatch( \ line -> line typeis BP7BusinessOwnersLine or line typeis CommercialPropertyLine)
        or _cancellation.CancelReasonCode == TC_OTHER
  }

  public function validateMailDate() : String{
    var result : String
    var today = java.util.Date.CurrentDate
    var initialProcessingDate = _cancellation.InitialNotificationDate != null ? _cancellation.InitialNotificationDate : today
    var calculatedDaysNotice = new CancellationLeadTimeCalculator(_cancellation.CancelReasonCode,
        _policyPeriod.AllPolicyLinePatternsAndJurisdictions,
        initialProcessingDate,
        initialProcessingDate <= _cancellation.findUWPeriodEnd(_policyPeriod), _policyPeriod).calculateMaximumLeadTime()

    if(_cancellation.CancelLetterMailDate.beforeOrEqualsIgnoreTime(today)){
      result = displaykey.una.validation.cancellation.FutureDateOnly
    //number of days + 1 to offset the 1 day that the plugin automatically adds to the stored lead time
    }else if(NumberOfDaysNotice + 1 < calculatedDaysNotice and !ReasonCode.TF_BACKDATABLEREASONCODES.TypeKeys.contains(_cancellation.CancelReasonCode)){
      result = displaykey.una.validation.cancellation.MailDateStateMandate
    }

    return result
  }

  private function updateReasonDetailsRange(reasonCode: ReasonCode){
    if(reasonCode != null){
      _reasonDetailRange = typekey.CancelReasonDetailType.getTypeKeys(false).where( \ elt -> elt.hasCategory(reasonCode))

      _reasonDetailRange?.removeWhere( \ elt ->
          elt.Categories.hasMatch( \ elt1 -> elt1.isOneOf(Jurisdiction.getTypeKeys(false))) and !elt.hasCategory(_policyPeriod.BaseState)
      )
    }

    _cancellation.CancelReasonDetails?.each( \ elt -> {
      if(!_reasonDetailRange.contains(elt.Code)){
        elt.Description = null
        elt.remove()
      }
    })
  }

  private function isInUWPeriod() : boolean{
    var uwPeriodEnd = Cancellation.findUWPeriodEnd(_policyPeriod)
    var initialDate = (_cancellation.CancelLetterMailDate == null) ? java.util.Date.CurrentDate.addDays(1).orNextBusinessDay(_policyPeriod.ProducerCodeOfRecord.Address) : _cancellation.CancelLetterMailDate
    var referencePoint = _cancellation.InitialNotificationDate != null ? _cancellation.InitialNotificationDate : initialDate
    return referencePoint.beforeOrEqualsIgnoreTime(uwPeriodEnd)
  }
}