import React, { Component } from 'react'
import { connect } from 'react-redux';

class UserAddress extends Component {
    
    componentWillReceiveProps(nextProps){
        console.log("current props:")
        console.log(this.props);
        console.log("next props")
        console.log(nextProps);
    }
    
  render() {
    return(
      <a>{this.props.userAddress}</a>
    );
  }
}


function mapStateToProps(state) {
    if(!state.web3.web3Instance.eth.accounts[0]){
        
      return ({userAddress: "No Address Connected"})
        
    }
    return ({userAddress: state.web3.web3Instance.eth.accounts[0]})

} 

export default connect(mapStateToProps)(UserAddress);  