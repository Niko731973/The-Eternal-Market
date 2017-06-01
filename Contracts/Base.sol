pragma solidity ^0.4.2;
contract owned {

    address public owner;

    function owned() {
        owner = msg.sender; 
    }
    
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract EternalMarket is owned {

    address public currentVersion; //points to the most recent version of the marketplace contract
	string public message_to_users;
	string public public_key;
	
    function changeAddressOfMarket(address new_address) onlyOwner{
    currentVersion = new_address;
    }
    
    function changeMessage(string newMessage) onlyOwner{
    message_to_users = newMessage;
    }
    
    function changePublicKey(string newKey) onlyOwner{
    public_key = newKey;
    }
    
    

}