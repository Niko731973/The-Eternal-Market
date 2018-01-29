import React, { Component } from 'react'
import { connect } from 'react-redux';

class UserAddress extends Component {
    
  render() {
    return(
      <a>{this.props.userAddress}</a>
    )
  }
}


function mapStateToProps(state, ownProps) {
    
    return {
    userAddress: state.userAddress
  };

} 

export default connect(mapStateToProps)(UserAddress);  