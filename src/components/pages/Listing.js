import React, { Component } from 'react'
import { connect } from 'react-redux';
import ListingCore from '../ListingCore'
import MarketAPI from '../../api/MarketAPI'

class Listing extends Component {
  constructor(props) {
    super(props);
      
      this.state = {
                listing : {},
                isLoading: true
            }  
  }
    
  // fetch info about listing and fees, and the sellers public key    
  componentDidMount(){
      var listing = {};
      
      MarketAPI.GetListing(this.props.params.id).then(fetched => {
      listing = fetched;
      }).then( 
      MarketAPI.GetOrderFee().then(orderFee => { 
      this.setState({orderFee: orderFee, listing: listing, isLoading:false});
      })
      );
        
  }
  
  render() {
  const isLoading = this.state.isLoading;
  return (
    <main className="container"> 
      {isLoading ? (
        <div>Loading Listing...</div>
      ) : (
        <ListingCore {...this.state} />
      )}
    </main>
  );
}
     
        
  }


function mapStateToProps(state, ownProps) {
      // empty listing to display in case no listing is loaded yet into the store
      let listing = {id:'', seller: '', title: '', description: '', price: '', timeListed: '', enabled: false, successes: '', disputed: '', aborted: '', orderFee: ''};
       
      // get the id to load from the url
      const listingID = ownProps.params.id;
    
    
    if(!ownProps.listingID || state.listing.id !== listingID){
        return {orderFee: '', listing: listing , marketInstance: state.marketInstance};
    }
      
    return {orderFee: '', listing: state.listing , marketInstance: state.marketInstance};
    
         

} 

export default connect(mapStateToProps)(Listing);  