import * as types from './actionTypes';  
import GetListings from '../api/MarketAPI';


export function loadListings() {  
  return function(dispatch) {
    return GetListings.GetActiveListings().then(listings => {
      dispatch(loadListingsSuccess(listings));
    }).catch(error => {
      throw(error);
    });
  };
}


export function loadListingsSuccess(listings) {  
  return {type: types.LOAD_LISTINGS_SUCCESS, listings};
}

export function loadListingSuccess(listing) {  
  return {type: types.LOAD_LISTING_SUCCESS, listing};
}

