import React, { Component } from 'react'
import { connect } from 'react-redux';

class UserAddress extends Component {
    
  render() {
    return(
      <a>{this.props.accounts[0]}</a>
    )
  }
}


function mapStateToProps(state, ownProps) {
    
    return {
    accounts: state.web3.web3Instance.eth.accounts
  };

} 

export default connect(mapStateToProps)(UserAddress);  