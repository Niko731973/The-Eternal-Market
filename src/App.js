import React, { Component } from 'react'
import { connect } from 'react-redux';
import MenuBar from './components/MenuBar'
import { loadEthPrice } from './actions/loadEthPrice'
import { loadMarketInstance } from './actions/loadMarketInstance'

// Styles
import './css/pure-min.css'
import './css/eternalMarket.css'
import './css/open-sans.css'
import './css/pure-min.css'
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/theme-bootstrap.css";

class App extends Component {
    
  render() {
      
      this.props.dispatch(loadMarketInstance()).then((result)=>{
        this.props.dispatch(loadEthPrice());
      }).catch(error => { console.log(error);});
      
    return (
      <div className="App">
        <MenuBar />
        {this.props.children}
      </div>
        
    );
  }
}

function mapStateToProps(state, ownProps) {
    
    return {
    state: state
  };

} 

export default connect(mapStateToProps)(App);  