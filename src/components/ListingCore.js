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
        <p>Enter your encrypted shipping address into the box below.</p> 
        <p><textarea name="unencryptedShipping" cols="50" rows="5"></textarea></p> 
        <p>Shipping Info</p> 
        <p>Enter Shipping Information Box</p> 
        <p>Encrypt Button</p> 
        
        <p>Order (Usd Price) ~XX.XX Eth</p>
        
        <p>Seller's Public Key</p> 
        <p><textarea name="unencryptedShipping" cols="50" rows="5" readOnly></textarea></p> 
        </div>
    </main>
    )
  }
}

export default ListingCore;  