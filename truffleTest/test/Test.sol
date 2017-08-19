import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Market.sol";

contract TestContract {

   uint listing_id = 1;
   Market market = Market(DeployedAddresses.Market());
   
   function beforeAll(){
   
   }

  function testCreateListing(){
  	   uint price = 1 ether;
  	   uint fee = market.getListingFee(price);
  	   uint valueToSend = price+fee;
  	   
       market.addListing("a","a","a",price).value(valueToSend);
       
       Assert.equal(market.nextFreeListingID, 2, "Listing added Successfully");
   
  }
  
  function testCreateUnfundedListing(){
  	   uint price = 1 ether;
  	   uint fee = market.getListingFee(price);
  	   uint valueToSend = price+fee-1;
  	   market.addListing("b","b","b",price).value(valueToSend);
  	   
  	   Assert.equal(market.nextFreeListingID,2, "Unfunded listing was successfully rejected");
  	   
  	   
  }

  function testCreateOrderGood(){
   uint price = market.listings[1].price;
   
   market.addOrder((1,"shipping").value(price);
   
   Assert.equal(market.nextFreeOrderID,2,"Order placed successfully");
   
  }

  function testCreateOrderBad(){
uint price = market.listings[1].price;
   
   market.addOrder((1,"shipping").value(price-1);
   
   Assert.equal(market.nextFreeOrderID,2,"Underfunded order rejected successfully");
   
  }

  function testNonOwnerRemoveListing(){
	
	
	
  }

  function testOwnerRemoveListing(){

  }

}

// Proxy contract for testing throws
// see http://truffleframework.com/tutorials/testing-for-throws-in-solidity-tests
contract ThrowProxy {
  address public target;
  bytes data;

  function ThrowProxy(address _target) {
    target = _target;
  }

  //prime the data using the fallback function.
  function() {
    data = msg.data;
  }

  function execute() returns (bool) {
    return target.call(data);
  }
}