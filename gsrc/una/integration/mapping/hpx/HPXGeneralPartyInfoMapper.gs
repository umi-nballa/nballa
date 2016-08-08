package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/3/16
 * Time: 7:28 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXGeneralPartyInfoMapper {

  /************************************** General Party Info ******************************************************/
  function createGeneralPartyInfo(party : Contact, role : PolicyContactRole) : wsi.schema.una.hpx.hpx_application_request.GeneralPartyInfo {
    var generalPartyInfo = new wsi.schema.una.hpx.hpx_application_request.GeneralPartyInfo()
    generalPartyInfo.addChild(createNameInfo(role))
    generalPartyInfo.addChild(createAddr(party.PrimaryAddress))
    return generalPartyInfo
  }

  /************************************** Name Info ******************************************************/
  function createNameInfo(role : PolicyContactRole) : wsi.schema.una.hpx.hpx_application_request.NameInfo {
    var nameInfo = new wsi.schema.una.hpx.hpx_application_request.NameInfo()
    if (role.FirstName != null or role.LastName != null) {
      var personName = new wsi.schema.una.hpx.hpx_application_request.PersonName()
      var surName = new wsi.schema.una.hpx.hpx_application_request.Surname()
      surName.setText(role.LastName)
      var givenName = new wsi.schema.una.hpx.hpx_application_request.GivenName()
      givenName.setText(role.FirstName)
      personName.addChild(surName)
      personName.addChild(givenName)
      nameInfo.addChild(personName)
    }
    if (role.CompanyName != null) {
      var commlName = new wsi.schema.una.hpx.hpx_application_request.CommlName()
      var commercialName = new wsi.schema.una.hpx.hpx_application_request.CommercialName()
      commercialName.setText(role.CompanyName)
      nameInfo.addChild(commlName)
    }
    return nameInfo
  }

  /************************************** Addr ******************************************************/
  function createAddr(address : Address) : wsi.schema.una.hpx.hpx_application_request.Addr {
    var addr = new wsi.schema.una.hpx.hpx_application_request.Addr()
    var addr1 = new wsi.schema.una.hpx.hpx_application_request.Addr1()
    addr.addChild(addr1)
    addr1.setText(address.AddressLine1)
    if (address.AddressLine2 != null) {
      var addr2 = new wsi.schema.una.hpx.hpx_application_request.Addr2()
      addr.setText(address.AddressLine2)
      addr.addChild(addr2)
    }
    if (address.AddressLine3) {
      var addr3 = new wsi.schema.una.hpx.hpx_application_request.Addr3()
      addr.setText(address.AddressLine3)
      addr.addChild(addr3)
    }
    var city = new wsi.schema.una.hpx.hpx_application_request.City()
    city.setText(address.City)
    addr.addChild(city)
    var stateProvCd = new wsi.schema.una.hpx.hpx_application_request.StateProvCd()
    stateProvCd.setText(address.State.Code)
    addr.addChild(stateProvCd)
    var stateProv = new wsi.schema.una.hpx.hpx_application_request.StateProv()
    stateProv.setText(address.State.Description)
    addr.addChild(stateProv)
    var postalCode = new wsi.schema.una.hpx.hpx_application_request.PostalCode()
    postalCode.setText(address.PostalCode)
    addr.addChild(postalCode)
    return addr
  }

  function createProducerOrganization(organization : Organization) : wsi.schema.una.hpx.hpx_application_request.GeneralPartyInfo {
    var generalPartyInfo = new wsi.schema.una.hpx.hpx_application_request.GeneralPartyInfo()
    var nameInfo = new wsi.schema.una.hpx.hpx_application_request.NameInfo()
    var commlName = new wsi.schema.una.hpx.hpx_application_request.CommlName()
    var commercialName = new wsi.schema.una.hpx.hpx_application_request.CommercialName()
    commercialName.setText(organization.Name)
    commlName.addChild(commercialName)
    nameInfo.addChild(commlName)
    var communications = new wsi.schema.una.hpx.hpx_application_request.Communications()
    var phoneInfo = new wsi.schema.una.hpx.hpx_application_request.PhoneInfo()
    var phoneTypeCd = new wsi.schema.una.hpx.hpx_application_request.PhoneTypeCd()
    phoneTypeCd.setText(organization.Contact.PrimaryPhone)
    phoneInfo.addChild(phoneTypeCd)
    var phoneNumber = new wsi.schema.una.hpx.hpx_application_request.PhoneNumber()
    phoneNumber.setText(organization.Contact.PrimaryPhoneValue)
    phoneInfo.addChild(phoneNumber)
    communications.addChild(phoneInfo)
    generalPartyInfo.addChild(nameInfo)
    generalPartyInfo.addChild(communications)
    return generalPartyInfo
  }
}