import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadSellListingsSuccess(sellListings) {  
  return {type: types.LOAD_SELL_LISTINGS_SUCCESS, sellListings};
}

export function loadSellListings() {  
  return function(dispatch) {
    return MarketAPI.GetListings('seller').then(sellListings => {
      dispatch(loadSellListingsSuccess(sellListings));
    }).catch(error => {
      dispatch({type: "could not load seller listings", error});
    });
  };
}


