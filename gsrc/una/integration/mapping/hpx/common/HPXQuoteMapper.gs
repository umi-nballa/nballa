package una.integration.mapping.hpx.common

uses wsi.schema.una.hpx.hpx_application_request.types.complex.QuoteInfoType
uses gw.xml.date.XmlDate
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/15/17
 * Time: 12:00 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXQuoteMapper {
  function createQuote(policyPeriod : PolicyPeriod) : QuoteInfoType {
    var quote = new wsi.schema.una.hpx.hpx_application_request.types.complex.QuoteInfoType()
    quote.CompanysQuoteNumber = policyPeriod.Job.JobNumber
    quote.InitialQuoteRequestDt = new XmlDate(policyPeriod.PeriodStart)
    quote.QuoteValidUntilDt = new XmlDate(policyPeriod.PeriodEnd)
    quote.QuotePreparedDt = new XmlDate(new Date())
    return quote
  }


}