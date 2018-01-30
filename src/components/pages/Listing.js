import React, { Component } from 'react'
import { connect } from 'react-redux';
import MarketAPI from '../../api/MarketAPI'

class Listing extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
        
    return(
      <main className="container"> 
        <h3>{this.props.listing.title}</h3>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
        Description goes here
        
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

function mapStateToProps(state, ownProps) {
      // empty listing in case no listing is loaded yet into the store
      let listing = {id:'', seller: '', title: '', description: '', price: '', timeListed: '', enabled: '', successes: '', disputed: '', aborted: ''};
       
      // get the id to load
      const id = ownProps.params.id;
    
    if(!ownProps.listing || ownProps.listing.id !== id){
        console.log(this.props);// ownProps.dispatch(MarketAPI.GetListing(id))
        return {listing: listing};
    }
        
    return {listing: state.listing};
    
         

} 

export default connect(mapStateToProps)(Listing);  