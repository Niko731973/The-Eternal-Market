import React, { Component } from 'react'


// accepts one prop (price) and converts cents into correct format
// ie: 123456 $1,234.56


class DateFormatting extends Component {
    
    
  render() {
      const date = new Date(this.props.value.toNumber()*1000).toDateString();
    return(
        <a>{date}</a>
      
    )
  }
}


export default DateFormatting
