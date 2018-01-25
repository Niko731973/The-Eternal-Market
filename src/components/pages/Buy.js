import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";
import { connect } from 'react-redux';



       
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
        return [{price:"50",title:"title",description:"test test test",successes:"50%"}];
    }
  
  render() {
        
    return(
      <main className="container"> 
        <h1>Buy</h1>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
            <AgGridReact
                    // properties
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    paginationAutoPageSize="true" 
                    enableSorting
                    enableFilter
                    supressHorizontalScroll 
                    //disable column movement
                    // pagation not working! need to fix

                    // events
                    onGridReady={this.onGridReady}>
                </AgGridReact>
        </div>
    
    </main>
    )
  }
}


export default connect((state) => state)(Buy);