pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PriceOracle.sol";

contract TestPriceOracle{



function testOracleWriteValue() public{
  PriceOracle priceOracle= PriceOracle(DeployedAddresses.PriceOracle());
  uint price = 121283;
  priceOracle.setPrice(price);
  bytes32 returned = priceOracle.read();
  bytes32 expected = bytes32((121283 ether)/100);
  Assert.equal(returned,expected,"The Oracle did not write the correct value");
}

}