package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 11/30/16
 * Time: 6:37 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRatingHelper {
  function getBaseRate(policyPeriod : PolicyPeriod, ratedItem : String) : double {
    var baseRate : double = null
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
        if (container.Description.equals(ratedItem)) {
          var items = container.Children
          for (item in items) {
            if (item typeis gw.rating.worksheet.treenode.WorksheetTreeNodeLeaf) {
              if (item.Instruction?.equals("BaseRate")) {
                baseRate = item.Result
                break
              }
            }
          }
        }
      })
    }
    return baseRate
  }

  function getBasis(policyPeriod : PolicyPeriod, ratedItem : String) : double {
    var baseRate : double = null
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
        if (container.Description.equals(ratedItem)) {
          var items = container.Children
          for (item in items) {
            if (item typeis gw.rating.worksheet.treenode.WorksheetTreeNodeLeaf) {
              if (item.Instruction?.equals("Basis")) {
                baseRate = item.Result
                break
              }
            }
          }
        }
      })
    }
    return baseRate
  }

  function getContainers(policyPeriod : PolicyPeriod) : java.util.List<String> {
    var containers = new java.util.ArrayList<String>()
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
        containers.add(container.Description)
      })
    }
    return containers
  }
}