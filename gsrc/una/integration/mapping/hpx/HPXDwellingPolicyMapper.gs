package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingPolicyMapper extends HPXPolicyMapper {

  function createDwellingPolicy(policyPeriod : PolicyPeriod,
                                coverage : wsi.schema.una.hpx.hpx_application_request.Coverage) : wsi.schema.una.hpx.hpx_application_request.DwellingPolicy
  {
    var dwellingPolicy = new wsi.schema.una.hpx.hpx_application_request.DwellingPolicy()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    var producerMapper = new HPXProducerMapper()
    dwellingPolicy.addChild(createPolicySummaryInfo(policyPeriod))
    dwellingPolicy.addChild(createInsuredOrPrincipal(policyPeriod))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      dwellingPolicy.addChild(additionalNamedInsured)
    }
    dwellingPolicy.addChild(createDwellingLineBusiness(policyPeriod, coverage))
    dwellingPolicy.addChild(createPolicyDetails(policyPeriod))
    dwellingPolicy.addChild(producerMapper.createProducer(policyPeriod))
    return dwellingPolicy
  }

  function createDwellingLineBusiness(policyPeriod : PolicyPeriod,
                                      coverage : wsi.schema.una.hpx.hpx_application_request.Coverage) : wsi.schema.una.hpx.hpx_application_request.DwellingLineBusiness {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.DwellingLineBusiness()
    dwellingLineBusiness.addChild(createDwell(policyPeriod, coverage))
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(question)
    }
    return dwellingLineBusiness
  }

  /************************************** Dwell  ******************************************************/
  function createDwell(policyPeriod : PolicyPeriod,
                       coverage : wsi.schema.una.hpx.hpx_application_request.Coverage) : wsi.schema.una.hpx.hpx_application_request.Dwell {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var coverageMapper = new HPXCoverageMapper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests(policyPeriod.HomeownersLine_HOE.Dwelling.AdditionalInterestDetails)
    var loc = createLocation(policyPeriod)
    for (additionalInterest in additionalInterests) {
      loc.addChild(additionalInterest)
    }
    var dwellMapper = new HPXDwellMapper()
    var dwellConstructionMapper = new HPXDwellConstructionMapper()
    var dwell = dwellMapper.createDwell(policyPeriod)
    dwell.addChild(dwellConstructionMapper.createDwellConstruction(policyPeriod))
    dwell.addChild(loc)
    //dwell.addChild(coverage)
    var covs = coverageMapper.createCoverages(policyPeriod)
    for (cov in covs) {
      dwell.addChild(cov)
    }
    return dwell
  }

  function createQuestionSet(policyPeriod : PolicyPeriod) : List<wsi.schema.una.hpx.hpx_application_request.QuestionAnswer> {
    var questions = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.QuestionAnswer>()
    var questionAnswers = policyPeriod.PeriodAnswers
    for (q in questionAnswers) {
      var question = new wsi.schema.una.hpx.hpx_application_request.QuestionAnswer()
      var questionText = new wsi.schema.una.hpx.hpx_application_request.QuestionText()
      questionText.setText(q.Question.Text)
      question.addChild(questionText)
      var questionCode = new wsi.schema.una.hpx.hpx_application_request.QuestionCd()
      questionCode.setText(q.QuestionCode)
      question.addChild(questionCode)
      if(q.BooleanAnswer != null) {
        var yesNoCd = new wsi.schema.una.hpx.hpx_application_request.YesNoCd()
        switch (q.BooleanAnswer) {
          case true :
              yesNoCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.Response.YES)
              break
          case false :
              yesNoCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.Response.NO)
        }
        question.addChild(yesNoCd)
      }
      var explanation = new wsi.schema.una.hpx.hpx_application_request.Explanation()
      if (q.Question.SupplementalTexts.atMostOne().Text != null) {
        explanation.setText(q.Question.SupplementalTexts.atMostOne().Text)
        question.addChild(explanation)
      }
      questions.add(question)
    }
    return questions
  }
}