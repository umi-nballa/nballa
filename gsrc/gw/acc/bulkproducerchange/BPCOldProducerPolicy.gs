package gw.acc.bulkproducerchange

/**
 * This class is used as data model to populate the old producer's policies ListView when you are performing a bulk change from an old producer code to a new producer code
 */
class BPCOldProducerPolicy {
  var _policy : Policy as Policy  //The policy
  var _checked : Boolean as Checked //Is to change producer?
}