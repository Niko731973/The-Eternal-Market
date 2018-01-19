pragma solidity ^0.4.9;

 /* PriceOracle contract interface located at 0x729D19f657BD0614b4985Cf1D82531c67569197B*/
 
contract PriceOracle {
    bytes32 public val = 0x00000000000000000000000000000000000000000000003a70415882df180000;
  function read() constant returns (bytes32) {
      return val;
}

function change(bytes32 _new) public{
    val = _new;
}
}