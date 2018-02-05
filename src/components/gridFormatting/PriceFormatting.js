import React, { Component } from 'react'


// accepts one prop (data) and converts cents into correct format
// ie: 123456 $1,234.56


class PriceFormatting extends Component {
    
    
  render() {
      const price = priceConvert(this.props.value/100)
    return(
        <a>${Intl.NumberFormat('en-US',{minimumFractionDigits: 2}).format(price)}</a>
      
    )
  }
}

function priceConvert(p){
    return (p).toFixed(2);
}

export default PriceFormatting
