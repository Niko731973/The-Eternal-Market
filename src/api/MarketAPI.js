import AuthenticationContract from '../../build/contracts/Market.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../../../store'


const contract = require('truffle-contract')


export function GetListings(name) {
    
 let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
        
      // Using truffle-contract we create the authentication object.
      const market = contract(MarketContract)
      market.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var marketInstance

      // Get current ethereum wallet.
      

        market.deployed().then(function(instance) {
          marketInstance = instance

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
