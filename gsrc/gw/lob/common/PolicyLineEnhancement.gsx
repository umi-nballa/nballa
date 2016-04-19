package gw.lob.common

enhancement PolicyLineEnhancement : entity.PolicyLine {

  function addNewAdditionalInsuredDetailOfContactType(contactType : ContactType, additionalInsuredType : AdditionalInsuredType) : PolicyAddlInsuredDetail {
    var policyAddlInsuredDetail = this.addNewAdditionalInsuredDetailOfContactType(contactType)

    if (additionalInsuredType != null) {
      policyAddlInsuredDetail.AdditionalInsuredType = additionalInsuredType
    }

    return policyAddlInsuredDetail
  }
}
