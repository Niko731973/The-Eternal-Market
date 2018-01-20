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
            Description
            Price in USD 
            
            You must have a public key saved in order to create a listing. Click here to add a public key to your seller account. 
        
            Create Listing 
          </div>
        </div>
      </main>
    )
  }
}

export default CreateListing
