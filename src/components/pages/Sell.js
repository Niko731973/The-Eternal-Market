import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";
import { connect } from 'react-redux';
import UserAddress from '../UserAddress'
import { loadSellListings } from '../../actions/loadSellListings'
import { loadSellOrders } from '../../actions/loadSellOrders'
import PriceFormatting from '../gridFormatting/PriceFormatting'
import EthFormatting from '../gridFormatting/EthFormatting'
import OrderTitleFormatting from '../gridFormatting/OrderTitleFormatting'
import DateFormatting from '../gridFormatting/DateFormatting'
import OrderActionButtons from '../orderButtons/OrderActionButtons'
import EditListingButton from '../orderButtons/EditListingButton'
import GridLinkToListing from '../gridFormatting/GridLinkToListing'

class Sell extends Component {
  constructor(props) {
    super(props);
       this.state = {
           listingColumnDefs: this.createListingColumnDefs(),
           orderColumnDefs: this.createOrderColumnDefs()
       }
  }
    
    componentWillMount(){
        
        this.props.dispatch(loadSellListings()).then(results => {
            this.props.dispatch(loadSellOrders());
        });
        
    }

   onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
       
    }    
    
    createListingColumnDefs() {
        return [
        { headerName: "Price", field: "price", cellRendererFramework: PriceFormatting  },
        { headerName: "Title", field: "title"  },
        { headerName: "Successes", field: "successes" },
        { headerName: "Listed", field: "timeListed" , cellRendererFramework: DateFormatting },
        { headerName: "Action", field: "id" , cellRendererFramework: EditListingButton}];
    
        }
    
     createOrderColumnDefs() {
        return [
        { headerName: "Order Date", field: "timeTracker" , cellRendererFramework: DateFormatting  },
        { headerName: "ETH", field: "price", cellRendererFramework: EthFormatting  },
        { headerName: "Title", field: "id" , cellRendererFramework: OrderTitleFormatting},
        { headerName: "Action", field: "state", cellRendererFramework: OrderActionButtons  }];
    
        }
    
    userAddressConnected(){
    let w3 = this.props.web3;
    return (w3 && w3.web3Instance && w3.web3Instance.eth && w3.web3Instance.eth.accounts &&
          typeof w3.web3Instance.eth.accounts[0] !== 'undefined')
}
      
  
  render() {
    if(this.userAddressConnected())
    return(
      <main className="container"> 
        <h1>Sell</h1>
        <h3>User: <span><UserAddress /> </span></h3>
        <h2>Open Orders</h2>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
            <AgGridReact
                    // properties
                    columnDefs={this.state.orderColumnDefs}
                    rowData={this.props.sellOrders}
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
        <h2>Your Listings</h2>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
            <AgGridReact
                    // properties
                    columnDefs={this.state.listingColumnDefs}
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
      
      return(
      <main className="container"> 
        <h1>Sell</h1>
        <h3>User: <span><UserAddress /> </span></h3>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
           You must connect an ethereum address to use this page.
        </div>
    
    </main>
    )
  }
}

function mapStateToProps(state, ownProps) {
    
    return {
    sellListings: state.sellListings,
    sellOrders: state.sellOrders,
    web3: state.web3
  };

} 

export default connect(mapStateToProps)(Sell);  