import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function ethPriceReducer(state = initialState.ethPrice, action) {  
  switch(action.type) {
    case types.LOAD_ETHPRICE_SUCCESS:
      return action.price;
    default: 
      return state;
  }
}