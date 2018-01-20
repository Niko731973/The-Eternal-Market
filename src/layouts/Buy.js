import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";


class Buy extends Component {
  constructor(props) {
    super(props);
       this.state = {
           
           columnDefs: this.createColumnDefs(),
           rowData: this.createRowData()
       }
      
  }
   onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
    }    
    
    createColumnDefs() {
        return [
        { headerName: "Rating", field: "rating" },
        { headerName: "Price", field: "price" },
        { headerName: "Title", field: "title" },
        { headerName: "Successes", field: "successes" }];
    
        }
      
      createRowData() {
        return [{rating:"rating",price:"price1",title:"title1",successes:"successfulListings"},
                      {rating:"rat22ing",price:"pr22ice1",title:"tit22le1",successes:"successfulListings2"}];
    }
  


  render() {
        
    return(
      <main className="container"> 
        <h1>Buy</h1>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}}>
        
        
            <AgGridReact
                    // properties
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}

                    // events
                    onGridReady={this.onGridReady}>
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