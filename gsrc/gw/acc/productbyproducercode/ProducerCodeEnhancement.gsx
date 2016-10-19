package gw.acc.productbyproducercode

uses gw.api.productmodel.Product
uses com.guidewire.pc.system.dependency.PCDependencies
uses java.lang.IllegalStateException
uses java.util.Date

enhancement ProducerCodeEnhancement : entity.ProducerCode {
  
  /**
   * Returns all the products that this producer code can see

  property get Products() : Product[] {
    return this.AvailableProductsExt.map(\ f -> PCDependencies.getProductModel().getPattern(f.ProductCode, Product))
  }
  */
  property get Products() : ProducerCodeProduct_Ext[] {
    return this.AvailableProductsExt
  }

  /**
   * Returns the list of products that can be added to the list of products this producer code can see
   */
  property get RemainingProducts() : Product[] {
    return PCDependencies.getProductModel().getAllInstances(Product).where( \ elt -> elt.CodeIdentifier=="CommercialPackage" || elt.CodeIdentifier=="BP7BusinessOwners" || elt.CodeIdentifier=="Homeowners").toTypedArray()
    //var addedProductCodes =  this.AvailableProductsExt.map(\ f -> f.ProductCode).toSet()
    //var remainingProductCodes =  PCDependencies.getProductModel().getAllInstances(Product).where(\ p -> not addedProductCodes.contains(p.Code)).toTypedArray()
    /*
    var remainingProductCodes =  PCDependencies.getProductModel().getAllInstances(Product).toTypedArray()
    var res = new List<ProducerCodeProduct_Ext>()
    for(r in remainingProductCodes){
     var theProducerCodeProduct_Ext = new ProducerCodeProduct_Ext()
     theProducerCodeProduct_Ext.ProductCode = r.DisplayName
     theProducerCodeProduct_Ext.ProducerCode = this
     res.add(theProducerCodeProduct_Ext)
    }
    return res.toArray(new ProducerCodeProduct_Ext[res.size()])
    */
  }

  public function handlePreUpdate(){
    if(this.Code.Numeric){
      this.setFieldValue("CodeIntValue", this.Code.toInt())
    }
  }
  
  /**
   * The producer will not see the product passed in anymore
   */
  function removeProduct(theProduct: ProducerCodeProduct_Ext) {
    var prodCodeProduct = this.AvailableProductsExt.firstWhere(\ f -> f.ProductCode == theProduct.ProductCode && f.EffectiveDateExt == theProduct.EffectiveDateExt && f.ExpirationDateExt == theProduct.ExpirationDateExt && f.JurisdictionExt == theProduct.JurisdictionExt)
    if (prodCodeProduct == null) {
      throw new IllegalStateException("Product \"${theProduct.ProductCode}\" not found")
    }
    this.removeFromAvailableProductsExt(prodCodeProduct)
  }
  
  /**
   * Adds the product passed in to the list of products this producer code can see

  function addProduct(theProducerCodeProduct_Ext : ProducerCodeProduct_Ext) : ProducerCodeProduct_Ext {
    //if (this.AvailableProductsExt.firstWhere(\ f -> f.ProductCode == productCode) != null) {
      //throw new IllegalStateException("Product \"${productCode}\" is already added to this Producer")
    //}
    var prodCodeProduct = new ProducerCodeProduct_Ext()
    prodCodeProduct.ProductCode = theProducerCodeProduct_Ext.ProductCode
    prodCodeProduct.ProducerCode = this
    prodCodeProduct.EffectiveDateExt = theProducerCodeProduct_Ext.EffectiveDateExt
    prodCodeProduct.ExpirationDateExt = theProducerCodeProduct_Ext.ExpirationDateExt
    prodCodeProduct.JurisdictionExt =  theProducerCodeProduct_Ext.JurisdictionExt
    this.addToAvailableProductsExt(prodCodeProduct)
    return prodCodeProduct
  }
  */

  function addProduct(theProduct : Product) : ProducerCodeProduct_Ext {
    //if (this.AvailableProductsExt.firstWhere(\ f -> f.ProductCode == productCode) != null) {
    //throw new IllegalStateException("Product \"${productCode}\" is already added to this Producer")
    //}
    var prodCodeProduct = new ProducerCodeProduct_Ext()
    prodCodeProduct.ProductCode = theProduct.CodeIdentifier
    prodCodeProduct.ProducerCode = this

    this.addToAvailableProductsExt(prodCodeProduct)
    return prodCodeProduct
  }

  /**
   * Adds the product passed in to the list of products this producer code can see
   * Returns the added ProducerCodeProductExt object
   */
  function addProductWithResult(product : Product, theEffectiveDate : Date, theExpirationDate : Date, theJurisdiction : Jurisdiction) : ProducerCodeProduct_Ext {
    //if (this.AvailableProductsExt.firstWhere(\ f -> f.ProductCode == product.Code) != null) {
      //throw new IllegalStateException("Product \"${product.Code}\" is already added to this Producer")
    //}
    if(theExpirationDate < theEffectiveDate){
      throw new IllegalStateException("Expiration Date Cannot Be Less Than Effective Date")
    }
    var prodCodeProduct = new ProducerCodeProduct_Ext()
    prodCodeProduct.ProductCode = product.Code
    prodCodeProduct.ProducerCode = this
    prodCodeProduct.EffectiveDateExt = theEffectiveDate
    prodCodeProduct.ExpirationDateExt = theExpirationDate
    prodCodeProduct.JurisdictionExt = theJurisdiction
    this.addToAvailableProductsExt(prodCodeProduct)
    return prodCodeProduct
  }

}