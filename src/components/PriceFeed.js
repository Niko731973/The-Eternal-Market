import React, { Component } from 'react'
import { connect } from 'react-redux';

class PriceFeed extends Component {
    
  
    
  render() {
     
    return(
      <a>{this.props.ethPrice}</a>
    )
  }
}

function toUSDFormat(price) {
      return price.toFixed(2);
      
  }

function mapStateToProps(state) {
     if(state.web3.web3Instance)
        return {
    ethPrice: "$"+toUSDFormat(state.ethPrice)+" ETH"
  };
    
    return{
        ethPrice: ""
    };

} 

export default connect(mapStateToProps)(PriceFeed);  