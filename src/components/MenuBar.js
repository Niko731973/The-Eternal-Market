import React, { Component } from 'react'
import { Link } from 'react-router'
import PriceFeed  from './PriceFeed'
import '../css/pure-min.css'
import '../css/eternalMarket.css'
import '../css/open-sans.css'
import '../css/pure-min.css'

class MenuBar extends Component {
  render() {
    return(
        <nav className="navbar pure-menu pure-menu-horizontal">
        <Link to="/" className="pure-menu-heading pure-menu-link">The Eternal Market</Link>
        <ul className="pure-menu-list navbar-right">
            <span>
            <li className="pure-menu-item">
                <div className="avoid-clicks"><PriceFeed /></div>
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
        </ul>
        </nav>
      
    )
  }
}

export default MenuBar
