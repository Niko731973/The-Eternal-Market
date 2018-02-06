import React, { Component } from 'react'
import { Link } from 'react-router'


class EditListingButton extends Component {
    
    
  render() {
      
    return(
        <div>
      <Link to={'/listing/'+this.props.value}>
    <button type='button'>Edit</button></Link></div>
        
    )
  }
}

export default EditListingButton
