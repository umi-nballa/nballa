package gw.plugin.billing.bc800

uses gw.api.util.DateUtil
uses gw.plugin.Plugins
uses gw.plugin.job.IPolicyRenewalPlugin
uses wsi.remote.gw.webservice.bc.bc800.entity.anonymous.elements.IssuePolicyInfo_NewInvoiceStream
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.IssuePolicyInfo

@Export
enhancement IssuePolicyInfoEnhancement : IssuePolicyInfo
{
  function sync(period : PolicyPeriod) : IssuePolicyInfo{
    this.syncPolicyChange(period)
    commonSync(period)
    return this
  }

  function syncForPreview(period : PolicyPeriod) : IssuePolicyInfo{
    this.syncPolicyChangeForPreview(period)
    commonSync(period)
    this.PolicyNumber = period.PolicyNumber ?: period.ID.toString()
    return this
  }
  
  private function commonSync(period : PolicyPeriod){
    this.BillImmediately = period.BillImmediately_Ext
    this.AccountNumber = period.Policy.Account.AccountNumber
    this.AssignedRisk = period.AssignedRisk
    this.PaymentPlanPublicId = period.SelectedPaymentPlan.BillingId
    this.ProducerCodeOfRecordId = period.ProducerCodeOfRecord.PublicID
    this.ProductCode = period.Policy.ProductCode
    // US4887: PC-BC Integration: mapping added for HOPolicyType
    this.HOPolicyType = period.HomeownersLine_HOE.HOPolicyType.Code
    this.UWCompanyCode = period.UWCompany.Code.Code
    if (period.ModelDate != null)
      this.ModelDate = period.ModelDate.XmlDateTime
    else
      this.ModelDate = DateUtil.currentDate().XmlDateTime
    this.JurisdictionCode = period.BaseState.Code
    this.BillingMethodCode = period.BillingMethod.Code
    this.PeriodStart = period.PeriodStart.XmlDateTime
    this.PeriodEnd = period.PeriodEnd.XmlDateTime
    this.TermNumber = period.TermNumber
    this.AltBillingAccountNumber = period.AltBillingAccountNumber
    var advancedOptionsSelected = period.CustomBilling
    if (advancedOptionsSelected and period.InvoiceStreamCode == null) {
      this.NewInvoiceStream = new IssuePolicyInfo_NewInvoiceStream()
      this.NewInvoiceStream.AnchorDate = period.NewInvoiceStream.FirstAnchorDate.XmlDateTime
      this.NewInvoiceStream.DayOfWeek = period.NewInvoiceStream.DayOfWeek.Code
      this.NewInvoiceStream.Description = period.NewInvoiceStream.Description
      this.NewInvoiceStream.FirstDayOfMonth = period.NewInvoiceStream.FirstDayOfMonth
      this.NewInvoiceStream.SecondDayOfMonth = period.NewInvoiceStream.SecondDayOfMonth
      this.NewInvoiceStream.DueDateBilling = period.NewInvoiceStream.DueDateBilling
      this.NewInvoiceStream.Interval = period.NewInvoiceStream.Interval.Code
      this.NewInvoiceStream.PaymentInstrumentID = period.NewInvoiceStream.PaymentInstrumentID
      this.NewInvoiceStream.PaymentMethod = period.NewInvoiceStream.PaymentMethod.Code
      this.NewInvoiceStream.UnappliedDescription = period.NewInvoiceStream.UnappliedFundDescription
      this.NewInvoiceStream.UnappliedFundID = period.NewInvoiceStream.UnappliedFundID
    }
    this.InvoiceStreamId = advancedOptionsSelected ? period.InvoiceStreamCode : null
    this.Currency = period.PreferredSettlementCurrency.Code
    //PC-BC year built and Wind Coastal
    if(period.HomeownersLine_HOEExists){
      if(period.HomeownersLine_HOE.Dwelling.YearBuilt != null)
        this.YearBuilt = period.HomeownersLine_HOE.Dwelling.YearBuilt
      else
        this.YearBuilt = period.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext
      if(period.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE?.HasHODW_WindHail_Ded_HOETerm && period.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.Value != null)
        this.CoastalWind = period.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.Value > 0 ? true:false
      else
        this.CoastalWind = false
    }

    var plugin = Plugins.get(IPolicyRenewalPlugin)
    if(plugin.isRenewalOffered(period)){
      this.OfferNumber = period.Job.JobNumber
    }
  }



}
