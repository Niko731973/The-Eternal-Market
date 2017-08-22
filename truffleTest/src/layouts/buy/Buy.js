import React, { Component } from 'react'

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
            <p><table id="buyTable" class="display" width="90%"></table></p>
          </div>
        </div>
      </main>
    )
  }
}

export default Buy
