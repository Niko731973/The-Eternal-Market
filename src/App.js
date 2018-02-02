import React, { Component } from 'react'
import { connect } from 'react-redux';
import MenuBar from './components/MenuBar'
import NoConnectionPage from './components/pages/NoConnectionPage'
import { loadEthPrice } from './actions/loadEthPrice'

// Styles
import './css/pure-min.css'
import './css/eternalMarket.css'
import './css/open-sans.css'
import './css/pure-min.css'
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/theme-bootstrap.css";

class App extends Component {
    
    componentWillUpdate(nextProps,nextState){
        this.props.dispatch(loadEthPrice())
    }
    
  render() {
      if(!this.props.state.web3.web3Instance || 
         typeof this.props.state.web3.web3Instance === 'undefined' ||
        !this.props.state.marketInstance ||
        typeof this.props.state.marketInstance === 'undefined' )
        return(
              <div className="App">
              <MenuBar />
              <NoConnectionPage />
              </div>
          );
      else
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