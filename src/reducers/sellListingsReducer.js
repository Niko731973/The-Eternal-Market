import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function sellListingsReducer(state = initialState.sellListings, action) {  
  switch(action.type) {
    case types.LOAD_SELL_LISTINGS_SUCCESS:
      return action.sellListings;
    default: 
      return state;
  }
}