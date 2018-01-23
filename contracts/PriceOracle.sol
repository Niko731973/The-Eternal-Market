pragma solidity ^0.4.9;
 /* This file is the middleman between the market and the MakerDAO Medianizer contract located at
 0x729D19f657BD0614b4985Cf1D82531c67569197B which publishes an ETH/USD price feed as an oracle 
 
 During Production the market would simply point it's oracleAddress to the Medianizer and execute the 
 read() method of the actual oracle*/
 
 
 
contract PriceOracle {
    bytes32 public val;

  function read() constant returns (bytes32) {
      return val;
}


// sets the price of an ether in cents
// ex: 121374 is $1213.74 per eth
// method (obviously) not included in the actual Medianizer

function setPrice(uint _new) public{
    uint price = _new * (1 ether);
    val = bytes32(price/100);
}

}