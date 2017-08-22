import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import getWeb3 from './util/web3/getWeb3'
import * as database from './util/database.js';

// Layouts
import App from './App'
import About from './layouts/about/About'
import Buy from './layouts/buy/Buy'
import Sell from './layouts/sell/Sell'
import User from './layouts/user/User'
import Listing from './layouts/listing/Listing'
import CreateListing from './layouts/createListing/CreateListing'

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

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Buy} />
          <Route path="about" component={About} />
          <Route path="buy" component={Buy} />
          <Route path="sell" component={Sell} />
          <Route path="user" component={User} />
          <Route path="listing" component={Listing} />
          <Route path="createListing" component={CreateListing} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
