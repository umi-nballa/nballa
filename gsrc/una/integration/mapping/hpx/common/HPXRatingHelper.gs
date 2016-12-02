package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 11/30/16
 * Time: 6:37 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRatingHelper {
  function getBaseRate(line : PolicyLine, ratedItem : String) : double {
    var baseRate : double = null
    var worksheet = line.getWorksheetRootNode(true)
    worksheet.Children.each( \ elt -> {
      var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
      print(container.Description)
      if (container.Description.equals(ratedItem)) {
        print(container.Description)
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
    return baseRate
  }
}