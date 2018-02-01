import React, { Component } from 'react'
import { connect } from 'react-redux';
import store from '../../store'
import ListingCore from '../ListingCore'
import { loadMarketInstance } from '../../actions/loadMarketInstance'

class Listing extends Component {
  constructor(props) {
    super(props);
      
      this.state = {
                listing : {},
                isLoading: true
            }  
  }
    
  componentDidMount(){
      this.props.state.marketInstance.GetListing(this.props.params.id).then(listing => {
      this.setState({listing: listing, isLoading:false});
      });
        
  }
  
  render() {
  const isLoading = this.state.isLoading;
  return (
    <main className="container"> 
      {isLoading ? (
        <div>Loading Listing...</div>
      ) : (
        <ListingCore listing = {this.state.listing} />
      )}
    </main>
  );
}
     
        
  }


function mapStateToProps(state, ownProps) {
      // empty listing in case no listing is loaded yet into the store
      let listing = {id:'', seller: '', title: '', description: '', price: '', timeListed: '', enabled: '', successes: '', disputed: '', aborted: ''};
       
      // get the id to load from the url
      const listingID = ownProps.params.id;
    
    if(!ownProps.listingID || state.listing.id !== listingID){
        return {listing: listing , marketInstance: state.marketInstance};
    }
      
    return {listing: state.listing , marketInstance: state.marketInstance};
    
         

} 

export default connect(mapStateToProps)(Listing);  