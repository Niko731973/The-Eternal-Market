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
            <h1>User Info</h1>
          </div>
        </div>
      </main>
    )
  }
}

export default User
