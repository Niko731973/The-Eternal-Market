import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";
import { connect } from 'react-redux';
import UserAddress from '../UserAddress'

class Sell extends Component {
  constructor(props) {
    super(props);
       this.state = {
           columnDefs: this.createColumnDefs(),
       }
  }

   onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
       
    }    
    
    createColumnDefs() {
        return [
        { headerName: "Price", field: "price" },
        { headerName: "Title", field: "title" },
        { headerName: "Successes", field: "successes" },
        { headerName: "Listed", field: "timeListed" }];
    
        }
      
  
  render() {
        
    return(
      <main className="container"> 
        <h1>Sell</h1>
        <h3>User: <span><UserAddress /> </span></h3>
        <h2>Open Orders</h2>
        <h2>Your Listings</h2>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
            <AgGridReact
                    // properties
                    columnDefs={this.state.columnDefs}
                    rowData={this.props.sellListings}
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

function mapStateToProps(state, ownProps) {
    
    return {
    sellListings: state.sellListings
  };

} 

export default connect(mapStateToProps)(Sell);  