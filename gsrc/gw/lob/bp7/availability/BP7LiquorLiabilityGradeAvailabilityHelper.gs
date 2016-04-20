package gw.lob.bp7.availability

class BP7LiquorLiabilityGradeAvailabilityHelper {
  
  private var _line : BP7BusinessOwnersLine

  construct(line : BP7BusinessOwnersLine) {
    _line = line
  }

  function isVisible() : boolean {
    return
         _line.BP7LiquorLiabExists 
      or _line.BP7LiquorLiabCovExists
      or _line.BP7AmendmentLiquorLiabExclExcptnExists
      or _line.BP7LiquorLiabCovBringYourOwnAlcoholEstablishmentsExists
  }
}
