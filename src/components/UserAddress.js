import React, { Component } from 'react'
import { connect } from 'react-redux';

class UserAddress extends Component {
    
  render() {
      if(this.props.web3 && 
         this.props.web3.web3Instance&& 
         this.props.web3.web3Instance.eth&&
         this.props.web3.web3Instance.eth.accounts[0])
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