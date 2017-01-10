package una.productmodel

uses java.math.BigDecimal
uses gw.api.domain.covterm.CovTerm
uses java.lang.Double
uses una.logging.UnaLoggerCategory
uses gw.api.web.job.JobWizardHelper

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 10/5/16
 * Time: 1:50 PM
 * To change this template use File | Settings | File Templates.
 */
class CPAutoPopulateUtil {

  final static var _logger = UnaLoggerCategory.PRODUCT_MODEL


  public static function setTermValue(term:CovTerm):void
  {
   // var cLine = (coverable as CPBuilding).PolicyLine as CommercialPropertyLine

    if(term!=null && term.Clause.Pattern=="CPSinkholeLossCoverage_EXT" && term.PatternCode=="SinkholeLimit_EXT")//cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeDed_EXTTerm!=null)
    {
      var cBuilding = term.Clause.OwningCoverable as CPBuilding
      cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeDed_EXTTerm?.Value = cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm?.Value * 0.10
    }

      try
      {
        if(term.Clause.OwningCoverable.PolicyLine typeis GeneralLiabilityLine && term.Clause.OwningCoverable.PolicyLine.GLHiredAutoNonOwnedLiab_EXTExists)
        {
          term.Clause.OwningCoverable.PolicyLine.GLHiredAutoNonOwnedLiab_EXT.HiredAutoNonOwnedLimit_EXTTerm.Value= term.Clause.OwningCoverable.PolicyLine.GLCGLCov.GLCGLOccLimitTerm.OptionValue.Value
        }
      }
          catch(e)
          {
              _logger.debug(e.Message)
          }

  }

  public static function setCoveragesOnToggle(covpattern:gw.api.productmodel.ClausePattern, coverable:Coverable):void
  {
    _logger.info("1 is building  " + (coverable typeis CPBuilding) + ": pattern name " + covpattern.Name + ": PolicyLinePattern " + covpattern.PolicyLinePattern + ": policylinepattern " + covpattern.PolicyLinePattern.CodeIdentifier )

    if(coverable typeis GeneralLiabilityLine)
      {
        var gline = coverable as GeneralLiabilityLine
        if(gline.GLHiredAutoNonOwnedLiab_EXTExists)
        {
          gline.GLHiredAutoNonOwnedLiab_EXT.HiredAutoNonOwnedLimit_EXTTerm.Value= gline.GLCGLCov.GLCGLOccLimitTerm.OptionValue.Value
        }
      }


    if(coverable typeis CPBuilding)
      {
    var cLine = (coverable as CPBuilding).PolicyLine as CommercialPropertyLine
    var cBuilding = coverable as CPBuilding

    if(covpattern!=null && coverable!=null && covpattern.Name=="Ordinance or Law")
      {

        _logger.info("inside ordinance coverage , cline is " + cLine + ":CPCoverageA : " + cLine.CPOrdinanceOrLawType +":CPCoverageB :"+ cLine.CPCoverageB +":CPCoverageC"+ cLine.CPCoverageC)

        if(cLine.CPOrdinanceOrLawType!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCoverage_EXTTerm)
        {
         cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCoverage_EXTTerm?.Value = cLine?.CPOrdinanceOrLawType.Code
        }

        //_logger.info("hasnoavailableoptions  b " + cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovB_ExtTerm?.hasNoAvailableOptionsOrNotApplicableOptionOnly())
        if(cLine.CPCoverageB!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovB_ExtTerm)// && !cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovB_ExtTerm.hasNoAvailableOptionsOrNotApplicableOptionOnly())
        {
          cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovB_ExtTerm?.OptionValue = cLine?.CPCoverageB?.Code
        }

        //_logger.info("hasnoavailableoptions c "+ cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm?.hasNoAvailableOptionsOrNotApplicableOptionOnly())
        if(cLine.CPCoverageC!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovC_ExtTerm)// && !cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm?.hasNoAvailableOptionsOrNotApplicableOptionOnly())
        {
          cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm?.OptionValue = cLine?.CPCoverageC?.Code
        }

        if(cLine.CPCoverageBC!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovBC_ExtTerm)// && !cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovC_ExtTerm?.hasNoAvailableOptionsOrNotApplicableOptionOnly())
        {
          cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.OptionValue = cLine?.CPCoverageBC?.Code
        }
      }

       }

    }

  public static function setCoveragesOnToggle(cLine:CommercialPropertyLine, cBuilding:CPBuilding):void
  {

    _logger.info("1 " + cBuilding?.CPBPPCovExists + ":" + cBuilding?.CPBPPCov)

    if(cLine==null)
      cLine = cBuilding.PolicyLine as CommercialPropertyLine

    if(cLine?.causeofloss!=null && cBuilding.CPBPPCovExists)
    {
      cBuilding?.CPBPPCov?.CPBPPCovCauseOfLossTerm?.Value = cLine?.causeofloss
    }

    if(cLine?.allotherperilded!=null && cBuilding.CPBPPCovExists)
    {
      cBuilding?.CPBPPCov?.CPBPPCovDeductibleTerm?.OptionValue=cLine?.allotherperilded.Code
    }

    if(cLine.hurricanededtype!=null && cBuilding.CPBPPCovExists)
    {
      cBuilding?.CPBPPCov?.CPBPPCovHurricaneDedType_EXTTerm?.OptionValue=cLine.hurricanededtype.Code
    }

    if(cLine.hurricanepercded!=null && cBuilding.CPBPPCovExists)
    {
      cBuilding?.CPBPPCov?.CPBPPCovHurricaneDed_EXTTerm?.OptionValue=cLine.hurricanepercded.Code
    }

  }

  public static function setIncreasedCostLimit (cLine:CommercialPropertyLine, cBuilding:CPBuilding):void
  {

    //Increased cost of construction limit to 5% of building coverage or 10000 whichever is minimum
    if(cBuilding?.CPBldgCov?.CPBldgCovLimitTerm!=null && 0.05*cBuilding.CPBldgCov.CPBldgCovLimitTerm.Value<(new BigDecimal(10000)))
    {
      cBuilding.CPIncreasedCostConst_EXT.CPIncreasedCostLimit_EXTTerm.Value= 0.05*cBuilding.CPBldgCov.CPBldgCovLimitTerm.Value
    }
    else
      {
        cBuilding.CPIncreasedCostConst_EXT.CPIncreasedCostLimit_EXTTerm.Value= new BigDecimal(10000)
      }

      if(cBuilding.CPOrdinanceorLaw_EXTExists)
      {
        if(cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovALimit_EXTTerm)
          cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovALimit_EXTTerm?.Value=cBuilding?.CPBldgCov?.CPBldgCovLimitTerm.Value
       // cBuilding.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCovALimit_EXTTerm.RestrictionModel

        if(cLine.CPCoverageB!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovBLimit_EXTTerm &&cLine.CPCoverageB.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)
          cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBLimit_EXTTerm?.Value= Double.parseDouble(cLine.CPCoverageB.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value

        if(cLine.CPCoverageC!=null && cBuilding.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovCLimit_EXTTerm && cLine.CPCoverageC.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)
          cBuilding.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovCLimit_EXTTerm?.Value= Double.parseDouble(cLine.CPCoverageC.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value

        _logger.info(" cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value " + cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value)
        _logger.info(" cBuilding?.CPOrdinanceorLaw_EXT " + cBuilding?.CPOrdinanceorLaw_EXT)

        if(cLine.CPCoverageBC!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovBCLimit_EXTTerm && cLine.CPCoverageBC.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)//cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value!=99)
          {
            _logger.info(cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBCLimit_EXTTerm + ":"+cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value + ":" + cBuilding?.CPBldgCov?.CPBldgCovLimitTerm)
          cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBCLimit_EXTTerm?.Value = Double.parseDouble(cLine.CPCoverageBC.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value
          }
      }

    if(cBuilding.CPBldgCovExists && cBuilding.CPBldgCov.HasCPBldgCovLimitTerm)
    {
      if(cBuilding.CPSinkholeLossCoverage_EXTExists)
      {
        cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm.Value=cBuilding.CPBldgCov.CPBldgCovLimitTerm.Value
        cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeDed_EXTTerm?.Value = cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm?.Value * 0.10
      }
    }

  }

  public static function setPcfDefaults(cLine:CommercialPropertyLine, cBuilding:CPBuilding):boolean
  {
    //setCoveragesFromDefaultScreen(cLine, cBuilding)
    //addRequiredCoverages(cBuilding,cLine)
    return true
  }

  public static function addRequiredCoverages(building:CPBuilding,cpline:CommercialPropertyLine)//coverable:Coverable):boolean/
  {
   //if(coverable typeis CommercialPropertyLine)
  //{
    //var cpline = coverable as CommercialPropertyLine
    print("### exists " + cpline.CPFloridaChangesCondoCondition_EXT)
     if(cpline.AssociatedPolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_CONDOMINIUMASSOCIATION &&
         //cpline.CPFloridaChangesCondoCondition_EXT.Pattern.getExistence(cpline)==typekey.ExistenceType.TC_REQUIRED &&
        !cpline.CPFloridaChangesCondoCondition_EXTExists)
    {
      cpline.addToCPLineConditions(cpline.CPFloridaChangesCondoCondition_EXT)
      }
  //  }
    //return true
  }

  public static function setSinkHoldDefaults(cBuilding:CPBuilding):void
  {
    if(cBuilding.CPBldgCovExists && cBuilding.CPBldgCov.HasCPBldgCovLimitTerm)
    {
      if(cBuilding.CPSinkholeLossCoverage_EXTExists)
      {
        cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm.Value=cBuilding.CPBldgCov.CPBldgCovLimitTerm.Value
        cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeDed_EXTTerm?.Value = cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm?.Value * 0.10
      }
    }

  }

   public static function setCoveragesFromDefaultScreen( cBuilding:Coverable):void
   {
      if(cBuilding typeis CPBuilding)
       setCoveragesFromDefaultScreen(cBuilding.PolicyLine as CommercialPropertyLine,cBuilding)
   }

  public static function setCoveragesFromDefaultScreen(cLine:CommercialPropertyLine, cBuilding:CPBuilding):void
  {
      _logger.info("Equipment brkdown " + cLine?.EquipmentBreakdownEnhancement)


    if(cBuilding.CPBldgCovExists && cBuilding.CPBldgCov.HasCPBldgCovLimitTerm)
     {
       if(cBuilding.CPSinkholeLossCoverage_EXTExists)
       {
         cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm.Value=cBuilding.CPBldgCov.CPBldgCovLimitTerm.Value
        cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeDed_EXTTerm?.Value = cBuilding?.CPSinkholeLossCoverage_EXT?.SinkholeLimit_EXTTerm?.Value * 0.10
        }
     }

   // if(cLine.AssociatedPolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_CONDOMINIUMASSOCIATION)
   //   cLine.CPFloridaChangesCondoCondition_EXT.
   // else
   // return false


    if(cLine?.CoverageForm!=null && cBuilding!=null)// && cBuilding.CoverageForm!=null)
      cBuilding?.CoverageForm=cLine?.CoverageForm

      if(cLine?.EquipmentBreakdownEnh!=null && cLine?.EquipmentBreakdownEnh!=false)
        {
        cBuilding.setCoverageConditionOrExclusionExists("CPEquipmentBreakdownEnhance_EXT",true)//CPEquipmentBreakdownEnhance_EXT.addToCoverages()/Exists=true
       // cBuilding.CPEquipmentBreakdownEnhance_EXT?.CovTerms?.where( \ elt -> elt.PatternCode=="CPEquipmentBreakdownLimit_EXT").first().setValueFromString(cLine.EquipmentBreakdownEnhancement)
          }

    if(cLine?.TerrorismCoverage!=null && cLine?.TerrorismCoverage==true)
      cLine?.setCoverageConditionOrExclusionExists("CPTerrorismCoverage_EXT",true)//CPEquipmentBreakdownEnhance_EXT.addToCoverages()/Exists=true


    if(cLine.AssociatedPolicyPeriod.Policy.PackageRisk==typekey.PackageRisk.TC_CONDOMINIUMASSOCIATION)
      cLine?.setConditionExists("CPFloridaChangesCondoCondition_EXT",true)

    if(cLine.hurricanededtype==typekey.CPHurricaneDedType_Ext.TC_CPBLDGCALENDARYEAR_EXT)
      cLine?.setConditionExists("CPFloridaHurricanePercentCondition_EXT",true)
    else
      cLine?.setConditionExists("CPFloridaHurricanePercentCondition_EXT",false)

    //setIncreasedCostLimit(cLine,cBuilding)

    if(cLine?.causeofloss!=null)
    {
      if(cBuilding?.CPBldgCovExists)
        cBuilding?.CPBldgCov?.CPBldgCovCauseOfLossTerm?.Value = cLine?.causeofloss
      if(cBuilding?.CPBPPCovExists && cBuilding?.CPBPPCov?.HasCPBPPCovDeductibleTerm)
        cBuilding?.CPBPPCov?.CPBPPCovCauseOfLossTerm?.Value = cLine?.causeofloss
    }

    if(cLine?.allotherperilded!=null && cBuilding?.CPBldgCovExists)
    {
      if(cBuilding?.CPBldgCovExists)
        cBuilding?.CPBldgCov?.CPBldgCovDeductibleTerm?.OptionValue=cLine?.allotherperilded.Code
      if(cBuilding?.CPBPPCovExists && cBuilding?.CPBPPCov?.HasCPBPPCovDeductibleTerm)
        cBuilding?.CPBPPCov?.CPBPPCovDeductibleTerm?.OptionValue=cLine?.allotherperilded.Code
      }

    if(cLine?.hurricanededtype!=null)
    {
      if(cBuilding?.CPBldgCovExists)
        cBuilding.CPBldgCov.CPBldgCovHurricaneDedType_EXTTerm?.OptionValue=cLine?.hurricanededtype.Code
      if(cBuilding?.CPBPPCovExists && cBuilding?.CPBPPCov?.HasCPBPPCovDeductibleTerm)
        cBuilding?.CPBPPCov?.CPBPPCovHurricaneDedType_EXTTerm?.OptionValue=cLine?.hurricanededtype.Code

    }

    if(cLine?.hurricanepercded!=null)
    {
      if(cBuilding?.CPBldgCovExists)
        cBuilding.CPBldgCov.CPBldgCovHurricaneDeductible_EXTTerm?.OptionValue=cLine?.hurricanepercded.Code
      if(cBuilding?.CPBPPCovExists && cBuilding?.CPBPPCov?.HasCPBPPCovDeductibleTerm)
        cBuilding?.CPBPPCov?.CPBPPCovHurricaneDed_EXTTerm?.OptionValue=cLine?.hurricanepercded.Code

  }

    if(cLine?.Inflationguard!=null)
     {
       if(cBuilding?.CPBldgCovExists)
        cBuilding.CPBldgCov.CPBldgCovAutoIncreaseTerm?.OptionValue=cLine?.Inflationguard.Code
     }

    _logger.info("ordinance coveagrae " + cLine?.AssociatedPolicyPeriod.CPLine.AllCoverages.where( \ elt -> elt.PatternCode=="CPOrdinanceorLaw_EXT")?.first())


    if(cLine?.CPOrdinanceOrLawType!=null)
    {
      _logger.info(" lawtype " + cLine?.CPOrdinanceOrLawType)
      cLine?.AllCoverages.where( \ elt -> elt.PatternCode=="CPOrdinanceorLaw_EXT")?.first()?.CovTerms?.where( \ elt -> elt.PatternCode=="CPOrdinanceorLawCoverage_EXT")?.first()?.setValueFromString(cLine.CPOrdinanceOrLawType.Code)
     }

    if(cLine?.CPCoverageB!=null)
    {
      _logger.info(" covb " +cLine?.CPCoverageB )
      cLine?.AllCoverages.where( \ elt -> elt.PatternCode=="CPOrdinanceorLaw_EXT")?.first()?.CovTerms?.where( \ elt -> elt.PatternCode=="CPOrdinanceorLawCovB_Ext")?.first()?.setValueFromString(cLine.CPCoverageB.Code)
      print("##### B covterm is " + cBuilding.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCovB_ExtTerm.OptionValue)

     }

    if(cLine?.CPCoverageC!=null)
    {
      _logger.info(" covc " +cLine?.CPCoverageC )

      cLine?.AllCoverages.where( \ elt -> elt.PatternCode=="CPOrdinanceorLaw_EXT")?.first()?.CovTerms?.where( \ elt -> elt.PatternCode=="CPOrdinanceorLawCovC_Ext")?.first()?.setValueFromString(cLine.CPCoverageC.Code)

      print("##### C covterm is " + cBuilding.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCovC_ExtTerm.OptionValue)
    }

    if(cLine?.CPCoverageBC!=null)
    {
      _logger.info(" covBc " +cLine?.CPCoverageBC )

      //cLine?.AllCoverages.where( \ elt -> elt.PatternCode=="CPOrdinanceorLaw_EXT")?.first()?.CovTerms?.where( \ elt2 -> elt2.PatternCode=="CPOrdinanceorLawCovBC_Ext")?.first()?.setValueFromString(cLine?.CPCoverageBC.Code)
      if(cBuilding!=null && cBuilding.CPOrdinanceorLaw_EXTExists && cBuilding.CPOrdinanceorLaw_EXT.HasCPOrdinanceorLawCovBC_ExtTerm)
            cBuilding.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCovBC_ExtTerm.OptionValue=cLine.CPCoverageBC.Code
      //first()?.setValueFromString(cLine.CPCoverageBC.Code)

      print("##### BC covterm is " + cBuilding.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCovBC_ExtTerm.OptionValue)

    }
    if(cBuilding.CPOrdinanceorLaw_EXTExists)
    {
      if(cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovALimit_EXTTerm)
        cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovALimit_EXTTerm?.Value=cBuilding?.CPBldgCov?.CPBldgCovLimitTerm.Value
      // cBuilding.CPOrdinanceorLaw_EXT.CPOrdinanceorLawCovALimit_EXTTerm.RestrictionModel

      if(cLine?.CPCoverageB!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovBLimit_EXTTerm &&cLine?.CPCoverageB.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)
        cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBLimit_EXTTerm?.Value= Double.parseDouble(cLine?.CPCoverageB.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value

      if(cLine?.CPCoverageC!=null && cBuilding.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovCLimit_EXTTerm && cLine?.CPCoverageC.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)
        cBuilding.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovCLimit_EXTTerm?.Value= Double.parseDouble(cLine?.CPCoverageC.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value


      if(cLine?.CPCoverageBC!=null && cBuilding.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovBCLimit_EXTTerm && cLine?.CPCoverageBC.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)
        cBuilding.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBCLimit_EXTTerm?.Value= Double.parseDouble(cLine?.CPCoverageBC.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value


      _logger.info(" cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value " + cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value)
      _logger.info(" cBuilding?.CPOrdinanceorLaw_EXT " + cBuilding?.CPOrdinanceorLaw_EXT)

      if(cBuilding?.CPBldgCovExists && cBuilding?.CPOrdinanceorLaw_EXTExists && cLine?.CPCoverageBC!=null && cBuilding?.CPOrdinanceorLaw_EXT?.HasCPOrdinanceorLawCovBCLimit_EXTTerm && cLine?.CPCoverageBC.Code!=typekey.CPCoverageBC_Ext.TC_CODE11)//cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value!=99)
      {
        _logger.info(cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBCLimit_EXTTerm + ":"+cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBC_ExtTerm?.Value + ":" + cBuilding?.CPBldgCov?.CPBldgCovLimitTerm)
        cBuilding?.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCovBCLimit_EXTTerm?.Value = Double.parseDouble(cLine?.CPCoverageBC?.Code)*cBuilding?.CPBldgCov?.CPBldgCovLimitTerm?.Value
      }
    }


  }

}