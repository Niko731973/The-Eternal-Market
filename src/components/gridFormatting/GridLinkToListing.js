import React, { Component } from 'react'
import { Link } from 'react-router'

class GridLinkToListing extends Component {
    
  render() {
    return(
        <span><Link to={'/listing/'+this.props.data.id}>{this.props.data.title}</Link></span>
      
    )
  }
}

export default GridLinkToListing
