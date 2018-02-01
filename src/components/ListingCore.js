import React, { Component } from 'react'
//Renders a listing page passed as a property

class ListingCore extends Component {
  constructor(props) {
    super(props);
    
  }
    
  render() {
      
    return(
      <main className="container"> 
        <h3>{this.props.listing.title}</h3>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
        <p>{this.props.listing.description}</p>
       
        Enter your shipping address into the box below, then press the "encrypt" button to encrypt your shipping info with the sellers public key. 
        
        Shipping Info
        Enter Shipping Information Box
        Encrypt Button 
        
        Order (Usd Price) - 
        ~XX.XX Eth 
        
        Seller's Public Key
        </div>
    </main>
    )
  }
}

export default ListingCore;  