import React, { Component } from 'react'

class User extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>User: Address</h1>
            Description
            Public Key (In Box, Copiable)
            
            
          </div>
        </div>
      </main>
    )
  }
}

export default User
