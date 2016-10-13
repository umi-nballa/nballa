package una.integration.mapping.hpx.common

uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/3/16
 * Time: 7:28 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXGeneralPartyInfoMapper {

  /************************************** General Party Info ******************************************************/
  function createGeneralPartyInfo(party : Contact, role : PolicyContactRole) : wsi.schema.una.hpx.hpx_application_request.types.complex.GeneralPartyInfoType {
    var generalPartyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.GeneralPartyInfoType()
    generalPartyInfo.addChild(new XmlElement("NameInfo", createNameInfo(role)))
    generalPartyInfo.addChild(new XmlElement("Addr", createAddr(party.PrimaryAddress)))
    return generalPartyInfo
  }

  /************************************** Name Info ******************************************************/
  function createNameInfo(role : PolicyContactRole) : wsi.schema.una.hpx.hpx_application_request.types.complex.NameInfoType {
    var nameInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.NameInfoType()
    nameInfo.PersonName.GivenName = role.FirstName != null ? role.FirstName : ""
    nameInfo.PersonName.Surname = role.FirstName != null ? role.LastName : ""
    nameInfo.CommlName.CommercialName = role.CompanyName != null ? role.CompanyName : ""
    return nameInfo
  }

  /************************************** Addr ******************************************************/
  function createAddr(address : Address) : wsi.schema.una.hpx.hpx_application_request.types.complex.AddrType {
    var addr = new wsi.schema.una.hpx.hpx_application_request.types.complex.AddrType()
    addr.Addr1 = address.AddressLine1
    addr.Addr2 = address.AddressLine2 != null ? address.AddressLine2 : ""
    addr.Addr3 = address.AddressLine3 != null ? address.AddressLine3 : ""
    addr.City = address.City
    addr.StateProvCd = address.State.Code
    addr.StateProv = address.State.Description
    addr.PostalCode = address.PostalCode
    return addr
  }

  function createProducerOrganization(organization : Organization) : wsi.schema.una.hpx.hpx_application_request.types.complex.GeneralPartyInfoType {
    var generalPartyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.GeneralPartyInfoType()
    generalPartyInfo.NameInfo.CommlName.CommercialName = organization.Name
    generalPartyInfo.Communications.PhoneInfo.PhoneTypeCd = organization.Contact.PrimaryPhone != null ? organization.Contact.PrimaryPhone : null
    generalPartyInfo.Communications.PhoneInfo.PhoneNumber = organization.Contact.PrimaryPhoneValue != null ? organization.Contact.PrimaryPhoneValue : ""
    return generalPartyInfo
  }

  function createUserGeneralPartyInfo(user : User) : wsi.schema.una.hpx.hpx_application_request.types.complex.GeneralPartyInfoType {
    var generalPartyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.GeneralPartyInfoType()
    generalPartyInfo.addChild(new XmlElement("NameInfo", createNameInfo(user.Contact)))
    return generalPartyInfo
  }

  /************************************** Name Info ******************************************************/
  function createNameInfo(user : UserContact) : wsi.schema.una.hpx.hpx_application_request.types.complex.NameInfoType {
    var nameInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.NameInfoType()
    if (user.FirstName != null or user.LastName != null) {
      nameInfo.PersonName.Surname = user.LastName
      nameInfo.PersonName.GivenName = user.FirstName
    }
    return nameInfo
  }

  function createMiscPartyInfo(party : Role) : wsi.schema.una.hpx.hpx_application_request.types.complex.MiscPartyInfoType {
    var miscPartyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.MiscPartyInfoType()
    switch (party.RoleType) {
      case typekey.RoleType.TC_USER :
          miscPartyInfo.MiscPartyRoleCd = "UserLogin"
          break
    }
    return miscPartyInfo
  }
}