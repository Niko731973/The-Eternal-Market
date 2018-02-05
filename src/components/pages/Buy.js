import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";
import { connect } from 'react-redux';
import GridLinkToListing from '../gridFormatting/GridLinkToListing'
import { loadBuyListings } from '../../actions/loadBuyListings'
import PriceFormatting from '../gridFormatting/PriceFormatting'



       
class Buy extends Component {
  constructor(props) {
    super(props);
       this.state = {
           columnDefs: this.createColumnDefs()
       }
  }
    
     componentWillMount(){
        
        this.props.dispatch(loadBuyListings());
        
    }
    

   onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }    
    
    createColumnDefs() {
        return [
        { headerName: "Price", field: "price" , cellRendererFramework: PriceFormatting},
        { headerName: "Title", field: "title" , cellRendererFramework: GridLinkToListing },
        { headerName: "Successes", field: "successes" },
        { headerName: "Listed", field: "timeListed" }];
    
        }
    
    
      
  
  render() {
        
       
    return(
      <main className="container"> 
        <h1>Buy</h1>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
            <AgGridReact
                    // properties
                    columnDefs={this.state.columnDefs}
                    rowData={this.props.buyListings}
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
    buyListings: state.buyListings
  };

} 

export default connect(mapStateToProps)(Buy);  