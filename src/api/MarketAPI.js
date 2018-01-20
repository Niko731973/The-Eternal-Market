import AuthenticationContract from '../../build/contracts/Market.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../../../store'


const contract = require('truffle-contract')

//should check for web3, return the current instance of the market for method calls
export function getMarketInstance(){
    
}

/* GET FUNCTIONS /*

/* Returns an array of "short" enabled listings.
A short listing consists of the following:
id, title, successRate, successes */
export function GetListings() {
    
 let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
        
      // Using truffle-contract we create the authentication object.
      const market = contract(MarketContract)
      market.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on
      var marketInstance

        market.deployed().then(function(instance) {
          marketInstance = instance;

          let nextFreeListingNumber = marketInstance.nextFreeListingID();
            
          var listings = [];
          
          // count back through listings, push each listing into our listings array
          for(let i = nextFreeListingNumber-1;i>0;i--){
              var listing = marketInstance.listings(i);
              console.log(listing);
          }
          
        })
        return dispatch; //would return listings array;
      }
  } else {
    console.error('Web3 is not initialized.');
  }
}


/* Returns all of the listing information for a given id, if 
the given id is valid and enabled */
export function GetListing(id){
    
}

/* Returns the description and public key of a given user address, if they exist*/
export function GetUserInfo(address){
    
}

// gets the current eth price from the market
export function GetETHPrice(){
    
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





