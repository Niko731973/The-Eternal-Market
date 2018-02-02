import React, { Component } from 'react'
import { Link } from 'react-router'


class EditListingButton extends Component {
    constructor(props) {
        super(props);
    }
    
    
  render() {
    return(
        <div>
      <Link to={'/listing/'+this.props.value}>
    <button>Edit</button></Link></div>
        
    )
  }
}

export default EditListingButton
