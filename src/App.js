import React, { Component } from 'react'
import { Link } from 'react-router'

// Styles
import './css/pure-min.css'
import './css/eternalMarket.css'
import './css/open-sans.css'
import './css/pure-min.css'
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/theme-bootstrap.css";


class App extends Component {
  render() {
    const MenuBarButtons = () => (
      <span>
        <li className="pure-menu-item">
            <a className="avoid-clicks">$1201.13 ETH</a>
        </li>
        <li className="pure-menu-item">
          <Link to="/buy" className="pure-menu-link">Buy</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/sell" className="pure-menu-link">Sell</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/account" className="pure-menu-link">Account</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/about" className="pure-menu-link">About</Link>
        </li>
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">The Eternal Market</Link>
          <ul className="pure-menu-list navbar-right">
            <MenuBarButtons />
          </ul>
        </nav>
			{this.props.children}
      </div>
      
        
    );
  }
}

export default App
