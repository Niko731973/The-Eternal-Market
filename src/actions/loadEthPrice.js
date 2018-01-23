import * as types from './actionTypes';  
import GetETHPrice from '../api/MarketAPI';


export function loadListings() {  
  return function(dispatch) {
    return GetETHPrice.then(price => {
      dispatch(loadEthPriceSuccess(price));
    }).catch(error => {
      throw(error);
    });
  };
}


export function loadEthPriceSuccess(price) {  
  return {type: types.LOAD_ETHPRICE_SUCCESS, price};
}
