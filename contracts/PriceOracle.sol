pragma solidity ^0.4.9;

 /* PriceOracle Medianizer contract interface located at 0x729D19f657BD0614b4985Cf1D82531c67569197B*/
 
contract PriceOracle {
    bytes32 public val;
  function read() constant returns (bytes32) {
      return val;
}


// sets the price of an ether in cents
// ex: 121374 is $1213.74 per eth

function setPrice(uint _new) public{
    uint price = _new* (1 ether);
    val = bytes32(price/100);
}

}