package una.integration.mapping.creditreport

uses java.util.Date

/**
 * Represents a request for a CreditReport
 */
public class CreditReportRequest {
  private var _policyState : State as PolicyState  
  private var _firstName : String as FirstName
  private var _middleName : String as MiddleName
  private var _lastName : String as LastName
  private var _socialSecurityNumber : String as SocialSecurityNumber
  private var _addressLine1 : String as AddressLine1
  private var _addressLine2 : String as AddressLine2
  private var _addressCity : String as AddressCity
  private var _addressState : State as AddressState
  private var _addressZip : String as AddressZip
  private var _dateOfBirth : Date as DateOfBirth
  private var _gender : String as Gender
  private var _createdDate : Date as CreatedDate = gw.api.util.DateUtil.currentDate()
  
  // If previous address is provided, typically needed when the applicant
  // is less than 60 days in the current address
  private var _priorAddressLine1 : String as PriorAddressLine1
  private var _priorAddressLine2 : String as PriorAddressLine2
  private var _priorAddressCity : String as PriorAddressCity
  private var _priorAddressState : String as PriorAddressState
  private var _priorAddressZip : String as PriorAddressZip
  
  private var _service : typekey.CreditReportServiceExt as CreditReportService
   
  // If we have a cached credit score which is out of date, we will request an updated credit score.
  // This date field allows us to specify a date after which a new score is required.
  private var _cacheExpireDate : Date as CacheExpireDate
  private var _publicId : String as PublicID
    
  // Ancestor override  
  override function toString() : String {
    return ("Request created on "
            + this.CreatedDate + " "
            + "for: " 
            + this.FirstName + " " 
            + (this.MiddleName != null ? this.MiddleName : "")
            + this.LastName + " "  
            + this.AddressLine1 + " " 
            + this.AddressCity + " " 
            + this.AddressState + " "
            + this.AddressZip
            )
  }
  
  public static class Builder {
    
    // Required parameters
    private var _firstName : String 
    private var _lastName : String
    private var _addressLine1 : String 
    private var _addressCity : String 
    private var _addressState : State 
    private var _cacheExpireDate : Date
     
    // Optional parameters
    private var  _policyState : State 
    private var _middleName : String 
    private var _socialSecurityNumber : String 
    private var _addressLine2 : String 
    private var _addressZip : String 
    private var _dateOfBirth : Date 
    private var _publicId : String
    private var _gender : String
    
    private var _priorAddressLine1 : String 
    private var _priorAddressLine2 : String 
    private var _priorAddressCity : String 
    private var _priorAddressState : String 
    private var _priorAddressZip : String

    //change this to Mock or NCF Service
    private var _service = typekey.CreditReportServiceExt.TC_NCF

    public function withFirstName(firstName : String) : Builder {
      
      this._firstName = firstName
      
      return this
    }
    
    public function withMiddleName(middleName : String) : Builder {
      
      this._middleName = middleName
      
      return this
    }
    
    public function withLastName(lastName : String) : Builder {
      
      this._lastName = lastName
      
      return this
    }
    
    public function withSocialSecurityNumber(socialSecurityNumber : String) : Builder {
      
      this._socialSecurityNumber = socialSecurityNumber     
      
      return this
    }
    
    public function withDateOfBirth(dateOfBirth : Date) : Builder {
      
      this._dateOfBirth = dateOfBirth
      
      return this
    }    
    
    public function withAddress1(addressLine1 : String) : Builder {
      
      this._addressLine1 = addressLine1     
      
      return this
    }
    
    public function withAddress2(addressLine2 : String) : Builder {
      
      this._addressLine2 = addressLine2     
      
      return this
    }    

    public function withAddresscity(city : String) : Builder {
      
      this._addressCity = city     
      
      return this
    }    

    public function withAddressState(state : String) : Builder {
      
      this._addressState = state     
      
      return this
    }  

    public function withAddressZip(addressZip : String) : Builder {
      
      this._addressZip = addressZip     
      
      return this
    }  
    
    public function withPolicyState(policyState:String) : Builder {
      
      this._policyState = policyState     
      
      return this
    }  

    public function withCacheExpireDate(cacheExpireDate : Date) : Builder {
      
      this._cacheExpireDate = cacheExpireDate     
      
      return this
    }  
    
    public function withPublicId(publicId : String) : Builder {
      
      this._publicId = publicId     
      
      return this
    }

    public function withGender(gender : String) : Builder {

      this._gender = gender

      return this
    }

    public function withPriorAddressLine1(priorAddressLine1 : String) : Builder {
      
      this._priorAddressLine1 = priorAddressLine1     
      
      return this
    }  
    
    public function withPriorAddressLine2(priorAddressLine2 : String) : Builder {
      
      this._priorAddressLine2 = priorAddressLine2     
      
      return this
    }      
    
    public function withPriorAddressCity(priorAddressCity : String) : Builder {
      
      this._priorAddressCity = priorAddressCity     
      
      return this
    }  

    public function withPriorAddressState(priorAddressState : String) : Builder {
      
      this._priorAddressState = priorAddressState     
      
      return this
    }  
    
    public function withPriorAddressZip(priorAddressZip : String) : Builder {
      
      this._priorAddressZip = priorAddressZip     
      
      return this
    }      
    
    public function withCreditReportService(service : typekey.CreditReportServiceExt) : Builder {
      _service = service
      return this
    }
    
    public function create() : CreditReportRequest {
      return new CreditReportRequest(this)
    }
  }
  
  private construct(builder : Builder) {
    
    this._firstName = builder._firstName
    this._middleName = builder._middleName
    this._lastName = builder._lastName
    
    this._socialSecurityNumber =  builder._socialSecurityNumber
    this._dateOfBirth = builder._dateOfBirth
    
    this._addressLine1 = builder._addressLine1
    this._addressLine2 = builder._addressLine2
    this._addressCity = builder._addressCity
    this._addressState = builder._addressState
    this._addressZip = builder._addressZip
    
    this._policyState = builder._policyState
    this._cacheExpireDate = builder._cacheExpireDate    
    this._publicId = builder._publicId
    this._gender = builder._gender
    
    this._priorAddressLine1 = builder._priorAddressLine1
    this._priorAddressLine2 = builder._priorAddressLine2
    this._priorAddressCity = builder._priorAddressCity
    this._priorAddressState = builder._priorAddressState
    this._priorAddressZip = builder._priorAddressZip    
    
    _service = builder._service
  }
}
