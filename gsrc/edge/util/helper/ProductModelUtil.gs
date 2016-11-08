package edge.util.helper


/**
 * Helper function to isolate Emerald API changes for ProductModel retrieval
 */
class ProductModelUtil {
  static property get BaseOfferingCode() : String {
    return gw.api.productmodel.ProductLookup.getByCode("PersonalAuto").Offerings.first().Code
  }
}
