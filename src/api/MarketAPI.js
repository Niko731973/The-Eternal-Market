import MarketContract from '../../build/contracts/Market.json';
//import PriceOracleContract from '../../build/contracts/PriceOracle.json';
//import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../store';

const contract = require('truffle-contract');



// gets the current eth price from the market in USD

class MarketAPI {  
    
    static GetListing(id){
    
    return new Promise(function(resolve, reject) {
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              marketInstance.getListing().then(function(i){
              var listing = {};
              console.log(i);
              listing.seller = i[0];
              listing.title = i[1];
              listing.description = i[2];
              listing.price = i[3];
              listing.timeListed = i[4];
              listing.enabled = i[5];
              listing.successes = i[6];
              listing.aborted = i[7];
              listing.disputed = i[8];
               
              resolve(listing);
            });
    }
          else{
            throw(new Error("market instance not defined"));
          }

});
    
       
}
    
static GetBuyListings() {
    
    return new Promise(function(resolve, reject) {
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              
              marketInstance.nextFreeListingID().then(function(nextFreeListingID){
                  if(nextFreeListingID === 1){
                      throw(new Error("market has no listings"));
                  }
                  var listings = {};
                  for(let i = nextFreeListingID-1;i>0;i-=1){
                      MarketAPI.GetListing(i).then(listing => {
                      
                      listings.i = listing;
                      
                  }).catch(()=>{
                      
                      console.log("could not fetch listing id: "+i);
                  });
                  }
                  
              resolve(listings);
            });
          }
          else{
            throw(new Error("market instance not defined"));
          }

    });
    
}
    
  static GetMarketInstance(){
      return new Promise(function(resolve, reject) {
          
        var w3 = store.getState().web3.web3Instance;
      
        if( typeof w3 !== 'undefined'){
            var market = contract(MarketContract);
            market.setProvider(w3.currentProvider);
            market.deployed().then(instance => {
                resolve(instance);;
            }).catch(error => {throw(error)});
        
        }
    
        else{
    throw(new Error("market instance not defined"));
          }
      });
        
  }
    
  static GetETHPrice() {
      return new Promise(function(resolve, reject) {
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
          marketInstance.eth_price().then(function(b32Price){
                let w3 = store.getState().web3.web3Instance;
                var price = w3.toDecimal(b32Price);
                price = w3.fromWei(price);
                price = parseFloat(price);
                resolve(price);
            });
    }
          else{
    throw(new Error("market instance not defined"));
          }

});
  }
}


export default MarketAPI;  

/* Returns the description and public key of a given user address, if they exist*/
export function GetUserInfo(address){
    
}
    
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





