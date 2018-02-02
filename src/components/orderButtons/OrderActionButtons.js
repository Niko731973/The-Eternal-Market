import React, { Component } from 'react'



class OrderActionButtons extends Component {
    constructor(props) {
        super(props);
    }
    
    
  render() {
    return(
        <a>{this.props.value.toNumber()}</a>
        
    )
  }
}

export default OrderActionButtons
