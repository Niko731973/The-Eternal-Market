import React, { Component } from 'react'

class Listing extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Listing Name Goes Here</h1>
        Description goes here
        
        Enter your shipping address into the box below, then press the "encrypt" button to encrypt your shipping info with the sellers public key. 
        
        Shipping Info
        Enter Shipping Information Box
        Encrypt Button 
        
        Order (Usd Price) - 
        ~XX.XX Eth 
        
        Seller's Public Key
      
          </div>
        </div>
      </main>
    )
  }
}

export default Listing
