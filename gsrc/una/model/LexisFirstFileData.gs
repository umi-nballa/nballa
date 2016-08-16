package una.model

uses una.integration.framework.file.outbound.persistence.OutboundFileData


/**
 * Created for LexisFirst Mapping
 * Created By: ptheegala
 * Created Date: 7/4/16
 *
 */
class LexisFirstFileData extends OutboundFileData {

  /*
  var customerTransactionID: String as CustomerTransactionID
  */
  var recordTypeIndicator: String as RecordTypeIndicator
  var actionEffectiveDate: String as ActionEffectiveDate
  var policyEffectiveFromDate: String as PolicyEffectiveFromDate
  var policyExpirationDate: String as PolicyExpirationDate
  var policyNumber: String as PolicyNumber
  var transactionCreationDate: String as TransactionCreationDate
  var insuranceCarrier: String as InsuranceCarrier
  var insuranceCarrierNAIC: String as InsuranceCarrierNAIC
  var producerName: String as ProducerName
  var producerCode: String as ProducerCode
  var producerStreet: String as ProducerStreet
  var producerCity: String as ProducerCity
  var producerState: String as ProducerState
  var producerZip: String as ProducerZip
  var producerCountry: String as ProducerCountry
  var insuredName1Type: String as InsuredName1Type
  var insuredName1FirstName: String as InsuredName1FirstName
  var insuredStreet: String as InsuredStreet
  var insuredCity: String as InsuredCity
  var insuredState: String as InsuredState
  var insuredZip: String as InsuredZip
  var insuredCountry: String as InsuredCountry
  var mortgagee: String as Mortgagee
  var mortgageeStreet: String as MortgageeStreet
  var mortgageeCity: String as MortgageeCity
  var mortgageeState: String as MortgageeState
  var mortgageeZip: String as MortgageeZip
  var mortgageeCountry: String as MortgageeCountry
  var mortgageeInterestType: String as MortgageeInterestType
  var propertyStreet: String as PropertyStreet
  var propertyCity: String as PropertyCity
  var propertyState: String as PropertyState
  var propertyZip: String as PropertyZip
  var propertyCountry: String as PropertyCountry

  //var producerPhone: String as ProducerPhone
  /*var commercialPolicy: String as CommercialPolicy
  var actionCode: String as ActionCode
  var policyTypeCode: String as PolicyTypeCode
  var propertyStreet: String as PropertyStreet
  var propertyCity: String as PropertyCity
  var propertyState: String as PropertyState
  var propertyZip: String as PropertyZip
  var propertyCountry: String as PropertyCountry
  var loanNumber: String as LoanNumber
  var insuredName1LastName: String as InsuredName1LastName
  var insuredName2Type: String as InsuredName2Type
  var insuredName2LastName: String as InsuredName2LastName
  var insuredName2FirstName: String as InsuredName2FirstName
  var coverageTypeCode1: String as CoverageTypeCode1
  var coverageAmount1: String as CoverageAmount1
  var deductible1: String as Deductible1
  var coverageTypeCode2: String as CoverageTypeCode2
  var coverageAmount2: String as CoverageAmount2
  var deductible2: String as Deductible2
  var coverageTypeCode3: String as CoverageTypeCode3
  var coverageAmount3: String as CoverageAmount3
  var deductible3: String as Deductible3
  var coverageTypeCode4: String as CoverageTypeCode4
  var coverageAmount4: String as CoverageAmount4
  var deductible4: String as Deductible4
  var coverageTypeCode5: String as CoverageTypeCode5
  var coverageAmount5: String as CoverageAmount5
  var deductible5: String as Deductible5
  var coverageTypeCode6: String as CoverageTypeCode6
  var coverageAmount6: String as CoverageAmount6
  var deductible6: String as Deductible6
  var coverageTypeCode7: String as CoverageTypeCode7
  var coverageAmount7: String as CoverageAmount7
  var deductible7: String as Deductible7
  var coverageTypeCode8: String as CoverageTypeCode8
  var coverageAmount8: String as CoverageAmount8
  var deductible8: String as Deductible8
  var coverageTypeCode9: String as CoverageTypeCode9
  var coverageAmount9: String as CoverageAmount9
  var deductible9: String as Deductible9
  var coverageTypeCode10: String as CoverageTypeCode10
  var coverageAmount10: String as CoverageAmount10
  var deductible10: String as Deductible10
  var legalDescription: String as LegalDescription
  var endorsementState1: String as EndorsementState1
  var endorsement1: String as Endorsement1
  var endorsementState2: String as EndorsementState2
  var endorsement2: String as Endorsement2
  var endorsementState3: String as EndorsementState3
  var endorsement3: String as Endorsement3
  var endorsementState4: String as EndorsementState4
  var endorsement4: String as Endorsement4
  var endorsementState5: String as EndorsementState5
  var endorsement5: String as Endorsement5
  var totalPolicyPremium: String as TotalPolicyPremium
  var premiumAmountDue: String as PremiumAmountDue
  var increasedPremiumAmountDue: String as IncreasedPremiumAmountDue
  var maximumPremiumAmountDue: String as MaximumPremiumAmountDue
  var premiumAmountDueDate: String as PremiumAmountDueDate
  var payableName: String as PayableName
  var remittanceStreet: String as RemittanceStreet
  var remittanceCity: String as RemittanceCity
  var remittanceState: String as RemittanceState
  var remittanceZip: String as RemittanceZip
  var remittanceCountry: String as RemittanceCountry
  var remittancePhone: String as RemittancePhone
  var floodZoneRated: String as FloodZoneRated
  var floodZoneCurrent: String as FloodZoneCurrent
  var grandfathered: String as Grandfathered
  var communityName: String as CommunityName
  var communityNumberORMapNumber: String as CommunityNumberORMapNumber
  var elevation: String as Elevation
  var notes: String as Notes
  var lenderAccountNumber: String as LenderAccountNumber
  var policyInceptionDate: String as PolicyInceptionDate
  var dateofBirth: String as DateofBirth
  var propertyType: String as PropertyType
  var contributingAMBestNumber: String as ContributingAMBestNumber*/
}