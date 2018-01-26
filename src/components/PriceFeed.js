import React, { Component } from 'react'
import { connect } from 'react-redux';

class PriceFeed extends Component {
    
  static toUSDFormat(price) {
      return price.toFixed(2);
      
  }
    
  render() {
      
    return(
      <a>${PriceFeed.toUSDFormat(this.props.ethPrice)} ETH</a>
    )
  }
}


function mapStateToProps(state, ownProps) {
    
    return {
    ethPrice: state.ethPrice
  };

} 

export default connect(mapStateToProps)(PriceFeed);  