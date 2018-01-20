import {combineReducers} from 'redux';  
import listings from './listingsReducer';

const rootReducer = combineReducers({  
  // short hand property names
  listings
})

export default rootReducer;  