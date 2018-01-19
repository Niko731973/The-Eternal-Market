pragma solidity ^0.4.2;

contract Base{

    address public market;          	// Current location of the market contract
    address public owner;           	// Instantiator of TEM
    string public website;		// IPFS address of app
    string public message;		// displays a message
	
	function Base(){
	    owner = msg.sender;
	}
	
    function changeMarketAddress(address _market) {
        require(msg.sender==owner);
        market = _market;
    }
    
    function changeMessage(string _message){
        require(msg.sender==owner);
        message = _message;
    }
    
    function changeWebsite(string _website){
        require(msg.sender==owner);
        website = _website;
    }
    
    function changeOwner(address _owner){
        require(msg.sender==owner);
        owner=_owner;
    }
    
    
    
}
