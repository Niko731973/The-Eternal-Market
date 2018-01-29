import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import web3Reducer from './reducers/web3Reducer'
import ethPriceReducer from './reducers/ethPriceReducer'
import marketInstanceReducer from './reducers/marketInstanceReducer'
import buyListingsReducer from './reducers/buyListingsReducer'
import sellListingsReducer from './reducers/sellListingsReducer'
import userAddressReducer from './reducers/userAddressReducer'

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer,
  ethPrice: ethPriceReducer,
  marketInstance: marketInstanceReducer,
  buyListings: buyListingsReducer,
  sellListings: sellListingsReducer,
  userAddress: userAddressReducer
})

export default reducer
