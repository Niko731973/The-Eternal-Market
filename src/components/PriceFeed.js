import React, { Component } from 'react'
import { connect } from 'react-redux';
import PriceFormatting from './gridFormatting/PriceFormatting'


class PriceFeed extends Component {
    
    
  render() {
    return(
      <PriceFormatting value={this.props.ethPrice} />
    )
  }
}

function mapStateToProps(state) {
 return {
    ethPrice: state.ethPrice
  };
    

} 

export default connect(mapStateToProps)(PriceFeed);  