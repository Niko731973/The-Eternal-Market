import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";




//Column titles and data used
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

var DivStyle = {height: 500, paddingLeft: "10%", paddingRight: "10%"};

const listings = [{price:"50",title:"title",description:"test test test",successes:"50%"}];

class Account extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
        
    return(
      <main className="container">
            <h1>Buy</h1>
    		<div className="ag-bootstrap" style={DivStyle}>
            <AgGridReact
    // properties
    
    columnDefs={columns}
    rowData={listings}
    paginationAutoPageSize="true"
    enableSorting
    enableFilter
    supressHorizontalScroll
    >
    </AgGridReact>
    </div>
    </main>
    )
  }
}

export default Account
