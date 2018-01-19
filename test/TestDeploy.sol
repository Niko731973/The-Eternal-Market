pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PriceOracle.sol";
import "../contracts/Market.sol";
import "../contracts/Base.sol";

contract TestDeploy{


function testPriceFeed() public {


 PriceOracle priceOracle= PriceOracle(DeployedAddresses.PriceOracle());
  Market market= Market(DeployedAddresses.Market());
  Base base= Base(DeployedAddresses.Base());

uint expectedPrice = 120032;
priceOracle.setPrice(toSend);
market.changeOracleAddress(DeployedAddresses.PriceOracle());
market.updatePrice();
bytes32 returned = market.eth_price();

Assert.equal(returned,toSend,"The price was not accepted by the market");

  

}

function testPriceConversion() public {

Market market= Market(DeployedAddresses.Market());
uint expected = 120032;
bytes32 price = market.eth_price();
uint returned = market.toWei(expected,price);

Assert.equal(returned,expected,"The price was not correct");


}
}