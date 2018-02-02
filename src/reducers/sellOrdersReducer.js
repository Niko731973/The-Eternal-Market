import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function sellOrdersReducer(state = initialState.sellOrders, action) {  
  switch(action.type) {
    case types.LOAD_SELL_ORDERS_SUCCESS:
      return action.sellOrders;
    default: 
      return state;
  }
}