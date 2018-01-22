import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import getWeb3 from './getWeb3'

// Layouts
import App from './App'
import About from './components/About'
import Account from './components/Account'
import Buy from './components/Buy'
import CreateListing from './components/CreateListing'
import Listing from './components/Listing'
import Sell from './components/Sell'
import User from './components/User'  

// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})

// allow console access to store for debugging
window.store = store;


ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Buy} />
          <Route path="about" component={About} />
          <Route path="account" component={Account} />
          <Route path="buy" component={Buy} />
          <Route path="createListing" component={CreateListing} />
          <Route path="listing" component={Listing} />
          <Route path="sell" component={Sell} />
          <Route path="user" component={User} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
