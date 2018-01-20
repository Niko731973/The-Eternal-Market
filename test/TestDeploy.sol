pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PriceOracle.sol";
import "../contracts/Market.sol";

contract TestDeploy{

PriceOracle priceOracle;
Market market;

function beforeEach() public {

market= Market(DeployedAddresses.Market());
priceOracle= PriceOracle(DeployedAddresses.PriceOracle());
}

function testOracleWriteValue() public{

  uint price = 121283;
  priceOracle.setPrice(price);
  bytes32 returned = priceOracle.read();
  bytes32 expected = bytes32((121283 ether)/100);
  Assert.equal(returned,expected,"The Oracle did not write the correct value");
}

function testPriceConversion() public {

uint usdPrice = 120032;
priceOracle.setPrice(usdPrice);

market.changeOracleAddress(DeployedAddresses.PriceOracle());
market.updatePrice();
bytes32 price = market.eth_price();

uint usd = 500;
uint returned = market.toWei(usd,price);
uint expected = (usd * 1 ether)/usdPrice;
Assert.equal(returned,expected,"The price was not correct");
}

}