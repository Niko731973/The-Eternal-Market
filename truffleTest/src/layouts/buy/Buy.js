import React, { Component } from 'react'
import {ShortListings} from '../../util/database.js'
import BuyTable from './BuyTable.js'

class Buy extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Buy</h1>
            <p>https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfa</p>
            <BuyTable names={ShortListings()} />
            </div>
        </div>
      </main>
    )
  }
}

export default Buy
