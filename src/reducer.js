import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import web3Reducer from './reducers/web3Reducer'
import ethPriceReducer from './reducers/ethPriceReducer'
import marketInstanceReducer from './reducers/marketInstanceReducer'
import buyListingsReducer from './reducers/buyListingsReducer'
import sellListingsReducer from './reducers/sellListingsReducer'
import sellOrdersReducer from './reducers/sellOrdersReducer'

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer,
  ethPrice: ethPriceReducer,
  marketInstance: marketInstanceReducer,
  buyListings: buyListingsReducer,
  sellListings: sellListingsReducer,
  sellOrders: sellOrdersReducer
})

export default reducer
