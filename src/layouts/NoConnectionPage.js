import React, { Component } from 'react'

class NoConnectionPage extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Web 3 Not Connected</h1>
        <a>You must connect an ethereum address to use this page.</a>
        Copy the message from Maker DAO 
          </div>
        </div>
      </main>
    )
  }
}

export default User
