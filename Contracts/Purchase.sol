pragma solidity ^0.4.2;

contract Purchase{

    address market; //only this address can transfer funds
    bool locked; //default value false
    
    function Purchase(address _market) payable {
        market = _market;
    }
    
    function sendFunds(address dest){
    	require(msg.sender == market);
    	dest.transfer(this.balance);
    	locked = true;
    }
    
    function() payable {
    	require(!locked);
    	 }
}
