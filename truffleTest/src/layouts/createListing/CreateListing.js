import React, { Component } from 'react'

class CreateListing extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Create Listing</h1>
          </div>
        </div>
      </main>
    )
  }
}

export default CreateListing
