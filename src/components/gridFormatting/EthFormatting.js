import React, { Component } from 'react'
// accepts one prop (data) and converts cents into correct format
// ie: 123456 $1,234.56


class EthFormatting extends Component {
    
    
  render() {
      const million = 1000000
      const price = priceConvert(this.props.value/million/million/million) // converts wei to ether
    return(
        <a>~{price} ETH</a>
      
    )
  }
}

function priceConvert(p){
    return (p).toFixed(6);
}

export default EthFormatting
