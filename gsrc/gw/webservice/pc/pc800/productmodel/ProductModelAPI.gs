package gw.webservice.pc.pc800.productmodel

uses gw.api.productmodel.OfferingLookup
uses gw.api.productmodel.PolicyLinePatternLookup
uses gw.api.productmodel.ProductLookup
uses gw.api.system.PCDependenciesGateway
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.webservice.exception.RequiredFieldException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPServerException
uses gw.api.webservice.exception.ServerStateException
uses gw.api.webservice.pc.productmodel.ProductModelAPIImpl
uses gw.webservice.SOAPUtil
uses gw.webservice.pc.pc800.gxmodel.clausepatternmodel.types.complex.ClausePattern
uses gw.webservice.pc.pc800.gxmodel.questionsetmodel.types.complex.QuestionSet
uses gw.xml.ws.annotation.WsiPermissions

uses java.util.ArrayList
uses java.util.Date
uses java.lang.IllegalArgumentException
uses gw.api.productmodel.CovTermPattern

/**
 * Provides service API methods for modifying the PolicyCenter product model.
 *
 * Modifying the Product Model definition has three major prerequisites:
 * <br/><br/>
 * 1. User must have permission - only an administrator may make modifications to the product model<br/>
 * 2. Server must not be in dev mode - the environment property gw.server.mode must be "dev"<br/>
 * 3. Server must be in maintenance mode - put the server in this mode before making any of the modification calls.
 * <br/><br/>
 */
@gw.xml.ws.annotation.WsiWebService( "http://guidewire.com/pc/ws/gw/webservice/pc/pc800/productmodel/ProductModelAPI" )
@gw.xml.ws.annotation.WsiExposeEnumAsString(ProductModelPatternType)
@Export
class ProductModelAPI {

  /**
   * Return the list of available questions for the given policy period.
   *
   * @param lookupRoot the information about the entity to look up availability on. Must not be null.
   * @param offeringCode the offeringCode. Must not be null.
   * @param lookupDate the date to look up. Must not be null.
   *
   * @return the list of available questions
   */
  @Throws(SOAPException, "If communication fails")
  @Throws(RequiredFieldException, "If any required field is null")
  @Throws(BadIdentifierException, "If cannot find an instance with specified id")
  @Param("lookupRoot", "the information about the entity to look up availability on")
  @Param("offeringCode", "the offeringCode")
  @Param("lookupDate", "the date to look up")
  @WsiPermissions({SystemPermissionType.TC_TOOLSPRODUCTMODELINFOVIEW})
  @Returns("the list of available questions")
  function getAvailableQuestions(lookupRoot : LookupRootImpl,
                                  offeringCode : String,
                                  lookupDate : Date) : List<QuestionSet>{
    SOAPUtil.require(lookupRoot, "lookupRoot")
    SOAPUtil.require(lookupRoot.ProductCode, "lookupRoot.ProductCode")
    SOAPUtil.require(lookupDate, "lookupDate")
    var product = ProductLookup.getByCode(lookupRoot.ProductCode)
    if(product == null){
      throw new BadIdentifierException(displaykey.ProductModelAPI.Error.ProductCodeNotFound(lookupRoot.ProductCode))
    }
    var coverableType = lookupRoot.lookupType()
    if(coverableType == null){
      throw new BadIdentifierException(displaykey.ProductModelAPI.Error.EntityNotFound(lookupRoot.LookupTypeName))
    }
    var offering = OfferingLookup.getByCode(offeringCode)
    var allQuestionSets = product.getQuestionSets(PolicyPeriod)
    var results = new ArrayList<QuestionSet>()
    for(questionSet in allQuestionSets){
      // filter out questionsets
      if(questionSet.maybeQuestionSetAvailable(lookupRoot, lookupDate, offering)){
        var questionSetModel = new gw.webservice.pc.pc800.gxmodel.questionsetmodel.QuestionSet(questionSet)
        // filter out question
        questionSetModel.Questions.Entry.removeWhere(\ q ->
          not questionSet.getQuestion(q.Code).maybeQuestionAvailable(lookupRoot, lookupDate)
        )
        results.add(questionSetModel.$TypeInstance)
      }
    }
    return results
  }

  /**
   * Return the list of available clause patterns for the given parameters.
   *
   * @param lookupRoot the information about the entity to look up availability on
   * @param offeringCode the offeringCode
   * @param lookupDate the date to look up
   *
   * @return the list of available clause patterns
   */
  @Throws(SOAPException, "If communication fails")
  @Throws(RequiredFieldException, "If any required field is null")
  @Throws(BadIdentifierException, "If cannot find an instance with specified id")
  @Param("lookupRoot", "the information about the entity to look up availability on")
  @Param("offeringCode", "the offeringCode")
  @Param("lookupDate", "the date to look up")
  @WsiPermissions({SystemPermissionType.TC_TOOLSPRODUCTMODELINFOVIEW})
  @Returns("the list of available clause patterns")
  function getAvailableClausePatterns(lookupRoot : LookupRootGeneric,
                                      offeringCode : String,
                                      lookupDate : Date) : List<ClausePattern>{
    var results : List<ClausePattern> = {}

    SOAPUtil.require(lookupRoot, "lookupRoot")
    SOAPUtil.require(lookupRoot.PolicyLinePatternCode, "lookupRoot.PolicyLinePatternCode")

    validate(lookupRoot)

    var patternsForEntity = PCDependenciesGateway.getProductModel().getClausePatternsForEntity(lookupRoot.LookupTypeName)
    var cpCtx = PCDependenciesGateway.getProductModel().getClauseAvailabilityContext(lookupRoot, lookupRoot.ProductModelPolicyLinePattern, lookupDate)


    patternsForEntity.each( \ pattern -> {
      var clauseAvailabilityInfo = pattern.getAvailabilityInfo(cpCtx, lookupRoot, lookupRoot.ProductModelPolicyLinePattern, offeringCode)

      if(clauseAvailabilityInfo.Available){
        var result = new gw.webservice.pc.pc800.gxmodel.clausepatternmodel.ClausePattern(pattern).$TypeInstance
        excludeUnavailableCovTerms(lookupRoot, pattern.CovTerms, result, lookupDate)
        results.add(result)
      }
    })

    return results
  }

  @Throws(SOAPException, "If communication fails")
  @Throws(RequiredFieldException, "If any required field is null")
  @Throws(BadIdentifierException, "If cannot find an instance with specified id")
  @Param("lookupTypeName", "the entity - coverable - on which to retrieve covverages for regardless of availability context")
  @WsiPermissions({SystemPermissionType.TC_TOOLSPRODUCTMODELINFOVIEW})
  @Returns("the list of all clause patterns for the lookup type coverable, regardless of availability context")
  function getAllClausePatterns(lookupTypeName : String) : List<ClausePattern>{
    var results : List<ClausePattern> = {}

    var clausePatterns = PCDependenciesGateway.getProductModel().getClausePatternsForEntity(lookupTypeName)

    clausePatterns?.each( \ pattern -> {
      results.add(new gw.webservice.pc.pc800.gxmodel.clausepatternmodel.ClausePattern(pattern).$TypeInstance)
    })

    return results
  }

  /**
   * Synchronizes the contents of the database's product model to the contents of the server's XML configuration.
   * This is important to call in order to relay implicit delete information to the database after a sync to
   * source control or hand-edits of the XML.
   */
  @Throws(ServerStateException, "If the server is not in maintenance mode or is not in dev mode.")
  @Throws(SOAPServerException, "If the user does not have permission to access this functionality or an error occurs while doing the synchronization.")
  @WsiPermissions({SystemPermissionType.TC_TOOLSPRODUCTMODELINFOVIEW})
  function synchronizeProductModel(){
    new ProductModelAPIImpl().synchronizeProductModel()
  }

  /**
   * Synchronizes the contents of the database's system tables to the contents of the server's XML configuration.
   * This is important to call in order to relay implicit delete information to the database after a sync to
   * source control or hand-edits of the XML.
   */
  @Throws(ServerStateException, "If the server is not in maintenance mode or is not in dev mode.")
  @Throws(SOAPServerException, "If the user does not have permission to access this functionality or an error occurs while doing the synchronization.")
  @WsiPermissions({SystemPermissionType.TC_TOOLSPRODUCTMODELINFOVIEW})
  function synchronizeSystemTables() {
    new ProductModelAPIImpl().synchronizeSystemTables()
  }

  /**
   * Returns the publicId associated with given codeIdentifier for a product model pattern type
   *
   * @param codeIdentifier the code identifier of the product model pattern. Must not be null.
   * @param productModelType the product model pattern type. Must not be null.
   */
  @Throws(SOAPException, "If communication fails")
  @Throws(RequiredFieldException, "If any required field is null")
  @Throws(IllegalArgumentException, "If cannot find an instance with specified id")
  @Param("codeIdentifier", "the code identifier")
  @Param("productModelType", "the type of the product model pattern")
  @WsiPermissions({SystemPermissionType.TC_TOOLSPRODUCTMODELINFOVIEW})
  @Returns("the public id of the product model pattern")
  function getPublicIdForCodeIdentifier(codeIdentifier: String, productModelType: ProductModelPatternType): String {
    SOAPUtil.require(codeIdentifier, "codeIdentifier")
    SOAPUtil.require(productModelType, "productModelType")
    var productModelClass = productModelType.ProductModelClass
    return PCDependenciesGateway.getProductModel().getPublicIdForCodeIdentifier(codeIdentifier, productModelClass);
  }

  private function validate(lookupRoot : LookupRootGeneric){
    validateLookupRoot(lookupRoot)
    validatePolicyTypes(lookupRoot)
  }

  private function validateLookupRoot(lookupRoot : LookupRootGeneric){
    if(lookupRoot.ProductModelPolicyLinePattern == null){
      throw new BadIdentifierException(displaykey.ProductModelAPI.Error.PolicyLinePatternNotFound(lookupRoot.PolicyLinePatternCode))
    }

    if(lookupRoot.LookupTypeName == null){
      throw new BadIdentifierException(displaykey.ProductModelAPI.Error.EntityNotFound(lookupRoot.LookupTypeName))
    }
  }

  private function validatePolicyTypes(lookupRoot : LookupRootGeneric){
    if(lookupRoot.PolicyType != null){
      switch(lookupRoot.PolicyLinePatternCode){
        case "HomeownersLine_HOE":
          var hoPolicyType = typekey.HOPolicyType_HOE.getTypeKeys(false).firstWhere( \ policyType -> policyType.Code == lookupRoot.PolicyType)

          if(hoPolicyType == null){
            throw new BadIdentifierException("Policy type ${lookupRoot.PolicyType} not available for line '${lookupRoot.PolicyLinePatternCode}'")
          }else if(!hoPolicyType.hasCategory(lookupRoot.State)){
            throw new BadIdentifierException("Policy type ${lookupRoot.PolicyType} is not available for State '${lookupRoot.State}'")
          }
          break
        case "BusinessAutoLine":
          if(!typekey.BAPolicyType.getTypeKeys(false).hasMatch( \ elt1 -> elt1.Code == lookupRoot.PolicyType)){
            throw new BadIdentifierException("Policy type ${lookupRoot.PolicyType} not available for line '${lookupRoot.PolicyLinePatternCode}'")
          }
          break
      }
    }
  }

  private function excludeUnavailableCovTerms(lookupRoot : LookupRootGeneric, covTerms : List<CovTermPattern>, clausePattern : ClausePattern, lookupDate : Date){
    var context = PCDependenciesGateway.getProductModel().getCovTermAvailabilityContext(lookupRoot, lookupRoot.ProductModelPolicyLinePattern, lookupDate)

    covTerms.each( \ covTerm -> {
      var availabilityInfo = covTerm.getAvailabilityInfo(context, lookupRoot.ProductModelPolicyLinePattern, null)
      if(!availabilityInfo.Available){
        clausePattern.CovTerms.Entry.removeWhere(\ c -> c.Code == covTerm.CodeIdentifier)
      }
    })
  }
}