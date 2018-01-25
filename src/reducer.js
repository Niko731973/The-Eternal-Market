import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import web3Reducer from './reducers/web3Reducer'
import ethPriceReducer from './reducers/ethPriceReducer'
import marketInstanceReducer from './reducers/marketInstanceReducer'

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer,
  ethPrice: ethPriceReducer,
  marketInstance: marketInstanceReducer
})

export default reducer
