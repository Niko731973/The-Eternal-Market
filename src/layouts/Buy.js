import React, { Component } from 'react'
import {AgGridReact, AgGridColumn} from "ag-grid-react";


/*

componentDidUpdate(prevProps) {
    // when old data was empty but new data contains entries it means it's a first load so columns will be resized, using "size" for immutable list
    if(!prevProps.data.size && this.props.data.size) {
      this.grid.sizeColumnsToFit();
    }
  }
  
  */
var columnDefs = [
        {
          headerName: "Rating",
          field: "rating"
        },
        {
          headerName: "Price",
          field: "price"
        },
        {
          headerName: "Title",
          field: "title"
        },
        {
          headerName: "Successes",
          field: "successes"
        }];


var DivStyle = {height: 500, paddingLeft: "10%", paddingRight: "10%"};





class Buy extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
       this.state = {
            rowData: [{rating:"rating",price:"price1",title:"title1",successes:"successfulListings"},
                      {rating:"rat22ing",price:"pr22ice1",title:"tit22le1",successes:"successfulListings2"}
            ]
        }
      
      
  }
    
  onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
    }


  render() {
        
    return(
      <main className="container">
            <h1>Buy</h1>
        <div className="ag-bootstrap" style={DivStyle}>
            <AgGridReact
            
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}>
        <AgGridColumn field="rating"></AgGridColumn>
    <AgGridColumn field="price"></AgGridColumn>
    <AgGridColumn field="title"></AgGridColumn>
    <AgGridColumn field="successes"></AgGridColumn>
    </AgGridReact>
        </div>
    </main>
    )
  }
}

export default Buy


/*

return(
      <main className="container">
            <h1>Buy</h1>
    		<div className="ag-bootstrap" style={DivStyle}>
            <AgGridReact
    // properties
    //columnDefs={columns}
    rowData={listings}
    //paginationAutoPageSize="true"
    //enableSorting
    //enableFilter
    //supressHorizontalScroll 
    >
    <AgGridColumn field="rating"></AgGridColumn>
    <AgGridColumn field="price"></AgGridColumn>
    <AgGridColumn field="title"></AgGridColumn>
    <AgGridColumn field="successes"></AgGridColumn>
    </AgGridReact>
    </div>
    </main>
    )

*/