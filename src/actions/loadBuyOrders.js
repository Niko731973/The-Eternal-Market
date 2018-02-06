import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadBuyOrdersSuccess(buyOrders) {  
  return {type: types.LOAD_BUY_ORDERS_SUCCESS, buyOrders};
}

export function loadBuyOrders() {  
  return function(dispatch) {
    return MarketAPI.GetOrders('buyer').then(buyOrders => {
      dispatch(loadBuyOrdersSuccess(buyOrders));
    }).catch(error => {
      dispatch({type: "could not load Buyer orders", error});
    });
  };
}


