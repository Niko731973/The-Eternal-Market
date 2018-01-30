import React, { Component } from 'react'

class NoConnectionPage extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <h1>NOT CONNECTED TO ETHEREUM</h1>
        <a>You must connect to web3 to use this page.</a>
        
      </main>
    )
  }
}

export default NoConnectionPage

/*<img class="img-ethereum-logo" alt="Ethereum" src="ethereum-logo.svg">
        <p>The Eternal Market requires an Ethereum client to be running and current. We could not detect a client running which probably means it's not installed, running, or is misconfigured.</p>
        <p>Please use one of the following clients to connect to Ethereum:</p>
        <div>
            <div>
                <img class="img-logo" alt="Metamask" src="metamask-logo.svg"></img>
                <h2>METAMASK</h2>
                <p><span class="align-number"><span class="numberCircle">1</span></span>Install <a class="span-montserrat-semi-bold a-link" href="https://metamask.io/" target="_blank">Metamask</a></p>
                <p><span class="align-number"><span class="numberCircle">2</span></span>Use Chrome to browse <a class="span-montserrat-semi-bold a-link" href="https://oasisdex.com" target="_blank">xxx</a></p>
            </div>
            <div class="div-mist">
                <img class="img-logo" alt="Mist" src="mist-logo.svg"></img>
                <h2>MIST</h2>
                <p><span class="align-number"><span class="numberCircle">1</span></span>Install and run <a class="span-montserrat-semi-bold a-link" href="https://github.com/ethereum/mist/releases" target="_blank">Mist</a></p>
                <p><span class="align-number"><span class="numberCircle">2</span></span>Use Mist to browse <a class="span-montserrat-semi-bold a-link" href="xxx" target="_blank">xx</a></p>
            </div>
        </div>
        <p class="p-connect-geth">While you can also connect with <b>geth</b> or <b>parity</b>, a more advanced configuration is needed. See the
            <a href="xxx" target="_blank">The Eternal Market documentation
        </a> 
        for instructions.
        </p>*/