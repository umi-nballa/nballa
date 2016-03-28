package gw.plugin.diff.impl

uses gw.api.diff.DiffItem

/**
 * This class contains methods to help with adding and filtering diff items for a 
 * Home Owner line of business. 
 */
@Export
class HODiffHelper extends DiffHelper<entity.HomeownersLine_HOE> {

  construct(reason : DiffReason, polLine1 : entity.HomeownersLine_HOE, polLine2 : entity.HomeownersLine_HOE) {
    super(reason, polLine1, polLine2)
  }
  
  override function addDiffItems(diffItems : List<DiffItem>) : List<DiffItem> {
    diffItems = super.addDiffItems(diffItems)
    
    // Add dwelling diffs
    diffItems.addAll(this.compareLineField("Dwelling", 5)) 
    
    // Add diffs for line-level clauses
    diffItems.addAll( DiffUtils.compareBeans(Line1, Line2, 5))
    return diffItems
  }
}
