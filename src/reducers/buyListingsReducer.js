import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function buyListingsReducer(state = initialState.buyListings, action) {  
  switch(action.type) {
    case types.LOAD_BUY_LISTINGS_SUCCESS:
      return action.buyListings;
    default: 
      return state;
  }
}