import * as types from './actionTypes';  
import store from '../store';

export function loadUserAddressSuccess(userAddress) {  
  return {type: types.LOAD_USER_ADDRESS_SUCCESS, userAddress};
}

export function loadUserAddress() {  
  return function(dispatch) {
    return dispatch(loadUserAddressSuccess(store.getState().web3.web3Instance.eth.accounts[0]));
    }
  }



