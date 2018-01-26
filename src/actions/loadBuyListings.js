import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadBuyListingsSuccess(listings) {  
  return {type: types.LOAD_BUY_LISTINGS_SUCCESS, listings};
}

export function loadBuyListings() {  
  return function(dispatch) {
    return MarketAPI.GetBuyListings().then(listings => {
      dispatch(loadBuyListingsSuccess(listings));
    }).catch(error => {
      dispatch({type: "could not load buy listings", error})
    });
  };
}


