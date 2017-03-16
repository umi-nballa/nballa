package una.utils
/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 3/8/17
 * Time: 12:08 PM
 * To change this template use File | Settings | File Templates.
 */
class SprinklerUtil {

 public enum CITES{

    Agoura_Hills("Agoura Hills", 2007 , 0 ),
    Albany("Albany", 2007 , 1500),
    Alhambra("Alhambra",2003 ,2250),
    Arcadia("Arcadia",2007,0) ,
    Arroyo_Grande("Arroyo Grande",2007,1000) ,
    Atherton("Atherton",2007,1000),
    Belvedere("Belvedere",2007,0),
    Beverly_Hills("Beverly Hills",2007,0),
    Brentwood("Brentwood",2000,0),
    Burbank("Burbank",2004,0),
    Claremont("Claremont",2007,0),
    Cloverdale("Cloverdale",2007,0),
    Coronado("Coronado",2002,2000),
    Corte_Madera("Corte Madera",2008,0),
    Cotati("Cotati",2008,0),
    Culver_City("Culver City",1990,0),
    Cypress("Cypress",2007,0),
    Dana_Point("Dana Point",2007,0),
    Daly_City("Daly City",2007,0),
    Downey("Downey",2005,0),
    Dublin("Dublin",2007,0),
    Fairfield("Fairfield",2008,0),
    Foster_City("Foster City",2007,0),
    Fontana("Fontana",1987,0),
    Fountain_Valley("Fountain Valley",2007,3500),
    Fremont("Fremont",1995,0),
    Glendora("Glendora",2007,0),
    Healdsburg("Healdsburg",2007,0),
    Kentfield("Kentfield",2007,0),
    La_Habra_Heights("La Habra Heights",2006,0),
    La_Mesa("La Mesa",2007,0),
    Laguna_Beach("Laguna Beach",2007,0),
    Larkspur("Larkspur",1996,0),
    Lathrop("Lathrop",1987,4000),
    Livermore("Livermore",1992,0),
    Loma_Linda("Loma Linda",2007,0),
    Long_Beach("Long Beach",2007,4000),
    Los_Angeles("Los Angeles",2007,0),
    Los_Gatos("Los Gatos",2002,3600),
    Marin_City("Marin City",2008,0),
    Mill_Valley("Mill Valley",2007,0),
    Milpitas("Milpitas",2007,3600),
    Monterey("Monterey",2008,0),
    Morro_Bay("Morro Bay",2008,1000),
    Napa("Napa",2008,0),
    Newark("Newark",2007,1000),
    Norco("Norco",2007,2500),
    Oxnard("Oxnard",2007,0),
     Palm_Springs("Palm Springs",1982,3600),
     Palo_Alto("Palo Alto",2007,3600),
     Pebble_Beach("Pebble Beach",1999,0),
     Petaluma("Petaluma",2008,0),
     Pismo_Beach ("Pismo Beach ",2008,1000),
     Placentia("Placentia",2008,0),
     Portola("Portola",2009,1000),
     Ramona("Ramona",2008,0),
     Rancho_Santa_Fe("Rancho Santa Fe",2008,0),
     Redlands("Redlands",2007,0),
     Redondo_Beach("Redondo Beach",1990,750),
     Redwood_City("Redwood City",2008,0),
     Riverside("Riverside",2007,0),
     Roseville("Roseville",2007,0),
     San_Bruno("San Bruno",2007,0),
   San_Carlos("San Carlos",2002,0),
   San_Clemente("San Clemente",1979,0),
   San_Diego("San_Diego",2008,0),
   San_Gabriel("San Gabriel",2008,0),
   San_Luis_Obispo("San Luis Obispo",2008,1000),
   San_Mateo("San Mateo",2007,0),
   San_Miguel("San Miguel",1998,0),
   San_Rafael("San Rafael",2007,0),
   Santa_Barbara("Santa Barbara",2009,0),
   Santa_Cruz("Santa Cruz",1996,0),
   Santa_Monica("Santa Monica",1992,0),
   Santee("Santee",2007,0),
   Saratoga("Saratoga",2008,3600),
   Sausalito("Sausalito",2002,0),
   Sierra_Madre("Sierra Madre",2007,0),
   Solana_Beach("Solana Beach",2008,0),
   Spring_Valley("Spring Valley",2007,0),
   Stanton("Stanton",2007,0),
   Sunnyvale("Sunnyvale",2007,3600),
   Tahoe_City("Tahoe City (NT FPD)",1986,3600),
   Tiburon("Tiburon",1982,0),
   Tomales("Tomales",2008,0),
   Ukiah("Ukiah",2007,0),
   Union_City("Union City",1995,0),
   West_Hollywood("West Hollywood",2007,0),
   Windsor("Windsor",2004,0),
   Woodland("Woodland",2007,0)

   private construct(cityName : String, yearBuilt : int , sqft : int){
     _cityName = cityName
     _yearBuilt = yearBuilt
     _sqft = sqft
   }
   private final var _cityName : String
   private final var _yearBuilt : int
   private final var _sqft : int

 }

 public enum COUNTY{
   Santa_Clara("Santa Clara",2002,3500),
   Sonoma("Sonoma",2003,0),
   Yolo("Yolo",1995,0)

   private construct(countyName : String, yearBuilt : int , sqft : int){
     _countyName = countyName
     _yearBuilt = yearBuilt
     _sqft = sqft
   }
   private final var _countyName : String
   private final var _yearBuilt : int
   private final var _sqft : int

  }

  public static function getSprinklerCredit(HOcounty : String ,HOcity : String , HOyear : int , HOsqft : int):boolean{

      for (county in COUNTY.AllValues ){
        if(county._countyName == HOcounty && HOyear >= county._yearBuilt  && HOsqft >= county._sqft){
          return false
        }
      }
      for (city in CITES.AllValues){
         if(city._cityName == HOcity && HOyear >= city._yearBuilt  && HOsqft >= city._sqft){
           return false
         }
      }
     return true
  }

}