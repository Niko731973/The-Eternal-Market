import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadBuyListingsSuccess(buyListings) {  
  return {type: types.LOAD_BUY_LISTINGS_SUCCESS, buyListings};
}

export function loadBuyListings() {  
  return function(dispatch) {
    return MarketAPI.GetListings('active').then(buyListings => {
      dispatch(loadBuyListingsSuccess(buyListings));
    }).catch(error => {
      dispatch({type: "could not load buy listings", error});
    });
  };
}


