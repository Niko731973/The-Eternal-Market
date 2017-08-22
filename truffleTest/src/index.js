import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import getWeb3 from './util/web3/getWeb3'
import $ from 'jquery'; 


// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Buy from './layouts/buy/Buy'
import Sell from './layouts/sell/Sell'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'
import './util/datatables/jquery.dataTables.min'

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
          <IndexRoute component={Home} />
          <Route path="buy" component={Buy} />
          <Route path="sell" component={Sell} />
          <Route path="profile" component={Profile} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
