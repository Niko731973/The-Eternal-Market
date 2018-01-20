import React, { Component } from 'react'

class Sell extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Sell</h1>
            <h2>Open Orders</h2>
            <p></p>
            <h2>Your Listings</h2>
            <p></p>
          </div>
        </div>
      </main>
    )
  }
}

export default Sell
