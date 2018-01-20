pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PriceOracle.sol";
import "../contracts/Market.sol";

contract TestBuyAndSell{

PriceOracle priceOracle;
Market market;

function beforeEach() public {

market= Market(DeployedAddresses.Market());
priceOracle= PriceOracle(DeployedAddresses.PriceOracle());
}


}