package una.integration.lexisnexis.clueproperty.enhancement
/**
 * Created with IntelliJ IDEA.
 * User: ptheegala
 * Date: 1/13/17
 *
 */
enhancement HOPriorLossEnhancement : entity.HOPriorLoss_Ext {

    function sync(priorLoss : HOPriorLoss_Ext){
      this.Reference = priorLoss.Reference
      this.ClaimDate = priorLoss.ClaimDate
      this.ClaimAge = priorLoss.ClaimAge
      this.ClaimNum = priorLoss.ClaimNum
      this.ClaimType = priorLoss.ClaimType
      this.ClaimScope = priorLoss.ClaimScope
      this.DisputeDate = priorLoss.DisputeDate
      this.PolicyNum = priorLoss.PolicyNum
      this.PolicyCompany = priorLoss.PolicyCompany
      this.Statements = priorLoss.Statements
      this.PropertyPolicyNum = priorLoss.PropertyPolicyNum
      this.PropertyType = priorLoss.PropertyType
      this.ClaimStatus = priorLoss.ClaimStatus
      this.AmBest = priorLoss.AmBest
      this.LocationOfLoss = priorLoss.LocationOfLoss
      this.CatastropheInica = priorLoss.CatastropheInica
      this.mortgageComp = priorLoss.mortgageComp
      this.mortgageNum = priorLoss.mortgageNum
      this.PolicyHolderName = priorLoss.PolicyHolderName
      this.AddressType = priorLoss.AddressType
      this.Address =  priorLoss.Address
      this.City = priorLoss.City
      this.State = priorLoss.State
      this.Zip =  priorLoss.Zip
      this.SearchMatchIndicator = priorLoss.SearchMatchIndicator
      this.PhoneNumber = priorLoss.PhoneNumber
      this.ManuallyAddedLoss = false
      var cPayment = new ClaimPayment_Ext()
      cPayment.PriorLossExt = this
      cPayment.ClaimType = priorLoss.ClaimPayment.ClaimType
      cPayment.ClaimDisposition = priorLoss.ClaimPayment.ClaimDisposition
      cPayment.ClaimAmount = priorLoss.ClaimPayment.ClaimAmount
      cPayment.Chargeable = Chargeable_Ext.TC_YES

    }
}
