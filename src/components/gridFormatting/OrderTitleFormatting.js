import React, { Component } from 'react'
import { connect } from 'react-redux';


class OrderTitleFormatting extends Component {
    
    
  render() {
      let obj = this.props.sellListings.find(o => o.id === this.props.value);
    return(
        <a>{obj.title}</a>
      
    )
  }
}

function mapStateToProps(state, ownProps) {
    
    return {
    sellListings: state.sellListings
  };

} 

export default connect(mapStateToProps)(OrderTitleFormatting);  
