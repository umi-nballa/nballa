package una.integration.mapping.creditreport

uses typekey.State
uses typekey.CreditStatusExt

uses java.util.Date
uses java.util.Map
uses java.util.HashMap


/**
 * Represents response from credit report provider
 */
class CreditReportResponse {
  
  private var _score : String as Score
  
  /**
    * Set this to true if the address in the order is not the
    * same as the vendor dataset's ref=1 address entry 
    * Ideally, this be derived field if the address(es) from the 
    * vendor's address dataset is also persisted
    */ 
  private var _addressDiscrepancyInd : boolean as AddressDiscrepancyInd
  
  private var _creditBureau : String as CreditBureau
  private var _scoreDate : Date as ScoreDate
  private var _folderID : String as FolderID
  private var _statusCode : CreditStatusExt as StatusCode
  private var _statusDescription : String as StatusDescription
  private var _orderedDate : Date as OrderedDate
  private var _publicID : String as PublicID
  private var _gender : String as Gender
  
  // This may need to be persisted for post notification or reporting purposes to customers 
  // who have received adverse or substandard rates. This is usually state-driven.
  private var _reasons : Map<String, String> as Reasons =  new HashMap<String, String>()

  // These fields are added so that we can persist them in CreditReportExt and 
  // it can be searched based on values of these fields before re ordering the credit report.
  private var _firstName : String as FirstName
  private var _middleName : String as MiddleName
  private var _lastName : String as LastName
  private var _socialSecurityNumber : String as SocialSecurityNumber
  private var _dateOfBirth : Date as DateOfBirth
  private var _addressLine1 : String as AddressLine1
  private var _addressLine2 : String as AddressLine2
  private var _addressCity : String as AddressCity
  private var _addressState : State as AddressState
  private var _addressZip : String as AddressZip

  construct() {
  }
  
  override function toString() : String {
    return ("Response from request ordered on " 
            + this.OrderedDate + " "
            + "for: " 
            + this.FirstName + " " 
            + this.LastName + " "  
            + this.AddressLine1 + " " 
            + this.AddressCity + " " 
            + this.AddressState + " " 
            + this.AddressZip
            )
  }
  
  public static class Builder {
  
    private var _firstName : String 
    private var _middleName : String 
    private var _lastName : String 
    private var _socialSecurityNumber : String 
    private var _dateOfBirth : Date 
    private var _addressLine1 : String 
    private var _addressLine2 : String 
    private var _addressCity : String 
    private var _addressState : State 
    private var _addressZip : String 

    private var _orderedDate : Date 
  
    private var _publicId : String 
    private var _gender : String

    private var _score : String
    private var _addressDiscrepancyInd : boolean
    private var _creditBureau : String
    private var _scoreDate : Date
    private var _folderId : String
    private var _statusCode : CreditStatusExt
    private var _statusDescription : String    
    private var _reasons : Map<String, String> = new HashMap<String, String>()
 
    construct() {
    }
  
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
  
    public function withOrderedDate(orderedDate : Date) : Builder {
      
      this._orderedDate = orderedDate     
      
      return this
    }    
 
    public function withScore(score : String) : Builder {
      
      this._score = score     
      
      return this
    } 

    public function withAddressDiscrepancyInd(addressDiscrepancyInd : boolean) : Builder {
      
      this._addressDiscrepancyInd = addressDiscrepancyInd     
      
      return this
    }     
  
    public function withCreditBureau(creditBureau : String) : Builder {
      
      this._creditBureau = creditBureau     
      
      return this
    }  
  
    public function withScoreDate(scoreDate : Date) : Builder {
      
      this._scoreDate = scoreDate     
      
      return this
    } 
  
    public function withFolderId(folderId : String) : Builder {
      
      this._folderId = folderId     
      
      return this
    }  
  
    public function withStatusCode(statusCode : CreditStatusExt) : Builder {
     
      this._statusCode = statusCode     
      
      return this
    }
  
    public function withStatusDescription(statusDescription : String) : Builder {
     
      this._statusDescription = statusDescription     
      
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
  
    public function withAddress1(addressLine1:String) : Builder {
      
      this._addressLine1 = addressLine1     
      
      return this
    }
    
    public function withAddress2(addressLine2:String) : Builder {
      
      this._addressLine2 = addressLine2     
      
      return this
    }    

    public function withAddresscity(city:String) : Builder {
      
      this._addressCity = city     
      
      return this
    }    

    public function withAddressState(state:String) : Builder {
      
      this._addressState = state     
      
      return this
    }  

    public function withAddressZip(addressZip:String) : Builder {
      
      this._addressZip = addressZip     
      
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
  
    public function withReason(code : String, description : String) : Builder {
        
      this._reasons.put(code, description)    
      
      return this
    }
  
    public function withReasons(mapReason : Map<String, String>) : Builder {
        
      if(mapReason != null) {
        this._reasons.putAll(mapReason) 
      }
      return this
    }
  
    public function create() : CreditReportResponse {
        
      return new CreditReportResponse(this)
    }
  }
  
  private construct(builder : Builder) {
    
    this._firstName = builder._firstName
    this._middleName = builder._middleName
    this._lastName = builder._lastName
    this._gender = builder._gender
    
    this._socialSecurityNumber =  builder._socialSecurityNumber
    this._dateOfBirth = builder._dateOfBirth
    
    this._addressLine1 = builder._addressLine1
    this._addressLine2 = builder._addressLine2
    this._addressCity = builder._addressCity
    this._addressState = builder._addressState
    this._addressZip = builder._addressZip
  
    this.OrderedDate = builder._orderedDate
    this.PublicID = builder._publicId
    
    this.Score = builder._score
    this.AddressDiscrepancyInd = builder._addressDiscrepancyInd

    this.CreditBureau = builder._creditBureau
    this.ScoreDate = builder._scoreDate
    this.FolderID = builder._folderId
    this.StatusCode = builder._statusCode
    this.StatusDescription = builder._statusDescription
 
    this.Reasons.putAll(builder._reasons)
    builder._reasons.clear()
    builder._reasons = null
  }
}
