import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function marketInstanceReducer(state = initialState.marketInstance, action) {  
  switch(action.type) {
    case types.LOAD_MARKETINSTANCE_SUCCESS:
      return action.marketInstance
    default: 
      return state;
  }
}