import React, { Component } from 'react'
import {AgGridReact} from "ag-grid-react";
import { connect } from 'react-redux';
import UserAddress from '../UserAddress'






class Account extends Component {
  constructor(props) {
    super(props);
       this.state = {
           columnDefs: this.createColumnDefs(),
       }
  }
    
    createColumnDefs() {
        return [
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
    },
    {
        headerName: 'Status' , field: 'state'
    },
    {
        headerName: 'Ordered' , field: 'time'
    }
];
    
        }

  render() {
        
    return(
      <main className="container"> 
        <h1>Your Account</h1>
        <h3>User: <span><UserAddress /> </span></h3>
        <h2>Purchases</h2>
        <div style={{height: "400px", width: "80%", paddingLeft: "10%"}} className="ag-bootstrap">
            <AgGridReact
                    // properties
                    columnDefs={this.state.columnDefs}
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
        <h2>Your Info</h2>
        <div>
           blerga
        </div>
    
    </main>
    )
  }
}


function mapStateToProps(state, ownProps) {
    
    return {
    state: state
  };

} 

export default connect(mapStateToProps)(Account);  
