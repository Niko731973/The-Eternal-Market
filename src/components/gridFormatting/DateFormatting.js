import React, { Component } from 'react'


// accepts one prop (price) and converts cents into correct format
// ie: 123456 $1,234.56


class DateFormatting extends Component {
    constructor(props) {
        super(props);
    }
    
    
  render() {
      const price = priceConvert(this.props.price/100)
    return(
        <a>${Intl.NumberFormat('en-US',{minimumFractionDigits: 2}).format(price)}</a>
      
    )
  }
}

function priceConvert(p){
    return (p).toFixed(2);
}

export default DateFormatting
