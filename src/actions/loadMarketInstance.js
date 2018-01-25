import * as types from './actionTypes';  
import MarketAPI from '../api/MarketAPI';

export function loadMarketInstanceSuccess(marketInstance) {  
  return {type: types.LOAD_MARKETINSTANCE_SUCCESS, marketInstance};
}


export function loadMarketInstance() {  
  return function(dispatch) {
    return MarketAPI.GetMarketInstance().then(marketInstance => {
      dispatch(loadMarketInstanceSuccess(marketInstance));
    }).catch(error => {
      console.log(error)
  });
}
}



