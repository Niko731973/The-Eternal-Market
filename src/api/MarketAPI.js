import MarketContract from '../../build/contracts/Market.json';
//import PriceOracleContract from '../../build/contracts/PriceOracle.json';
//import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../store';

const contract = require('truffle-contract');

/* GET FUNCTIONS /*

/* Returns an array of "short" enabled listings.
A short listing consists of the following:
id, title, successRate, successes */
export function GetBuyListings() {
    /*
          var marketInstance;
          = getMarketInstance();
          console.log(marketInstance);
          let nextFreeListingNumber = marketInstance.nextFreeListingID();
            
          var listings = [];
          
          // count back through listings, push each listing into our listings array
          for(let i = nextFreeListingNumber-1;i>0;i--){
              var listing = marketInstance.listings(i);
              console.log(listing);
          }
          
        
        return listings; //return listings array;
        */
}



/* Returns all of the listing information for a given id, if 
the given id is valid and enabled */
export function GetListing(id){
    
}

/* Returns the description and public key of a given user address, if they exist*/
export function GetUserInfo(address){
    
}

// gets the current eth price from the market in USD

class MarketAPI {  
    
  static getWeb3Instance(){
    return new Promise(function(resolve, reject) {
        let w3 = store.getState().web3.web3Instance;
        if( typeof w3 !== 'undefined'){
            resolve(w3);
        }
        reject(new Error("W3 is not configured"));
    });
}
    
  static getMarketInstance(){
        return MarketAPI.getWeb3Instance().then(w3 => {
            var market = contract(MarketContract);
            market.setProvider(w3.currentProvider);
            return market.deployed();
        }).catch(error =>{
            return error;
        });
    
  }
    
  static GetETHPrice() {
    return MarketAPI.getWeb3Instance().then( function(instance) {
        
        var w3 = instance;
        
        return MarketAPI.getMarketInstance().then(function(instance) {
        
            return instance.eth_price().then(function(b32Price){
                
                var price = w3.toDecimal(b32Price);
                price = w3.fromWei(price);
                console.log(price);
                return price;
                
            });
        });
        
    }).catch(error => {console.log(error); return error;});
    
  }
}

export default MarketAPI;  
    
export function GetListingFee(){
    
}

export function GetOrderFee(){
    
}

export function IsBadListing(listingID){
    
}

/* User Functions */

export function UpdateUserPublicKey(newKey){
    
}

export function UpdateUserDescription(newDescription){
    
}




/* Buying/Selling Functions */

export function CreateOrder(listingID,shippingInfo){
    
}

export function CreateListing(title,description,price){
    //addListing(title,description,price, {value:fee});
}

export function DeleteListing(listingID){
    
}

export function UpdateListingDescription(listingID,description){
    
}

export function UpdateListingPrice(listingID,newPrice){
    
}

// confirm shipment
// confirm delivery
// disputeOrder
// abort order
// deadman switch





