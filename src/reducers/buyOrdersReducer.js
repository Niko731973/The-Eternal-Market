import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function buyOrdersReducer(state = initialState.buyOrders, action) {  
  switch(action.type) {
    case types.LOAD_BUY_ORDERS_SUCCESS:
      return action.buyOrders;
    default: 
      return state;
  }
}