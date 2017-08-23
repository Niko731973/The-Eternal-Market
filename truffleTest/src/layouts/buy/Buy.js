import React, { Component } from 'react'
import {ShortListings} from '../../util/database.js'
import {AgGridReact} from "ag-grid-react";
import '../../../node_modules/ag-grid/dist/styles/ag-grid.css'
import '../../../node_modules/ag-grid/dist/styles/theme-bootstrap.css'


/*

componentDidUpdate(prevProps) {
    // when old data was empty but new data contains entries it means it's a first load so columns will be resized, using "size" for immutable list
    if(!prevProps.data.size && this.props.data.size) {
      this.grid.sizeColumnsToFit();
    }
  }
  
  */



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

const listings = ShortListings();

class Buy extends Component {
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

export default Buy
