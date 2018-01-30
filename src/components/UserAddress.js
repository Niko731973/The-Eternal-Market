import React, { Component } from 'react'
import { connect } from 'react-redux';

class UserAddress extends Component {
    
  render() {
      if(typeof this.props.web3.web3Instance !== 'undefined' && 
        typeof this.props.web3.web3Instance !== 'undefined' &&
        typeof this.props.web3.web3Instance.eth.accounts[0] !== 'undefined')
    return(
      <a>{this.props.web3.web3Instance.eth.accounts[0]}</a>
    )
      else
    return(
      <a>No Ethereum Address Connected</a>
    ) 
  }
}


function mapStateToProps(state, ownProps) {
    
    return {
    web3: state.web3
  };

} 

export default connect(mapStateToProps)(UserAddress);  