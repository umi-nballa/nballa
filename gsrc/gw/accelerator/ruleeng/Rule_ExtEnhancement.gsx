package gw.accelerator.ruleeng

uses gw.api.productmodel.PolicyLinePattern
uses gw.api.productmodel.Product

uses java.util.List
uses java.util.Collection
uses gw.api.util.DisplayableException
uses java.util.ArrayList
uses java.util.Set
uses gw.lang.reflect.ReflectUtil
uses gw.api.productmodel.PolicyLinePatternLookup

/**
 * Enhancement methods for the Rule_Ext entity.
 */
enhancement Rule_ExtEnhancement : entity.Rule_Ext {
  @Returns("The graph node that this rule applies to")
  property get GraphNode() : RuleEntityGraphNode {
    return RuleEntityGraph.Instance.findByPath(this.GraphNodePath)
  }

  /**
   * When the selected GraphNode changes, it may be possible to infer what the
   * RuleApplyMethod must be.
   */
  property set GraphNode(node : RuleEntityGraphNode) {
    this.GraphNodePath = node.Path
    var applyMethods = RuleValidationApplyMethods
    if (applyMethods.size() == 1) {
      // If there's only one choice, set it.
      this.RuleApplyMethod = applyMethods[0]
    }
  }

  @Returns("The Gosu package that contains rules for this rule's target node")
  property get RulePackage() : String {
    if (this.GraphNode != null) {

     // print(" productabbrevforline is " + this.ProductAbbrevForLine + ":" + this.PolicyLine)

      var product:String = this.ProductAbbrevForLine==null && this.PolicyLine=="commercialpropertyline"?"cp":this.ProductAbbrevForLine

      var pkgName =
          RulesEngineInterface.RULE_PACKAGE_BASE
              + "." + product//this.ProductAbbrevForLine
              + "." + this.GraphNode.NodeName
      return pkgName.toLowerCase()
    }
    return ""
  }

  @Returns("The PolicyLine that owns the entity graph node this rule applies "
      + "to (if any)")
  property get PolicyLine() : typekey.PolicyLine {
    var returnVar : typekey.PolicyLine = null
    var nodes = this.GraphNode.PathToRoot

    // From the root, walk down the path until we find a node that's a valid
    // PolicyLinePattern typekey
    for (node in nodes) {
      //var line = PolicyLinePattern.getByCode(node.NodeName)
      print(" node is " + node.NodeName)

      var line = PolicyLinePatternLookup.getByCode(node.NodeName)
      if (line != null) {
        returnVar = line.PolicyLineSubtype
        break
      }
      if((line==null) && node.NodeName=="CPLine")
        {
          returnVar = node.NodeName
          break
        }
    }

    print("get PolicyLine returning " + returnVar)
    return returnVar
  }

  @Returns("The abbreviation for the Product that this rule applies to, or \"all\" if it applies to all")
  property get ProductAbbrevForLine() : String {
    var policyLine = this.PolicyLine
    print("policyline is " + policyLine)

    print("policyline " + displaykey.Accelerator.RulesFramework.PolicyLineAbbrev.All)

//    print("linecode "+ typekey.ProductLookup_Ext.get(policyLine.Code.remove("Line")).Code)
    return (policyLine == null)
        ? displaykey.Accelerator.RulesFramework.PolicyLineAbbrev.All
        : typekey.ProductLookup_Ext.get(policyLine.Code.remove("Line")).Code
        //: Product.getByCode(policyLine.Code.remove("Line")).Abbreviation
  }

  /**
   * Underwriting issue rules use the related UW issue to determine whether a
   * rule can be applied to "each" or "all"; other rule types let you choose
   * any value.
   */
  @Returns("The type of apply methods that are valid for this rule")
  property get RuleValidationApplyMethods() : List<typekey.RuleApplyMethod_Ext> {
    var values : List<typekey.RuleApplyMethod_Ext>
    if (this typeis UWRule_Ext) {
      values = this.UWApplyMethods
    } else {
      values = typekey.RuleApplyMethod_Ext.getTypeKeys(false)
    }
    if (this.GraphNode != null) {
      // Filter the available apply modes based on the graph node type
      // For example, you can't choose "all" for an entity,
      // but you can choose between "all" and "each" for an array.
      values = values.where(
          \ method -> method.hasCategory(this.GraphNode.NodeType))
    }

    return values
  }

  @Returns("An array of abbreviations for the job types that this rule"
      + "applies to")
  property get JobAbbrevs() : String[] {
    return this.Jobs.map(\ ruleJob -> ruleJob.FullApplication
        ? displaykey.Accelerator.RulesFramework.JobAbbrev.FullApplication
        : gw.api.domain.DisplayKey.getDisplayKeyValue(
            "Accelerator.RulesFramework.JobAbbrev." + ruleJob.JobType.Code))
    // Sort them to ensure they appear in a consistent order
    .sort()
  }

  /**
   * Associates a job type to this rule.
   */
  @Param("jobType", "The type of job")
  @Returns("The new RuleJob_Ext instance")
  function addJob(jobType : typekey.Job) : RuleJob_Ext {
    var ruleJob = new RuleJob_Ext(this.Bundle)
    ruleJob.JobType = jobType
    this.addToJobs(ruleJob)
    return ruleJob
  }

  /**
   * Indicates whether this rule applies to a particular job type.
   */
  @Param("jobType", "A job type")
  @Returns("True, if this rule applies for the given job type")
  function hasJob(jobType : typekey.Job) : boolean {
    return this.Jobs.hasMatch(\ ruleJob -> ruleJob.JobType == jobType)
  }

  // Expose core Job type associations as properties

  @Returns("Whether this rule applies to full application submissions")
  property get FullApplication() : boolean {
    var jobs = this.Jobs
    return jobs.hasMatch(\ ruleJob -> ruleJob.JobType == typekey.Job.TC_SUBMISSION
        and ruleJob.FullApplication)
  }

  property set FullApplication(flag : boolean) {
    var match = this.Jobs.firstWhere(\ ruleJob -> ruleJob.JobType == typekey.Job.TC_SUBMISSION
        and ruleJob.FullApplication)
    if (flag) {
      if (match == null) {
        addJob(typekey.Job.TC_SUBMISSION).FullApplication = true
      }
    } else if (match != null) {
      match.remove()
    }
  }

  @Returns("Whether this rule applies to quick quote submissions")
  property get QuickQuote() : boolean {
    return this.Jobs.hasMatch(\ ruleJob -> ruleJob.JobType == typekey.Job.TC_SUBMISSION
        and not ruleJob.FullApplication)
  }

  property set QuickQuote(flag : boolean) {
    var match = this.Jobs.firstWhere(\ ruleJob -> ruleJob.JobType == typekey.Job.TC_SUBMISSION
        and not ruleJob.FullApplication)
    if (flag) {
      if (match == null) {
        addJob(typekey.Job.TC_SUBMISSION)
      }
    } else if (match != null) {
      match.remove()
    }
  }

  @Returns("Whether this rule applies to cancellations")
  property get Cancellation() : boolean {
    return hasJob(typekey.Job.TC_CANCELLATION)
  }
  property set Cancellation(flag : boolean) {
    toggleJobType(typekey.Job.TC_CANCELLATION, flag)
  }
  @Returns("Whether this rule applies to renewals")
  property get Renewal() : boolean {
    return hasJob(typekey.Job.TC_RENEWAL)
  }
  property set Renewal(flag : boolean) {
    toggleJobType(typekey.Job.TC_RENEWAL, flag)
  }
  @Returns("Whether this rule applies to policy changes")
  property get PolicyChange() : boolean {
    return hasJob(typekey.Job.TC_POLICYCHANGE)
  }
  property set PolicyChange(flag : boolean) {
    toggleJobType(typekey.Job.TC_POLICYCHANGE, flag)
  }
  @Returns("Whether this rule applies to rewrites")
  property get Rewrite() : boolean {
    return hasJob(typekey.Job.TC_REWRITE)
  }
  property set Rewrite(flag : boolean) {
    toggleJobType(typekey.Job.TC_REWRITE, flag)
  }
  @Returns("Whether this rule applies to rewrites to a new account")
  property get RewriteNewAccount() : boolean {
    return hasJob(typekey.Job.TC_REWRITENEWACCOUNT)
  }
  property set RewriteNewAccount(flag : boolean) {
    toggleJobType(typekey.Job.TC_REWRITENEWACCOUNT, flag)
  }
  @Returns("Whether this rule applies to reinstatements")
  property get Reinstatement() : boolean {
    return hasJob(typekey.Job.TC_REINSTATEMENT)
  }
  property set Reinstatement(flag : boolean) {
    toggleJobType(typekey.Job.TC_REINSTATEMENT, flag)
  }
  @Returns("Whether this rule applies to issuance jobs")
  property get Issuance() : boolean {
    return hasJob(typekey.Job.TC_ISSUANCE)
  }
  property set Issuance(flag : boolean) {
    toggleJobType(typekey.Job.TC_ISSUANCE, flag)
  }
  @Returns("Whether this rule applies to audits")
  property get Audit() : boolean {
    return hasJob(typekey.Job.TC_AUDIT)
  }
  property set Audit(flag : boolean) {
    toggleJobType(typekey.Job.TC_AUDIT, flag)
  }

  /**
   * Associates or dissociates this rule with a job type.
   */
  @Param("jobType", "A job type")
  @Param("flag", "Whether the rule should execute for the given job type")
  private function toggleJobType(jobType : typekey.Job, flag : boolean) {
    var match = this.Jobs.firstWhere(\ ruleJob -> ruleJob.JobType == jobType)
    if (flag) {
      if (match == null) {
        addJob(jobType)
      }
    } else if (match != null) {
      match.remove()
    }
  }

  /**
   * This method syncs the related jurisdictions for this rule with the
   * collection of selection objects passed in.
   */
  @Param("jurisdictions", "A collection of jurisdiction selections")
  function updateJurisdictions(jurisdictions : Collection<JurisdictionSelection>) {
    if (not this.AllJurisdictions) {
      if (not jurisdictions.hasMatch(\ j -> j.Selected)) {
        print("3#########")
        throw new DisplayableException(
            displaykey.Accelerator.RulesFramework.Rule_Ext.JurisdictionRequired)
      }
      var toRemove = this.Jurisdictions.mapToKeyAndValue(
          \ entry -> entry.Jurisdiction,
          \ entry -> entry
      )
      for (var entry in jurisdictions.where(\ j -> j.Selected)) {
        if (toRemove.remove(entry.Jurisdiction) == null) {
          this.addToJurisdictions(new RuleJurisdiction_Ext() {
            :Jurisdiction = entry.Jurisdiction
          })
        }
      }
      toRemove.Values*.remove()
    } else {
      // If AllJurisdictions is selected, then we can remove the individual
      // rows in the join table.
      this.Jurisdictions*.remove()
    }
  }

  function updatePolicyTypes(policyTypes : Collection<PolicyTypeSelection>) {
    if (not this.AllPolicyTypes) {
      if (not policyTypes.hasMatch(\ j -> j.Selected)) {
        print("2@@@@@@@")
        throw new DisplayableException(
            displaykey.Accelerator.RulesFramework.Rule_Ext.PolicyTypeRequired)
      }
      var toRemove = this.PolicyTypes.mapToKeyAndValue(
          \ entry -> entry.PolicyType,
              \ entry -> entry
      )
      for (var entry in policyTypes.where(\ j -> j.Selected)) {
        if (toRemove.remove(entry.polType) == null) {
          print("Policy Type to be added " + entry.polType)
          this.addToPolicyTypes(new RulePolicyType_Ext() {
              :PolicyType = entry.polType
          })
        }
      }
      toRemove.Values*.remove()
    } else {
      // If AllJurisdictions is selected, then we can remove the individual
      // rows in the join table.
      this.PolicyTypes*.remove()
    }
  }
  /**
   * This property is the set of Jurisdictions with a selected flag.
   */
  @Returns("A list of jurisdiction selections")
  property get JurisdictionSelections() : List<JurisdictionSelection> {
    var jurisdictionList = new ArrayList<JurisdictionSelection>()

    var selected : Set<Jurisdiction>
    if (this.AllJurisdictions) {
      selected = {}
    } else {
      selected = this.Jurisdictions.map(\ j -> j.Jurisdiction).toSet()
    }

    // TO CONFIGURE: Update this typefileter to include only jurisdictions
    // supported by your business
    for (jurisdiction in typekey.Jurisdiction.TF_RULEJURISDICTIONS.TypeKeys) {
      var selection = new JurisdictionSelection() {
          :Jurisdiction = jurisdiction,
          :Selected = selected.contains(jurisdiction)
      }
      jurisdictionList.add(selection)
    }

    return jurisdictionList
  }

  /**
   * This property is the set of Jurisdictions with a selected flag.
   */
  @Returns("A list of jurisdiction selections")
  property get PolicyTypeSelections() : List<PolicyTypeSelection> {
    var policyTypeList = new ArrayList<PolicyTypeSelection>()

    var selected : Set<HOPolicyType_HOE>
    if (this.AllPolicyTypes) {
      selected = {}
    } else {
      selected = this.PolicyTypes.map(\ j -> j.PolicyType).toSet()
    }

    // TO CONFIGURE: Update this typefileter to include only jurisdictions
    // supported by your business
    for (policyType in typekey.HOPolicyType_HOE.TF_RULEPOLICYTYPES.TypeKeys) {
      var selection = new PolicyTypeSelection() {
          :polType = policyType,
          :Selected = selected.contains(policyType)
      }
      policyTypeList.add(selection)
    }

    return policyTypeList
  }
  /**
   * Constructs an instance of the rule condition configured for this rule.
   */
  @Param("graph", "The rule entity graph")
  @Returns("A new instance of the rule condition implemented by RuleClass")
  function NewConditionInstance<T>() : IRuleCondition<T> {
    return ReflectUtil.constructGosuClassInstance(
        this.RulePackage + "." + this.RuleClass, {})
        as IRuleCondition<T>

  }
}
