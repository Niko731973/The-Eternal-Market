import React, { Component } from 'react'
import {ShortListings} from '../../util/database.js'

import {AgGridReact} from "ag-grid-react";


   
//seller, title, description, price, timeListed, enabled, successes, aborted, disputed
var columns = [
    {
        headerName: 'Rating' , field: 'rating'
    },
    {
        headerName: 'Price' , field: 'price'
    },
    {
        headerName: 'Title' , field: 'title'
    },
    {
        headerName: 'Successes' , field: 'successes'
    }
];

const listings = ShortListings();

class Buy extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    
 
    
  }

  render() {
        
    return(
      <main className="container">
        <div className="pure-g" width="90%">
          <div className="pure-u-1-1" width="90%">
            <h1>Buy</h1>
            
            </div>
        </div>
            
            <AgGridReact
    // properties
    columnDefs={columns}
    rowData={listings}

    enableSorting

    // enable filtering
    enableFilter>   // shorthand for enableFilter="true"

</AgGridReact>
      </main>
    )
  }
}

export default Buy
