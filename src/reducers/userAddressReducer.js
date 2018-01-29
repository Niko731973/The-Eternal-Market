import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function userAddressReducer(state = initialState.userAddress, action) {  
  switch(action.type) {
    case types.LOAD_USER_ADDRESS_SUCCESS:
      return action.userAddress;
    default: 
      return state;
  }
}