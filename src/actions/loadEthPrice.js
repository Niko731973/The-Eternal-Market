import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadEthPriceSuccess(price) {  
  return {type: types.LOAD_ETHPRICE_SUCCESS, price};
}

export function loadEthPrice() {  
  return function(dispatch) {
    return MarketAPI.GetETHPrice().then(price => {
      dispatch(loadEthPriceSuccess(price));
    }).catch(error => {
      dispatch({type: "could not load price", error});
  });
};
}



