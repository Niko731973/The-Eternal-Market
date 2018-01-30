import React, { Component } from 'react'
import { connect } from 'react-redux';
import MenuBar from './components/MenuBar'
import NoConnectionPage from './components/pages/NoConnectionPage'

// Styles
import './css/pure-min.css'
import './css/eternalMarket.css'
import './css/open-sans.css'
import './css/pure-min.css'
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/theme-bootstrap.css";

class App extends Component {
    
  render() {
      if(typeof this.props.state.web3.web3Instance !== 'undefined')
    return (
      <div className="App">
        <MenuBar />
        {this.props.children}
      </div>
        
    );
      else
          return(
              <div className="App">
              <MenuBar />
              <NoConnectionPage />
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