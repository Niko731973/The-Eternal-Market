import * as types from './actionTypes';  
import GetBuyListings from '../api/MarketAPI';


export function loadBuyListings() {  
  return function(dispatch) {
    return GetBuyListings.GetActiveListings().then(listings => {
      dispatch(loadListingsSuccess(listings));
    }).catch(error => {
      throw(error);
    });
  };
}


export function loadBuyListingsSuccess(listings) {  
  return {type: types.LOAD_BUY_LISTINGS_SUCCESS, listings};
}
