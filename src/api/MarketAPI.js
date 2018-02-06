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
          if(marketInstance && typeof marketInstance !== 'undefined'){
              marketInstance.getListing(id).then(function(i){
              var listing = {};
              listing.id = id;
              listing.seller = i[0];
              listing.title = i[1];
              listing.description = i[2];
              listing.price = i[3].toNumber();
              listing.timeListed = i[4];
              listing.enabled = i[5];
              listing.successes = i[6];
              listing.aborted = i[7];
              listing.disputed = i[8];
               
              resolve(listing);
            }).catch(error => {
                  console.log(error);
              });
          }
          else{
            throw(new Error("market instance not defined"));
          }

});
    
       
}
    
static GetOrder(id){
    
    return new Promise(function(resolve, reject) {
          let marketInstance = store.getState().marketInstance;
          if(marketInstance && typeof marketInstance !== 'undefined'){
              marketInstance.getOrder(id).then(function(i){
              var order = {};
                  //i.seller, i.buyer, i.listingID, i.timeTracker, i.state, i.deliveryInfo, i.feedback, i.price
              order.id = id;
              order.seller = i[0];
              order.buyer = i[1];
              order.listingID = i[2]
              order.timeTracker = i[3]
              order.state = i[4]
              order.deliveryInfo = i[5]
              order.feedback = i[6]
              order.price = i[7]
                  
              resolve(order);
            }).catch(error => {
                  console.log(error);
              });
          }
          else{
            throw(new Error("market instance not defined"));
          }

});
    
       
}
    
static isListingActive(listing){
        return listing.enabled;
}
    
static isSellerListing(listing,userAddress){
    return listing.seller === store.getState().web3.web3Instance.eth.accounts[0];
}
    
static isSellerOrder(order,userAddress){
    return order.seller === store.getState().web3.web3Instance.eth.accounts[0];
}    
    
static isBuyerOrder(order,userAddress){
    return order.buyer === store.getState().web3.web3Instance.eth.accounts[0];
}    
    
    
    
static GetListings(condition){
    
    switch(condition){
            
        case 'active':
            return MarketAPI.GetSelectedListings(MarketAPI.isListingActive);
        case 'seller':
            return MarketAPI.GetSelectedListings(MarketAPI.isSellerListing);
        default:
            return MarketAPI.GetSelectedListings(true); // gets all listing
            
            
    }
    
    
}
    
static GetOrders(condition){
    
    switch(condition){
            
        case 'seller':
            return MarketAPI.GetSelectedOrders(MarketAPI.isSellerOrder);
        case 'buyer':
            return MarketAPI.GetSelectedOrders(MarketAPI.isBuyerOrder);
        default:
            return MarketAPI.GetSelectedOrders(true); // gets all listing
            
            
    }
    
    
}
    
static GetSelectedListings(condition) {
    
    return new Promise(function(resolve, reject) {
        
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              
              marketInstance.nextFreeListingID().then(function(nextFreeListingID){
              nextFreeListingID = nextFreeListingID.toNumber();
                  
                  if(nextFreeListingID === 1){
                      console.log("market has no listings")
                      throw(new Error("market has no listings"));
                  }
                  
                  var listings = [];
                  var promisesArray = [];
                  for(let i = nextFreeListingID-1;i>0;i-=1){
                      
                      
                      
                      promisesArray.push(new Promise(function(resolve, reject) {
                          
                          return MarketAPI.GetListing(i).then(listing => {
                            if(condition(listing)){
                                listings.push(listing)
                            }
                                resolve()
                          
                          }).catch(error => {
                              console.log("could not fetch listing id: "+i,error);
                              resolve()
                          });
                          
                      }));
                      
                  }
                  
                  Promise.all(promisesArray).then(()=>{
                      resolve(listings);
                  }).catch(error => {
                      console.log(error)
                      console.log('error resolving promise array')
                  });
                 
            }).catch(error => {
                  console.log(error)
                  throw (new Error("could not fetch nextFreeListing ID"));
                 
              });
          }
          else{
              
            throw(new Error("market instance not defined"));
          }

    });
    
}
    
    
static GetSelectedOrders(condition) {
    
    return new Promise(function(resolve, reject) {
        
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              
              marketInstance.nextFreeOrderID().then(function(nextFreeOrderID){
              nextFreeOrderID = nextFreeOrderID.toNumber();
                  
                  if(nextFreeOrderID === 1){
                      console.log("market has no orders")
                      throw(new Error("market has no orders"));
                  }
                  
                  var orders = [];
                  var promisesArray = [];
                  for(let i = nextFreeOrderID-1;i>0;i-=1){
                      
                      
                      
                      promisesArray.push(new Promise(function(resolve, reject) {
                          
                          return MarketAPI.GetOrder(i).then(order => {
                            if(condition(order)){
                                orders.push(order)
                            }
                                resolve()
                          
                          }).catch(error => {
                              console.log("could not fetch order id: "+i,error);
                              resolve()
                          });
                          
                      }));
                      
                  }
                  
                  Promise.all(promisesArray).then(()=>{
                      resolve(orders);
                  }).catch(error => {
                      console.log(error)
                      console.log('error resolving promise array')
                  });
                 
            }).catch(error => {
                  console.log(error)
                  throw (new Error("could not fetch nextFreeOrder ID"));
                 
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
                price = parseFloat(price)*100; //price is in cents
                resolve(price);
            });
    }
          else{
    throw(new Error("market instance not defined"));
          }

});
  }
    
static CreateOrder(listingID,shippingInfo,usdtosend){
    
    return new Promise(function(resolve, reject) {
        
    MarketAPI.GetWeiFromUSD(usdtosend).then(weiToSend => {
        
        let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              
            marketInstance.addOrder(listingID,shippingInfo,{
            value: weiToSend,
            from: store.getState().web3.web3Instance.eth.accounts[0]
              }).then(result => {
              resolve(result);
              
            }).catch(error => {
                  console.log(error);
              });
          }
          else{
              
            throw(new Error("market instance not defined"));
              
          }

});
        
        
    });
          
    
    
}
    
    
    
    
static GetListingFee(id){
    
    return new Promise(function(resolve, reject) {
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              marketInstance.listing_fee().then(listingFee => {
               
              resolve(listingFee);
              
            }).catch(error => {
                  console.log(error);
              });
          }
          else{
            throw(new Error("market instance not defined"));
          }

});
    
       
}
    //returns the amount of wei (at the current market price), given a price in cents
    static GetWeiFromUSD(usd){
        return new Promise(function(resolve, reject) {
        var w3 = store.getState().web3.web3Instance;
             if( typeof w3 !== 'undefined'){
              MarketAPI.GetETHPrice().then(marketPrice => {
                  
               resolve(w3.toWei(usd/marketPrice,'ether'))
                  
              
            }).catch(error => {
                  console.log(error);
              });
          
         
            }else{
                console.log('no web3 found')
                reject();
            }
        });
        

}
    
static GetOrderFee(id){
    
    return new Promise(function(resolve, reject) {
          let marketInstance = store.getState().marketInstance;
          if(typeof marketInstance !== 'undefined'){
              
              marketInstance.order_fee().then(orderFee => {
               
              resolve(orderFee.toNumber());
              
            }).catch(error => {
                  console.log(error);
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
    


export function IsBadListing(listingID){
    
}

/* User Functions */

export function UpdateUserPublicKey(newKey){
    
}

export function UpdateUserDescription(newDescription){
    
}




/* Buying/Selling Functions */



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





