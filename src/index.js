import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import getWeb3 from './getWeb3'
import { loadMarketInstance } from './actions/loadMarketInstance'
import MarketAPI from './api/MarketAPI';


// Layouts
import App from './App'
import About from './components/pages/About'
import Account from './components/pages/Account'
import Buy from './components/pages/Buy'
import CreateListing from './components/pages/CreateListing'
import Listing from './components/pages/Listing'
import Sell from './components/pages/Sell'
import User from './components/pages/User'  

// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.then(() => {
  return store.dispatch(loadMarketInstance()) ;
  })
.then(()=> {
  return console.log('Market Instance Loaded');
})
.catch((err) => {
  console.log('there was an error')
  console.log(err);
  console.log('Error in web3 initialization.')
});


// allow console access to vars for debugging
window.store = store;
window.m = MarketAPI;

// used to select id's when loading listings, users, or orders
export const dispatchThenRoute = (myAction, myPath) => {
    return (dispatch) => {
        dispatch(myAction)
        browserHistory.push(myPath);
    }
}; 


ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Buy} />
          <Route path="about" component={About} />
          <Route path="account" component={Account} />
          <Route path="buy" component={Buy} />
          <Route path="createListing" component={CreateListing} />
          <Route path="listing/:id" component={Listing} />
          <Route path="sell" component={Sell} />
          <Route path="user" component={User} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
