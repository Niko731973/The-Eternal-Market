import React, { Component } from 'react'
import { connect } from 'react-redux';
import MarketAPI from '../../api/MarketAPI'
import ListingCore from '../ListingCore'

class Listing extends Component {
  constructor(props) {
    super(props);
      
      this.state = {
                listing : {},
                isLoading: true
            }
    
  }
    
  componentWillMount(){
      console.log(this.state.isLoading)
      MarketAPI.GetListing(this.props.params.id).then(listing => {
          this.state.listing = listing;
          this.state.isLoading = false;
      });
        
  }
    
  render() {
      
      return (
          
    {if(this.state.isLoading)(
      <span>Loading...</span>
    )}
          
    {if(!this.state.isLoading)(
      <ListingCore  listing={this.state.listing} /> 
    )}
    
  );
      
        */
  }
}

function mapStateToProps(state, ownProps) {
      // empty listing in case no listing is loaded yet into the store
      let listing = {id:'', seller: '', title: '', description: '', price: '', timeListed: '', enabled: '', successes: '', disputed: '', aborted: ''};
       
      // get the id to load from the url
      const listingID = ownProps.params.id;
    
    if(!ownProps.listingID || state.listing.id !== listingID){
        return {listing: listing };
    }
      
    return {listing: state.listing };
    
         

} 

export default connect(mapStateToProps)(Listing);  