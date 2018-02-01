import React, { Component } from 'react'
import { connect } from 'react-redux';
import PriceFormatting from './gridFormatting/PriceFormatting'


class PriceFeed extends Component {
    
  render() {
     const mydata = {price: this.props.ethPrice*100}; //must multiply by 100 to convert from USD to cents for formatting
    return(
      <PriceFormatting data={mydata} />
    )
  }
}

function mapStateToProps(state) {
     if(state.web3.web3Instance)
        return {
    ethPrice: state.ethPrice
  };
    
    return{
        ethPrice: ""
    };

} 

export default connect(mapStateToProps)(PriceFeed);  