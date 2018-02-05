import React, { Component } from 'react'



class OrderActionButtons extends Component {
    
  render() {
      //0 unconfirmed, 1 shipped, 2 successful, 3 disputed, 4 aborted, 5 deadman activated
      switch(this.props.value.toNumber()){
          case 0: 
              return (<a>Mark as Shipped or Cancel Order</a>)
          case 1: 
              return (<a>Mark As Delivered or Dispute Order</a>)
          default:
             return(<a>{this.props.value.toNumber()}</a>)
                      
      }
    
  }
}

export default OrderActionButtons
