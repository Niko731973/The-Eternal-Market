import React, { Component } from 'react'

class PriceFormatting extends Component {
    constructor(props) {
        super(props);
    }
    
    
  render() {
      const price = priceConvert(this.props.data.price)
    return(
        <a>${Intl.NumberFormat('en-US',{minimumFractionDigits: 2}).format(price)}</a>
      
    )
  }
}

function priceConvert(p){
    return (p/100).toFixed(2);
}

export default PriceFormatting
