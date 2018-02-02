import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadSellOrdersSuccess(sellOrders) {  
  return {type: types.LOAD_SELL_ORDERS_SUCCESS, sellOrders};
}

export function loadSellOrders() {  
  return function(dispatch) {
    return MarketAPI.GetOrders('seller').then(sellOrders => {
      dispatch(loadSellOrdersSuccess(sellOrders));
    }).catch(error => {
      dispatch({type: "could not load seller orders", error});
    });
  };
}


