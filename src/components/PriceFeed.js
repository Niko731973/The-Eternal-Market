import React, { Component } from 'react'
import { connect } from 'react-redux';

class PriceFeed extends Component {
    
  static toUSDFormat(price) {
      return price.toFixed(2);
      
  }
    
  render() {
      if(typeof this.props.web3instance !== 'undefined')
    return(
      <a>${PriceFeed.toUSDFormat(this.props.ethPrice)} ETH</a>
    )
    else
    return(
      <a></a>
    )
  }
}


function mapStateToProps(state, ownProps) {
    
    return {
    ethPrice: state.ethPrice,
    web3instance: state.web3.web3Instance
  };

} 

export default connect(mapStateToProps)(PriceFeed);  